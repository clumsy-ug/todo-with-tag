"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/supabase/client";
import { Session } from "@supabase/supabase-js";
import toast, { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { TagsInput } from "react-tag-input-component";
import { selectTodosByUserId } from "@/supabase/CRUD/todo/selectTodos";
import selectTodoIds from "@/supabase/CRUD/todo/selectTodoIds";
import { selectTodosByTodoIds } from "@/supabase/CRUD/todo/selectTodos";
import { selectTagIdsBySearchTag } from "@/supabase/CRUD/tag/selectTags";
import insertTodo from "@/supabase/CRUD/todo/insertTodo";
import updateTodo from "@/supabase/CRUD/todo/updateTodo";
import deleteTodo from "@/supabase/CRUD/todo/deleteTodo";
import insertTag from "@/supabase/CRUD/tag/insertTag";
import insertTodoIdAndTagId from "@/supabase/CRUD/todo/insertTodoIdAndTagId";
import { Todo } from "@/types";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;  // ただurlに入力されている文字列(信頼性低いが即取得可)
    const [sessionUserId, setSessionUserId] = useState<string>('');  // 実際にログインしているuserのid(信頼性高いが即取得不可)
    const [content, setContent] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);
    
        const initialization = async () => {
            /* Userを取得 */
            try {
                setIsLoading(true);

                // Sessionが無い場合は強制的にloginページに飛ばす
                let globalSession: Session | null = null;
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (session) globalSession = session;
                } catch (e) {
                    console.error("UserTodos関数内のgetSessionのe->", e);
                }
                if (!globalSession) {
                    router.push('/login');
                }
            } catch (e) {
                console.error('getUserで発生したeー->', e);
            } finally {
                setIsLoading(false);
            }
        };
        initialization();
    }, [supabase.auth, router]);

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                // userのidとemailをstateとして保存
                if (user && user.id) {
                    setSessionUserId(user.id);
                } else {
                    console.error('userもしくはuserのidが見つかりません');
                }
        
                if (user && user.email) {
                    setEmail(user.email);
                } else {
                    console.error('userもしくはuserのemailが見つかりません');
                }
            } catch (e) {
                console.error('supabase.auth.getUser()でエラー', e);
            } finally {
                setIsLoading(false);
            }
        }
        initialization();
    }, [supabase.auth])

    useEffect(() => {
        setIsLoading(true);
        
        const initialization = async () => {
            /* Userのtodo一覧を取得 */
            try {
                const userTodos = await selectTodosByUserId(userId);
                if (userTodos) {
                    userTodos.sort((a, b) => a.content.localeCompare(b.content, undefined, { numeric: true }));
                    setTodos(userTodos);
                } else {
                    console.error('selectTodosByUserIdでfalsyな値が返ってきました');
                }
            } catch (e) {
                console.error('selectTodosByUserIdで発生したe->', e);
            } finally {
                setIsLoading(false);
            }
        }
        initialization();
    }, [userId]);

    const handleCreateTodoAndTags = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (userId === sessionUserId) {
            if (content) {
                try {
                    /* todo登録処理 */
                    const newTodo = await insertTodo(userId, content);
                    if (newTodo) {
                        try {
                            const newTodos = await selectTodosByUserId(userId);
                            if (newTodos) {
                                newTodos.sort((a, b) => a.content.localeCompare(b.content, undefined, { numeric: true }));
                                setTodos(newTodos);
                            }
                        } catch (e) {
                            console.error('handleCreateTodoAndTags内のselectTodosByUserIdでe->', e);
                        }
                        setContent('');
                    } else {
                        toast.error('todo登録失敗!');
                    }

                    /* tag登録処理 */
                    if (tags.length >= 1) {  // tagが1つ以上登録された場合                    
                        tags.map(async (tag, index) => {
                            if (newTodo && newTodo.id) {
                                try {
                                    const tagId = await insertTodoIdAndTagId(newTodo.id);
                                    if (tagId) {
                                        try {
                                            const isSuccess = await insertTag(tagId, tag);
                                            if (isSuccess) {
                                                if (index === tags.length - 1) {
                                                    toast.success('登録完了!');
                                                    setTags([]);
                                                }
                                            } else {
                                                console.error('insertTagの結果がfalsyだ!');
                                            }
                                        } catch (e) {
                                            console.error('insertTagのe->', e);
                                        }
                                    } else {
                                        console.error('tagIdがfalsyだ!');
                                    }
                                } catch (e) {
                                    console.error('insertTodoIdAndTagIdでe->', e);
                                }
                            } else {
                                console.error('newTodoかnewTodo.idがfalsyだ!');
                            }
                        })
                    }
                } catch (e) {
                    toast.error('handleCreateTodoAndTagsでエラー!');
                    console.error('handleCreateTodoAndTagsでe発生->', e);
                } finally {
                    setIsLoading(false);
                    inputRef.current?.focus();
                }
            }
        } else {
            toast.error('不正なurlです!');
            setIsLoading(false);
        }
    }

    const handleUpdateTodo = async (todoId: string, currentContent: string) => {
        const newContent = prompt('編集内容を入力してください', currentContent);
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
            const isSuccess = await updateTodo(todoId, newContent);
            if (isSuccess) {
                try {
                    const newTodos = await selectTodosByUserId(userId);
                    if (newTodos) {
                        toast.success('編集完了!');
                        newTodos.sort((a, b) => a.content.localeCompare(b.content, undefined, { numeric: true }));
                        setTodos(newTodos);
                    } else {
                        console.error('selectTodosByUserIdの返り値がfalsyだ!');
                    }
                } catch (e) {
                    console.error('handleUpdateTodo内のselectTodosのe->', e);
                }
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

    const handleSearchTag = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true);

        // input要素のvalueではなくe.target.valueにしないと最新情報が取れない
        if (e.target.value === '') {
            try {
                const userTodos = await selectTodosByUserId(userId);
                if (userTodos) {
                    userTodos.sort((a, b) => a.content.localeCompare(b.content, undefined, { numeric: true }));
                    setTodos(userTodos);
                } else {
                    console.error('handleSearchTag内のselectTodosByUserIdでfalsyな値が返ってきました');
                }
            } catch (e) {
                console.error('handleSearchTag内のselectTodosByUserIdで発生したe->', e);
            } finally {
                setIsLoading(false)
            }
            return;
        }

        // 最終的にtodos.idを持ってこれれば良い。それを使ってsetTodosするので。
        // 1文字変えるだけで3回リクエスト & 1回更新 が走るが、仕方ない（改善したい場合は恐らくテーブル構造を変えるしかない）
        try {
            const filteredTagIdsRow = await selectTagIdsBySearchTag(e.target.value);
            const filteredTagIds = filteredTagIdsRow?.map(tagIdObj => tagIdObj.id);
            if (filteredTagIds) {
                try {
                    const filteredTodoIdsRow = await selectTodoIds(filteredTagIds);
                    const filteredTodoIds = filteredTodoIdsRow?.map(todoIdObj => todoIdObj.todo_id);
                    if (filteredTodoIds) {
                        try {
                            const filteredTodos = await selectTodosByTodoIds(filteredTodoIds, userId);
                            if (filteredTodos) {
                                filteredTodos.sort((a, b) => a.content.localeCompare(b.content, undefined, { numeric: true }));
                                setTodos(filteredTodos);
                            } else {
                                console.error('handleSearchTag内のselectTodosByTodoIdsの返り値がfalsyだ!');
                            }
                        } catch (e) {
                            console.error('handleSearchTag内のselectTodosByTodoIdsでe->', e);
                        }
                    } else {
                        console.error('selectTodoIdsの返り値がfalsyだ!');
                    }
                } catch (e) {
                    console.error('handleSearchTag内のselectTodoIdsでe->', e);
                }
            }
        } catch (e) {
            console.error('handleSarchTag内のe->', e);
        } finally {
            setIsLoading(false);
        }

    }

    return (
        <div className="container mx-auto">
            <Toaster />

            <nav className="bg-gray-700 p-4 rounded-t-lg sticky top-0">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex space-x-4">
                        <form action="/" method="get">
                            <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:underline">
                                ホーム
                            </button>
                        </form>
                    </div>

                    <div>
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <h3 className="text-xl font-bold mt-4">Welcome, <span className="text-blue-600">{email}</span>！</h3>

            <hr className="border-t-slate-950 my-10" />

            <div className="flex justify-center">
                <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />
            </div>

            <div className="mb-8">
                <h3 className="text-xl mb-4">タグで絞り込み検索</h3>
                <input
                    type="text"
                    placeholder="検索したいタグを入力 (入力されたタグを持つTodoが表示されます)"
                    onChange={e => handleSearchTag(e)}
                    className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* ちらつき確認用 */}
            <p className="text-red-600">あいうえお: {isLoading.toString()}</p>

            {todos.length === 0 ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <div className="shadow-md rouded-lg p-4">
                        <p className="text-xl text-red-600">Todoが登録されていません</p>
                    </div>
                </div>
            ) : (
            <>
                <h1 className="text-3xl font-bold mb-6">あなたのTodo一覧</h1>
                <ul className="space-y-4">
                    {todos.map((todo, index) => (
                        <li key={index} className="shadow-md border-2 rounded-lg p-4 flex justify-between items-center">
                            <span className="text-lg">{todo.content}</span>
                            <div className="space-x-2">
                                <button 
                                    onClick={() => handleDeleteTodo(todo.id!)}
                                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                                >
                                    削除
                                </button>
                                <button 
                                    onClick={() => handleUpdateTodo(todo.id!, todo.content)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
                                >
                                    編集
                                </button>
                                <Link 
                                    href={`/tags/${todo.id}`}
                                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg inline-block"
                                >
                                    タグ一覧
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </>
            )}

            <hr className="border-t-slate-950 my-10" />

            <h1 className="text-3xl font-bold mb-6">Todoを追加</h1>
            <form onSubmit={handleCreateTodoAndTags} className="space-y-3 mb-6">
                <input
                    type="text"
                    placeholder="Todoを入力"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ref={inputRef}
                    required
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <TagsInput
                    value={tags}
                    placeHolder="各タグを入力し終わったらEnter (任意/複数入力可)"
                    onChange={setTags}
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    追加
                </button>
            </form>
        </div>
    );
};

export default UserTodos;
