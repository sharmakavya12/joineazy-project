import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import logo1 from "../assets/logo1.png";

function Auth() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("login");
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const resetForm = () => {
    setName(""); setEmail(""); setPassword("");
    setErrors({}); setMessage({ text: "", type: "" });
  };

  const validateForm = () => {
    const e = {};
    if (authMode === "register" && !name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!validateEmail(email)) e.email = "Invalid email format";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body = authMode === "login"
        ? { email, password }
        : { name, email, password, role };

      const res = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.success) {
        setMessage({ text: res.message || res.error || "Something went wrong", type: "error" });
        return;
      }

      if (authMode === "register") {
        setMessage({ text: "Account created successfully. Please log in.", type: "success" });
        setAuthMode("login");
        resetForm();
        return;
      }

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage({ text: "Login successful", type: "success" });
      setTimeout(() => navigate(user.role === "professor" ? "/professor" : "/student"), 500);
    } catch {
      setMessage({ text: "Server error. Please try again.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 bg-white outline-none transition focus:ring-2 ${
      hasError
        ? "border-red-400 focus:ring-red-100"
        : "border-green-200 focus:border-green-500 focus:ring-green-100"
    }`;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — green gradient */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-linear-to-br from-[#1a6b4a] via-[#1e8a5e] to-[#3dd68c] px-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute bottom-10 right-40px h-80 w-80 rounded-full bg-white/5" />

        <div className="relative z-10 text-center text-white">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl backdrop-blur-sm">
            <img src={logo1} alt="Logo" className="h-6 w-6" />
          </div>
          <h1 className="mb-3 text-4xl font-medium tracking-tight">SGAMS</h1>
          <p className="mb-8 text-lg font-medium text-white/80">
            Student & Group Assignment<br />Management System
          </p>

          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: "📋", text: "Manage assignments with ease" },
              { icon: "👥", text: "Collaborate in groups seamlessly" },
              { icon: "📊", text: "Track progress in real-time" },
              { icon: "🔐", text: "Secure role-based access" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center bg-[#f0faf5] px-4 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-[#1a6b4a] to-[#2da870] text-2xl shadow-md">
              <img src={logo1} alt="Logo" className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900">SGAMS</h1>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {authMode === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {authMode === "login"
                  ? "Sign in to your SGAMS account"
                  : "Join SGAMS to get started"}
              </p>
            </div>

            {/* Mode toggle */}
            <div className="mb-5 flex rounded-xl bg-green-50 p-1 border border-green-100">
              {["login", "register"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => { setAuthMode(mode); resetForm(); }}
                  className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${
                    authMode === mode
                      ? "bg-linear-to-r from-[#1a6b4a] to-[#2da870] text-white shadow-sm"
                      : "text-gray-500 hover:text-green-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Role selector */}
            {authMode === "register" && (
              <div className="mb-5 flex gap-3">
                {["student", "professor"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                      role === r
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white text-gray-500 hover:border-green-200 hover:bg-green-50/50"
                    }`}
                  >
                    {r === "student" ? " " : " "}{r}
                  </button>
                ))}
              </div>
            )}

            {/* Message */}
            {message.text && (
              <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
                message.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-green-200 bg-green-50 text-green-700"
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              {authMode === "register" && (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: "" }); }}
                    className={inputClass(errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: "" }); }}
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: "" }); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className={`${inputClass(errors.password)} pr-16`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green-600 hover:text-green-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-linear-to-r from-[#1a6b4a] to-[#2da870] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? authMode === "login" ? "Signing in..." : "Creating account..."
                : authMode === "login" ? "Sign In" : "Create Account"}
            </button>

            <p className="mt-5 text-center text-sm text-gray-500">
              {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); resetForm(); }}
                className="font-semibold text-green-600 hover:text-green-800"
              >
                {authMode === "login" ? "Register" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;