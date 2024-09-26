import Link from "next/link";

const SignedOutAlready = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="shadow-md text-center rounded-lg p-8">
                <p className="text-red-600 text-xl font-bold mb-4">
                    エラー: 既にあなたはSign outした状態です
                </p>
                <Link
                    href="/login"
                    scroll={false}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    ログイン画面へ
                </Link>
            </div>
        </div>
    );
};

export default SignedOutAlready;
