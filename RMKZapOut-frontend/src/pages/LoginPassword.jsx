import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import AuthLayout from "../layouts/AuthLayout";

export default function LoginPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const rollNo = location.state?.rollNo || "";
  const passwordRef = useRef(null);

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const handleEdit = () => {
    navigate("/", { state: { rollNo } });
  };

  const handleLogin = () => {
    console.log("Login triggered");
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

            {/* Roll No Display */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
                color: "#ffffff",
                fontSize: "0.95rem",
                fontWeight: 500
              }}
            >
              <span>Roll Number – {rollNo}</span>

              <button
                onClick={handleEdit}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
            </div>

            <input
              ref={passwordRef}
              type="password"
              placeholder="Enter password"
              className="input-field"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
          </div>
        </div>

        {/* 🔽 LOGIN BUTTON */}
        <div
          style={{
            marginTop: "72px",
            padding: "0 32px",
            textAlign: "center"
          }}
        >
          <button
            className="primary-btn"
            onClick={handleLogin}
          >
            Login
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
