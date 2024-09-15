import { supabase } from "../client";
import { User } from "@/types/user";

const selectUser = async (id: number): Promise<User | null> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq('id', id)
            .single();
    
        if (error) {
            throw error;
        }

        return data as User;
    } catch (err) {
        console.error("selectUsers内のエラーは->", err);
        return null;
    }
}

export default selectUser;
