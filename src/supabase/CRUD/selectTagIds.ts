import { TagId } from "@/types";
import { createClient } from "../client";

const selectTagIds = async (todoId: string): Promise<TagId[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos_tags')
            .select('tag_id')
            .eq('todo_id', todoId);

        if (error) {
            console.error('selectTagIds内のerror->', error);
            return null;
        }

        if (data.length === 0) return null;

        return data;
        /* dataの型
        [
            {tag_id: 'bcd22085-90cc-417d-aff8-4a252fff77f4'},
            {tag_id: '5a0b85fa-5c15-479d-a147-0b2a195cc1ac'},
            {tag_id: 'c88f1a8b-cc2f-49b5-8f87-b8a5b3b8cb23'}
        ]
        */
    } catch (e) {
        console.error('selectTagIds内のe->', e);
        return null;
    }
}

export default selectTagIds;
