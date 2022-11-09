import HTTP from '../../conection/api.service';

export const getListaEstatusFin = async (Token) => {
    const response = await HTTP.post('api/OTCat/EstatusFinListado/',{},{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const saveEstatusOTFin = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/EstatusFinGuardar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}

export const deleteEstatusOTFinal = async (Data, Token) => {
    const response = await HTTP.post('api/OTCat/EstatusFinBorrar/',Data,{
        headers: {
            'Authorization':`Bearer ${Token}`
        }
    })
    return response.data
}