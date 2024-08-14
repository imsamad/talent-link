import LoginForm from "@/components/forms/LoginForm";
import { authOption } from "@/lib/authOption";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession(authOption);
  console.log("session:", session);
  if (!!session) return redirect("/profile");

  return (
    <section className="w-full h-full flex justify-center items-center">
      <LoginForm />
    </section>
  );
};

export default LoginPage;
