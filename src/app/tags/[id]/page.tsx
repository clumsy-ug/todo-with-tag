/*
todos_tagsテーブルからtodoIdが一致するデータのtag_idを全て返す
（もしtagが登録されていないtodoだった場合、つまりtag_idではなくnullが返ってきた場合、画面に「この
todoにはタグが登録されていません」と表示）
->tagsテーブルからそのtag_idと一致するデータのnameを全て画面表示する
*/

import selectTagIds from "@/supabase/CRUD/selectTagIds";

const TodoTags = async ({ params }: { params: { id: string } }) => {
    const todoId = params.id;
    try {
        const ids = await selectTagIds(todoId);
        console.log(ids);
    } catch (e) {
        console.error('TodoTags内でe->', e);
    }

    return (
        <p>todoのidは: {todoId}</p>
    )
}

export default TodoTags;
