import { useEffect, useState } from "react";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import "./ModernLogin.css";

const ModernLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Thêm class body chỉ cho trang login
    document.body.classList.add("login-body");

    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    const handleRegisterClick = () => container?.classList.add("active");
    const handleLoginClick = () => container?.classList.remove("active");

    registerBtn?.addEventListener("click", handleRegisterClick);
    loginBtn?.addEventListener("click", handleLoginClick);

    return () => {
      document.body.classList.remove("login-body");
      container?.classList.remove("active");
      registerBtn?.removeEventListener("click", handleRegisterClick);
      loginBtn?.removeEventListener("click", handleLoginClick);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.data.token);
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <div className="container" id="container">
      {/* Form Đăng ký */}
      <div className="form-container sign-up">
        <form>
          <h1>Create Account</h1>
          <div className="social-icons">
            <button type="button" className="icon"><i className="fa-brands fa-google-plus-g"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-facebook-f"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-github"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-linkedin-in"></i></button>
          </div>
          <span>or use your email for registration</span>
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="button">Sign Up</button>
        </form>
      </div>

      {/* Form Đăng nhập */}
      <div className="form-container sign-in">
        <form onSubmit={handleLogin}>
          <h1>Sign In</h1>
          <div className="social-icons">
            <button type="button" className="icon"><i className="fa-brands fa-google-plus-g"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-facebook-f"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-github"></i></button>
            <button type="button" className="icon"><i className="fa-brands fa-linkedin-in"></i></button>
          </div>
          <span>or use your email password</span>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="text-xs text-blue-500 underline mt-2 mb-2"
            onClick={() => alert("Chức năng đang phát triển")}
          >
            Forget Your Password?
          </button>
          <button type="submit">Sign In</button>
        </form>
      </div>

      {/* Phần hiệu ứng toggle */}
      <div className="toggle-container">
        <div className="toggle">
          <div className="toggle-panel toggle-left">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <button className="hidden" id="login">Sign In</button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Hello, Friend!</h1>
            <p>Register with your personal details to use all of site features</p>
            <button className="hidden" id="register">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernLogin;
