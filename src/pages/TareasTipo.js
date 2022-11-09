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

//
import { getListaTipoTareas, saveTipoTareas, deleteTipoTareas } from '../service/catalogos/Tareas/tipoTarea.service'

export const TareasTipo = () => {
    const [Token, setToken] = useState('')
    const formTipoTarea = useRef()

    const [oDataTareas, setODataTareas] = useState([])
    const [objTipoTarea, setObjTipoTarea] = useState({
        "Es_activo": true,
        "Tipo_ot_clave":"",
        "Tipo_ot_nombre":""
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
            selector: row => row.Tipo_ot_clave,
            sortable: true,
            width: '120px',
        },
        {
            name : 'Nombre',
            selector: row => row.Tipo_ot_nombre,
            sortable: true,
            width: '600px',
        },
        {
            name : 'Estatus',
            selector: row => row.Es_activo ? 'Activo' : 'Inactivo' ,
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
                        Change={() => alertDeleteTareas(row.Tipo_ot_clave, row.Tipo_ot_nombre)}
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
        getListaTipoTareas(code).then(res => {
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

    const closeModal = () => {
        setModalNuevaTarea(false)
        setValidated(false)
        setEditar(false)
        setBtnActiv(false)
        setObjTipoTarea({
            "Es_activo": true,
            "Tipo_ot_clave":"",
            "Tipo_ot_nombre":""
        })
    }

    const validacion = (e) => {
        e.preventDefault();
        let valido = false;
        console.log("entro")

        for (const key in objTipoTarea) {
            if (objTipoTarea[key] === "") {
                e.preventDefault();
                e.stopPropagation();
                setValidated(true);
                setBtnActiv(true)
                valido = true
            }
            if((objTipoTarea.Es_activo === false)&&(editar === false)){
                setValidated(true);
                setBtnActiv(true)
                valido = true
                alert("error",'No puedes agregar Tareas inactivas', '', 'no')
            }
        }

        if (valido === false) {
            saveTarea(objTipoTarea, Token)
        }
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
        if (name === 'Tipo_ot_clave' ) {
            setObjTipoTarea({...objTipoTarea, [name]:format})
            setBtnActiv(false)
        } else {
            setObjTipoTarea({...objTipoTarea, [name]:value})
            setBtnActiv(false)
        }
    }

    const checkEstatus = ({target: {checked, id}}) => {
        setObjTipoTarea({...objTipoTarea, [id]:checked})
        setBtnActiv(false)
    }

    const saveTarea = (data, token) => {
        Loading()
        saveTipoTareas(data, token).then(res => {
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
            "Tipo_ot_clave":id
        }

        Loading()
        deleteTipoTareas(dataDe, token).then(res => {
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

    const handleButtonClick = (state) => {
        console.log(state)
        setEditar(true)
        setObjTipoTarea(state)
        setModalNuevaTarea(true)
    };

    return (
        <Menu 
            menuTitle={"Tipo de Tareas"}
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
                        titlemodal={ editar === true ? "Editar Tipo Tarea" :"Agregar Tipo Tarea"}
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
                                id={"guardar-Tarea"}
                                name={"guardar-Tarea"}
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
                    <Form id='tarea-new' className='needs-validation' validated={validated} onSubmit={validacion} noValidate ref={formTipoTarea}>
                        <div className='row p-0 align-items-center'>
                            <div className='col-3'>
                                <Forms.Input
                                    SizeSM={12}
                                    SizeLG={12}
                                    SizeMD={12}
                                    TextLabelImp={'Clave'}
                                    Type={'number'}
                                    name={'Tipo_ot_clave'}
                                    PlaceHolder={'Ingresa Clave'}
                                    IdInp={"Tipo_ot_clave"}
                                    Valueinp={objTipoTarea.Tipo_ot_clave}
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
                                    Type={'text'}
                                    name={'Tipo_ot_nombre'}
                                    PlaceHolder={'Ingresa Nombre'}
                                    IdInp={"Tipo_ot_nombre"}
                                    Valueinp={objTipoTarea.Tipo_ot_nombre}
                                    FuncInp={changeInpu}
                                    required={true}
                                />
                            </div>
                            <div className='col-2  mt-4 pt-1'>
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
                                        checked={objTipoTarea.Es_activo}
                                        onChange={(e) => checkEstatus(e)}
                                        required={true}
                                        id="Es_activo"
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