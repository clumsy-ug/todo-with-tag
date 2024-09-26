import Link from "next/link";

const Home = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-10 space-y-8">
                <h1 className="text-4xl font-bold text-center text-indigo-600">
                    Welcome to Your Todo App
                </h1>
                <div className="space-y-6">
                    <p className="text-xl text-gray-700 text-center">
                        自分だけのTodoリストを作成しよう！
                    </p>
                    <ul className="list-disc list-inside space-y-3 text-lg text-gray-600 pl-4">
                        <li>各Todoには自由なタグをつけることができます。</li>
                        <li>タグでTodoを検索することができます。</li>
                    </ul>
                </div>
                <div className="text-center pt-4">
                    <Link
                        href="/login"
                        className="inline-block bg-indigo-600 text-white text-lg font-semibold py-3 px-8 rounded-full hover:bg-indigo-700 duration-300 hover:scale-105"
                        scroll={false}
                    >
                        はじめる
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
