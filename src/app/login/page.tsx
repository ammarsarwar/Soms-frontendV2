import Image from "next/image";
import UserAuthForm from "@/components/authComponents/user-auth-form";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Image
          src="/Logo.svg"
          height={150}
          width={150}
          alt="soms"
          className="absolute left-4 top-4 md:left-8 md:top-8"
        />
        <div className="lg:p-8 ">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
            <div className="flex flex-col space-y-2 ">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Please enter your
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex">
          <div className="absolute inset-0 bg-[#faf5ff]" />
          <div className="relative z-20 h-screen flex items-center justify-center">
            <Image src="/main.svg" height={400} width={400} alt="main" />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
