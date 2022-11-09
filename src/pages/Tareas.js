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
import { getListaTarea, saveTarea, deleteTarea } from '../service/catalogos/Tareas/tareas.service'

export const Tareas = () => {
    const [Token, setToken] = useState('')
    const formTarea = useRef()

    const [oDataTareas, setODataTareas] = useState([])
    const [objTarea, setObjTarea] = useState({
        "Es_activo": true,
        "Actividad_clave":"",
        "Nombre_actividad":"",
        "Requiere_foto": false
    })
    const [load, setLoad] = useState(false)

    //
    const [modalNuevaTarea, setModalNuevaTarea] = useState(false)
    const [editar, setEditar] = useState(false)
    const [btnActiv, setBtnActiv] = useState(false)
    const [validated, setValidated] = useState(false);

    const columns = [
        {
            name : '#',
            selector: row => row.U_Secuencia,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Clave Tarea',
            selector: row => row.Actividad_clave,
            sortable: true,
            width: '120px',
        },
        {
            name : 'Nombre',
            selector: row => row.Nombre_actividad,
            sortable: true,
            width: '500px',
        },
        {
            name : 'Estatus',
            selector: row => row.Es_activo ? 'Activo' : 'Inactivo' ,
            sortable: true,
            width: '100px',
        },
        {
            name:<>{'Requiere'} <br/> {'foto'}</>,
            selector: row => row.Requiere_foto ? 'Si' : 'No' ,
            sortable: true,
            width: '100px',
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
                        Change={() => alertDeleteTareas(row.Actividad_clave, row.Nombre_actividad)}
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
        let user = getCurrentUser()

        return () => {
            setToken(user.Code)
            lista(user.Code)
        }
    }, [])

    const lista = (code) => {
        setLoad(true)
        getListaTarea(code).then(res => {
            let data = res.OData
            if (data !== null) {
                setLoad(false)
                for (const i in data) {
                    let obj = data[i]
                    obj['U_Secuencia'] = 0;
                    data[i].U_Secuencia = parseInt(i) + 1
                }
                setODataTareas(data)
            }
        }).catch(e => {
            console.log(e)
        })
    }

    const validacion = (e) => {
        e.preventDefault();
        let valido = false;
        console.log("entro")

        for (const key in objTarea) {
            if (objTarea[key] === "") {
                e.preventDefault();
                e.stopPropagation();
                setValidated(true);
                setBtnActiv(true)
                valido = true
            }
            if((objTarea.Es_activo === false)&&(editar === false)){
                setValidated(true);
                setBtnActiv(true)
                valido = true
                alert("error",'No puedes agregar Tareas inactivas', '', 'no')
            }
        }

        if (valido === false) {
            saveTareas(objTarea, Token)
        }
    }

    const saveTareas = (data, token) => {
        Loading()
        saveTarea(data, token).then(res => {
            let data = res
            if (data.Number >= 0) {
                Loading(false)
                closeModal()
                lista(Token)
                // alert(data._MessageFull, "success")
                alert("success",data._MessageFull, '', 'no')
            } else {
                Loading(false)
                alert("error",data._MessageFull, '', 'no')
            }
            console.log(data)
        }).catch(e => {
            console.log(e)
            alert("error",'Opss', e , '')
        })
    }

    const checkEstatus = ({target: {checked, id}}) => {
        setObjTarea({...objTarea, [id]:checked})
        setBtnActiv(false)
    }

    const closeModal = () => {
        setModalNuevaTarea(false)
        setValidated(false)
        setEditar(false)
        setBtnActiv(false)
        setObjTarea({
            "Es_activo": true,
            "Actividad_clave":"",
            "Nombre_actividad":"",
            "Requiere_foto": false
        })
    }

    const alert = (icon, title, text, sin) => {
        if(sin === 'no'){
            Swal.fire({
                icon: icon,
                title: title,
            })
        }else{
            Swal.fire({
                icon: icon,
                title: title,
                text: text
            })
        }
    }

    const changeInpu = ({target: {value, name}}) => {
        let format = value.toUpperCase()
        if (name === 'Actividad_clave' ) {
            setObjTarea({...objTarea, [name]:format})
            setBtnActiv(false)
        } else {
            setObjTarea({...objTarea, [name]:value})
            setBtnActiv(false)
        }
    }

    const handleButtonClick = (state) => {
        console.log(state)
        setEditar(true)
        setObjTarea(state)
        setModalNuevaTarea(true)
    };

    const alertDeleteTareas = (id, text) => {
        Swal.fire({
            title:'¿Desea Eliminar este Tarea?',
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
        let dataDe = {
            "Actividad_clave":id
        }

        Loading()
        deleteTarea(dataDe, token).then(res => {
            let data = res
            if (data.Number >= 0) {
                Loading(false)
                lista(Token)
                // alert(data._MessageFull, "success")
                alert("success",data._MessageFull, '', 'no')
            } else {
                Loading(false)
                alert("error",data._MessageFull, '', 'no')
            }
            console.log(data)
        }).catch(e => {
            console.log(e)
            alert("error",'Opss', e , '')
        })
    } 

    return (
        <Menu 
            menuTitle={"Tareas"}
            actionesHeader={
                <Button
                    id={"agregar-Estatus"}
                    name={"agregar-Estatus"}
                    size={"sm"}
                    className={"btn btn-outline-primary btn-sm"}
                    Type={"button"}
                    styleButton={"Primary"}
                    textButton={"Agregar Tarea"}
                    Change={() => setModalNuevaTarea(true) }
                />
            }
        >
            <div className='row'>
                <div className='col-12'>
                    <Table
                        Data={oDataTareas}
                        Columnas={columns}
                        placeholderFilter={"Buscar Tarea"}
                        customStyles={customStyles}
                        Loading={load}
                        AccionFila={handleButtonClick}
                    />
                    <Modal
                        show={modalNuevaTarea} 
                        size={"lg"}  
                        onHide={() => closeModal()}
                        fullscreen={false}
                        titlemodal={ editar === true ? "Editar Tarea" :"Agregar Tarea"}
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
                                textButton={"Agregar Tarea"}
                                // Change={() => guardarEstatus(newEstatus, Token)} validacion
                                Change={(e) => validacion(e)}
                                status={btnActiv}
                            />
                            
                        }
                        stylebodybard={"row px-0"}
                    >
                    <Form id='tarea-new' className='needs-validation' validated={validated} onSubmit={validacion} noValidate ref={formTarea}>
                        <div className='row p-0 mb-1'>
                            <div className='col-3'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Clave Tarea'}
                                    Type={'text'}
                                    name={'Actividad_clave'}
                                    PlaceHolder={'Ingresa Clave'}
                                    IdInp={"Actividad_clave"}
                                    Valueinp={objTarea.Actividad_clave}
                                    FuncInp={changeInpu}
                                    required={true}
                                    Disabled={ editar === true ? true : false}
                                />
                            </div>
                            <div className='col-9'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Nombre Tarea'}
                                    Type={'text'}
                                    name={'Nombre_actividad'}
                                    PlaceHolder={'Ingresa Nombre'}
                                    IdInp={"Nombre_actividad"}
                                    Valueinp={objTarea.Nombre_actividad}
                                    FuncInp={changeInpu}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className='row p-0 pt-2'>
                            <div className='col-3'>
                                <div className="form-check form-switch">
                                    <label 
                                        className="form-check-label" 
                                        htmlFor="Es_activo"
                                    >
                                        Avtivo
                                    </label>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch" 
                                        checked={objTarea.Es_activo}
                                        onChange={(e) => checkEstatus(e)}
                                        required={true}
                                        id="Es_activo"
                                    />
                                </div>
                            </div>
                            <div className='col-3'>
                            <div className="form-check form-switch">
                                    <label 
                                        className="form-check-label" 
                                        htmlFor="Es_activo"
                                    >
                                        Requiere Foto
                                    </label>
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        role="switch" 
                                        checked={objTarea.Requiere_foto}
                                        onChange={(e) => checkEstatus(e)}
                                        id="Requiere_foto"
                                    />
                                </div>
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
