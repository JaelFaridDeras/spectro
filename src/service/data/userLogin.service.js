import API_URL from '../conection/api.service';

export const acceso = async (data) =>{
    const response = await API_URL.post('api/AAcceso', data);
    return response.data;
}
