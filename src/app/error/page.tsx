import Link from "next/link";

const ErrorPage = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="p-8 rounded-lg shadow-md text-center">
                <p className="text-xl font-bold text-red-600 mb-4">
                    申し訳ございません、問題が発生しました
                </p>
                <Link
                    href="/login"
                    scroll={false}
                    className="text-blue-600 underline hover:text-blue-800"
                >
                    ログインページへ
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
