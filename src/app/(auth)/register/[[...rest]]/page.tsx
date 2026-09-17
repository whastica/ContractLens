"use client";

import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-2xl font-700">Crear cuenta</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Comienza a analizar contratos con IA
        </p>
      </div>
      <SignUp
        routing="path"
        path="/register"
        signInUrl="/login"
        forceRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#131b2e",
            colorInput: "#0f1729",
            borderRadius: "0.75rem",
          },
          elements: {
            rootBox: "w-full",
            card: "bg-[#131b2e] border border-[#1e3050] shadow-2xl shadow-black/40",
            headerTitle: "text-[#f0f4ff] font-heading text-xl",
            headerSubtitle: "text-[#8896b3]",
            formButtonPrimary:
              "bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-medium shadow-lg shadow-blue-900/30 transition-all duration-200",
            formButtonSecondary:
              "bg-[#1a2540] hover:bg-[#1e3050] text-[#f0f4ff] border border-[#2a3a5c] transition-all duration-200",
            formFieldInput:
              "bg-[#0f1729] border border-[#1e3050] text-[#f0f4ff] placeholder-[#5a6a8a] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/30 transition-all duration-200",
            formFieldLabel: "text-[#8896b3] text-sm font-medium",
            dividerLine: "bg-[#1e3050]",
            dividerText: "text-[#5a6a8a]",
            socialButtonsBlockButton:
              "bg-[#1a2540] border border-[#2a3a5c] text-[#f0f4ff] hover:bg-[#1e3050] transition-all duration-200",
            socialButtonsBlockButtonText: "text-[#f0f4ff] font-medium",
            socialButtonsIconButton:
              "border-[#2a3a5c] bg-transparent",
            footerActionLink: "text-[#60a5fa] hover:text-[#93c5fd] transition-colors",
            identityPreviewEditButton: "text-[#60a5fa]",
            formResendCodeLink: "text-[#60a5fa] hover:text-[#93c5fd]",
          },
        }}
      />
    </div>
  );
}
