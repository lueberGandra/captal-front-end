import { useState } from "react";
import { ForgotPasswordCard } from "@/components/ForgotPasswordCard";
import { CodeVerificationCard } from "@/components/CodeVerificationCard";
import { ForgotPasswordStep } from "@/models/ForgotPasswordModel";
import backgroundJpg from "@/assets/images/background.jpg";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(
    ForgotPasswordStep.EMAIL
  );
  const [email, setEmail] = useState<string>("");

  const handleEmailSubmit = (submittedEmail: string) => {
    setEmail(submittedEmail);
    setCurrentStep(ForgotPasswordStep.CODE_VERIFICATION);
  };

  const handleCodeVerified = () => {
    setCurrentStep(ForgotPasswordStep.NEW_PASSWORD);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return <ForgotPasswordCard onEmailSubmit={handleEmailSubmit} />;
      case ForgotPasswordStep.CODE_VERIFICATION:
        return (
          <CodeVerificationCard
            email={email}
            onCodeVerified={handleCodeVerified}
          />
        );
      case ForgotPasswordStep.NEW_PASSWORD:
        // TODO: Implement new password step
        return <ForgotPasswordCard onEmailSubmit={handleEmailSubmit} />;
      default:
        return <ForgotPasswordCard onEmailSubmit={handleEmailSubmit} />;
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${backgroundJpg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0a174e] opacity-50 z-0"></div>

      {/* Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        {renderCurrentStep()}
      </div>

      <div className="absolute bottom-4 left-0 w-full text-center text-white text-sm z-10">
        Copyright© Captal {new Date().getFullYear()} | Política de Privacidade
      </div>
    </div>
  );
};

export default ForgotPassword;
