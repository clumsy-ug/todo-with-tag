import { createClient } from "@/supabase/server";
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    return (
        <div>
            <h1>Welcome to the home page</h1>
            {session ? (
                <>
                    <p>You are logged in as <b>{session.user.email}</b></p>
                    <SignOutButton />
                </>
            ) : (
                <p>You are not logged in</p>
            )}
        </div>
    );
}
