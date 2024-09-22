import { createClient } from "../../client";

const insertTag = async (id: string, name: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('tags')
            .insert({ id, name });

        if (error) {
            console.error('insertTag内のerror->', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('insertTag内のe->', e);
        return false;
    }
}

export default insertTag;
