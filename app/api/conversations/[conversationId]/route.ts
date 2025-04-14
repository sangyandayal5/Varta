import getCurrentUser from "@/app/actions/getCurrentUser"
import { NextResponse } from "next/server"
import prisma from '@/app/libs/prismadb'
import { pusherServer } from "@/app/libs/pusher"

interface Iparams {
    conversationId?: string
}

export async function DELETE(
    request: Request,
    {params} : {params: Iparams}
) {
    try{

        const {conversationId} = params
        const currentUser = await getCurrentUser()

        if(!currentUser?.id){
            return NextResponse.json(null)
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if(!existingConversation){
            return new NextResponse('Invalid ID', {status: 400})
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        })

        existingConversation.users.forEach((user) => {
            if(user.email) {
                pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deleteConversation)
    } catch(error: unknown){
        console.log(error);
        
        return new NextResponse('Internal Error', {status: 500})
    }
}
