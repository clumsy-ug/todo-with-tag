import { createClient } from "../client";

const selectTagIds = async (todoId: string) => {
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
    } catch (e) {
        console.error('selectTagIds内のe->', e);
        return null;
    }
}

export default selectTagIds;


// return data.map(row => row.tag_id)

