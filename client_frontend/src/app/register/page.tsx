"use client";

import React, { useState } from "react";
import Container from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({ email, password, name });
      alert("Registered! Please log in.");
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      alert(message);
    }
  };

  return (
    <Container>
      <header className="header">
        <h1 className="title">Create account</h1>
        <p className="subtitle">Join Furniro to enjoy easy shopping</p>
      </header>
      <form onSubmit={onSubmit} className="card max-w-md">
        <div>
          <label htmlFor="name" className="label">Name</label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mt-3">
          <label htmlFor="email" className="label">Email</label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-3">
          <label htmlFor="password" className="label">Password</label>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button className="mt-4" type="submit">Register</Button>
      </form>
    </Container>
  );
}
