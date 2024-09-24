import { createClient } from "@/supabase/server";

const selectUser = async (userId: string): Promise<number | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('users')
            .select()
            .eq('id', userId);  // single()不要か？

        if (error) {
            console.error('selectUserでerror->', error);
            return null;
        }

        return data.length;
        /* dataの型
        userが存在しない場合
        []

        userが存在する場合
        [
            {"id": "aaa", "email": "bbb", "created_at": ccc}
        ]

        つまりどちらにしてもdata.lengthは使用可能。0か1が返ってくる
        */
    } catch (e) {
        console.error('selectUserでe->', e);
        return null;
    }
}

export default selectUser;
