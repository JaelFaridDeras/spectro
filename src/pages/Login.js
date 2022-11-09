import {useState} from 'react';
import {useAuth} from '../context/authContext';
import {useNavigate} from 'react-router-dom'
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

// const required = (value) => {
//     if (!value) {
//         return (
//             <div className="invalid-feedback d-block">
//                 Este campo es requerido!
//             </div>
//         );
//     }
// };

export const Login = () => {
    const [user, setUser] = useState({
        "Usuario_id":"",
        "Password":""   
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {login} = useAuth()
    const [message, setMessage] = useState("");
    const [error, setError] = useState()
    const [show, setShow] = useState(true);
    const [validated, setValidated] = useState(false);

    const handleChange = ({target:{name, value}}) =>{
        setUser({...user, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if((user.Password !== "")&&(user.Usuario_id !== "")){
            setLoading(true)
            setShow(false)
            try {
                const data = await login(user)
                if(data.Number >= 0){
                    navigate("/Menu")
                    setLoading(false)
                    console.clear()
                    window.location.reload();
                }else{
                    setMessage(data.Message)
                    setLoading(false)
                    setShow(true)
                    setTimeout(function() {
                        setShow(false)
                        setMessage("");
                    }, 10000)
                }
            } catch (error) {
                setError(error)
            }
        }
    }

    return (
        <div className=' container-fluid min-vh-100 min-vw-100'>              
            <div className="row ">
                <div className=' col-lg-8 col-sm-8 min-vh-100 imagen' >
                    
                </div>
                <div className=' col-lg-4 col-sm-12 min-vh-100 pe-0 car ps-0'>
                    <div className="login-box">
                        <div className='row'>
                            <img src='https://crm.spectro.mx/qas/Content/images/logo.png'/>
                        </div>
                        <div className='row text-center pt-2 pb-3'>
                            <h3 className="h3 title">Bienvenidos.</h3>
                        </div>
                        <div className='row'>
                            <Form noValidate validated={validated} onSubmit={ (e) =>handleSubmit(e)}>
                                <div className='inputbox'>
                                    <input type="text" className='input-login' required name='Usuario_id' onChange={(e) =>handleChange(e)} />
                                    <span >Usuario</span>
                                </div>
                                <div className='inputbox'>
                                    <input type="password" className='input-login' required name='Password' onChange={(e) =>handleChange(e)} />
                                    <span >Password</span>
                                </div>
                                <div className='col'>
                                    <button type="submit" className='button-log btn' onClick={(e) =>handleSubmit(e)} disabled={loading}> 
                                        <span>Login</span>
                                        {loading && ( 
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )}
                                    </button>
                                    {message && (
                                        (show) &&(
                                            <div className="form-group mt-4">
                                                <Alert className="alert alert-danger d-flex align-items-center " role="alert">
                                                    <div>
                                                        {message}
                                                    </div>
                                                </Alert>
                                            </div>
                                        )
                                    )}
                                </div>
                                <div className='row text-lg-end pt-4 pb-2'>
                                    <div>
                                        <a className="lead recuperar" href="/">Recuperar contraseña </a>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}