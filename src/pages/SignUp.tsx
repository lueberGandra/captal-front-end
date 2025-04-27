import { SignUpCard } from "@/components/SignUpCard";
import backgroundJpg from "@/assets/images/background.jpg";

const SignUp = () => (
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
    <div className="relative z-10">
      <SignUpCard />
    </div>

    <div className="absolute bottom-4 left-0 w-full text-center text-white text-sm z-10">
      Copyright© Captal {new Date().getFullYear()} | Política de Privacidade
    </div>
  </div>
);

export default SignUp;
