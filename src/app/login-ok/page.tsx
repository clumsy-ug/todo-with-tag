import Link from "next/link";
import { createClient } from "@/supabase/server";

const LoginOk = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 rounded-lg shadow-md text-center w-72">
                <p className="text-green-600 text-2xl mb-4 font-bold">
                    ログイン完了！
                </p>
                <Link
                    href={`todos/${userId}`}
                    scroll={false}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    あなたのtodoへ
                </Link>
            </div>
        </div>
    )
}

export default LoginOk;
