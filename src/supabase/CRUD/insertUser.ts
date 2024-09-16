import { createClient } from "../client";

const insertUser = async (id: string, email: string): Promise<boolean> => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("users")
            .insert({ id: id, email: email });

        if (error) {
            console.error("insertUser内のerror", error);
            return false;
        }

        return true;
    } catch (e) {
        console.error("insertUser内のe", e);
        return false;
    }
};

export default insertUser;
