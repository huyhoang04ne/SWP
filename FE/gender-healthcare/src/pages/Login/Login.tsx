import React, { useState } from "react";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }); // ✅ đúng số đối số
      localStorage.setItem("token", res.data.token); // ✅ truy xuất đúng
      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold text-center">Đăng nhập</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        className="w-full border rounded px-3 py-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded">
        Đăng nhập
      </button>
    </form>
  );
};

export default Login;