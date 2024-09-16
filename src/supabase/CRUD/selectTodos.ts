import { Todo } from "@/types";
import { createClient } from "../client";

const selectUserTodos = async (userId: string): Promise<Todo[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos')
            .select()
            .eq('user_id', userId)

        if (error) {
            console.error('selectUserTodos内のerror->', error);
            return null;
        }

        return data as Todo[];;
    } catch (e) {
        console.error('selectUserTodos内のe->', e);
        return null;
    }
}

export default selectUserTodos;
