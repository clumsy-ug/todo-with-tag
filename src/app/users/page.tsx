"use client";

import selectUsers from "@/supabase/CRUD/selectUsers";
import { useState, useEffect } from "react";
import { User } from "@/types/user";
import Link from 'next/link'

const Home = () => {
    const [users, setUsers] = useState<User[] | null>([]);

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
            <br />
            <Link href='/'>ホームへ</Link>
        </>
    );
};

export default Home;
