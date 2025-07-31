import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Assuming you have an auth context
import { motion } from "framer-motion";
import { 
  Mail, 
  CheckCircle, 
  ArrowRight,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react";

interface EmailVerificationProps {
  onVerify?: (code: string) => Promise<void>;
  onResendCode?: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  email?: string;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  isLoading = false,
  error = null,
}) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationEmail, user } = useAuth(); // Assuming you have a useAuth hook to get user info

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0 && !canResend) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
  }, [timeLeft, canResend]);

  const handleChange = (index: number, value: string) => {
    const newCode: string[] = [...code];
    
    // Handle pasted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      
      setCode(newCode);
      
      const lastFilledIndex = newCode.reduce((lastIndex, digit, i) => {
        return digit ? i : lastIndex;
      }, -1);

      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      // Single character input
      if (/^\d*$/.test(value)) { // Only allow digits
        newCode[index] = value;
        setCode(newCode);
        
        if (value && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      }
    }
    
    // Clear any previous errors
    setLocalError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      setLocalError("Please enter all 6 digits");
      return;
    }

    setIsSubmitting(true);
    setLocalError("");
    
    try {
      await verifyEmail(verificationCode);
      console.log("Verification successful");
      navigate("/");
    } catch (err) {
			console.error("Verification error:", err);
      setLocalError("Invalid verification code. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setLocalError("");
    
    try {
      if (resendVerificationEmail) {
        await resendVerificationEmail(user?.email || "");
        console.log("Resend code successful");
        // Reset timer
        setTimeLeft(60);
        setCanResend(false);
        setCode(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        throw new Error("Resend function is not available.");
      }
    } catch (err) {
			console.error("Resend code error:", err);
      setLocalError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [code]);

  const displayError = error || localError;
  const loading = isLoading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to{" "}
              <span className="font-medium text-amber-600">{user?.email}</span>
            </p>
          </div>

          {/* Success Message */}
          {!displayError && code.every(digit => digit !== "") && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <p className="text-green-700 text-sm">Code entered successfully! Verifying...</p>
            </motion.div>
          )}

          {/* Error Message */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{displayError}</p>
            </motion.div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Code Input Fields */}
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <motion.input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                    digit 
                      ? 'border-amber-500 bg-amber-50 text-amber-900' 
                      : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-amber-500 focus:bg-white'
                  }`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || code.some((digit) => !digit)}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Resend Code Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Didn't receive the code?</p>
            
            {canResend ? (
              <motion.button
                onClick={handleResendCode}
                disabled={isResending}
                whileHover={{ scale: isResending ? 1 : 1.02 }}
                whileTap={{ scale: isResending ? 1 : 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-2 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-150 disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </>
                )}
              </motion.button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend code in {timeLeft} seconds
              </p>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              Check your spam folder if you don't see the email. The code expires in 10 minutes.
            </p>
          </div>
        </div>

        {/* Back to Sign In */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/signin')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-150"
          >
            ← Back to Sign In
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmailVerification;