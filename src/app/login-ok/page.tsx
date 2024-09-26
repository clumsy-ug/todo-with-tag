import Link from "next/link";
import { createClient } from "@/supabase/server";

const LoginOk = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    return (
        <>
            <h3>ログイン完了！</h3>
            <Link href={`todos/${userId}`} scroll={false}>あなたのtodoへ</Link>
        </>
    )
}

export default LoginOk;
