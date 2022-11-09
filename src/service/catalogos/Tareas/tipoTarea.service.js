import HTTP from '../../conection/api.service';

export const getListaTipoTareas = async (Token) => {
    const response = await HTTP.post('api/OTCat/TipoOrdenListado/',{},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const saveTipoTareas = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/TipoOrdenGuardar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const deleteTipoTareas = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/TipoOrdenBorrar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}
