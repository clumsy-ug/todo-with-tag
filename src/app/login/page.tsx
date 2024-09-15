import { login, signup } from "./actions";
import { createClient } from "@/supabase/server";
import { Session } from "@supabase/supabase-js";

const LoginPage = async () => {
    const supabase = createClient();
    
    /* useStateなどのclient系使えない、しかしsessionはグローバルで保持したい、そしてエラーハンドリングもしたい
    -> グローバル変数としてsessionを保存することで解決 */
    let globalSession: Session | null = null;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) globalSession = session;
    } catch (e) {
        console.error('LoginPage内のエラー->', e);
    }

    return (
        <>
            {globalSession ? (
                <p>あなたは既にログインしています</p>
            ) : (
                <form>
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="given-name"
                        required
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="given-name"
                        required
                    />
                    <button formAction={login}>Log in</button>
                    <button formAction={signup}>Sign up</button>
                </form>
            )}
        </>
    );
}

export default LoginPage;
