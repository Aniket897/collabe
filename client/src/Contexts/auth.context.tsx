import { KeycloakTokenParsed } from "keycloak-js";
import { createContext, useContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import client from "../Services/keycloak";
import { Button } from "react-bootstrap";

type authContextTypes = {
  token: string | null;
  isLogin: boolean;
  profile: KeycloakTokenParsed | undefined;
  uid: string;
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
  const [profile, setProfile] = useState<KeycloakTokenParsed>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");

  useEffect(() => {
    if (!isLogin) {
      client
        .init({
          // checkLoginIframe : false,
          onLoad: "login-required",
        })
        .then((res) => {
          setLogin(res);
          console.log(res)
          setProfile(client.idTokenParsed);
          setToken(client.token!);
          client
            .loadUserProfile()
            .then((profile) => {
              setUid(profile.id!);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((e) => {
          setLoading(false);
          console.log(e);
          setError(true);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // starting backend service
  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/health`).then((res) => {
      console.log(res.json());
    });
  }, []);

  const handleRefreshPage = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="pageLoader">
        <Loader />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="authErrorPage">
        <h1>☹️ Keycloak server down</h1>
        <p>Failed to Authenticated please try to refresh page</p>
        <Button onClick={handleRefreshPage}>Refresh</Button>
      </div>
    );
  }

  return (
    <authContext.Provider value={{ token, isLogin, profile, uid }}>
      {children}
    </authContext.Provider>
  );
}
