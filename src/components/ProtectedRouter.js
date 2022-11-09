import {useAuth} from '../context/authContext'
import {Navigate} from "react-router-dom";

export function ProtectedRouter({children}) {
    const {currentUser} = useAuth();

    if(currentUser === null) return <Navigate to='/login'/>

    return <>{children}</>
}

export const getCurrentUser = () => {
    const user = JSON.parse(sessionStorage.getItem("user"))
    return user
}

export const getEmpresa = () => {
    const empresa = JSON.parse(sessionStorage.getItem("empresa"))
    return empresa
}

export const getMenu = () => {
    const objMenu = JSON.parse(sessionStorage.getItem("menu"))
    return objMenu.menu
}

export const logout =  () => {
    const user =  sessionStorage.removeItem("user");
    sessionStorage.removeItem("empresa");
    sessionStorage.removeItem("selMenu");
    return user
}