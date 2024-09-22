'use client';

import selectTagIds from "@/supabase/CRUD/selectTagIds";
import selectTags from "@/supabase/CRUD/selectTags";
import deleteTag from "@/supabase/CRUD/deleteTag";
import { Tag } from "@/types";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import toast, { Toaster } from "react-hot-toast";

const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    const [tags, setTags] = useState<Tag[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
            try {
                const tagIdsObj = await selectTagIds(todoId);

                if (tagIdsObj && tagIdsObj.length >= 1) {
                    const tagIds = tagIdsObj.map(tagIdObj => tagIdObj.tag_id);
                    try {
                        const tagNamesObj = await selectTags(tagIds);
                        tagNamesObj?.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
                        if (tagNamesObj) setTags(tagNamesObj);
                    } catch (e) {
                        console.error('selectTagNamesでe->', e);
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

    const handleDeleteTag = async (tagId: string) => {
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
        }
    }

    return (
        <>
            <Toaster />
            
            <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />

            {tags.length === 0 ? (
                <p>このtodoにtagは登録されていません</p>
            ) : (
                <>
                    <h1>tag一覧</h1>
                    {tags.map((tag, index) => (
                        <ul key={index}>
                            <li>{tag.name}</li>
                            <button onClick={() => handleDeleteTag(tag.id)}>削除</button>
                        </ul>
                    ))}
                </>
            )}
        </>
    )
}

export default TodoTags;
