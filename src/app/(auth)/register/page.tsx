import RegisterForm from "@/components/auth/register-form";
import { getUser } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    const session = await getUser({ headers: await headers() })
    if (session) {
        redirect("/dashboard");
    }
    return <RegisterForm /> 
}