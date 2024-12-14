import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import {io} from "socket.io-client"

const BASE_URL = "http://localhost:5001"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket:null,

    checkAuth: async () => {
        // let res=1;
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })

            get().connectSocket()
        } catch (error) {
            // console.log(res);
            console.log("Error in checkAuth: ", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Acccount created successfully")

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");

            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully");

            get().disconnectSocket()
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data)
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        } catch (error) {
            console.log("Error in updateProfile: ",error.message);
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;           // if user is not logged in or socket is already connected, then do not connect (we optimize the code)


        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id
            }
        })
        socket.connect()

        set({socket:socket}) // this will set the socket in the store

        socket.on("getOnlineUsers",(userIds)=>{           // here the event name is getOnlineUsers must be same as the event name in the backend (io.emit() part, here)
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket:()=>{
        if(get().socket?.connected){
            get().socket.disconnect() // if socket is connected, then disconnect it means we have value in socket which we can access through get()
        }
    }
}))