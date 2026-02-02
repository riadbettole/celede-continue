'use server'

import { auth } from "../../shared/lib/auth/server" // your Better Auth server instance
import { EmailSchema, PasswordSchema } from "./login-validation"
import { redirect } from "next/navigation"

export type LoginState = {
  emailError?: string
  passwordError?: string
  generalError?: string
} | null

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email?.trim()) {
    return { emailError: "Email is required" }
  }

  if (!password?.trim()) {
    return { passwordError: "Password is required" }
  }

  const emailResult = EmailSchema.safeParse(email.trim())
  if (!emailResult.success) {
    return { 
      emailError: emailResult.error.issues[0]?.message || "Please enter a valid email address" 
    }
  }

  const passwordResult = PasswordSchema.safeParse(password)
  if (!passwordResult.success) {
    return { 
      passwordError: passwordResult.error.issues[0]?.message || "Password must be at least 6 characters" 
    }
  }

  try {
    const response = await auth.api.signInEmail({
      body: {
        email: emailResult.data.toLowerCase().trim(),
        password: passwordResult.data,
      },
      asResponse: true
    })

    if (!response.ok) {
      return { generalError: "Invalid email or password" }
    }

  } catch (error) {
    return { 
      generalError: error instanceof Error ? error.message : "Invalid email or password" 
    }
  }

  redirect("/dashboard")
}

