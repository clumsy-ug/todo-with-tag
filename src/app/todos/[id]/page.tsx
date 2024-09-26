"use client";

import { Todo } from "@/types";
import { selectTodosByUserId } from "@/supabase/CRUD/todo/selectTodos";
import selectTodoIds from "@/supabase/CRUD/todo/selectTodoIds";
import { selectTodosByTodoIds } from "@/supabase/CRUD/todo/selectTodos";
import { selectTagIdsBySearchTag } from "@/supabase/CRUD/tag/selectTags";
import insertTodo from "@/supabase/CRUD/todo/insertTodo";
import updateTodo from "@/supabase/CRUD/todo/updateTodo";
import deleteTodo from "@/supabase/CRUD/todo/deleteTodo";
import insertTag from "@/supabase/CRUD/tag/insertTag";
import insertTodoIdAndTagId from "@/supabase/CRUD/todo/insertTodoIdAndTagId";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { ClipLoader } from "react-spinners";
import Link from "next/link";
import { TagsInput } from "react-tag-input-component";

const UserTodos = ({ params }: { params: { id: string } }) => {
    const userId = params.id;  // ただurlに入力されている文字列(信頼性低いが即取得可)
    const [sessionUserId, setSessionUserId] = useState<string>('');  // 実際にログインしているuserのid(信頼性高いが即取得不可)
    const [content, setContent] = useState<string>('');
    const [todos, setTodos] = useState<Todo[]>([]);
    const [email, setEmail] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        setIsLoading(true);
    
        const initialization = async () => {
            /* Userを取得 */
            try {
                setIsLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

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
                console.error('getUserで発生したeー->', e);
            }

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
        };
        initialization();
    }, []);

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
                toast.success('編集完了!');
                try {
                    const newTodos = await selectTodosByUserId(userId);
                    if (newTodos) {
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
                            const filteredTodos = await selectTodosByTodoIds(filteredTodoIds);
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
        <>
            <Toaster />

            <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />

            <form action="/auth/signout" method="post">
                <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded duration-300 hover:scale-110"
                >
                    Sign out
                </button>
            </form>

            <Link href='/' scroll={false}>ホーム</Link><br />

            <h1>Welcome, <b style={{color: 'blue'}}>{email}</b></h1>

            <h2>tagで絞り込み検索</h2>
            <input
                type="text"
                placeholder="検索したいtagを入力"
                onChange={e => handleSearchTag(e)}
            />

            <hr />

            <h2>あなたのTodo一覧</h2>
            {todos.map((todo, index) => (
                <ul key={index}>
                    <li>{todo.content}</li>
                    <button onClick={() => handleDeleteTodo(todo.id!)}>削除</button>&nbsp;
                    <button onClick={() => handleUpdateTodo(todo.id!, todo.content)}>編集</button>&nbsp;
                    <Link href={`/tags/${todo.id}`} scroll={false}>タグ一覧</Link>
                </ul>
            ))}

            <br /><hr /><br />

            <h1>Todoを追加</h1>
            <form onSubmit={handleCreateTodoAndTags}>
                <input
                    type="text"
                    placeholder="Todoを入力"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ref={inputRef}
                    required
                />
                <TagsInput
                    value={tags}
                    placeHolder="tagを入力してEnter(任意/複数入力可)"
                    onChange={setTags}
                />
                <button type="submit" disabled={isLoading}>追加</button>
            </form>
        </>
    );
};

export default UserTodos;
