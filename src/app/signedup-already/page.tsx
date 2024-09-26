import Link from "next/link";

const SignedUpAlready = () => {
    return (
        <>
            <h3>エラー: 既にあなたはSign up済みです</h3>
            <Link href="/login" scroll={false}>ログインする</Link>
        </>
    );
};

export default SignedUpAlready;
