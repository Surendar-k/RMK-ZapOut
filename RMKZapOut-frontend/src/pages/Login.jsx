import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function Login() {
  const [rollNo, setRollNo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const rollInputRef = useRef(null);

  useEffect(() => {
    rollInputRef.current?.focus();
  }, []);

  const isValidRollNo = (value) => {
    return /^[0-9]+$/.test(value);
  };

  const handleContinue = () => {
    if (!rollNo.trim() || !isValidRollNo(rollNo)) {
      setError("Please enter a valid register number");
      return;
    }

    setError("");
    navigate("/password", { state: { rollNo } });
  };

  return (
    <AuthLayout>
      <div className="glass-card flex flex-col">

        {/* 🔝 TOP */}
        <div>
          <div className="brand-top">
            <div className="brand-name">RMK ZapOut</div>
            <div className="brand-tagline">
              Re-engineering Secure Campus Flow
            </div>
          </div>

          <div className="inner-stack">
            <h1
              style={{
                color: "#ffffff",
                fontSize: "1.875rem",
                fontWeight: 600,
                marginTop: "24px"
              }}
            >
              Welcome back
            </h1>

            <input
              ref={rollInputRef}
              type="text"
              placeholder="Enter your roll no"
              value={rollNo}
              onChange={(e) => {
                setRollNo(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleContinue();
              }}
              className="input-field"
            />

            {error && (
              <p
                style={{
                  color: "#f87171",
                  fontSize: "0.8rem",
                  marginTop: "-12px"
                }}
              >
                {error}
              </p>
            )}
          </div>
        </div>

        {/* 🔽 BUTTON */}
        <div
          style={{
            marginTop: "72px",
            padding: "0 32px",
            textAlign: "center"
          }}
        >
          <button
            className="primary-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>

        {/* 🔻 FOOTER */}
        <div className="pb-4 mt-auto text-center">
          <p
            style={{
              color: "#ffffff",
              fontSize: "0.75rem",
              opacity: 0.8,
              letterSpacing: "0.05em"
            }}
          >
            Designed by IT Department · RMKECIT
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
