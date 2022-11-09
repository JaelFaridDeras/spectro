import React,{ useState, useEffect, useRef } from 'react'
import Menu from '../components/pagesMenu'
import Forms from '../components/FormComponent'
import Table from '../components/TableComponent'
import Form from 'react-bootstrap/Form';
import Button from '../components/ButtonComponent'
import Modal from '../components/ModalComponent'
import { getCurrentUser } from '../components/ProtectedRouter';
import Swal from 'sweetalert2'
import { FaTrashAlt } from "react-icons/fa";
import { Loading } from '../components/AlertComponent';
import { getListaEstatusFin, saveEstatusOTFin, deleteEstatusOTFinal } from '../service/catalogos/Estatus/estatusOtFinal.service'

export const EstatusOTFinal = () => {
    // data
    const [Token, setToken] = useState('')
    const [oDataEstatus, setoDataEstatus] = useState([])
    const [load, setLoad] = useState(false)
    const [modalNuevoEstatus, setModalNuevoEstatus] = useState(false);
    const [newEstatus, setNewEstatus] = useState({
        "Estatus_fin":"",
        "Nombre":"",
        "Fin":""
    })
    
    const [validated, setValidated] = useState(false);
    const [editar, setEditar] = useState(false);
    const [btnActiv, setBtnActiv] = useState(false);
    const formEstatus = useRef()

    const columns = [
        {
            name : '#',
            selector: row => row.U_Secuencia,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Estatus',
            selector: row => row.Estatus_fin,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Nombre',
            selector: row => row.Nombre,
            sortable: true,
            width: '500px',
        },
        {
            name : 'Exitoso / Incorrecto',
            selector: row => row.Fin,
            sortable: true,
            width: '270px',
        },
        {
            name : 'Acciones',
            selector: row => 
                <div className="col ps-0 text-center">
                    <Button
                        textButton={<FaTrashAlt/>}
                        Type={"button"}
                        id={"delete-item"}
                        name={"delete-item"}
                        styleButton={"danger"}
                        Change={() => validarFores(row.Estatus_fin, row.Nombre)}
                        // status={row.Nuevo === "N" ? true : false}
                        className={"buton-table"}
                    />
                </div>,
            sortable: true,
            // width: '100px',
        },
    ]

    const customStyles = {
        rows: {
            style: {
                minHeight: '26px', // override the row height
            },
        },
    };

    useEffect(() => {
        const user = getCurrentUser()

        const getLista = async (token) => {
            setLoad(true)
            await getListaEstatusFin(token).then(res => {
                let data = res.OData
                console.log(data)
                if(data !== null){
                    setLoad(false)
                    for (const i in data) {
                        let obj = data[i]
                        obj['U_Secuencia'] = 0;
                        data[i].U_Secuencia = parseInt(i) + 1
                    }

                    setoDataEstatus(data)
                }
            }).catch(e => {
                console.log(e)
            })
        }
    
        return () => {
            if(user !== null){
                setToken(user.Code)
                getLista(user.Code)
            }
        }
    }, [])

    const cerrarModal = () => {
        setModalNuevoEstatus(true)
        // setColorNone(false)
    }

    const alert = (text, icon) => {
        Swal.fire({
            icon:icon,
            title:text,
        })
    }

    const closeModal = () => {
        setModalNuevoEstatus(false)
        setNewEstatus({
            "Estatus_fin":"",
            "Nombre":"",
            "Fin":""
        })
        setValidated(false)
        setEditar(false)
        setBtnActiv(false)
    }

    const validacion = (e) => {
        e.preventDefault();
        let valido = false;
        console.log("entro")

        for (const key in newEstatus) {
            if (newEstatus[key] === "") {
                e.preventDefault();
                e.stopPropagation();
                setValidated(true);
                setBtnActiv(true)
                valido = true
            }
        }

        if (valido === false) {
            guardarEstatus(newEstatus, Token)
        }
    }

    const guardarEstatus = (data, token) => {
        Loading()
        saveEstatusOTFin(data, token).then(res => {
            let data = res
            console.log(data)
            if(data.Number >= 1){
                Loading(false)
                closeModal()
                setEditar(false)
                getLista(Token)
                alert(data._MessageFull, "success")
                
                console.log(res)
            }else{
                Loading(false)
                alert(data._MessageFull, "error")
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const getLista = async (token) => {
        setLoad(true)
        await getListaEstatusFin(token).then(res => {
            let data = res.OData
            if(data !== null){
                setLoad(false)
                for (const i in data) {
                    let obj = data[i]
                    obj['U_Secuencia'] = 0;
                    data[i].U_Secuencia = parseInt(i) + 1
                }
                setoDataEstatus(data)
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const handleButtonClick = (state) => {
        console.log(state)
        setEditar(true)
        setNewEstatus(state)
        setModalNuevoEstatus(true)
    };

    const changeInpu = ({target: {value, name}}) => {
        let hh = formEstatus.current
        setValidated(false);
        setBtnActiv(false)
        if(name === 'Estatus_fin'){
            let up = value.toUpperCase()
            if (up.length <= 3) {
                setNewEstatus({...newEstatus, [name]:up})
            }else{
                alert('No puedes agregar claves mayores a 3 caracteres', "error")
                hh.reset()
            }
        }else{
            setNewEstatus({...newEstatus, [name]:value})
        }
    }

    const validarFores = (id, text) => {
        Swal.fire({
            title:'¿Desea Eliminar este Estatus OT Final?',
            text: `${text}`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        })
        .then((result) => {
            if (result.isConfirmed) {
                //  Ejecutar cosa 1
                eliminar(id, Token)
            } else if (result.isDenied) {
                // Ejecutar cosa 2
                Swal.fire(`${text}, no se elimino `, '', 'info')
            }
        })
    }

    const eliminar = (id, token) => {
        let data = {
            "Estatus_fin":id
        }

        Loading()
        
        deleteEstatusOTFinal(data, token).then(res => {
            let data = res
            console.log(data)
            if(data.Number >= 1){
                getLista(Token)
                Loading(false)
                alert(data._MessageFull, "success")
                console.log(res)
            }else{
                alert(data._MessageFull, "error")
            }
        }).catch(e => {
            console.log(e)
        })

    }

    return (
        <Menu 
            menuTitle={"Estatus final de órdenes de trabajo"}
            actionesHeader={
                <Button
                    id={"agregar-Estatus"}
                    name={"agregar-Estatus"}
                    size={"sm"}
                    className={"btn btn-outline-primary btn-sm"}
                    Type={"button"}
                    styleButton={"Primary"}
                    textButton={"Agregar Estatus"}
                    Change={() => setModalNuevoEstatus(true) }
                />
            }
        >
            <div className='row'>
                <div className='col-12'>
                    <Table
                        Data={oDataEstatus}
                        Columnas={columns}
                        Header={false}
                        customStyles={customStyles}
                        FilterProp={'Nombre'}
                        Loading={load}
                        AccionFila={handleButtonClick}
                    />

                    <Modal
                        show={modalNuevoEstatus} 
                        size={"lg"}  
                        onHide={() => closeModal()}
                        fullscreen={false}
                        titlemodal={ editar === true ? "Editar Estatus Final" :"Agregar Estatus Final"}
                        buttons={
                                editar === true ? <Button
                                id={"act-Estatus"}
                                name={"act-Estatus"}
                                size={"sm"}
                                className={"btn btn-outline-primary"}
                                Type={"button"}
                                styleButton={"Primary"}
                                textButton={"Actualizar Estatus"}
                                // Change={() => guardarEstatus(newEstatus, Token)}
                                Change={(e) => validacion(e)} 
                            /> :
                            <Button
                                id={"guardar-Estatus"}
                                name={"guardar-Estatus"}
                                size={"sm"}
                                className={"btn btn-outline-success"}
                                Type={"button"}
                                styleButton={"Success"}
                                textButton={"Agregar Estatus"}
                                // Change={() => guardarEstatus(newEstatus, Token)} validacion
                                Change={(e) => validacion(e)} 
                                status={btnActiv}
                            />
                            
                        }
                        stylebodybard={"row px-0"}
                    >
                    <Form id='status-new' className='needs-validation' validated={validated} onSubmit={validacion} noValidate ref={formEstatus}>
                        <div className='row p-0'>
                            <div className='col-2'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Clave'}
                                    Type={'text'}
                                    name={'Estatus_fin'}
                                    PlaceHolder={'Ingresa Clave'}
                                    IdInp={"Estatus_fin"}
                                    Valueinp={newEstatus.Estatus_fin}
                                    FuncInp={changeInpu}
                                    required={true}
                                    Disabled={ editar === true ? true : false}
                                />
                            </div>
                            <div className='col-5'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Nombre'}
                                    IdInp={"Nombre"}
                                    Type={'text'}
                                    name={'Nombre'}
                                    PlaceHolder={'Ingresa Nombre'}
                                    Valueinp={newEstatus.Nombre}
                                    required={true}
                                    FuncInp={changeInpu}
                                />
                            </div>
                            <div className='col-5'>
                            <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Exitoso / Incorrecto'}
                                    IdInp={"Fin"}
                                    Type={'text'}
                                    name={'Fin'}
                                    PlaceHolder={'Ingresa'}
                                    Valueinp={newEstatus.Fin}
                                    required={true}
                                    FuncInp={changeInpu}
                                />
                            </div>
                        </div>
                    </Form>
                    {/* <Table
                        Data={oDataEstatus}
                        Columnas={columns}
                        Header={false}
                        customStyles={customStyles}
                    /> */}
                    </Modal>
                </div>
            </div>
        </Menu>
    )
}