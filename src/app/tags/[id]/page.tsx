'use client';

import selectTagIds from "@/supabase/CRUD/selectTagIds";
import selectTagName from "@/supabase/CRUD/selectTagName";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

const TodoTags = ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    const [tagnames, setTagnames] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        const initialization = async () => {
            try {
                const ids = await selectTagIds(todoId);

                if (ids && ids.length >= 1) {
                    const newTagnames = new Set<string>();

                    for (const tagIdObj of ids) {
                        const tagId = tagIdObj.tag_id;
                        try {
                            const tagName = await selectTagName(tagId);
                            if (tagName) {
                                newTagnames.add(tagName);
                            } else {
                                console.error('tagNameがfalsyだ!');
                            }
                        } catch (e) {
                            console.error('selectTagNameでe->', e);
                        }
                    }
                    setTagnames(newTagnames);
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

            {tagnames.size === 0 ? (
                <p>このtodoにtagは登録されていません</p>
            ) : (
                <>
                    <h1>tag一覧</h1>
                    {Array.from(tagnames).map((tagname, index) => (
                        <ul key={index}>
                            <li>{tagname}</li>
                        </ul>
                    ))}
                </>
            )}
        </>
    )
}

export default TodoTags;
