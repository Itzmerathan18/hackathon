import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
  loginWithProvider: () => {},
  loginWithPhone: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ email, password }) => {
    if (!email || !password) throw new Error("Email and password required");
    setUser({ email, name: email.split("@")[0] });
  };

  const signup = ({ name, email, password }) => {
    if (!name || !email || !password)
      throw new Error("Name, email, password required");
    setUser({ email, name });
  };

  const loginWithProvider = (provider) => {
    setUser({ email: `${provider.toLowerCase()}@demo.ai`, name: provider });
  };

  const loginWithPhone = ({ phone }) => {
    if (!phone || phone.length < 10)
      throw new Error("Valid phone number required");
    setUser({ phone, name: `Farmer ${phone.slice(-4)}` });
  };

  const logout = () => setUser(null);

  const value = useMemo(
    () => ({ user, login, signup, logout, loginWithProvider, loginWithPhone }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

