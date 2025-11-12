"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken, setUser, setLoading } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setToken(res.token);
      try {
        const me = await api.me();
        setUser(me as unknown as { email: string; name?: string; role?: "user" | "admin" });
      } catch {
        setUser({ email });
      }
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">Login</h1>
        <p className="subtitle">Access your Furniro account</p>
      </header>
      <form onSubmit={onSubmit} className="card max-w-md">
        <div>
          <label htmlFor="email" className="label">Email</label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="label">Password</label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="mt-4" type="submit">Login</Button>
      </form>
    </Container>
  );
}
