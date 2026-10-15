import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid place-items-center bg-cream-100">
      <SignIn />
    </main>
  );
}