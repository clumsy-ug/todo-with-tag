import { TagName } from "@/types";
import { createClient } from "../client";

const selectTagNames = async (tagIds: string[]): Promise<TagName[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .select('name')
            .in('id', tagIds);

        if (error) {
            console.error('selectTagNames内のerror->', error);
            return null;
        }

        return data;
        /* dataの型
        [
            {name: 'aaa'},
            {name: 'bbb'},
            {name: 'ccc'}
        ]
        */
    } catch (e) {
        console.error('selectTagNames内のe->', e);
        return null;
    }
}

export default selectTagNames;
