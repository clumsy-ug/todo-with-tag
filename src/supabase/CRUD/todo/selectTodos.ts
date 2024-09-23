import { Todo } from "@/types";
import { createClient } from "../../client";

export const selectTodosByUserId = async (userId: string): Promise<Todo[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos')
            .select()
            .eq('user_id', userId)

        if (error) {
            console.error('selectTodosByUserId内のerror->', error);
            return null;
        }

        // このTodo[]は、空配列つまり[]も含むため、todoを1件も登録していないUserの場合でもエラーにはならず正常に動作させることができる
        return data;
    } catch (e) {
        console.error('selectTodosByUserId内のe->', e);
        return null;
    }
}

export const selectTodosByTodoIds = async (todoIds: string[]): Promise<Todo[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('todos')
            .select()
            .in('id', todoIds)

        if (error) {
            console.error('selectTodosByTodoIds内のerror->', error);
            return null;
        }

        return data;
        /* dataの型
        [
            {"id": "aaa", "content": "bbb", "user_id": "ccc", "created_at": "ddd"},
            {"id": "aaa", "content": "bbb", "user_id": "ccc", "created_at": "ddd"},
            {"id": "aaa", "content": "bbb", "user_id": "ccc", "created_at": "ddd"}
        ]
        */
    } catch (e) {
        console.error('selectTodosByTodoIds内のe->', e);
        return null;
    }
}
