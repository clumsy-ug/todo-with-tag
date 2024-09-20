/*
front側でtags内をmapでまわして、各要素に対して以下のinsertTagを実行しよう
そうすれば各tagを配列ではなく文字列としてそれぞれtagsテーブルに登録できるので
で、その際に、tagを1つも入力しなかったらそもそもinsertTagを実行しないようにしよう
じゃないとそもそもnameを入力できずエラーになると思うので
*/

import { createClient } from "../client";

const insertTag = async (name: string): Promise<string | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .insert({ name })
            .select();

        if (error) {
            console.error('insertTag内のerror->', error);
            return null;
        }

        return data[0].id;
    } catch (e) {
        console.error('insertTag内のe->', e);
        return null;
    }
}

export default insertTag;
