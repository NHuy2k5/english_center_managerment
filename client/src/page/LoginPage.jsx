import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

export default function LoginPage({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:5002/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier: email, // Backend expect identifier, frontend uses email state
          password: password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
        setIsLoading(false);
        return;
      }

      // Lưu trữ token vào localStorage
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      localStorage.setItem("userRole", data.user.role);
      
      setIsLoading(false);
      
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950">
      {/* Quầng sáng trang trí nền */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl -top-48 -left-48 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl -bottom-32 -right-32 pointer-events-none" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card chính */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Logo & Tiêu đề */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-black text-white mb-1">
                Eng<span className="text-blue-400">Pro</span>
              </h1>
              <p className="text-blue-200/70 text-sm">Hệ thống quản lý trung tâm tiếng Anh</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <h2 className="text-xl font-bold text-white">Chào mừng trở lại!</h2>
              <p className="text-blue-200/60 text-sm mt-1">Đăng nhập để tiếp tục</p>
            </motion.div>
          </div>

          {/* Form đăng nhập */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Trường Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-blue-300/70" />
              </div>
              <input
                type="text"
                placeholder="Tên đăng nhập hoặc Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-200/50 rounded-2xl px-4 py-3.5 pl-11 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-sm"
              />
            </div>

            {/* Trường Mật khẩu */}
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-blue-300/70" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-blue-200/50 rounded-2xl px-4 py-3.5 pl-11 pr-12 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-blue-300/70 hover:text-blue-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Thông báo lỗi */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs text-center bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Quên mật khẩu */}
            <div className="flex justify-end">
              <a href="#" className="text-blue-300/70 text-xs hover:text-blue-300 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút đăng nhập */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-600/30 cursor-pointer mt-1"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Dòng phân cách */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-blue-200/40 text-xs">hoặc</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Quay về trang chủ */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate("/")}
            className="w-full border border-white/20 text-blue-200/80 hover:text-white hover:border-white/40 rounded-2xl py-3 text-sm font-medium transition-all duration-300 cursor-pointer bg-transparent"
          >
            ← Quay về trang chủ
          </motion.button>
        </div>

        {/* Footer nhỏ */}
        <p className="text-center text-blue-200/30 text-xs mt-6">
          © 2026 EngPro. Hệ thống quản lý trung tâm tiếng Anh.
        </p>
      </motion.div>
    </div>
  );
}
