'use server';

import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function POST() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) { // user.idが取れる時はログイン済、つまり妥当な状態
        await supabase.auth.signOut();
    } else {  // user.idが取れない時はログイン済じゃないのにsignoutしようとしてる、つまり異常な状態
        redirect('/signedout-already');
    }

    revalidatePath("/", "layout");
    redirect('/login');
}
