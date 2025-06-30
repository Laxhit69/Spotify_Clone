import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import {useAuth} from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
    if(token){
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    else{
        delete axiosInstance.defaults.headers.common['Authorization'];
    }
}

const AuthProvider = ({children} : {children:React.ReactNode}) => {
    const {getToken ,  userId} = useAuth();
    const [loading , setLoading] = useState(true);
    const {initSocket , disconnectSocket} = useChatStore()
    const {checkAdminStatus} = useAuthStore()

    useEffect(() => { // use effect me directly async use nahi kar skte 
        const initAuth = async () => {
            try {
            const token = await getToken();    // getToken is a function , useAuth gives getToken function , then u have to call the function again to get the token
            updateApiToken(token);    
            if(token){
                await checkAdminStatus()
                //init socket
                if(userId){
                    initSocket(userId);
                }
            }   
            } catch (error) {
                updateApiToken(null);
                console.log("Error in auth provider" , error);
            }finally{
                setLoading(false)
            }
        };
        initAuth();

        // clean up
        return () => disconnectSocket()
    } , [getToken , checkAdminStatus , initSocket , disconnectSocket , userId])
    if(loading) return(
        <div className="w-full h-screen flex justify-center items-center">
            <Loader className="size-8 text-emerald-500 animate-spin"/>
        </div>
    )
    return <div>{children}</div>
}

export default AuthProvider;