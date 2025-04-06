import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (converation: FullConversationType | {
    users: User[]
}) => {
    const session = useSession()

    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email
        const otherUser = converation.users.filter((user) => user.email != currentUserEmail)

        return otherUser
    },[session?.data?.user?.email, converation.users])

    return otherUser[0]

}

export default useOtherUser
