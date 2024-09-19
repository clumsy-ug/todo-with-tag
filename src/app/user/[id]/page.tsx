// 俺

"use client";

import { Todo } from "@/types";
import selectUserTodos from "@/supabase/CRUD/selectTodos";
import insertTodo from "@/supabase/CRUD/insertTodo";
import updateTodo from "@/supabase/CRUD/updateTodo";
import deleteTodo from "@/supabase/CRUD/deleteTodo";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/supabase/client";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;  // ただurlに入力されている文字列(信頼性低い)
    const [sessionUserId, setSessionUserId] = useState<string>('');  // 実際にログインしているuserのid(信頼性高い)
    const [content, setContent] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        setIsLoading(true);
    
        const initialization = async () => {
            // Userを取得
            try {
                setIsLoading(true);
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.id) setSessionUserId(user.id)
                if (user) {
                    setEmail(user.email!);
                } else {
                    console.info('getUser()でfalsyな値が返ってきました');
                }            
            } catch (e) {
                console.error('getUserで発生したエラー->', e);
            }

            // Userのtodo一覧を取得
            try {
                const userTodos = await selectUserTodos(userId);
                if (userTodos) {
                    setTodos(userTodos);
                } else {
                    console.error('selectUserTodos()でfalsyな値が返ってきました');
                }
            } catch (e) {
                console.error('selectUserTodosで発生したエラー->', e);
            } finally {
                setIsLoading(false);
            }
        };
        initialization();
    }, []);

    const handleCreateTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (userId === sessionUserId) {
            if (content) {
                try {
                    const isSuccess = await insertTodo(userId, content);
                    if (isSuccess) {
                        toast.success('登録完了!');
                        /* task: setTodosで更新 */
                        setTodos(prev => [ ...prev, { user_id: userId, content } ])
                        /* task: content(=新規登録のinput欄)を空にする */
                        setContent('');
                    } else {
                        toast.error('登録失敗!');
                    }
                } catch (e) {
                    toast.error('insertTodoでエラー!');
                    console.error('insertTodoでe発生->', e);
                } finally {
                    setIsLoading(false);
                }
            }
        } else {
            toast.error('不正なurlです!');
            setIsLoading(false);
        }
    }

    const handleUpdateTodo = async (todoId: string, currentContent: string) => {
        const newContent = prompt('編集内容を入力してください', currentContent);
        /* task: 空だった場合 と 変更なしで登録された場合　のvalidation */
        if (!newContent) {
            toast.error('空欄で登録はできません!');
            return;
        }
        if (newContent === currentContent) {
            toast.error('変更されていません!');
            return;
        }

        setIsLoading(true);

        try {
            const isSuccess = await updateTodo(todoId, newContent!);
            /* task: 成功したらtodosを更新 */
            if (isSuccess) {
                toast.success('編集完了!');
                setTodos(prev => prev.map(todo => 
                    todo.id === todoId ? { ...todo, content: newContent } : todo
                ));
            } else {
                toast.error('編集失敗!');
                console.error('updateTodoの返り値がfalsyになった!');
            }
        } catch (e) {
            toast.error('編集が失敗しました!');
            console.error('handleUpdateTodo内のe->', e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteTodo = async (todoId: string) => {
        setIsLoading(true);

        try {
            const isSuccess = await deleteTodo(todoId);
            if (isSuccess) {
                toast.success('削除完了!');
                setTodos(prev => prev.filter(todo => todo.id !== todoId));
            } else {
                toast.error('削除失敗!');
                console.error('deleteTodoの返り値がfalsyになった');
            }
        } catch (e) {
            toast.error('削除失敗!');
            console.error('handleDeleteTodo内のe->', e);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Toaster />

            {isLoading ? (
                <>
                    <h2 style={{color: 'green'}}>Loading...</h2>
                    <h1>Welcome, <b style={{color: 'blue'}}>{email}</b></h1>
                </>
            ) : (
                <h1>Welcome, <b style={{color: 'blue'}}>{email}</b></h1>
            )}

            <h2>あなたのTodo一覧</h2>
            {todos?.map((todo, index) => (
                <ul key={index}>
                    <li>{todo.content}</li>
                    <p className={todo.id ? '' : 'text-red-500'}>
                        id: {todo.id || 'DBからidを取得するためにページをリロードしてください'}
                    </p>
                    <button onClick={() => handleUpdateTodo(todo.id!, todo.content)}>編集</button>
                    <button onClick={() => handleDeleteTodo(todo.id!)}>削除</button>
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
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>追加</button>
            </form>
        </>
    );
};

export default UserTodos;
