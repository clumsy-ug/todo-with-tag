import { Todo } from "@/types";
import { createClient } from "../../client";

const insertTodo = async (userId: string, content: string): Promise<Todo | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos')
            .insert({ user_id: userId, content })
            .select();

        if (error) {
            console.error('insertTodo内のerror->', error);
            return null;
        }

        return data[0];
    } catch (e) {
        console.error('insertTodo内のe->', e);
        return null;
    }
}

export default insertTodo;
