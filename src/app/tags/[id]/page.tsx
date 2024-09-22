'use client';

import selectTagIds from "@/supabase/CRUD/selectTagIds";
import selectTags from "@/supabase/CRUD/selectTags";
import { Tag } from "@/types";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

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

                        /* idが数字であればsort内で減算(a.id - b.id)したものを返すだけで良いのだが、
                        idは数字と英語の混合文字列なのでsortのみではなくlocaleCompareを使用することでより短く・正確に比較可能に。
                        更に、localeCompare内の引数でnumericも設定することで、単純なUnicode値で比較したときに
                        発生してしまう 10 < 2 のような状態になってしまうことを防げる */
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

    const handleUpdateTag = async (tagId: string) => {
        console.log('tagIdは->', tagId);
    }

    return (
        <>
            <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />

            {tags.length === 0 ? (
                <p>このtodoにtagは登録されていません</p>
            ) : (
                <>
                    <h1>tag一覧</h1>
                    {tags.map((tag, index) => (
                        <ul key={index}>
                            <li>{tag.name}</li>
                            <button onClick={() => handleUpdateTag(tag.id)}>編集</button>
                        </ul>
                    ))}
                </>
            )}
        </>
    )
}

export default TodoTags;
