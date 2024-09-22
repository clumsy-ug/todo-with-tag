import { createClient } from "../client";

const insertTodoIdAndTagId = async (todoId: string): Promise<string | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos_tags')
            .insert({ todo_id: todoId })
            .select()
        
        if (error) {
            console.error('insertTodoIdAndTagId内のerror->', error);
            return null;
        }

        return data[0].tag_id;
    } catch (e) {
        console.error('insertTodoIdAndTagId内のe->', e);
        return null;
    }
}

export default insertTodoIdAndTagId;
