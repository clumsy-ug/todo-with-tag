import Link from "next/link";

const ErrorPage = () => {
    return (
        <>
            <p>Sorry, something went wrong</p>
            <p>申し訳ございません、何か問題が発生しました</p>
            <Link href='/login'>ログインページへ</Link>
        </>
    )
}

export default ErrorPage;
