import { createClient } from "../server";

const insertTodo = async (content: string, userId: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('todos')
            .insert({ content: content, user_id: userId });

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
