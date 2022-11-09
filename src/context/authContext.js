//imprtar algo mas para poder urilizar el dato
import {createContext, useContext} from 'react';
import {acceso} from '../service/data/userLogin.service'

//este contiene el valor
export const authContext = createContext()

export const useAuth = () => {
    const context = useContext(authContext)
    if(!context){
        throw new Error('NO HAY PROVEDOR')
    }
    return context
}

export const AuthProvider = ({children}) =>{

    const emp = {
        'empresa': ''
    }

    let selMenu = {
        'menu': ''
    }

    const login = async (data) =>{
        const dataUser = await acceso(data)
        if (dataUser.Number >= 0) {
            sessionStorage.setItem("user", JSON.stringify(dataUser));
            sessionStorage.setItem("empresa", JSON.stringify(emp));
            sessionStorage.setItem("menu", JSON.stringify(selMenu));

        }
        return dataUser
    }

    const currentUser = () => {
        return JSON.parse(sessionStorage.getItem("user"))
    }

    //componetes hijos podan acceder a el 
    return(
        <authContext.Provider value={{ login, currentUser }}>
            {children}
        </authContext.Provider>
    )
}