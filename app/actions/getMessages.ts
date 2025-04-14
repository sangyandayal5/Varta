import prisma from "@/app/libs/prismadb"
// import ConversationId from "../conversations/[conversationId]/page"

const getMessages = async (
    ConversationId: string
) => {
    try{
        const messages = await prisma?.message.findMany({
            where: {
                conversationId: ConversationId
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
    }catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message); 
        }
        return [] 
    }
}

export default getMessages

