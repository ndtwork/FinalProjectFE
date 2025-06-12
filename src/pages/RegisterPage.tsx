  // src/pages/RegisterPage.tsx
  import React, { useState } from "react";
  import { register } from "../api/auth";
  import { useNavigate } from "react-router-dom";
  
  export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await register(username, email, password);
        navigate("/login");
      } catch (err: any) {
        alert("Đăng ký thất bại: " + err.message);
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
    );
  }
