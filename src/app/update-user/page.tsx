'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import updateUser from "@/supabase/CRUD/updateUser";

const UpdateUser = () => {
    const [id, setId] = useState<number>(0);
    const [name, setName] = useState<string>('');
    const router = useRouter();

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const isSuccess = await updateUser(id, name);
            if (isSuccess) {
                console.log('Success!');
                router.push('/');
            } else {
                console.error('Failure!');
            }
        } catch (e) {
            console.error('handleUpdate内のエラーは->', e);
        }
    }

    return (
        <form onSubmit={handleUpdate}>
            <input
                type="number"
                onChange={(e) => setId(Number(e.target.value))}
                placeholder="変更するデータのid"
                required
            />
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="変更後の名前を入力"
                required
            />
            <button type="submit">更新</button>
        </form>
    )
}

export default UpdateUser;
