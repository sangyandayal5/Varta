import ws from 'k6/ws'
import { check } from 'k6'

const PUSHER_APP_KEY = 'PUSHER_APP_KEY'
const PUSHER_CLUSTER = 'PUSHER_CLUSTER'

const WSS_URL = `wss://ws-${PUSHER_CLUSTER}.pusher.com:443/app/${PUSHER_APP_KEY}?protocol=7&client=k6`

export const options = {
  stages: [
    { duration: '3m', target: 500 }, // Stage 1: Ramp up to 500 VUs
    { duration: '5m', target: 1000 }, // Stage 2: Ramp up to 1000 VUs and hold
    { duration: '2m', target: 1000 }, // Stage 3: Hold at 1000 VUs
    { duration: '1m', target: 0 }, // Stage 4: Ramp down
  ],
  thresholds: {
    // Fail the test if message success rate drops below 99%
    checks: ['rate>0.99'],
    // Fail if 95% of connections take longer than 2 seconds to establish
    ws_connecting: ['p(95)<2000'],
  },
}

export default function () {
  const channelName = 'presence-general-chat'

  const res = ws.connect(WSS_URL, null, function (socket) {
    let socketId = ''

    socket.on('message', (data) => {
      const msg = JSON.parse(data)

      if (msg.event === 'pusher:connection_established') {
        const payload = JSON.parse(msg.data)
        socketId = payload.socket_id

        const subscribeMsg = JSON.stringify({
          event: 'pusher:subscribe',
          data: {
            channel: channelName,
          },
        })
        socket.send(subscribeMsg)
      }

      // Check for message broadcasts from other VUs
      if (
        msg.channel === channelName &&
        msg.event !== 'pusher_internal:subscription_succeeded'
      ) {
        check(msg.data, {
          'Received message broadcast successfully': (d) => d.length > 0,
        })
      }
    })

    // Simulate VUs sending a message every 5 seconds
    socket.setInterval(function timeout() {
      if (!socketId) return

      const messagePayload = JSON.stringify({
        event: `client-new-message`,
        data: {
          sender_id: `user_${__VU}`,
          text: `Test message from VU ${__VU} at ${new Date().getTime()}`,
        },
        channel: channelName,
      })

      socket.send(messagePayload)
    }, 5000) // 5 seconds interval

    // Close the connection gracefully at the end of the stage
    socket.setTimeout(function () {
      socket.close()
    }, 660000) // 11 minutes
  })

  check(res, {
    'status is 101 (Switching Protocols)': (r) => r && r.status === 101,
  })
}
