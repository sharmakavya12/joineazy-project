import { useState } from "react";
import { apiFetch } from "../utils/api";

function Auth() {
  const [mode, setMode] = useState("student"); // student | admin | register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pass) => pass.length >= 6;

  const getErrors = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Enter valid email";
    
    if (!password) newErrors.password = "Password is required";
    else if (!validatePassword(password)) newErrors.password = "Password must be 6+ characters";
    
    if (mode === "register" && !name.trim()) newErrors.name = "Name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = "success") => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl text-white transform translate-x-full transition-all duration-300 ${
      type === "error" ? "bg-red-500" : "bg-green-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.remove("translate-x-full");
      toast.classList.add("translate-x-0");
    }, 100);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleSubmit = async () => {
    if (!getErrors()) return;

    setLoading(true);
    try {
      const isLogin = mode !== "register";
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin 
        ? { email, password } 
        : { name, email, password };

      const { res, data } = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        showToast(data.msg, "error");
        return;
      }

      if (isLogin) {
        // Role check
        if (mode === "admin" && data.user.role !== "admin") {
          showToast("Admin access required", "error");
          return;
        }
        if (mode === "student" && data.user.role !== "student") {
          showToast("Student access required", "error");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        showToast("Login successful!");
        
        // Redirect
        setTimeout(() => {
          window.location.href = data.user.role === "admin" ? "/admin" : "/student";
        }, 1000);
      } else {
        showToast("Student Registered Successfully!");
        setMode("student");
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ active, onClick, children, icon }) => (
    <button
      onClick={onClick}
      className={`flex-1 px-6 py-3 rounded-xl transition-all duration-150 flex items-center space-x-2 font-medium ${
        active
          ? "bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-white/50"
      }`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-indigo-300/20 to-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 transform hover:scale-[1.02] transition-all duration-500">
          
          {/* Logo/Title */}
          <div className="text-center mb-8">
            
            <h1 className="text-3xl bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 rounded-full gap-2 mb-8 bg-white/50 p-1 shadow-inner">
            <TabButton 
              active={mode === "student"}
              onClick={() => setMode("student")}
              
            >
              Student
            </TabButton>
            <TabButton 
              active={mode === "admin"}
              onClick={() => setMode("admin")}
             
            >
              Admin
            </TabButton>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {mode === "register" && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500">👤</span>
                </div>
                <input
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm ${
                    errors.name ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                  }`}
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) delete errors.name;
                  }}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1 ml-1">{errors.name}</p>}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500">📧</span>
              </div>
              <input
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm ${
                  errors.email ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                }`}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) delete errors.email;
                }}
              />
              {errors.email && <p className="text-sm text-red-600 mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-gray-500">🔒</span>
              </div>
              <input
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-white/50 backdrop-blur-sm ${
                  errors.password ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300 focus:border-blue-500'
                }`}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) delete errors.password;
                }}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-gray-500">{showPassword ? "hide" : "show"}</span>
              </button>
              {errors.password && <p className="text-sm text-red-600 mt-1 ml-1">{errors.password}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === "register" ? "Register" : "Login"}</span>
                </>
              )}
            </button>
          </div>

          {/* Register Toggle (for login modes) */}
          {mode !== "register" && (
            <p className="text-center mt-6 text-sm text-gray-600">
              {mode === "student" ? "New student?" : "Admin account?"}{' '}
              <button
                onClick={() => {
                  setMode(mode === "student" ? "register" : "admin");
                  setEmail("");
                  setPassword("");
                }}
                className="font-semibold rounded-full text-blue-600 hover:text-blue-700 transition-colors"
              >
                {mode === "student" ? "Register here" : "Admin Login"}
              </button>
            </p>
          )}

          {/* Divider & Alternative */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/70 text-gray-500 backdrop-blur-sm">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 px-4 border-2 border-gray-300 rounded-2xl hover:shadow-md hover:border-gray-400 transition-all bg-white/50 backdrop-blur-sm flex items-center justify-center space-x-2 text-sm font-medium">
            <span className="text-sky-400">Google</span>
              
            </button>
            <button className="py-3 px-4 border-2 border-gray-300 rounded-2xl hover:shadow-md hover:border-gray-400 transition-all bg-white/50 backdrop-blur-sm flex items-center justify-center space-x-2 text-sm font-medium">
              <span className="text-blue-600">F<span className="text-blue-400">acebook</span></span>
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;
