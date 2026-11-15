import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router";
import { assets } from "../assets/assets";
import ImageSwiper from "../components/ImageSwiper";
import { Eye, EyeOff, Mail, Lock, User, Home, ArrowLeft } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const VALIDATORS = {
  name: [
    {
      regex: /^.{2,}$/,
      message: "Name must be at least 2 characters long",
    },
    {
      regex: /^[a-zA-Z\s]+$/,
      message: "Name can contain only letters and spaces",
    },
  ],

  email: [
    {
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      message: "Please enter a valid email address",
    },
  ],

  password: [
    {
      regex: /^.{8,}$/,
      message: "Password must be at least 8 characters long",
    },
    {
      regex: /[A-Z]/,
      message: "Password must contain at least one uppercase letter",
    },
    {
      regex: /[a-z]/,
      message: "Password must contain at least one lowercase letter",
    },
    {
      regex: /\d/,
      message: "Password must contain at least one number",
    },
  ],
};

const swiperImages = assets.loginImages.map((src, i) => ({
  src,
  alt: `Wick & Aura ${i + 1}`,
}));

const STEP_ORDER = [
  "credentials",
  "otp",
  "forgot",
  "forgot-otp",
  "reset-password",
];

const stepVariants = {
  enter: (direction) => ({ x: direction > 0 ? "30%" : "-30%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? "-30%" : "30%", opacity: 0 }),
};
const stepTransition = { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] };

function OtpInputGroup({ otp, setOtp, disabled }) {
  const refs = useRef([]);

  const focusIdx = (i) => refs.current[i]?.focus();

  const handleInput = (e, i) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) focusIdx(i + 1);
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      focusIdx(i - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    for (let i = 0; i < 6; i++) next[i] = pasted[i] || "";
    setOtp(next);
    focusIdx(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex gap-2.5 justify-center" onPaste={handlePaste}>
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-11 h-13 text-center text-lg font-semibold border border-gray-200 rounded-xl outline-none focus:border-black transition-colors bg-white disabled:opacity-50"
        />
      ))}
    </div>
  );
}

export default function Login() {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "arbaz9234@gmail.com",
    password: "Arbaz9234",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Stepper state
  const [step, setStep] = useState("credentials");
  const [direction, setDirection] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpPurpose, setOtpPurpose] = useState("signup"); // "signup" | "login" | "forgot"
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewConfirmPassword, setShowNewConfirmPassword] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(""); // Store verified OTP for password reset

  const goTo = (nextStep) => {
    const cur = STEP_ORDER.indexOf(step);
    const nxt = STEP_ORDER.indexOf(nextStep);
    setDirection(nxt >= cur ? 1 : -1);
    setOtp(["", "", "", "", "", ""]);
    setStep(nextStep);
  };

  useEffect(() => {
    if (token) {
      const redirectTo = location.state?.redirectTo || "/home";
      navigate(redirectTo, { replace: true });
    }
  }, [token]);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPageReady(true));
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setInterval(
      () => setResendCooldown((c) => (c <= 1 ? 0 : c - 1)),
      1000,
    );
    return () => clearInterval(id);
  }, [resendCooldown]);

  const switchMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setErrors({});
    setSubmitted(false);
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
    setShowPassword(false);
    setStep("credentials");
  };

  const validate = (field, value) => {
    const rules = VALIDATORS[field];
    if (!rules) return "";

    if (!value.trim()) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }

    for (const rule of rules) {
      if (!rule.regex.test(value)) {
        return rule.message;
      }
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const fields =
      mode === "signup"
        ? ["name", "email", "password", "confirmPassword"]
        : ["email", "password"];

    const newErrors = {};

    fields.forEach((f) => {
      if (f === "confirmPassword") {
        newErrors[f] = !form[f].trim()
          ? "Please confirm your password"
          : form[f] !== form.password
            ? "Passwords do not match"
            : "";
      } else {
        newErrors[f] = validate(f, form[f]);
      }
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    try {
      const url =
        mode === "signup"
          ? backendUrl + "/api/user/register"
          : backendUrl + "/api/user/login";

      const payload =
        mode === "signup"
          ? { name: form.name, email: form.email, password: form.password }
          : { email: form.email, password: form.password };

      const response = await axios.post(url, payload);

      if (response.data.success) {
        // Signup requires OTP verification
        if (response.data.requiresOTP) {
          setOtpEmail(response.data.email);
          setOtpPurpose("signup");
          setResendCooldown(30);
          goTo("otp");
          return;
        }
        // Login with 2FA
        if (response.data.requires2FA) {
          setOtpEmail(response.data.email);
          setOtpPurpose("login");
          setResendCooldown(30);
          goTo("otp");
          return;
        }
        // Direct login (no 2FA)
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setOtpLoading(true);
    try {
      const endpoint =
        otpPurpose === "signup"
          ? "/api/user/verify-signup-otp"
          : otpPurpose === "login"
            ? "/api/user/verify-login-otp"
            : null;

      if (!endpoint) return;

      const { data } = await axios.post(backendUrl + endpoint, {
        email: otpEmail,
        otp: code,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    if (!forgotEmail.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/forgot-password",
        { email: forgotEmail },
      );
      if (data.success) {
        setOtpEmail(data.email);
        setOtpPurpose("forgot");
        setResendCooldown(30);
        goTo("forgot-otp");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleForgotVerifyOTP = async () => {
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the 6-digit code");
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/verify-forgot-password-otp",
        { email: otpEmail, otp: code },
      );
      if (data.success) {
        // OTP verified, store it for password reset
        setVerifiedOtp(code);
        goTo("reset-password");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!verifiedOtp) {
      toast.error("OTP verification expired. Please restart password reset.");
      goTo("forgot");
      return;
    }
    setOtpLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reset-password",
        { email: otpEmail, otp: verifiedOtp, newPassword },
      );
      if (data.success) {
        toast.success("Password reset successfully");
        setNewPassword("");
        setConfirmPassword("");
        setVerifiedOtp("");
        setMode("login");
        goTo("credentials");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    try {
      const { data } = await axios.post(backendUrl + "/api/user/resend-otp", {
        email: otpEmail,
      });
      if (data.success) {
        setResendCooldown(30);
        toast.success("OTP sent");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  const maskedEmail = otpEmail
    ? otpEmail.replace(
        /^(.{2})(.*)(@.*)$/,
        (_, a, b, c) => a + "•".repeat(b.length) + c,
      )
    : "";

  const inputClass = (field) =>
    `w-full pl-11 pr-4 py-3.5 text-sm border rounded-xl outline-none transition-colors bg-white placeholder:text-gray-400 ${
      errors[field]
        ? "border-red-300 focus:border-red-500"
        : "border-gray-200 focus:border-black"
    }`;

  const errorMsg = (field) => (
    <p
      className={`text-xs ml-1 overflow-hidden transition-all duration-200 ${
        errors[field]
          ? "h-5 mt-1.5 text-red-500 opacity-100"
          : "h-0 mt-0 text-red-500 opacity-0"
      }`}
    >
      {errors[field] || " "}
    </p>
  );

  // --- Step renderers ---

  const renderCredentials = () => (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>
        <p className="text-gray-500 mt-2">
          {mode === "login"
            ? "Sign in to continue to your account"
            : "Join Wick & Aura for a curated candle experience"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {mode === "signup" && (
          <div>
            <div className="relative">
              <User className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass("name")}
                placeholder="Full name"
              />
            </div>
            {errorMsg("name")}
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={inputClass("email")}
              placeholder="Email address"
            />
          </div>
          {errorMsg("email")}
        </div>

        <div>
          <div className="relative">
            <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className={`${inputClass("password")} pr-12`}
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          </div>
          {errorMsg("password")}
        </div>

        {mode === "signup" && (
          <div>
            <div className="relative">
              <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                className={`${inputClass("confirmPassword")} pr-12`}
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
            {errorMsg("confirmPassword")}
          </div>
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setForgotEmail(form.email || "");
                goTo("forgot");
              }}
              className="text-sm text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : mode === "login" ? (
            "Sign In"
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs text-gray-500 uppercase tracking-wider">
            or
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <button
          onClick={switchMode}
          className="text-black font-medium hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </>
  );

  const renderOtp = () => (
    <>
      <button
        type="button"
        onClick={() => goTo("credentials")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {otpPurpose === "signup"
            ? "Verify your email"
            : "Two-factor authentication"}
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-700">{maskedEmail}</span>
        </p>
      </div>

      <div className="space-y-6">
        <OtpInputGroup otp={otp} setOtp={setOtp} disabled={otpLoading} />

        <button
          onClick={handleVerifyOTP}
          disabled={otpLoading || otp.join("").length < 6}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {otpLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Verify"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Didn&apos;t receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="text-gray-400">Resend in {resendCooldown}s</span>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-black font-medium hover:underline"
            >
              Resend
            </button>
          )}
        </p>
      </div>
    </>
  );

  const renderForgot = () => (
    <>
      <button
        type="button"
        onClick={() => goTo("credentials")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Reset password</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Enter your email and we&apos;ll send you a reset code
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-200 rounded-xl outline-none transition-colors bg-white placeholder:text-gray-400 focus:border-black"
            placeholder="Email address"
          />
        </div>

        <button
          onClick={handleForgotSubmit}
          disabled={otpLoading}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {otpLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Send Reset Code"
          )}
        </button>
      </div>
    </>
  );

  const renderForgotOtp = () => (
    <>
      <button
        type="button"
        onClick={() => goTo("forgot")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Enter reset code
        </h1>
        <p className="text-gray-500 mt-2 text-sm">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-700">{maskedEmail}</span>
        </p>
      </div>

      <div className="space-y-6">
        <OtpInputGroup otp={otp} setOtp={setOtp} disabled={otpLoading} />

        <button
          onClick={handleForgotVerifyOTP}
          disabled={otpLoading || otp.join("").length < 6}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {otpLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Continue"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Didn&apos;t receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="text-gray-400">Resend in {resendCooldown}s</span>
          ) : (
            <button
              onClick={handleResendOTP}
              className="text-black font-medium hover:underline"
            >
              Resend
            </button>
          )}
        </p>
      </div>
    </>
  );

  const renderResetPassword = () => (
    <>
      <button
        type="button"
        onClick={() => goTo("forgot")}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">New password</h1>
        <p className="text-gray-500 mt-2 text-sm">
          Choose a strong password for your account
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full pl-11 pr-12 py-3.5 text-sm border border-gray-200 rounded-xl outline-none transition-colors bg-white placeholder:text-gray-400 focus:border-black"
            placeholder="New password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showNewPassword ? (
              <EyeOff className="w-4.5 h-4.5" />
            ) : (
              <Eye className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        <div className="relative">
          <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type={showNewConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 text-sm border border-gray-200 rounded-xl outline-none transition-colors bg-white placeholder:text-gray-400 focus:border-black"
            placeholder="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowNewConfirmPassword((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showNewConfirmPassword ? (
              <EyeOff className="w-4.5 h-4.5" />
            ) : (
              <Eye className="w-4.5 h-4.5" />
            )}
          </button>
        </div>

        <button
          onClick={handleResetPassword}
          disabled={otpLoading}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {otpLoading ? (
            <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            "Reset Password"
          )}
        </button>
      </div>
    </>
  );

  const stepContent = {
    credentials: renderCredentials,
    otp: renderOtp,
    forgot: renderForgot,
    "forgot-otp": renderForgotOtp,
    "reset-password": renderResetPassword,
  };

  return (
    <div
      className={`transition-opacity duration-500 ${pageReady ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative flex min-h-screen lg:h-screen lg:overflow-hidden">
        {/* Mobile/Tablet — Background Swiper */}
        {!isDesktop && (
          <div className="absolute inset-0">
            <ImageSwiper
              images={swiperImages}
              autoplayDelay={4000}
              className="hide-bullet"
            />
            <div className="absolute inset-0 bg-white/20 backdrop-blur-xl" />
          </div>
        )}

        {/* Left — Image Swiper */}
        {isDesktop && (
          <div className="lg:w-1/2 relative overflow-hidden">
            <ImageSwiper images={swiperImages} autoplayDelay={4000} />
          </div>
        )}

        {/* Right — Form */}
        <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
          <button
            onClick={() => navigate("/home")}
            className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium border border-gray-200 rounded-xl hover:bg-black hover:text-white hover:border-black transition-all bg-white/90 backdrop-blur-sm"
          >
            <Home className="w-3.5 h-3.5" />
            Back to Home
          </button>

          <div className="w-full max-w-md bg-white/95 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none rounded-2xl lg:rounded-none p-6 sm:p-8 lg:p-0 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={stepTransition}
              >
                {stepContent[step]()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
