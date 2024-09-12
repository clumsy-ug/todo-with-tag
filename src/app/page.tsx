"use client";

import selectUsers from "@/supabase/select/selectUsers";
import { useState, useEffect } from "react";
import { User } from "@/types/user";

const Home = () => {
    const [users, setUsers] = useState<User[] | boolean>([]);

    useEffect(() => {
        const getUsers = async () => {
            const users = await selectUsers();
            setUsers(users);
        };
        getUsers();
    }, []);

    return (
        <>
            <h1>usersテーブルの中身</h1>
            <pre>{JSON.stringify(users, null, 2)}</pre>

            {/* preタグを使わない方法 */}
            {/* {Array.isArray(users) &&
                users.map((user, index) => (
                    <div key={index}>
                        <p>{JSON.stringify(user, null, 2)}</p>
                    </div>
                ))
            } */}
        </>
    );
};

export default Home;
