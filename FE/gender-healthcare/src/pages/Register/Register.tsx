import React from "react";
import { useNavigate } from "react-router-dom";
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyALAxRrByCV7H39-w1f1LwWqJHg2xmKkEc",
//   authDomain: "gender-healthcare.firebaseapp.com",
//   projectId: "gender-healthcare",
//   storageBucket: "gender-healthcare.appspot.com",
//   messagingSenderId: "728504252384",
//   appId: "1:728504252384:web:1f4e67a276ceb09e7ddd85",
//   measurementId: "G-43W2992NKD",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    // const provider = new GoogleAuthProvider();
    // signInWithPopup(auth, provider)
    //   .then((result) => {
    //     const user = result.user;
    //     alert("Đăng nhập thành công với: " + user.email);
    //     navigate("/dashboard");
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     alert("Đăng nhập thất bại!");
    //   });
    alert("Đăng ký bằng Google đang được phát triển!");
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center bg-white px-6 py-2 rounded-xl shadow space-x-4">
            <div className="text-4xl text-purple-600">⚥</div>
            <div className="text-3xl font-bold text-gray-800">
              Gender<span className="text-green-600">Care</span>
            </div>
          </div>
        </div>

        {/* Tiêu đề */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Tạo tài khoản mới</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Vui lòng nhập đầy đủ thông tin để đăng ký</p>

        {/* Form */}
        <form>
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              id="fullname"
              placeholder="Họ và tên đầy đủ"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Địa chỉ email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              placeholder="Tạo mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Nhập lại mật khẩu
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Đăng ký
          </button>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg shadow-sm hover:shadow-md transition"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="h-5 w-5"
              />
              <span className="font-medium">Đăng ký bằng Gmail</span>
            </button>
          </div>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-purple-600 hover:underline font-medium">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
