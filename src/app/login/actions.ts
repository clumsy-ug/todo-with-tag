'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export async function login(formData: FormData) {
    const supabase = createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error('loginのerror->', error);
        redirect("/error");
    }

    revalidatePath('/login-ok', "layout");
    redirect('/login-ok');
}

export async function signup(formData: FormData) {
    const supabase = createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.error('signUpのerror->', error);
        redirect("/error");
    }

    revalidatePath('/signup-pending', "layout");
    redirect('/signup-pending');
}
