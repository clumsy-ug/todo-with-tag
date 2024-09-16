"use client";

import { createClient } from "@/supabase/client";
import { useState } from "react";
import insertUser from "@/supabase/CRUD/insertUser";
import toast, { Toaster } from "react-hot-toast";

const Test = () => {
    const supabase = createClient();
    const [id, setId] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const func = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;
        if (userId) setId(userId);
        const userEmail = user?.email;
        if (userEmail) setEmail(userEmail);
    };
    func();

    const handleInsert = async () => {
        const isSuccess = await insertUser(id, email);
        if (isSuccess) {
            toast.success('insert完了!');
        } else {
            toast.error('insert失敗!');
        }
    }

    return (
        <>
            <Toaster />
            <p>idは: {id}</p>
            <p>emailは: {email}</p>

            <button onClick={handleInsert}>insertUser!</button>
        </>
    );
};

export default Test;
