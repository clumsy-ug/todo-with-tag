import { signout } from "@/app/login/actions";

export default function SignOutButton() {
    return (
        <form>
            <button formAction={signout}>Sign out</button>
        </form>
    );
}
