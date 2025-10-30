import React , {createContext ,useState,useEffect, Children} from "react";

export const AuthContext = createContext();

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const storedUser = localStorage.getItem("user");
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    },[]);

    return (
        <AuthContext.Provider value={{user, setUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
};