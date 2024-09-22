'use client';

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";
import { createClient } from "@/supabase/client";
import Link from "next/link";
import { Tag } from "@/types";
import selectTagIds from "@/supabase/CRUD/selectTagIds";
import selectTags from "@/supabase/CRUD/selectTags";
import deleteTag from "@/supabase/CRUD/deleteTag";
import updateTag from "@/supabase/CRUD/updateTag";
import insertTodoIdAndTagId from "@/supabase/CRUD/insertTodoIdAndTagId";
import insertTag from "@/supabase/CRUD/insertTag";

const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    const supabase = createClient();
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');
    const [newTagName, setNewTagName] = useState<string>('');

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
            try {
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
                        const tagsObj = await selectTags(tagIds);
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
                        try {
                            const tagIdsObj = await selectTagIds(todoId);
                            if (tagIdsObj && tagIdsObj.length >= 1) {
                                const tagIds = tagIdsObj.map(tagIdObj => tagIdObj.tag_id);
                                try {
                                    const tagsObj = await selectTags(tagIds);
                                    if (tagsObj) {
                                        toast.success('登録完了!')
                                        tagsObj.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
                                        setTags(tagsObj);
                                        setNewTagName('');
                                    } else {
                                        console.error('selectTagsでfalsyな値が返ってきました!');
                                    }
                                } catch (e) {
                                    console.error('selectTagsでe->', e);
                                }
                            }
                        } catch (e) {
                            console.error('handleCreateTag内のselectTagIdsでe->', e);
                        }
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
                ));
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
        <>
            <Toaster />
            
            <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />

            <Link href={`/todos/${userId}`} scroll={false}>Todo一覧へ</Link>

            {tags.length === 0 ? (
                <p>このtodoにtagは登録されていません</p>
            ) : (
                <>
                    <h1>tag一覧</h1>
                    {tags.map((tag, index) => (
                        <ul key={index}>
                            <li>{tag.name}</li>
                            <button onClick={() => handleDeleteTag(tag.id)}>削除</button>
                            <button onClick={() => handleUpdateTag(tag.id, tag.name)}>編集</button>
                        </ul>
                    ))}
                </>
            )}

            <hr />

            <h1>tagを追加</h1>
            <form onSubmit={handleCreateTag}>
                <input
                    type="text"
                    placeholder="tag名を入力"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                />
                <button type="submit">登録</button>
            </form>
        </>
    )
}

export default TodoTags;
