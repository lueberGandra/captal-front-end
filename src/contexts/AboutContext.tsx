import { createContext, useCallback, useContext, useState } from "react";
import { AboutInfo } from "@/types/about";
import { aboutService } from "@/services/aboutService";

interface AboutContextData {
  aboutInfo: AboutInfo | null;
  isLoading: boolean;
  error: string | null;
  fetchAboutInfo: () => Promise<void>;
}

const AboutContext = createContext<AboutContextData>({} as AboutContextData);

export function AboutProvider({ children }: { children: React.ReactNode }) {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAboutInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await aboutService.getAboutInfo();
      setAboutInfo(data);
    } catch (err) {
      setError("Erro ao carregar informações");
      setAboutInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AboutContext.Provider
      value={{
        aboutInfo,
        isLoading,
        error,
        fetchAboutInfo,
      }}
    >
      {children}
    </AboutContext.Provider>
  );
}

export function useAbout(): AboutContextData {
  const context = useContext(AboutContext);

  if (!context) {
    throw new Error("useAbout must be used within an AboutProvider");
  }

  return context;
}
