// ログイン中のユーザーのtodoリストを表示

"use client";

import selectUser from "@/supabase/CRUD/selectUser";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;
    const [userState, setUserState] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const user = await selectUser(userId);
            if (user) setUserState(user as User);
        };
        getUser();
    }, []);

    return (
        <>
            <h1>
                こんにちは、<b>{userState?.email}</b>
            </h1>

            <p>
                あなたのデータは↓<br /><br />
                {JSON.stringify(userState, null, 2)}
            </p>
        </>
    );
};

export default UserTodos;
