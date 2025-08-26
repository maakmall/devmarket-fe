"use client";

import { useState } from "react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function RegisterForm({ className, ...props }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    try {
      await api.get("/sanctum/csrf-cookie");

      const res = await api.post("/users/signup", form);
      setMessage(res.data.message);
      setForm({ name: "", email: "", password: "", password_confirmation: "" });
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setMessage("Something went wrong");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>Register new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              {message && <p className="text-green-600">{message}</p>}

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name[0]}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="johndoe@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email[0]}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password[0]}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password_confirmation">
                  Password Confirmation
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={form.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Register
              </Button>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
