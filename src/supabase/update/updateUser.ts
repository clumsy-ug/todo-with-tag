import { supabase } from "../supabaseClient";

const updateUser = async (id: number, name: string): Promise<Boolean> => {
    try {
        const { error } = await supabase
            .from("users")
            .update({ name: name })
            .eq("id", id);

        if (error) {
            console.error(error);
        }

        return true;
    } catch (e) {
        console.error("updateUser内のエラーは->", e);
        return false;
    }
};

export default updateUser;
