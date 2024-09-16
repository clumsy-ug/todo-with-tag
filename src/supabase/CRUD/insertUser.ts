import { createClient } from "../client";

const insertUser = async (name: string): Promise<boolean> => {
    const supabase = createClient();
    
    try {
        const { error } = await supabase
            .from("users")
            .insert({ name: name });

        if (error) {
            console.error(error);
        }

        return true;
    } catch (e) {
        console.error("insertUser内のエラーは->", e);
        return false;
    }
};

export default insertUser;