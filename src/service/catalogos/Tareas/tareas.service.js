import HTTP from '../../conection/api.service';

export const getListaTarea = async (Token) => {
    const response = await HTTP.post('api/OTCat/ActividadListado/',{},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const saveTarea = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/ActividadGuardar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const deleteTarea = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/ActividadBorrar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}
