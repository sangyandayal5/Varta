import prisms from "@/app/libs/prismadb"
import ConversationId from "../conversations/[conversationId]/page"

const getMessages = async (
    ConversationId: string
) => {
    try{
        const messages = await prisma?.message.findMany({
            where: {
                conversastionId: ConversationId
            },
            include: {
                sender: true,
                seen: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        })
        return messages
    }catch(error: any){
        return []
    }
}

export default getMessages

