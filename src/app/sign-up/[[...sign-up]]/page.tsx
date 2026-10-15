import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-cream-100">
      <SignUp />
    </main>
  );
}