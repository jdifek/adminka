"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Home() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login } = useAuth(); // Используем контекст аутентификации

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const { token, role } = await response.json();
      localStorage.setItem("token", token);
      setMessage("Login successful!");

      // Обновляем глобальное состояние аутентификации
      login(token, role);

      // Redirect based on the role returned from the server
      if (role === "manager") {
        router.push("/admin/manager/dashboard/contracts");
      } else if (role === "owner") {
        router.push("/admin/owner/dashboard/cars");
      }
    } catch (err) {
      console.log(err);
      setMessage("Login failed, please check your credentials.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Login</h1>
      <form
        onSubmit={handleLogin}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: "300px",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "300px",
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "5px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      {message && (
        <p style={{ marginTop: "1rem", color: message === "Login successful!" ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
}
