import { Todo } from "@/types";
import { createClient } from "../client";

const selectTodos = async (userId: string): Promise<Todo[] | null> => {
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

        // このTodo[]は、空配列つまり[]も含むため、todoを1件も登録していないUserの場合でもエラーにはならず正常に動作させることができる
        return data;
    } catch (e) {
        console.error('selectUserTodos内のe->', e);
        return null;
    }
}

export default selectTodos;
