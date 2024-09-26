import Link from "next/link";

const ErrorPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-xl font-semibold text-red-600 mb-4">
                    申し訳ございません、問題が発生しました
                </p>
                <Link
                    href="/login"
                    scroll={false}
                    className="text-blue-600 hover:text-blue-800 underline"
                >
                    ログインページへ
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
