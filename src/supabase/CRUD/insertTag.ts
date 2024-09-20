/*
front側でtags内をmapでまわして、各要素に対して以下のinsertTagを実行しよう
そうすれば各tagを配列ではなく文字列としてそれぞれtagsテーブルに登録できるので
で、その際に、tagを1つも入力しなかったらそもそもinsertTagを実行しないようにしよう
じゃないとそもそもnameを入力できずエラーになると思うので
*/

import { createClient } from "../client";

const insertTag = async (id: string, name: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from('tags')
            .insert({ id, name })
            .select();

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
