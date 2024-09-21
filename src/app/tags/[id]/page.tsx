'use client';

import selectTagIds from "@/supabase/CRUD/selectTagIds";
import selectTagNames from "@/supabase/CRUD/selectTagName";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    const [tagNamesState, setTagNamesState] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
            try {
                const tagIdsObj = await selectTagIds(todoId);

                if (tagIdsObj && tagIdsObj.length >= 1) {
                    const tagIds = tagIdsObj.map(tagIdObj => tagIdObj.tag_id);
                    try {
                        const tagNamesObj = await selectTagNames(tagIds);
                        const tagNames = tagNamesObj!.map(tagNameObj => tagNameObj.name);
                        if (tagNames) setTagNamesState(tagNames);
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

    return (
        <>
            <ClipLoader size={100} loading={isLoading} color={"#42e0f5"} />

            {tagNamesState.length === 0 ? (
                <p>このtodoにtagは登録されていません</p>
            ) : (
                <>
                    <h1>tag一覧</h1>
                    {tagNamesState.map((tagName, index) => (
                        <ul key={index}>
                            <li>{tagName}</li>
                        </ul>
                    ))}
                </>
            )}
        </>
    )
}

export default TodoTags;
