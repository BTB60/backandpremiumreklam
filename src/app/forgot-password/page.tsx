"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { auth } from "@/lib/db";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "verify" | "reset" | "success">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Generated verification code (in real app, this would be sent via SMS/email)
  const [generatedCode, setGeneratedCode] = useState("");

  const handleSendCode = () => {
    setError("");
    
    if (!email && !phone) {
      setError("Email və ya telefon nömrəsi daxil edin");
      return;
    }

    setLoading(true);

    // Check if user exists
    const users = auth.getAllUsers();
    const user = users.find(
      (u) => u.email === email || u.phone === phone || u.username === email
    );

    if (!user) {
      setError("Bu email/telefon ilə istifadəçi tapılmadı");
      setLoading(false);
      return;
    }

    // Generate verification code (6 digits)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    
    // In real app, send code via SMS/email
    // For demo, we show the code in console
    console.log("Verification code:", code);
    
    setStep("verify");
    setLoading(false);
  };

  const handleVerifyCode = () => {
    setError("");

    if (verificationCode.length !== 6) {
      setError("6 rəqəmli kod daxil edin");
      return;
    }

    if (verificationCode !== generatedCode) {
      setError("Yanlış kod. Yenidən cəhd edin");
      return;
    }

    setStep("reset");
  };

  const handleResetPassword = () => {
    setError("");

    if (newPassword.length < 6) {
      setError("Şifrə minimum 6 simvol olmalıdır");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifrələr uyğun gəlmir");
      return;
    }

    setLoading(true);

    // Find user and update password
    const users = auth.getAllUsers();
    const userIndex = users.findIndex(
      (u) => u.email === email || u.phone === phone || u.username === email
    );

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      // Save updated users directly to localStorage
      localStorage.setItem("decor_users", JSON.stringify(users));
      setStep("success");
    } else {
      setError("Xəta baş verdi. Yenidən cəhd edin");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <h1 className="text-3xl font-bold text-[#D90429]">Premium Reklam</h1>
          </Link>
          <p className="text-[#6B7280] mt-2">Şifrəni bərpa et</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Back Button */}
          <Link href="/login">
            <Button variant="ghost" className="mb-4 -ml-4" icon={<ArrowLeft className="w-4 h-4" />}>
              Girişə qayıt
            </Button>
          </Link>

          {/* Step 1: Enter Email/Phone */}
          {step === "email" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                Email və ya telefon nömrəsi
              </h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Şifrəni bərpa etmək üçün email ünvanınızı və ya telefon nömrənizi daxil edin
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Email və ya istifadəçi adı
                  </label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(value) => setEmail(value)}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="text-center text-sm text-[#6B7280]">və ya</div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Telefon nömrəsi
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(value) => setPhone(value)}
                    placeholder="0501234567"
                  />
                </div>

                <Button
                  onClick={handleSendCode}
                  loading={loading}
                  className="w-full"
                >
                  Kod göndər
                </Button>
              </div>

              {/* Demo Note */}
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                <strong>Demo:</strong> Gerçək SMS göndərilmir. Kod konsolda görünəcək (F12 → Console).
              </div>
            </motion.div>
          )}

          {/* Step 2: Verify Code */}
          {step === "verify" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                Təsdiq kodu
              </h2>
              <p className="text-sm text-[#6B7280] mb-6">
                {email || phone} ünvanına göndərilmiş 6 rəqəmli kodu daxil edin
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Təsdiq kodu
                  </label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="123456"

                  />
                </div>

                <Button
                  onClick={handleVerifyCode}
                  className="w-full"
                >
                  Təsdiqlə
                </Button>

                <button
                  onClick={() => setStep("email")}
                  className="w-full text-center text-sm text-[#D90429] hover:underline"
                >
                  Kod gəlmədi? Yenidən göndər
                </button>
              </div>

              {/* Show code for demo */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-xs text-blue-600">Demo kod:</p>
                <p className="text-lg font-bold text-blue-800">{generatedCode}</p>
              </div>
            </motion.div>
          )}

          {/* Step 3: Reset Password */}
          {step === "reset" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-xl font-bold text-[#1F2937] mb-4">
                Yeni şifrə
              </h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Yeni şifrənizi daxil edin
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Yeni şifrə
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(value) => setNewPassword(value)}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">
                    Şifrəni təsdiqlə
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                    placeholder="••••••••"
                  />
                </div>

                <Button
                  onClick={handleResetPassword}
                  loading={loading}
                  className="w-full"
                >
                  Şifrəni yenilə
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-bold text-[#1F2937] mb-2">
                Şifrə yeniləndi!
              </h2>
              <p className="text-sm text-[#6B7280] mb-6">
                Şifrəniz uğurla dəyişdirildi. Yeni şifrənizlə daxil ola bilərsiniz.
              </p>
              <Link href="/login">
                <Button className="w-full">
                  Giriş et
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
