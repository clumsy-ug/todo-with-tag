'use client';

import insertUser from "@/supabase/insert/insertUser";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CreateUser = () => {
    const [name, setName] = useState<string>('');
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const isSuccess = await insertUser(name);
            if (isSuccess) {
                console.log('Success!');
                router.push('/');
            } else {
                console.error('Failure');
            }
        } catch (e) {
            console.error('handleCreate内のエラーは->', e);
        }
    }

    return (
        <form onSubmit={handleCreate}>
            <input
                placeholder="名前"
                type="text"
                required
                onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">登録</button>
        </form>
    )
}

export default CreateUser;
