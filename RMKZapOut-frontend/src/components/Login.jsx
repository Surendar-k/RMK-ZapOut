import { useState, useRef, useEffect } from "react";
import { checkRegister, loginUser } from "../services/authService";
import loginImage from "../assets/login-illustration.jpg";

const Login = () => {
  const [step, setStep] = useState(1); // Step 1: roll number, Step 2: password
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const rollInputRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (step === 1) rollInputRef.current?.focus();
    if (step === 2) passwordRef.current?.focus();
  }, [step]);

  const isValidRollNo = (value) => /^[0-9]+$/.test(value);

  const handleContinue = async () => {
    if (!rollNo.trim() || !isValidRollNo(rollNo)) {
      setError("Please enter a valid register number");
      return;
    }

    try {
      await checkRegister(rollNo); // backend check
      setStep(2);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid register number");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(rollNo, password);
      console.log(res.data);
      alert("Login successful");
      // TODO: redirect based on role
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  const handleEditRoll = () => {
    setStep(1);
    setPassword("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-600 to-purple-700">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <img
          src={loginImage}
          alt="RMK ZapOut"
          className="w-3/4 object-contain rounded-xl shadow-lg"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md w-full max-w-md p-10 rounded-2xl shadow-2xl flex flex-col">

          {/* Brand */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-indigo-900">RMK ZapOut</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Re-engineering Secure Campus Flow
            </p>
            <h2 className="text-xl font-semibold mt-6 text-indigo-700">
              Welcome back
            </h2>
          </div>

          {/* STEP 1: Roll Number */}
          {step === 1 && (
            <div className="mt-5 flex flex-col">
              <input
                ref={rollInputRef}
                type="text"
                placeholder="Enter your roll number"
                value={rollNo}
                onChange={(e) => {
                  setRollNo(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className="input-field w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleContinue}
                className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Password */}
          {step === 2 && (
            <div className="mt-5 flex flex-col">
              <div className="flex justify-center items-center gap-2 text-gray-700 text-sm mb-3">
                <span>Roll Number – <b>{rollNo}</b></span>
                <button onClick={handleEditRoll} className="text-blue-400 hover:underline text-xs">
                  Edit
                </button>
              </div>
              <input
                ref={passwordRef}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="input-field w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleLogin}
                className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Login
              </button>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

          {/* Footer */}
          <p className="text-xs text-center text-gray-500 mt-6">
            Designed by IT Department · RMKECIT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
