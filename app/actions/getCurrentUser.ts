import  prisma  from "@/app/libs/prismadb";
import getSession from "./getSession";

const getCurrentUser  = async () => {
    try{
        const session = await getSession()

        if(!session?.user?.email){
            return null
        }

        const currentUser = await prisma.user.findUnique({
            where:{
                email: session.user.email as string
            }
        })

        if(!currentUser){
            return null
        }

        return currentUser

    }catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return null;
    }
}

export default getCurrentUser
