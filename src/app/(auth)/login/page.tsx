import LoginForm from "@/components/auth/login-form";
import { getUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function LoginPage() {
    const session = await getUser({ headers: await headers() })

    if (session) {
    redirect("/dashboard")
    }
    return <LoginForm />
}