'use client';

// Claude ------------------------

import selectUserTodos from "@/supabase/CRUD/selectTodos";
import insertTodo from "@/supabase/CRUD/insertTodo";
import updateTodo from "@/supabase/CRUD/updateTodo";
import { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Todo } from "@/types";
import { createClient } from "@/supabase/client";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;
    const [content, setContent] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);
    const [email, setEmail] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    // console.log('あいうえお'); //10, たまに12

    const fetchUserTodos = useCallback(async () => {
        // console.log('あいうえお'); //2
        setIsLoading(true);

        try {
            // console.log('あいうえお'); //2
            const data = await selectUserTodos(userId);
            if (data) setTodos(data);

            const { data: { user } } = await supabase.auth.getUser();
            if (user) setEmail(user.email!);
        } catch (e) {
            console.error('fetchUserTodos内のe->', e);
        } finally {
            setIsLoading(false);
        }
    }, [userId, supabase]);

    useEffect(() => {
        fetchUserTodos();
        // console.log('あいうえお'); //2
    }, [fetchUserTodos]);

    const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        // console.log('あいうえお'); //0
        e.preventDefault();
        setIsLoading(true);

        if (userId && content) {
            const isSuccess = await insertTodo(userId, content);
            if (isSuccess) {
                toast.success('登録完了!');
                setTodos(prevTodos => [...prevTodos, { user_id: userId, content }]);
                setContent("");
            } else {
                toast.error('登録失敗!');
            }
        }

        setIsLoading(false);
    }

    const handleUpdateTodo = async (todoId: string, currentContent: string) => {
        const newContent = prompt('編集内容を入力してください', currentContent);
        if (!newContent || newContent === currentContent) return;

        setIsLoading(true);
        try {
            const isSuccess = await updateTodo(todoId, newContent);
            if (isSuccess) {
                setTodos(prevTodos =>
                    prevTodos.map(todo =>
                        todo.id === todoId ? { ...todo, content: newContent } : todo
                    )
                );
                toast.success('更新完了!');
            } else {
                toast.error('更新失敗!');
            }
        } catch (e) {
            console.error('handleUpdateTodo内のe->', e);
            toast.error('更新中にエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Toaster />

            <h1>Welcome, <b style={{color: 'blue'}}>{email}</b></h1>

            <h2>あなたのTodo一覧</h2>
            {isLoading ? (
                <h2>Loading...</h2>
            ) : (
                todos.map((todo) => (
                    <ul key={todo.id}>
                        <li>{todo.content}</li>
                        <p>id: {todo.id}</p>
                        <button onClick={() => handleUpdateTodo(todo.id!, todo.content)}>編集</button>
                    </ul>
                ))
            )}

            <br />
            <hr />
            <br />

            <h1>Todoを追加</h1>
            <form onSubmit={handleCreateTodo}>
                <input
                    type="text"
                    value={content}
                    placeholder="Todoを入力"
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>追加</button>
            </form>
        </>
    );
};

export default UserTodos;
