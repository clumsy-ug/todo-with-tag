import { createClient } from "../client";
import { User } from "@/types";

const selectUsers = async (): Promise<User[] | null> => {
    const supabase = createClient();
    
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
