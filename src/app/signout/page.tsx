const SignOut = () => {
    return (
        <form action="/auth/signout" method="post">
            <button type="submit">
                Sign out
            </button>
        </form>
    );
};

export default SignOut;