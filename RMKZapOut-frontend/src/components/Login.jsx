import { useState, useRef, useEffect } from "react";
import { checkEmail, loginUser, updatePassword } from "../services/authService.jsx";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-illustration.jpg";
import logo from "../assets/zaplogo.png";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const emailRef = useRef(null);
  const passRef = useRef(null);
  const newPassRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (step === 1) emailRef.current?.focus();
    else if (step === 2) passRef.current?.focus();
    else if (step === 3) newPassRef.current?.focus();
  }, [step]);

  // Step 1: Verify email
  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    try {
      await checkEmail(email);
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Email not registered");
    }
  };

  // Step 2: Login
const handleLogin = async () => {
  if (!password) {
    setError("Please enter your password");
    return;
  }

  try {
    const res = await loginUser(email, password);
    const { user, token } = res.data;

    // SAVE USER SESSION
    localStorage.setItem("user", JSON.stringify(user));
    if (token) localStorage.setItem("token", token);

    if (user.isFirstLogin) {
      setStep(3);
      return;
    }

    // 🔹 SAFE ROLE FETCH
    const role =
      user.role ||
      user.user_role ||
      user.role_name ||
      user.userRole;

    navigateByRole(role);

    setError("");
  } catch (err) {
    setError(err.response?.data?.message || "Invalid credentials");
  }
};


  // Step 3: Reset first-time password
const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    setError("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    await updatePassword(email, newPassword);

    const res = await loginUser(email, newPassword);
    const { user, token } = res.data;

    localStorage.setItem("user", JSON.stringify(user));
    if (token) localStorage.setItem("token", token);

    const role =
      user.role ||
      user.user_role ||
      user.role_name ||
      user.userRole;

    navigateByRole(role);
  } catch (err) {
    setError(err.response?.data?.message || "Failed to update password");
  }
};


const navigateByRole = (role) => {
  if (!role) {
    setError("User role not assigned. Contact admin.");
    return;
  }

  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "student") {
    navigate("/student/dashboard");
  } else if (
    normalizedRole === "staff" ||
    normalizedRole === "hod" ||
    normalizedRole === "counsellor" ||
    normalizedRole === "coordinator" ||
    normalizedRole === "warden"
  ) {
    navigate("/staff/dashboard");
  } else {
    setError("Invalid user role");
  }
};


  return (
    <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-400/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">

        {/* LEFT IMAGE */}
        <div className="w-1/2 relative overflow-hidden">
          <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)" }}>
            <img src={loginImage} alt="Secure Campus" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="absolute bottom-10 left-10 max-w-md text-white">
            <h2 className="text-3xl font-semibold mb-4">Secure Campus Digital Access</h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              RMK ZapOut enables secure email-based access with role-driven authorization and real-time verification.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[420px] h-[600px] rounded-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col justify-between">
            <div>
              <img src={logo} alt="RMK ZapOut" className="mx-auto h-40 mb-2" />
              <h1 className="text-white text-3xl font-semibold text-center">Welcome back!</h1>
              <h2 className="text-cyan-400 text-xl text-center mt-2">Login to Get Started</h2>

              <p className="text-gray-300 text-sm text-center mt-1">
                {step === 1 ? "Enter your official email address" : step === 2 ? "Enter your password" : "Set a new password"}
              </p>

              {/* STEP 1: EMAIL */}
              {step === 1 && (
                <>
                  <input ref={emailRef} type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleContinue()} placeholder="example@rmkec.ac.in" className="mt-6 w-full h-12 px-4 rounded-md bg-white/10 text-white placeholder-gray-400 border border-cyan-400/40 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                  <button onClick={handleContinue} className="mt-10 w-full h-12 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition">Continue</button>
                </>
              )}

              {/* STEP 2: PASSWORD */}
              {step === 2 && (
                <>
                  <div className="flex justify-between text-xs text-white mb-2">
                    <span>{email}</span>
                    <button onClick={() => setStep(1)} className="text-indigo-400 hover:underline">Change</button>
                  </div>
                  <input ref={passRef} type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter your password" className="mt-2 w-full px-4 py-3 rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                  <button onClick={handleLogin} className="mt-10 w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">Login</button>
                </>
              )}

              {/* STEP 3: FIRST-TIME PASSWORD RESET */}
              {step === 3 && (
                <>
                  <input ref={newPassRef} type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value); setError(""); }} placeholder="Enter new password" className="mt-6 w-full h-12 px-4 rounded-md bg-white/10 text-white placeholder-gray-400 border border-cyan-400/40 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                  <input type="password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} placeholder="Re-enter new password" className="mt-4 w-full h-12 px-4 rounded-md bg-white/10 text-white placeholder-gray-400 border border-cyan-400/40 focus:ring-2 focus:ring-indigo-500 outline-none"/>
                  <button onClick={handleResetPassword} className="mt-10 w-full py-3 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition">Update Password</button>
                </>
              )}

              {error && <p className="text-red-400 text-xs mt-4 text-center">{error}</p>}
            </div>

            <p className="text-center text-xs text-white">Designed by IT Department · RMKEC IT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
