import { createClient } from "../client";

const deleteTag = async (tagId: string): Promise<string | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos_tags')
            .delete()
            .eq('tag_id', tagId)
            .select();

        if (error) {
            console.error('deleteTagのerror->', error);
            return null;
        }

        return data[0].tag_id;
        /* data[0]の型
        {"todo_id": "aaa", "tag_id": "bbb"}
        */

        /* data[0].tag_idの型
        "bbb"
        */
    } catch (e) {
        console.error('deleteTagのe->', e);
        return null;
    }
}

export default deleteTag;
