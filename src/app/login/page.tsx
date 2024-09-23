import '../globals.css';

import { login, signup } from "./actions";
import { createClient } from "@/supabase/server";
import { Session } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const LoginPage = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    let globalSession: Session | null = null;

    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) globalSession = session;
    } catch (e) {
        console.error("LoginPage内のgetSessionのe->", e);
    }

    if (globalSession) redirect(`todos/${userId}`);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <form className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Email:
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Password:
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        formAction={login}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Log in
                    </button>
                    <button
                        formAction={signup}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
