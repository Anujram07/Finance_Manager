"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Sparkles } from "lucide-react";
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
      className={cn("rounded-full bg-white flex items-center justify-center overflow-hidden transition-all", isVibrating && "animate-pulse")}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <div
        className="rounded-full bg-black transition-transform duration-75"
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
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState(null); // 'email' or 'password'
  const [isHoveringLogin, setIsHoveringLogin] = useState(false);
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

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const body = mode === "signup" ? { name, email, password } : { email, password };

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
        return;
      }

      const { token, user } = data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("authUser", JSON.stringify(user));
      setIsLoggedIn(true);
      setUserName(user?.name || user?.email || "User");
      navigate("/dashboard");
    } catch (fetchError) {
      setError(fetchError.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    resetMessages();
    setMode(mode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background">
      {/* Visual Section - Keeping your Original Layout */}
      <div className="relative hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground overflow-hidden">
        <div className="z-20 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="size-6" /> <span>LoginApp</span>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative w-[550px] h-[400px]">
            
            {/* Purple Character - Now "Hides" when typing password */}
            <div className="absolute bottom-0 transition-all duration-500 ease-in-out"
              style={{
                left: '70px', width: '180px', 
                height: focusField === 'password' ? '120px' : '400px', // Shrinks down
                backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1,
              }}>
              <div className="absolute flex gap-8" style={{ left: '50px', top: '50px' }}>
                <EyeBall size={20} />
                <EyeBall size={20} />
              </div>
            </div>

            {/* Black Character - Peeks closer when typing email */}
            <div className="absolute bottom-0 transition-all duration-300"
              style={{
                left: focusField === 'email' ? '220px' : '240px', 
                width: '120px', height: '310px', backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0', zIndex: 2,
                transform: focusField === 'email' ? 'rotate(-3deg)' : 'rotate(0deg)'
              }}>
              <div className="absolute flex gap-6" style={{ left: '26px', top: '32px' }}>
                <EyeBall size={18} />
                <EyeBall size={18} />
              </div>
            </div>

            {/* Orange Character - Vibrates when password is shown */}
            <div className="absolute bottom-0 transition-all duration-300"
              style={{ left: '0', width: '240px', height: '200px', backgroundColor: '#FF9B6B', borderRadius: '120px 120px 0 0', zIndex: 3 }}>
              <div className="absolute flex gap-8" style={{ left: '82px', top: '90px' }}>
                <EyeBall size={16} pupilSize={showPassword ? 12 : 8} isVibrating={showPassword} />
                <EyeBall size={16} pupilSize={showPassword ? 12 : 8} isVibrating={showPassword} />
              </div>
            </div>

            {/* Yellow Character - Opens mouth when hovering Login */}
            <div className="absolute bottom-0 transition-transform duration-300"
              style={{ left: '310px', width: '140px', height: '230px', backgroundColor: '#E8D754', borderRadius: '70px 70px 0 0', zIndex: 4, transform: isHoveringLogin ? 'scaleY(1.05)' : 'scaleY(1)' }}>
              <div className="absolute flex gap-6" style={{ left: '52px', top: '40px' }}>
                <EyeBall size={14} />
                <EyeBall size={14} />
              </div>
              <div 
                className="absolute bg-black rounded-full transition-all duration-300" 
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
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Form Section - Clean & Original */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">{mode === "login" ? "Welcome back!" : "Create a new account"}</h1>
            <p className="text-muted-foreground mt-2">
              {mode === "login"
                ? "Enter your details to sign in"
                : "Fill in your details to create an account"}
            </p>
          </div>
          {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {success && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocusField('name')}
                  onBlur={() => setFocusField(null)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField(null)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground transition-transform active:scale-125"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" className="cursor-pointer" />
                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer hover:text-black">
                  Remember me
                </Label>
              </div>
              <button type="button" className="text-sm font-semibold text-indigo-500 hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              onMouseEnter={() => setIsHoveringLogin(true)}
              onMouseLeave={() => setIsHoveringLogin(false)}
              className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            >
              {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <Button variant="outline" className="w-full h-12 flex items-center justify-center gap-3 rounded-xl border-gray-300 hover:bg-gray-50 transition-all">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-gray-700">Continue with Google</span>
          </Button>

          <div className="text-center text-sm text-slate-600">
            {mode === "login" ? "Don’t have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="font-semibold text-indigo-500 hover:underline"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;