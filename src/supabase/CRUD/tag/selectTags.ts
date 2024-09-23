import { Id, Tag } from "@/types";
import { createClient } from "../../client";

export const selectTagsByTagIds = async (tagIds: string[]): Promise<Tag[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .select()
            .in('id', tagIds);

        if (error) {
            console.error('selectTagNames内のerror->', error);
            return null;
        }

        return data;
        /* dataの型
        [
            {id: 'aaa', name: 'aaa'},
            {id: 'bbb', name: 'bbb'},
            {id: 'ccc', name: 'ccc'}
        ]
        */
    } catch (e) {
        console.error('selectTagNames内のe->', e);
        return null;
    }
}

export const selectTagIdsBySearchTag = async (searchTag: string): Promise<Id[] | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .select('id')
            .ilike('name', `%${searchTag}%`);

        if (error) {
            console.error('selectTagIdsBySearchTag内のerror->', error);
            return null;
        }

        return data;
        /* dataの型
        [
            {"id": "aaa"},
            {"id": "bbb"},
            {"id": "ccc"}
        ]
        */
    } catch (e) {
        console.error('selectTagIdsBySearchTag内のe->', e);
        return null;
    }
}
