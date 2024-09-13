import { supabase } from "../supabaseClient";
import { User } from "@/types/user";

const selectUsers = async (): Promise<User[] | null> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select();
    
        if (error) {
            throw error;
        }

        return data as User[];
    } catch (err) {
        console.error("selectUsers内のエラーは->", err);
        return null;
    }
}

export default selectUsers;
