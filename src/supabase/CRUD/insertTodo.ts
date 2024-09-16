import { createClient } from "../client";

const insertTodo = async (userId: string, content: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('todos')
            .insert({ user_id: userId, content: content });

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

export default insertTodo;
