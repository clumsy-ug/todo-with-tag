'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/supabase/client";
import { Tag } from "@/types";
import selectTagIds from "@/supabase/CRUD/tag/selectTagIds";
import { selectTagsByTagIds } from "@/supabase/CRUD/tag/selectTags";
import deleteTag from "@/supabase/CRUD/tag/deleteTag";
import updateTag from "@/supabase/CRUD/tag/updateTag";
import insertTodoIdAndTagId from "@/supabase/CRUD/todo/insertTodoIdAndTagId";
import insertTag from "@/supabase/CRUD/tag/insertTag";
import { Session } from "@supabase/supabase-js";

const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    const supabase = createClient();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [newTagName, setNewTagName] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
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

                const tagIdsObj = await selectTagIds(todoId);

                try {
                    const {data: { user }} = await supabase.auth.getUser();
                    if (user && user.id) {
                        setUserId(user.id);
                    }
                } catch (e) {
                    console.error('getUserでe->', e);
                }

                if (tagIdsObj && tagIdsObj.length >= 1) {
                    const tagIds = tagIdsObj.map(tagIdObj => tagIdObj.tag_id);
                    try {
                        const tagsObj = await selectTagsByTagIds(tagIds);
                        if (tagsObj) {
                            tagsObj.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
                            setTags(tagsObj);
                        } else {
                            console.error('selectTagsでfalsyな値が返ってきました!');
                        }
                    } catch (e) {
                        console.error('selectTagsでe->', e);
                    }
                }
            } catch (e) {
                console.error('selectTagIdsでe->', e);
            } finally {
                setIsLoading(false);
            }
        }   
        initialization();
    }, []);

    const handleCreateTag = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const generatedTagId = await insertTodoIdAndTagId(todoId);
            if (generatedTagId) {
                try {
                    const isSuccess = await insertTag(generatedTagId, newTagName);
                    if (isSuccess) {
                        toast.success('登録完了!');
                        setTags(prev => [ ...prev, { id: generatedTagId, name: newTagName } ]
                            .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                        );
                        setNewTagName('');
                    } else {
                        toast.error('登録失敗!');
                        console.error('insertTagの返り値がfalsyだ!');
                    }
                } catch (e) {
                    console.error('insertTagでe->', e);
                }
            } else {
                console.error('insertTodoIdAndTagIdの返り値がfalsyだ!');
            }
        } catch (e) {
            console.error('handleCreateTag内のe->', e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateTag = async (tagId: string, currentName: string) => {
        const newName = prompt('新しいタグ名を入力してください', currentName);
        if (!newName) {
            toast.error('空欄で登録はできません!');
            return;
        }
        if (newName === currentName) {
            toast.error('変更されていません!');
            return;
        }

        setIsLoading(true);

        try {
            const isSuccess = await updateTag(tagId, newName);
            if (isSuccess) {
                toast.success('編集成功!');
                setTags(prev => prev.map(tagObj => 
                    tagObj.id === tagId ? { ...tagObj, name: newName } : tagObj
                )
                    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
                );
            } else {
                toast.error('編集失敗!')
                console.error('updateTagの返り値がfalsyだ!');
            }
        } catch (e) {
            console.error('handleUpdateTag内のe->', e);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDeleteTag = async (tagId: string) => {
        setIsLoading(true);

        try {
            const deletedTagId = await deleteTag(tagId);
            if (deletedTagId) {
                toast.success('削除成功!');
                setTags(prev => prev.filter(tagObj => tagObj.id !== tagId));
            } else {
                toast.error('削除失敗!');
                console.error('deleteTagの返り値がfalsyだ!');
            }
        } catch (e) {
            console.error('handleDeleteTag内のe->', e);
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
                        <form action={`/todos/${userId}`} method="get">
                            <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                                Todo一覧
                            </button>
                        </form>

                        <form action="/" method="get">
                            <button className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
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

            <hr className="border-t-slate-950 my-10" />

            <div className="flex justify-center">
                <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />
            </div>

            {tags.length === 0 ? (
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <div className="shadow-md rouded-lg p-4">
                        <p className="text-xl text-red-600">このTodoにタグは登録されていません</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold mb-6">タグ一覧</h1>
                    <ul className="space-y-4">
                        {tags.map((tag, index) => (
                            <li key={index} className="rounded-lg shadow-md border-2 p-4 flex justify-between items-center">
                                <span className="text-lg">{tag.name}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleDeleteTag(tag.id)}
                                        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                                    >
                                        削除
                                    </button>
                                    <button
                                        onClick={() => handleUpdateTag(tag.id, tag.name)}
                                        className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600"
                                    >
                                        編集
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <hr className="border-t-slate-950 my-10" />
                </div>
            )}

            <h1 className="text-3xl font-bold mb-6">タグを追加</h1>
            <form onSubmit={handleCreateTag} className="mb-6 space-y-2">
                <input
                    type="text"
                    placeholder="タグを入力"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    登録
                </button>
            </form>
        </div>
    )
}

export default TodoTags;
