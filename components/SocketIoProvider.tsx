"use client"

import {createContext, useContext, useState, useEffect} from "react"
import {io as ClientIO} from "socket.io-client"

type SocketIoType = {
    socket : any | null;
    isConnected : boolean;
}

const SocketContext = createContext<SocketIoType>({
    isConnected : false,
    socket : null
})

export const useSocket = ()=>{
    return useContext(SocketContext)
}

export const SocketIoProvider = ({children}:{children : React.ReactNode})=>{
    const [socket, setSocket] = useState<any>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(()=>{
        const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path : "/api/socket/io",
            addTrailingSlash : false
        })

        socketInstance.on("connect", ()=>{
            setIsConnected(true);
        })

        socketInstance.on("disconnect", ()=>{
            setIsConnected(false);
        })

        setSocket(socketInstance)

        return ()=>{
            socketInstance.disconnect()
        }
    },[])

    return <SocketContext.Provider value={{socket, isConnected}}>
        {children}
    </SocketContext.Provider>
}