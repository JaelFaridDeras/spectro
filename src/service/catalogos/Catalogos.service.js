import HTTP from '../conection/api.service';

// export const TipoOT = async (Token) => {
//     const response = await HTTP.get('api/CatalogoV/Listas/tipo_ot',{
//         headers: {
//             'Authorization':`Bearer ${Token}`
//         }
//     })
//     return response.data
// }

export const TipoOT = async (Token) => {
    const response = await HTTP.get('api/CatalogoV/Listas/tipo_ot',{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const EtatusOT = async (Token) => {
    const response = await HTTP.get('api/CatalogoV/Listas/estatus_ot',{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const EmpresaCat = async (Token) => {
    const response = await HTTP.get('api/CatalogoV/Listas/empresa',{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const ArticuloTipoVenta = async (Data,Token) => {
    const response = await HTTP.post('api/Consulta/ListadoVTX',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const TecnicoList = async (Tabla,Token) => {
    const response = await HTTP.post('api/Consulta/ListadoVTX',{"Tabla":Tabla},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const MaterialesOT = async (Data,Token) => {
    const response = await HTTP.post('api/Consulta/ListadoVTX',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const SeveCliente = async (Data,Token) => {
    const response = await HTTP.post('api/Cliente/Guardar',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const ListadoGen = async (Data,Token) => {
    const response = await HTTP.post('api/Consulta/ListadoVTX',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

// api/OrdenTrabajo/Leer

export const GetOT = async (Data,Token) => {
    const response = await HTTP.post('api/OrdenTrabajo/Leer',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const GetClientes = async (Token) => {
    const response = await HTTP.post('api/Cliente/Clientes',{},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const SaveOT = async (Data,Token) => {
    const response = await HTTP.post('api/OrdenTrabajo/Guardar',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })

    return response.data
}