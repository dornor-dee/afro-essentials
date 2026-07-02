"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold text-foreground/80">
          Check your email
        </h1>
        <p className="text-muted-foreground text-sm">
          If an account exists with this email, you will receive a reset link.
          Note: If you originally signed up with Google, going through this
          process will allow you to optionally sign in with a password as well
        </p>
        <Link href="/login">
          <Button variant="outline" className="mt-4 border-primary">
            Back to Sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center mb-4">
          <h1 className="text-3xl font-bold text-foreground/80">
            Forgot Password
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </Field>

        <div className="text-center mt-2 text-sm text-muted-foreground flex justify-center">
          Remember your password?{" "}
          <Link href="/login" className="ml-1 underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
};

export default ForgotPassword;
