import { User } from "@/types/user";
import { createClient } from "../client";

const selectUser = async (id: string): Promise<User | null> => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq("id", id)
            .single();

        if (error) {
            console.error("selectUser内のerror->", error);
            return null;
        }

        return data as User;
    } catch (e) {
        console.error("selectUser内のe->", e);
        return null;
    }
};

export default selectUser;
