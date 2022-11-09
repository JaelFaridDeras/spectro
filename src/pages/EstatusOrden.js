import React,{useState, useEffect, useRef} from 'react'
import Menu from '../components/pagesMenu'
import Forms from '../components/FormComponent'
import Table from '../components/TableComponent'
import Form from 'react-bootstrap/Form';
import Button from '../components/ButtonComponent'
import Modal from '../components/ModalComponent'
import {getListaEstatus, saveEstatus, deleteEstatus} from '../service/catalogos/Estatus/estatusOt.service'
import {getCurrentUser} from '../components/ProtectedRouter';
import Swal from 'sweetalert2'
import { FaTrashAlt } from "react-icons/fa";
import {Loading} from '../components/AlertComponent';

export const EstatusOrden = () => {
    // data
    const [Token, setToken] = useState('')
    const formEstatus = useRef()
    const [validated, setValidated] = useState(false);
    //tabla
    const [oDataEstatus, setoDataEstatus] = useState([])
    const [modalNuevoEstatus, setModalNuevoEstatus] = useState(false);
    const [newEstatus, setNewEstatus] = useState({
        "Estatus_id":"",
        "Nombre":"",
        "Color":""
    })

    const [editar, setEditar] = useState(false)
    const [btnActiv, setBtnActiv] = useState(false)
    const [load, setLoad] = useState(false)

    const [colorNone, setColorNone] = useState(false)

    const columns = [
        {
            name : '#',
            selector: row => row.U_Secuencia,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Estatus',
            selector: row => row.Estatus_id,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Nombre',
            selector: row => row.Nombre,
            sortable: true,
            width: '600px',
        },
        {
            name : 'Color',
            selector: row =>
                <div style={{ minHeight: '20px', minWidth:'150px', backgroundColor: `${row.Color}` }}>
                    <p style={{ color: `${row.Color}`, padding:'0px', margin:'0px' }}>p</p>
                </div>
            ,
            sortable: true,
            width: '170px',
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
                        Change={() => validarFores(row.Estatus_id, row.Nombre)}
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
            await getListaEstatus(token).then(res => {
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
    
        return () => {
            if(user !== null){
                setToken(user.Code)
                getLista(user.Code)
            }
        }
    }, [])
    

    const color = ({target: {value, id}}) => {
        setNewEstatus({...newEstatus, [id]:value})
        setValidated(false);
        setBtnActiv(false)
        setColorNone(false)
    }

    const changeInpu = ({target: {value, name}}) => {
        let hh = formEstatus.current
        setValidated(false);
        setBtnActiv(false)
        if(name === 'Estatus_id'){
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

    const closeModal = () => {
        setModalNuevoEstatus(false)
        setNewEstatus({
            "Estatus_id":"",
            "Nombre":"",
            "Color":""
        })
        setValidated(false)
        setEditar(false)
        setBtnActiv(false)
        setColorNone(false)
    }

    const eliminar = (id, token) => {

        let data = {
            "Estatus_id":id
        }

        Loading()
        deleteEstatus(data, token).then(res => {
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

    const validarFores = (id, text) => {
            Swal.fire({
                title:'¿Desea Eliminar este Estatus?',
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

    const guardarEstatus = (data, token) => {
        Loading()
        saveEstatus(data, token).then(res => {
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

    const handleButtonClick = (state) => {
        console.log(state)
        setEditar(true)
        setNewEstatus(state)
        setModalNuevoEstatus(true)
    };

    const alert = (text, icon) => {
            Swal.fire({
                icon:icon,
                title:text,
            })
    }

    const getLista = async (token) => {
        setLoad(true)
        await getListaEstatus(token).then(res => {
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
            if((newEstatus.Color === "")||(newEstatus.Color === '#ffffff' )||(newEstatus.Color === '#000000' )){
                setValidated(true);
                setBtnActiv(true)
                valido = true
                alert('No puedes agregar coleres Blancos o Negros', "error")
                setColorNone(true)
            }else{
                setColorNone(false)
            }
        }

        if (valido === false) {
            guardarEstatus(newEstatus, Token)
        }
    }

    return (
        <Menu 
            menuTitle={"Estatus de órdenes de trabajo "}
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
                        titlemodal={ editar === true ? "Editar Estatus" :"Agregar Estatus"}
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
                            <div className='col-3'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Clave'}
                                    Type={'text'}
                                    name={'Estatus_id'}
                                    PlaceHolder={'Ingresa Clave'}
                                    IdInp={"Estatus_id"}
                                    Valueinp={newEstatus.Estatus_id}
                                    FuncInp={changeInpu}
                                    required={true}
                                    Disabled={ editar === true ? true : false}
                                />
                            </div>
                            <div className='col-7'>
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
                            <div className='col-2'>
                                <Form.Label htmlFor="exampleColorInput">Color Estatus</Form.Label>
                                <Form.Control
                                    type="color"
                                    id="Color"
                                    name={'Color'}
                                    defaultValue={newEstatus.Color}
                                    title="Choose your color"
                                    onChange={color}
                                    className='colorInp'
                                    required
                                    style={{ borderStyle: 'solid', borderColor: (colorNone === true) && ('#dc3545'), backgroundImage: 'none !important'}}
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
