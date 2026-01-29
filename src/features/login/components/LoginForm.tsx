"use client"

import { useActionState, useEffect } from "react"
import { useState } from "react"
import { cn } from "@/shared/utils/cn"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { loginAction } from "../login-action"

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (state?.emailError || state?.passwordError || state?.generalError) {
      setPassword("")
    }
  }, [state])

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm w-full">
      <div className="flex flex-col items-start gap-3">
        <label className="text-sm font-medium text-white/80" htmlFor="email">
          Email
        </label>
        <Input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className={cn(
            "h-auto w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 font-normal",
            state?.emailError && "border-red-500/50",
            "focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/5 transition-colors duration-200"
          )}
          aria-invalid={state?.emailError ? "true" : "false"}
          aria-describedby={state?.emailError ? "email-error" : undefined}
        />
        {state?.emailError && (
          <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">
            {state.emailError}
          </p>
        )}
      </div>

      <div className="flex flex-col items-start gap-3">
        <label className="text-sm font-medium text-white/80" htmlFor="password">
          Password
        </label>
        <div className="relative w-full">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={cn(
              "h-auto w-full px-4 py-3 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 font-normal",
              state?.passwordError && "border-red-500/50",
              "focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/10 transition-colors duration-200"
            )}
            aria-invalid={state?.passwordError ? "true" : "false"}
            aria-describedby={state?.passwordError ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {state?.passwordError && (
          <p id="password-error" className="text-red-400 text-xs mt-1" role="alert">
            {state.passwordError}
          </p>
        )}
        {state?.generalError && (
          <p className="text-red-400 text-xs mt-1" role="alert">
            {state.generalError}
          </p>
        )}
        <div className="text-right mt-1 w-full">
          <button
            type="button"
            className="text-sm text-white/70 hover:text-white/90 transition-colors duration-200"
          >
            Forgot Password?
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full py-3 px-4 bg-white text-black rounded-lg font-medium",
          "hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-background",
          "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isPending ? "Signing in..." : "Login"}
      </button>
    </form>
  )
}