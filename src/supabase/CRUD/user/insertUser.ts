import { createClient } from "@/supabase/server";

const insertUser = async (userId: string, userEmail: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("users")
            .insert({ id: userId, email: userEmail });

        if (error) {
            console.error("insertUser内のinsert処理でerror->", error);
            return false;
        }

        return true;
    } catch (e) {
        console.error("insertUser内のinsert処理でe->", e);
        return false;
    }
};

export default insertUser;
