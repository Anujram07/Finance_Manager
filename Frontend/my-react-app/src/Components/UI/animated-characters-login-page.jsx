"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const EyeBall = ({ size = 20, pupilSize = 8, maxDistance = 6, forceLookX, forceLookY, isVibrating = false }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined) return { x: forceLookX, y: forceLookY || 0 };

    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePosition();

  return (
    <div
      ref={eyeRef}
      className={cn("rounded-full bg-white flex items-center justify-center overflow-hidden transition-all shadow-inner border border-slate-100", isVibrating && "animate-pulse")}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className="rounded-full bg-slate-900 transition-transform duration-75"
        style={{
          width: `${pupilSize}px`,
          height: `${pupilSize}px`,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
        }}
      />
    </div>
  );
};

function LoginPage({ setIsLoggedIn, setUserName, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
  const [isHoveringGoogle, setIsHoveringGoogle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    resetMessages();

    if (mode === "forgot") {
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all required fields.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    } else if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "signup"
          ? "/api/auth/signup"
          : mode === "forgot"
            ? "/api/auth/forgot-password"
            : "/api/auth/login";

      const body =
        mode === "signup"
          ? { name, email, password }
          : mode === "forgot"
            ? { email, newPassword: password }
            : { email, password };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(typeof data === "string" ? data : data.message || "Authentication failed.");
        return;
      }

      if (mode === "signup") {
        setSuccess("Registration successful. Please sign in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      if (mode === "forgot") {
        setSuccess("Password updated successfully. Please sign in with your new password.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
        return;
      }

      const { token, user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Optional backward compatibility
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      setIsLoggedIn(true);
      setUserName(user?.name || user?.email || "User");
      navigate("/");
    } catch (fetchError) {
      setError(fetchError.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    resetMessages();
    setMode(mode === "login" ? "signup" : "login");
    setPassword("");
    setConfirmPassword("");
  };

  const goToForgotPassword = () => {
    resetMessages();
    setMode("forgot");
    setPassword("");
    setConfirmPassword("");
  };

  // Turn pupils completely away (Up and Left) when password is being typed
  const isPasswordFocused = focusField === "password";
  const forceLookX = isPasswordFocused ? -6 : undefined;
  const forceLookY = isPasswordFocused ? -5 : undefined;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-slate-50 font-sans">

      {/* Visual Left Banner */}
      <div className="relative hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white overflow-hidden border-r border-slate-800">

        {/* Brand Header */}
        <div className="z-20 flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500 rounded-xl text-slate-900 shadow-lg shadow-emerald-500/20">
            <Wallet className="w-6 h-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            WealthMetrics
          </span>
        </div>

        {/* Interactive Character Stage Area */}
        <div className="relative z-20 flex flex-col items-center justify-center h-[500px]">
          <div className="text-center max-w-sm mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">Automate Your Net Margin Tracker</h2>
            <p className="text-sm text-slate-400">Our database-synced ledger keeps an eye on your assets while you plan ahead.</p>
          </div>

          <div className="relative w-[550px] h-[340px]">
            {/* Deep Emerald Character */}
            <div className="absolute bottom-0 transition-all duration-500 ease-in-out shadow-2xl border border-emerald-700/30"
              style={{
                left: '70px', width: '150px',
                height: isPasswordFocused ? '120px' : '340px',
                backgroundColor: '#065F46', borderRadius: '24px 24px 0 0', zIndex: 1,
              }}>
              <div className="absolute flex gap-8" style={{ left: '50px', top: '50px' }}>
                <EyeBall size={20} forceLookX={forceLookX} forceLookY={forceLookY} />
                <EyeBall size={20} forceLookX={forceLookX} forceLookY={forceLookY} />
              </div>
            </div>

            {/* Charcoal Body Character */}
            <div className="absolute bottom-0 transition-all duration-300 shadow-2xl"
              style={{
                left: focusField === 'email' ? '220px' : '240px',
                width: '120px', height: '270px', backgroundColor: '#1E293B',
                borderRadius: '20px 20px 0 0', zIndex: 2,
                transform: focusField === 'email' ? 'rotate(-3deg)' : 'rotate(0deg)'
              }}>
              <div className="absolute flex gap-6" style={{ left: '26px', top: '32px' }}>
                <EyeBall size={18} forceLookX={forceLookX} forceLookY={forceLookY} />
                <EyeBall size={18} forceLookX={forceLookX} forceLookY={forceLookY} />
              </div>
            </div>

            {/* Emerald Green Character */}
            <div className="absolute bottom-0 transition-all duration-500 ease-out shadow-2xl"
              style={{
                left: '0',
                width: '230px',
                height: '180px',
                backgroundColor: '#10B981',
                borderRadius: '120px 120px 0 0',
                zIndex: 3,
                transform: isHoveringGoogle ? 'translateY(-20px)' : 'translateY(0)'
              }}>
              <div className="absolute flex gap-8" style={{ left: '82px', top: '80px' }}>
                <EyeBall
                  size={16}
                  pupilSize={showPassword || isHoveringGoogle ? 12 : 8}
                  isVibrating={showPassword}
                  forceLookX={forceLookX}
                  forceLookY={forceLookY}
                />
                <EyeBall
                  size={16}
                  pupilSize={showPassword || isHoveringGoogle ? 12 : 8}
                  isVibrating={showPassword}
                  forceLookX={forceLookX}
                  forceLookY={forceLookY}
                />
              </div>
            </div>

            {/* Amber Yellow Character */}
            <div className="absolute bottom-0 transition-transform duration-300 shadow-2xl"
              style={{ left: '310px', width: '140px', height: '200px', backgroundColor: '#F59E0B', borderRadius: '70px 70px 0 0', zIndex: 4, transform: isHoveringLogin ? 'scaleY(1.05)' : 'scaleY(1)' }}>
              <div className="absolute flex gap-6" style={{ left: '52px', top: '40px' }}>
                <EyeBall size={14} forceLookX={forceLookX} forceLookY={forceLookY} />
                <EyeBall size={14} forceLookX={forceLookX} forceLookY={forceLookY} />
              </div>
              <div
                className="absolute bg-slate-950 rounded-full transition-all duration-300"
                style={{
                  left: isHoveringLogin ? '60px' : '40px',
                  top: '88px',
                  width: isHoveringLogin ? '20px' : '60px',
                  height: isHoveringLogin ? '20px' : '4px'
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-[420px] bg-white p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-100/80 space-y-6">
          <div className="text-center">
            <span className="px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-700 uppercase bg-emerald-100 rounded-full">
              Secure Ledger Access
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-4">
              {mode === "login" ? "Welcome back!" : mode === "forgot" ? "Reset your password" : "Create free account"}
            </h1>
            <p className="text-slate-500 text-sm mt-1.5">
              {mode === "login"
                ? "Access your portfolio panel."
                : mode === "forgot"
                  ? "Enter your email and choose a new password."
                  : "Start tracking budgets, incomes, and expenses securely."}
            </p>
          </div>

          {error && <div className="rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-3 text-xs font-semibold text-rose-700">{error}</div>}
          {success && <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3 text-xs font-semibold text-emerald-700">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600">Full Name</Label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusField('name')}
                  onBlur={() => setFocusField(null)}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-600">Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {mode !== "forgot" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-600">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusField('password')}
                    onBlur={() => setFocusField(null)}
                    className="p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-transform active:scale-125"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === "forgot" && (
              <>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusField('password')}
                      onBlur={() => setFocusField(null)}
                      className="p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-transform active:scale-125"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-600">Confirm New Password</Label>
                  <Input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </>
            )}

            {mode === "login" && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" className="border-slate-300 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 cursor-pointer rounded-md" />
                  <Label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer hover:text-slate-900 transition">
                    Remember device
                  </Label>
                </div>
                <button type="button" onClick={goToForgotPassword} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setMode("login");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline"
              >
                Back to login
              </button>
            )}

            <Button
              type="submit"
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={() => setIsHoveringLogin(false)}
              className="w-full h-12 text-sm font-bold rounded-xl bg-slate-900 hover:bg-emerald-600 text-white shadow-lg transition-all transform active:scale-[0.98]"
            >
              {loading ? "Connecting to server..." : mode === "login" ? "Access Dashboard" : mode === "forgot" ? "Reset Password" : "Create Master Profile"}
            </Button>
          </form>

          <div className="relative flex py-1 items-center font-medium">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase tracking-widest">or security handshake</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <Button
            variant="outline"
            onMouseEnter={() => setIsHoveringGoogle(true)}
            onMouseLeave={() => setIsHoveringGoogle(false)}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
            <span>Continue with Google</span>
          </Button>

          <div className="text-center text-xs font-medium text-slate-500">
            {mode === "login" ? "New to WealthMetrics?" : "Already managing assets?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition"
            >
              {mode === "login" ? "Create an account" : "Sign in here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;