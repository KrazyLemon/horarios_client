import { createContext, useLayoutEffect, useState } from "react";
import instance from "../api/axios";

export const AuthContext = createContext();

export const UseAuth = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) {
        throw new Error("useAuth debe estar dentro del proveedor AuthContext");
    }
    return authContext;
}

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [isAuth, setIsAuth] = useState(false);

    const login = async (LoginRequest) => {
        try {
            console.log(LoginRequest);
            const response = await instance.post("/auth/login", LoginRequest);
            setToken(response.data.token);
            if (token) {
                localStorage.setItem("token", token);
            }
            setIsAuth(true) // Cambiar a true si el login es exitoso;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    const register = async (RegisterRequest) => {
        try {
            const response = await instance.post("/auth/register", RegisterRequest);
            return response;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    const logout = () => {
        localStorage.removeItem("token");
    }

    useLayoutEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setToken(token);
        } else {
            setToken(null);
        }
    }, []);

    useLayoutEffect(() => {
        const authInterceptor = instance.interceptors.request.use((config) => {
            config.headers.Authorization =
                token
                    ? `Bearer ${token}`
                    : config.headers.Authorization;
            return config;
        });
        return () => {
            instance.interceptors.request.eject(authInterceptor);
        }
    }, [token]);

    return (
        <AuthContext.Provider
         value={{
            login,
            register,
            logout,
            token,
            isAuth
        }} >
            {children}
        </AuthContext.Provider>
    );
}