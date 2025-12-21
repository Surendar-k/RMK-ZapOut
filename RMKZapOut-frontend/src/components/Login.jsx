import { useState, useRef, useEffect } from "react";
import { checkRegister, loginUser } from "../services/authService";
import loginImage from "../assets/login-illustration.jpg";
import logo from "../assets/zaplogo.png";

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: roll number, Step 2: password
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const rollRef = useRef(null);
  const passRef = useRef(null);

  useEffect(() => {
    step === 1 ? rollRef.current?.focus() : passRef.current?.focus();
  }, [step]);

  // Step 1: Verify roll number
  const handleContinue = async () => {
    if (!/^[0-9]+$/.test(rollNo)) {
      setError("Enter a valid register number");
      return;
    }
    try {
      await checkRegister(rollNo);
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid register number");
    }
  };

  // Step 2: Login with password
  const handleLogin = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }
    try {
      const res = await loginUser(rollNo, password);
      console.log(res.data);
      alert("Login successful");
      // TODO: redirect based on role if needed
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative overflow-hidden">

      {/* 🌌 Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-400/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/20 blur-[120px]" />
      </div>

      {/* 🔀 Split Layout */}
      <div className="relative z-10 flex min-h-screen">

        {/* LEFT SIDE IMAGE */}
        <div className="w-1/2 relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                "polygon(0 0, 92% 0, 100% 50%, 92% 100%, 0 100%)",
            }}
          >
            <img
              src={loginImage}
              alt="Secure Campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* LEFT TEXT */}
          <div className="absolute bottom-10 left-10 max-w-md text-white">
            <h2 className="text-3xl font-semibold mb-4">
              Secure Campus Digital Access
            </h2>
            <p className="text-sm text-gray-200 leading-relaxed">
              RMK ZapOut streamlines student outing and On-Duty requests
              through a digital approval workflow, real-time verification,
              and secure campus movement tracking.
            </p>
          </div>
        </div>

        {/* RIGHT LOGIN CARD */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[420px] h-[600px] rounded-2xl p-8
            bg-white/10 backdrop-blur-xl border border-white/20
            shadow-[0_20px_50px_rgba(0,0,0,0.6)]
            flex flex-col justify-between">

            {/* TOP */}
            <div>
              {/* LOGO */}
              <img
                src={logo}
                alt="RMK ZapOut"
                className="mx-auto h-40 w-auto mb-2"
              />

              {/* WELCOME */}
              <h1 className="text-white text-2xl font-semibold text-center mt-2">
                Welcome back
              </h1>
              <p className="text-gray-300 text-sm text-center mt-1">
                {step === 1 ? "Enter your register number" : "Enter your password"}
              </p>

              {/* STEP 1 INPUT */}
              {step === 1 && (
                <>
                  <input
                    ref={rollRef}
                    type="text"
                    value={rollNo}
                    onChange={(e) => { setRollNo(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                    placeholder="Enter your register number"
                    className="mt-6 w-full h-12 rounded-full px-4 py-3 rounded-md text-sm
                      bg-white/10 text-white placeholder-gray-400
                      border border-cyan-400/40 outline-none
                      focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <button
                    onClick={handleContinue}
                    className="mt-10 w-full h-12 rounded-full text-white font-semibold px-4 py-3 rounded-md
                      bg-indigo-600 hover:bg-indigo-700
                      hover:opacity-90 transition"
                  >
                    Continue
                  </button>
                </>
              )}

              {/* STEP 2 INPUT */}
              {step === 2 && (
                <>
                  <div className="flex justify-between items-center text-xs mb-2 text-white">
                    <span>{rollNo}</span>
                    <button
                      onClick={() => setStep(1)}
                      className="text-indigo-400 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <input
                    ref={passRef}
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter your password"
                    className="mt-2 w-full px-4 py-3 rounded-md
                      bg-[rgba(255, 255, 255, 0.95)] text-white
                      border border-white/10
                      placeholder:text-white
                      focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <button
                    onClick={handleLogin}
                    className="mt-10 w-full py-3 rounded-md
                      bg-indigo-600 hover:bg-indigo-700
                      text-white
                      transition font-medium"
                  >
                    Login
                  </button>
                </>
              )}

              {error && (
                <p className="text-red-400 text-xs mt-4 text-center">{error}</p>
              )}
            </div>

            {/* FOOTER */}
            <p className="text-center text-xs text-white">
              Designed by IT Department · RMKECIT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;