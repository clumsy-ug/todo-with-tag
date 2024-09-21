import { createClient } from "../client";

const selectTagName = async (tagId: string): Promise<string | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .select('name')
            .eq('id', tagId)

        if (error) {
            console.error('selectTags内のerror->', error);
            return null;
        }

        if (data.length === 0) return null;

        return data[0].name;
        /* data[0].nameの型
        fire
        */
    } catch (e) {
        console.error('selectTags内のe->', e);
        return null;
    }
}

export default selectTagName;
