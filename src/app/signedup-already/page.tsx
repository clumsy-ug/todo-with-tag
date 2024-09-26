import Link from "next/link";

const SignedUpAlready = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="shadow-md p-8 text-center rounded-lg">
                <p className="text-red-600 text-xl font-bold mb-4">
                    エラー: 既にあなたはSign up済みです
                </p>
                <Link
                    href="/login"
                    scroll={false}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    ログインする
                </Link>
            </div>
        </div>
    );
};

export default SignedUpAlready;
