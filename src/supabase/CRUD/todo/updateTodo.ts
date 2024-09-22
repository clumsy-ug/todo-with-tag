import { createClient } from "../../client";

const updateTodo = async (todoId: string, content: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('todos')
            .update({ content: content })
            .eq('id', todoId)

        if (error) {
            console.error('insertTodo内のerror->', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('insertTodo内のe->', e);
        return false;
    }
}

export default updateTodo;
