const BACKEND_URL = import.meta.env.BACKEND_URL || "http://localhost:5001";
import axios from "axios";


export interface UserLoginData{
    email: string;
    password: string;
}

export const login = async (formData: UserLoginData)=>{
    try{
        const res = await axios.post(BACKEND_URL+'/login', formData);
        const {token} = res.data;
        localStorage.setItem("token", token);
    }
    catch(err){
        throw Error("Failed to login!")
    }
}