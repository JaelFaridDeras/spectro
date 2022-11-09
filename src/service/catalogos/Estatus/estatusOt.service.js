import HTTP from '../../conection/api.service';

export const getListaEstatus = async (Token) => {
    const response = await HTTP.post('api/OTCat/EstatusListado/',{},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const saveEstatus = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/EstatusGuardar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const deleteEstatus = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/EstatusBorrar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}
