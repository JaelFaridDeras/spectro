import axios from 'axios'

export default axios.create({
    baseURL: 'https://crm.spectro.mx/qas/',
    headers:{
        "Content-type": "application/json",
        // "Cookie": "ASP.NET_SessionId=4r5l2i1v10a2kvwrvgtmbiht"
    }
});