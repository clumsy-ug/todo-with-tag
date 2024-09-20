import { createClient } from "../client";

const insertTodoIdAndTagId = async (todoId: string, tagId: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('todos_tags')
            .insert({ todo_id: todoId, tag_id: tagId });
        
        if (error) {
            console.error('insertTodoIdAndTagId内のerror->', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('insertTodoIdAndTagId内のe->', e);
        return false;
    }
}

export default insertTodoIdAndTagId;
