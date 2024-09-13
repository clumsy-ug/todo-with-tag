'use client';

import deleteUser from "@/supabase/delete/deleteUser";
import { useState } from "react";
import {useRouter} from "next/navigation";

const DeleteUser = () => {
    const [id, setId] = useState<number>(0);
    const router = useRouter();

    const handleDelete = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();

        try {
            const isSuccess = await deleteUser(id);
            if (isSuccess) {
                console.log('Success!');
                router.push('/');
            } else {
                console.log('Failure!');
            }
        } catch (e) {
            console.error('handleDelete内のエラーは->', e);
        }
    }

    return (
        <form onSubmit={handleDelete}>
            <input
                type="number"
                placeholder="削除するデータのid"
                onChange={(e) => setId(Number(e.target.value))}
                required
            />
            <button type="submit">削除</button>
        </form>
    )
}

export default DeleteUser;
