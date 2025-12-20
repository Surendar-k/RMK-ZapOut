export default function AuthLayout({ children }) {
  return (
    <div className="auth-root bg-app-gradient">
      <div className="auth-split">

        {/* LEFT IMAGE (50%) */}
        <div className="auth-left">
          <div className="angled-image">
            <img
              src="/src/assets/login-illustration.jpg"
              alt="RMK ZapOut Illustration"
            />
          </div>
        </div>

        {/* RIGHT LOGIN (50%) */}
        <div className="auth-right">
          {children}
        </div>

      </div>
    </div>
  );
}
