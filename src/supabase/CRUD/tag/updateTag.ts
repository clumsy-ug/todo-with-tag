import { createClient } from "../../client";

const updateTag = async (tagId: string, newTagName: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from('tags')
            .update({ name:  newTagName})
            .eq('id', tagId);

        if (error) {
            console.error('updateTag内のerror->', error);
            return false;
        }

        return true;
    } catch (e) {
        console.error('updateTag内のe->', e);
        return false;
    }
}

export default updateTag;
