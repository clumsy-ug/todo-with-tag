const SignOut = () => {
    return (
        <form
            action="/auth/signout"
            method="post"
            className="flex justify-center items-center min-h-screen"
        >
            <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded duration-300 hover:scale-110"
            >
                Sign out
            </button>
        </form>
    );
};

export default SignOut;
