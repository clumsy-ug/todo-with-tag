import { login, signup } from "./actions";

export default function LoginPage() {
    return (
        <form>
            <label htmlFor="email">Email:</label>
            <input
                id="email"
                name="email"
                type="email"
                autoComplete="given-name"
                required
            />
            <label htmlFor="password">Password:</label>
            <input
                id="password"
                name="password"
                type="password"
                autoComplete="given-name"
                required
            />
            <button formAction={login}>Log in</button>
            <button formAction={signup}>Sign up</button>
        </form>
    );
}
