// ログイン中のユーザーのtodoリストを表示

"use client";

import selectUserTodos from "@/supabase/CRUD/selectTodos";
import insertTodo from "@/supabase/CRUD/insertTodo";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Todo } from "@/types";
import { createClient } from "@/supabase/client";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;
    const [content, setContent] = useState<string | null>(null);
    const [todos, setTodos] = useState<Todo[] | null>([]);
    const [email, setEmail] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUserTodos = async () => {
            try {
                const data = await selectUserTodos(userId);
                if (data) setTodos(data);

                const { data: { user } } = await supabase.auth.getUser();
                if (user) setEmail(user.email!);
            } catch (e) {
                console.error('getUserTodos内のe->', e);
            }
        }
        getUserTodos();
    }, [])

    const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (userId && content) {
            const isSuccess = await insertTodo(userId, content);
            if (isSuccess) {
                toast.success('登録完了!');
            } else {
                toast.error('登録失敗!');
            }
        }
    }

    return (
        <>
            <Toaster />

            <h1>Welcome, <b style={{color: 'blue'}}>{email}</b></h1>

            <h2>あなたのTodo一覧</h2>
            {todos?.map((todo) => (
                <ul key={todo.id}>
                    <li>{todo.content}</li>
                </ul>
            ))}

            <br />
            <hr />
            <br />

            <h1>Todoを追加</h1>
            <form onSubmit={handleCreateTodo}>
                <input
                    type="text"
                    placeholder="Todoを入力"
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">追加</button>
            </form>
        </>
    );
};

export default UserTodos;
