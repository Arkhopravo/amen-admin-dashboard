import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoLogoGithub } from "react-icons/io";

import { toast } from "sonner";


type LoginFormInputs = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
const onSubmit = async (data: LoginFormInputs) => {
  try {
    const loginPromise = new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errData = await res.json();
          return reject(new Error(errData.message || "Login failed"));
        }

        const result = await res.json();
        if(res.status === 200) {

          navigate("/home/dashboard");
        }
        resolve(result); // success
      } catch (err) {
        reject(err);
      }
    });

    // 🧠 Show toast while waiting
    const result: any = await toast.promise(loginPromise, {
      loading: "Logging in...",
      success: "Login successful!",
      error: (err: any) => err.message || "Login failed",
    });

    // ✅ Navigate *after* login and toast success
  

  } catch (error) {
    console.error("Login error:", error);
    // stay on page
  }
};



  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>

      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 text-white hover:bg-blue-600"
        >
          Login
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full">
          <IoLogoGithub className="" />
          Login with GitHub
        </Button>
      </div>

      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </form>
  );
}
