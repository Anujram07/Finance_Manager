"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={pupilRef}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "black", isBlinking = false, forceLookX, forceLookY }) => {
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

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };

    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pos = calculatePupilPosition();

  return (
    <div
      ref={eyeRef}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: `${size}px`,
        height: isBlinking ? '2px' : `${size}px`,
        backgroundColor: eyeColor,
        overflow: 'hidden',
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: `${pupilSize}px`,
            height: `${pupilSize}px`,
            backgroundColor: pupilColor,
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        />
      )}
    </div>
  );
};

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const deltaX = mouseX - centerX;
    return {
      faceX: Math.max(-15, Math.min(15, deltaX / 20)),
      faceY: Math.max(-10, Math.min(10, (mouseY - (rect.top + rect.height / 3)) / 30)),
      bodySkew: Math.max(-6, Math.min(6, -deltaX / 120))
    };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const orangePos = calculatePosition(orangeRef);
  const yellowPos = calculatePosition(yellowRef);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background">
      {/* Visual Section */}
      <div className="relative hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground overflow-hidden">
        <div className="z-20 flex items-center gap-2 text-xl font-bold">
          <Sparkles className="size-6" /> <span>LoginApp</span>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative w-[550px] h-[400px]">
            {/* Purple Character */}
            <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '70px', width: '180px', height: isTyping ? '440px' : '400px',
                backgroundColor: '#6C3FF5', borderRadius: '10px 10px 0 0', zIndex: 1,
                transform: `skewX(${purplePos.bodySkew}deg)`, transformOrigin: 'bottom center'
              }}>
              <div className="absolute flex gap-8" style={{ left: '50px', top: '50px' }}>
                <EyeBall size={20} forceLookX={isTyping ? 5 : undefined} />
                <EyeBall size={20} forceLookX={isTyping ? 5 : undefined} />
              </div>
            </div>

            {/* Black Character */}
            <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
              style={{
                left: '240px', width: '120px', height: '310px', backgroundColor: '#2D2D2D',
                borderRadius: '8px 8px 0 0', zIndex: 2, transform: `skewX(${blackPos.bodySkew}deg)`
              }}>
              <div className="absolute flex gap-6" style={{ left: '26px', top: '32px' }}>
                <EyeBall size={18} />
                <EyeBall size={18} />
              </div>
            </div>

            {/* Orange Character */}
            <div ref={orangeRef} className="absolute bottom-0"
              style={{ left: '0', width: '240px', height: '200px', backgroundColor: '#FF9B6B', borderRadius: '120px 120px 0 0', zIndex: 3 }}>
              <div className="absolute flex gap-8" style={{ left: '82px', top: '90px' }}><Pupil /><Pupil /></div>
            </div>

            {/* Yellow Character */}
            <div ref={yellowRef} className="absolute bottom-0"
              style={{ left: '310px', width: '140px', height: '230px', backgroundColor: '#E8D754', borderRadius: '70px 70px 0 0', zIndex: 4 }}>
              <div className="absolute flex gap-6" style={{ left: '52px', top: '40px' }}><Pupil /><Pupil /></div>
              <div className="absolute w-20 h-1 bg-black rounded-full" style={{ left: '40px', top: '88px' }} />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-2">Enter your details to sign in</p>
          </div>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
  
  {/* Remember Me */}
  <div className="flex items-center gap-2">
    <Checkbox id="remember" className="cursor-pointer" />
    <Label
      htmlFor="remember"
      className="text-sm text-gray-600 cursor-pointer hover:text-black transition"
    >
      Remember me
    </Label>
  </div>

  {/* Forgot Password */}
  <button
    type="button"
    className="text-sm font-semibold text-indigo-500 
    hover:text-indigo-600 hover:underline transition"
  >
    Forgot password?
  </button>

</div>
          </form>
          <Button
            asChild
            className="w-full h-12 text-lg font-semibold rounded-xl 
  bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
  text-white shadow-lg transition-all duration-300 
  hover:scale-105 hover:shadow-xl hover:from-indigo-600 hover:to-pink-600 
  active:scale-95"
          >
            <Link
              to="/dashboard"
              onClick={() => alert("Signup successful")}
              className="flex items-center justify-center gap-2"
            >
              🚀 Sign Up
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 
  rounded-xl border border-gray-300 bg-white 
  shadow-sm transition-all duration-300 
  hover:shadow-md hover:bg-gray-50 hover:scale-[1.02] active:scale-95"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Component = LoginPage;
export default LoginPage;