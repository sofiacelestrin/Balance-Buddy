import { supabase } from "../supabase/supabase";
import { AuthSession } from "@supabase/supabase-js";
import { useState, createContext, useContext, useEffect } from "react";

type SessionProviderValueType = {
  session: AuthSession | null;
  isLoading: boolean;
};

const SessionContext = createContext({} as SessionProviderValueType);

function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Effect that listens to Supabase auth event changes. We only handle "SIGNED_OUT" events
  // or events where the session object is truthy.
  // On initial page load or reload, `isLoading` is set to true, giving Supabase time to check for
  // an existing session before the app redirects to the intended page according to PrivateRoutes component. Once the session is determined, `isLoading` is set to false.
  useEffect(function () {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoading(false);
      if (event === "SIGNED_OUT") {
        setSession(null);
      } else if (session) {
        setSession(session);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("SessionContext was used outside of the SessionProvider ");
  }
  return context;
}

export { SessionProvider, useSession };
