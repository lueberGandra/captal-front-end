import { useNavigate } from "react-router-dom";
import { Home, LogOut, X, Building2, Info, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/contexts/SidebarContext";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const { isOpen, setIsOpen } = useSidebar();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      path: "/projects",
      label: "Projetos",
      icon: Building2,
    },
    {
      path: "/about",
      label: "Sobre",
      icon: Info,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F5]">
      {/* Hamburger menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 p-2 text-[#30448F] hover:text-[#30448F]/80 lg:hidden z-10 bg-white rounded-md shadow-sm"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          w-[240px] bg-white min-h-screen flex flex-col fixed left-0 top-0 z-30
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute right-2 top-2 p-2 text-[#30448F] hover:text-[#30448F]/80"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="p-6 flex justify-center items-center">
          <h1 className="text-[#30448F] text-2xl font-bold">Captal</h1>
        </div>

        {/* Menu Items */}
        <div className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`w-full flex items-center px-6 py-3 text-sm ${
                isActive(item.path)
                  ? "text-[#30448F] bg-[#30448F]/10 border-l-4 border-[#30448F]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 text-sm text-gray-600 hover:bg-gray-100 border-t"
        >
          <LogOut size={20} className="mr-3" />
          Sair
        </button>
      </div>

      <main className="lg:ml-[240px] p-8 pt-20 lg:pt-8">{children}</main>
    </div>
  );
}

export default Layout;
