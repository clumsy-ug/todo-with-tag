import { supabase } from "../client";

const deleteUser = async (id: number): Promise<Boolean> => {
    try {
        const {error} = await supabase
            .from('users')
            .delete()
            .eq('id', id)
    
        if (error) {
            console.error(error);
        }
        
        return true;
    } catch (e) {
        console.error('deleteUser内のエラーは->', e);
        return false;
    }
}

export default deleteUser;
