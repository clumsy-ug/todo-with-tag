import Link from "next/link";

const SignedOutAlready = () => {
    return (
        <>
            <h3>エラー: 既にあなたはSign outした状態です</h3>
            <Link href="/login" scroll={false}>ログイン画面へ</Link>
        </>
    );
};

export default SignedOutAlready;
