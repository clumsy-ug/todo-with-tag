import { createClient } from "@/supabase/client";
import { Todo_id } from "@/types";

const selectTodoIds = async (tagIds: string[]): Promise<Todo_id[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos_tags')
            .select('todo_id')
            .in('tag_id', tagIds);

        if (error) {
            console.error('selectTodoIdsのerror->', error);
            return null;
        }

        return data;
    } catch (e) {
        console.error('selectTodoIdsのe->', e);
        return null;
    }
}

export default selectTodoIds;
