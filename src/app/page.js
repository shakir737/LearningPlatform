import LoginForm from "@/components/forms/loginForm";
import SignupForm from "@/components/forms/signupForm";
import Image from "next/image";
export default async function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <LoginForm />
    </div>
  );
}
