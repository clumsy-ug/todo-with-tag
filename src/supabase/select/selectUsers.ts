import { supabase } from "../supabaseClient";
import { User } from "@/types/user";

const selectUsers = async (): Promise<User[] | boolean> => {
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
        return false;
    }
}

export default selectUsers;
