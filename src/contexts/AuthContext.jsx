import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      return { ...state, user: action.payload, isAuthenticated: true };
    }
    case "LOGOUT": {
      return initialState;
    }
    default:
      return state;
  }
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;
  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "LOGIN", user: FAKE_USER });
    }
  };
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };
  const contextValues = { user, isAuthenticated, login, logout };
  return (
    <AuthContext.Provider values={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("AuthContext must be used within a AuthProvider");
  }
  return context;
};
export { useAuth, AuthProvider };
