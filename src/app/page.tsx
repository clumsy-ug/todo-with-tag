import SignOutButton from "@/components/SignOutButton";
import { createClient } from "@/supabase/server";
import { Session } from "@supabase/supabase-js";

const Home = async () => {
    const supabase = createClient();

    /* useStateなどのclient系使えない、しかしsessionはグローバルで保持したい、そしてエラーハンドリングもしたい
    -> グローバル変数としてsessionを保存することで解決 */
    let globalSession: Session | null = null;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) globalSession = session;
    } catch (e) {
        console.error(e);
    }

    return (
        <div>
            <h1>Welcome to the home page</h1>
            {globalSession ? (
                <>
                    <p>
                        You are logged in as <b>{globalSession.user.email}</b>
                    </p>
                    <SignOutButton />
                </>
            ) : (
                <p>You are not logged in</p>
            )}
        </div>
    );
};

export default Home;
