import { createClient } from "../../client";

const deleteTodo = async (todoId: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', todoId);

        if (error) {
            console.error('deleteTodo内のerror->', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('deleteTodo内のe->', e);
        return false;
    }
}

export default deleteTodo;
