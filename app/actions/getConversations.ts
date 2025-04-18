import prisma from "@/app/libs/prismadb"
import getCurrentUser from "@/app/actions/getCurrentUser"

const getConversations = async () => {
    const currentUser = await getCurrentUser()

    if(!currentUser?.id){
        return []
    }

    try{
        const conversations = await prisma.conversation.findMany({
            orderBy: {
                lastMessageAt: 'desc'
            },
            where: {
                userIds: {
                    has: currentUser.id
                }
            },
            include: {
                users: true,
                messages: {
                    include: {
                        sender: true,
                        seen: true
                    }
                }
            }
        })

        return conversations
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message); 
        }
        return [] 
    }

}

export default getConversations