"use client";

import { useActionState, useEffect } from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { loginAction } from "../login-action";
import clsx from "clsx";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.emailError || state?.passwordError || state?.generalError) {
      setPassword("");
    }
  }, [state]);

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <form action={formAction} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className={clsx(
              "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
              state?.emailError
                ? "border-red-300 focus:ring-red-500"
                : "border-gray-300"
            )}
            aria-invalid={state?.emailError ? "true" : "false"}
            aria-describedby={state?.emailError ? "email-error" : undefined}
          />
          {state?.emailError && (
            <p
              id="email-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {state.emailError}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={clsx(
                "w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                state?.passwordError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              )}
              aria-invalid={state?.passwordError ? "true" : "false"}
              aria-describedby={
                state?.passwordError ? "password-error" : undefined
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {state?.passwordError && (
            <p
              id="password-error"
              className="text-red-600 text-sm mt-1"
              role="alert"
            >
              {state.passwordError}
            </p>
          )}
          {state?.generalError && (
            <p className="text-red-600 text-sm mt-1" role="alert">
              {state.generalError}
            </p>
          )}
          <div className="text-right mt-2">
       
          </div>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}