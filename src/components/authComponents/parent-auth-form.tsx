"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Icons } from "../ui/icons";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";

interface ParentAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

function ParentAuthForm({ className, ...props }: ParentAuthFormProps) {
  const router = useRouter();

  //zod schema for validation
  const ParentSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(5, { message: "Password must be at least 5 characters" }),
  });

  //inferring schema type
  type ParentValidationSchemaType = z.infer<typeof ParentSchema>;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<ParentValidationSchemaType>({
    resolver: zodResolver(ParentSchema),
  });

  // Form submit handler
  const onSubmit: SubmitHandler<ParentValidationSchemaType> = async (data) => {
    console.log("client side data:", data);
    const res = await signIn("parent-login", {
      email: data.email,
      password: data.password,
      // redirect: false,
    });
    console.log(res);
    // reset();
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <div>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                {...register("email")}
                disabled={isLoading || isSubmitting}
              />
              {errors.email && (
                <small className="text-red-500 ">{errors.email?.message}</small>
              )}
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <div>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                {...register("password")}
                disabled={isLoading || isSubmitting}
              />
              {errors.password && (
                <small className="text-red-500">
                  {errors.password?.message}
                </small>
              )}
            </div>
          </div>
          <Button disabled={isLoading || isSubmitting} type="submit">
            {isLoading ||
              (isSubmitting && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ))}
            Sign In with Email
          </Button>
        </div>
      </form>
      {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div> */}
      {/* <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Image
            width={100}
            height={100}
            alt="outlook"
            src="/outlook.svg"
            className="mr-2 h-4 w-4"
          />
        )}{" "}
        Outlook
      </Button> */}
    </div>
  );
}

export default ParentAuthForm;
