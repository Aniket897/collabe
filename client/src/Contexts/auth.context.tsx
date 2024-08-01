import { KeycloakProfile } from "keycloak-js";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import client from "../Services/keycloak";
import { Button } from "react-bootstrap";

type authContextTypes = {
  token: string | null;
  isLogin: boolean;
  profile: KeycloakProfile | undefined;
};

const authContext = createContext({} as authContextTypes);

export const useAuth = () => {
  return useContext(authContext);
};

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [isLogin, setLogin] = useState<boolean>(false);
  const [profile, setProfile] = useState<KeycloakProfile>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLogin) {
      client
        .init({
          onLoad: "login-required",
        })
        .then((res) => {
          setLogin(res);
          setProfile(client.profile);
          setToken(client.token!);
        })
        .catch((e) => {
          console.log(e);
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="authErrorPage">
        <p>Failed to Authenticated please try to refresh page</p>
        <Button>Refresh</Button>
      </div>
    );
  }

  return (
    <authContext.Provider value={{ token, isLogin, profile }}>
      {children}
    </authContext.Provider>
  );
}
