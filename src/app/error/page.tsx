import Link from "next/link";

const ErrorPage = () => {
    return (
        <>
            <p>申し訳ございません、何か問題が発生しました</p>
            <Link href='/login' scroll={false}>ログインページへ</Link>
        </>
    )
}

export default ErrorPage;
