import Link from "next/link";

const Home = () => {
    return (
        <>
            <h1>Welcome to the home page</h1>
            <p>自分だけのTodoリストを作成しよう！</p>
            <p>各Todoには自由なタグをつけることができます。</p>
            <p>タグでTodoを検索することができます。</p>

            <br />

            <Link href="/login">はじめる</Link>
        </>
    );
};

export default Home;
