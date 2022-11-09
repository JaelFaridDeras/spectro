import React,{useState, useEffect, useRef} from 'react'
import Menu from '../components/pagesMenu'
import Card from '../components/CardsComponent'
import Button from '../components/ButtonComponent'
import Select from '../components/SelectComponent'
import Forms from '../components/FormComponent'
import Form from 'react-bootstrap/Form';
import DatePicker from '../components/DatePickerComponent'
import Search from '../components/SearchComponent'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Table from '../components/TableComponent'
import {getCurrentUser} from '../components/ProtectedRouter';
import Modal from '../components/ModalComponent'
import {TipoOT, EtatusOT, TecnicoList, ArticuloTipoVenta, MaterialesOT, SeveCliente, GetClientes, ListadoGen, SaveOT} from '../service/catalogos/Catalogos.service'
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import { Loading, Success, ErrorAlert } from '../components/AlertComponent'


export const OrdenTrabajo = () => {

    const [Token, setToken] = useState(undefined)
    const [userLog, setUserLog] = useState("")
    const formAddM = useRef();
    const formAddCl = useRef();
    const formHeader = useRef();
    const [validated, setValidated] = useState(false);
    //
    const [vistaTipo, setVistaTipo] = useState("")
    const [dataTipo, setDataTipo] = useState([])

    const [vistaEstatus, setVistaEstatus] = useState("")
    const [dataEstatus, setDataEstatus] = useState([])

    const [vistaTecnico, setVistaTecnico] = useState("")
    const [dataTecnico, setDataTecnico] = useState([])

    //table actividades
    const [dataOtActiv, setDataOtActiv] = useState([])

    //tabala list Mat
    const [dataOtList, setDataOtList] = useState([])

    //fecha actual
    const [fechaActual, setfechaActual] = useState("")
    const [loading, setLoading] = useState(false)
    //Clientes
    const [oDataClientes, setODataClientes] = useState([])
    const [mostrarValor, setMostrarValor] = useState(false)
    const [filtroMostrar, setFiltroMostrar] = useState([])
    const [openMoCliente, setOpenMoCliente] = useState(false)

    //data para guardar
    const [dataOT, setDataOT] = useState({
        "OrdenTrabajo_id": 0,
        "Resumen": "",
        "Contacto_nombre": "",
        "Prioridad": "",
        "Cliente_id": 0,
        "Tipo_id": "",
        "Cliente":"",
        "Usuario_id_inserta":"",
        "Estatus_id":"",
        "Fecha_inserta":"",
        "Fecha_programada":"",
        "Usuario_id_asignado":"",
        "Folio":"",
        "Comentarios":"",
        "_Detalle": [],
        "_Materiales":[]
    })

    //nuevo cliente 
    const [modalNuevaCliente, setmodalNuevaCliente] = useState(false);
    const [newCliente, setNewCliente] = useState({
        "Nombre": "",
        "Alias": "",
        "Telefono": "",
        "Movil": "",
        "Email": "",
        "Contacto_nombre": "",
        "Es_activo": true,
        "Grupo": null
    })
    const [showAlertCliente, setShowAlertCliente] = useState(false)
    const [messaseErrorCliente, setMessaseErrorCliente] = useState('')

    //materiales
    const [modalShowAddMaterial, setModalShowAddMaterial] = useState(false)
    const [vistaMaterialesOT, setVistaMaterialesOT] = useState('')
    const [oDataMaterialesOT, setODataMaterialesOT] = useState([])
    const [oDataMaterialesTable, setoDataMaterialesTable] = useState([])
    const [buscadorModal, setBuscadorModal] = useState(false)
    const [filterModal, setFilterModal] = useState([])

    const resetInputs = () => {
        let data = document.querySelectorAll('form')
        for (const key in data) {
            let linea  = data[key].id
            if(linea !== undefined){
                let ex = linea.indexOf('TTTT')
                let com = linea.indexOf('com')
                if((ex === -1)&&(com !== -1)){
                    const element = data[key]
                    element.reset()
                }
            }
        }
    }

    const columnsActv =  [
        {
            name : '#',
            selector: row => row.U_Secuencia,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Descripción Actividad',
            selector: row => row.Nombre_actividad,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Requiere fotos',
            // selector: row => row.DocEntry,
            sortable: true,
            width: '150px',
        },
    ]

    const columnsList =  [
        {
            name : '#',
            selector: row => row.Clave,
            sortable: true,
            width: '50px',
        },
        {
            name : 'ItemCode',
            selector: row => row.ItemCode,
            sortable: true,
            width: '100px',
        },
        {
            name : 'Nombre de artículo',
            selector: row => row.Nombre,
            sortable: true,
            // width: '200px',
        },
        {
            name : 'Cantidad',
            selector: row => 
            <form id={`input-com-${row.Clave !== undefined ? row.U_Secuencia : 'TTTT' }`} onSubmit={(e) => e.preventDefault()}>
                <Forms.Input
                    SizeSM={12}
                    SizeMD={12}
                    SizeLG={12}
                    Type={"number"}
                    StyleLable={"show-lable"}
                    ForImp={"inpTable"}
                    IdInp={"inpTable"}
                    Valueinp={row.Cantidad}
                    FuncInp={(e) => qtyMaterial(row.Clave , e)}
                    plusClass={"input-table-rec"}
                />
            </form>
                    ,
            sortable: true,
            width: '120px',
        },
        {
            name : 'NSerie',
            // selector: row => row.DocEntry,
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
        const hoy = new Date();
        const fechaActual = (fecha, formato) =>{
            let actual =  fecha.getMonth() + 1
            if (actual < 10) {
                actual = String('0' + actual);
            }
            let dia = fecha.getDate()
            if (dia < 10) {
                dia = String('0' + dia);
            }

            const formatoMap = {
                dd: dia,
                MM: actual,
                yyyy: fecha.getFullYear()
            };
            return formato.replace(/yyyy|MM|dd/gi, matched => formatoMap[matched])
        }
        if (user !== null) {
            console.log("Desde el Oden trabajo: ",user.Code)
            setToken(user.Code)
            setUserLog(user.OData.Usuario_id)
        }

        const getClientes = async (token) => {
            await GetClientes(token).then(res => {
                let dataRes = res.OData;
                if((dataRes !== undefined) && (dataRes !== null)){
                    setODataClientes(dataRes)
                }
            }).catch(e => {
                console.log(e)
            })
        }

        let fecha = fechaActual(hoy, 'yyyy-MM-dd')
        
        return () => {
            newTipoOT(user.Code)
            newEstatusOT(user.Code)
            setfechaActual(fecha)
            setDataOT({...dataOT, ["Fecha_inserta"]:fecha})
            tecnicoOT(user.Code)
            getClientes(user.Code)
        }
    }, [])
    
    useEffect(() => {
    
        let data = {
            "Tabla":"actividad_tipo_ot",
            "Campos":[
                {
                    "Nombre":"Tipo_ot_clave",
                    "Valor":dataOT.Tipo_id
                }
            ]
        }

        let dataMateriales = {
            "Tabla":"material_tipo_ot",
            "Campos":[
                {
                    "Nombre":"Tipo_ot_clave",
                    "Valor":dataOT.Tipo_id
                }
            ]
        }

        let dataListaMateriales = {
            "Tabla":"material_ot"
        }

        const getData = async (data, Token) => {
            setLoading(true)
            await ArticuloTipoVenta(data, Token).then(res =>{
                let dataRes = res.OData;
                for(const j in dataRes){
                    let obj = dataRes[j] 
                    obj['U_Secuencia'] = 0
                    dataRes[j].U_Secuencia = parseInt(j) + 1
                }
                console.log(dataRes)
                if((dataRes !== undefined) && (dataRes !== null)){
                    setDataOtActiv(dataRes)
                    setLoading(false)
                }else{
                    setLoading(false)
                }
            }).catch(e => {
                console.log(e)
            })
        }

        const getMateriales = async (Data,Token) => {
            Loading(true)
            await MaterialesOT(Data, Token).then(res => {
                // console.log("materiales",res)
                let dataRes = res.OData;
                if(res.OData !== null){
                    for(const j in dataRes){
                        let obj = dataRes[j] 
                        obj['Clave'] = 0
                        obj['Nuevo'] = 'N'
                        dataRes[j].Clave = parseInt(j) + 1
                    }
                    setDataOtList(dataRes)
                    Loading(false)
                }else{
                    setDataOtList([])
                    Loading(false)
                }
            }).catch(e => {
                console.log(e)
            })
        }

        const getListadoMateriales = async (Data,Token) => {
            await ListadoGen(Data, Token).then(res => {
                let dataRes = res.OData;
                if(res.OData !== null){
                    for(const j in dataRes){
                        let obj = dataRes[j] 
                        obj['Nombre_Comp'] = ""
                        dataRes[j].Nombre_Comp = `${dataRes[j].ItemCode} ${dataRes[j].Descripcion}`
                    }
                    setODataMaterialesOT(dataRes)
                    console.log("list mat", dataRes)
                }
            }).catch(e => {
                console.log(e)
            })
        }

        let typo = dataOT.Tipo_id
        if (typo !== ""){
            getData(data, Token)
            getMateriales(dataMateriales,Token)
            getListadoMateriales(dataListaMateriales, Token)
        }else{
            setDataOtActiv([])
        }
        
    }, [dataOT.Tipo_id])
    

    const newTipoOT = async (Token) =>{
        Loading(true)
        await TipoOT(Token).then(res =>{
            let data = res.OData[0].Items
            if((data !== undefined) && (data !== null)){
                setDataTipo(data);
                Loading(false)

            }
            console.log(data)
        }).catch(e => {
            console.log(e)
        })
    }

    const newEstatusOT = async (Token) => {
        await EtatusOT(Token).then(res => {
            let data = res.OData[0].Items
            if((data !== undefined) && (data !== null)){
                setDataEstatus(data)
            }
            console.log(data)
        }).catch( e => {
            console.log(e)
        })
    }

    const tecnicoOT = async (Token) => {
        await TecnicoList('tecnico', Token).then(res => {
            let data = res.OData
            let formatoData = [];

            for (const key in data) {
                const obj = {Nombre: data[key].Nombre, Clave: data[key].Usuario_id, Email: data[key].Email, Nuevo: 'Y'}
                formatoData.push(obj)
            }

            if((data !== undefined) && (data !== null)){
                setDataTecnico(formatoData)
            }
        }).catch( e => {
            console.log(e)
        })
    }

    const selectsValue = ({target: {id, value}}) => {
        if(value !== ""){
            switch (id) {
                case "Tipo_id":
                    setVistaTipo(value)
                    setDataOT({...dataOT, [id]:value})
                    break;
                case "Estatus_id":
                    setVistaEstatus(value)
                    setDataOT({...dataOT, [id]:value})
                    break;
                case "Usuario_id_asignado":
                    setVistaTecnico(value)
                    setDataOT({...dataOT, [id]:value})
                break;
                default:
                    break;
            }
        }
    }

    const changeInputUser = ({target: {name, value}}) =>{
        setDataOT({...dataOT, [name]:value, ["Usuario_id_inserta"]:userLog})
    }

    const changeCliente = ({target: {name, value}}) =>{
        setNewCliente({...newCliente,[name]:value })
    }

    const copiarNombre = (valor) => {
        console.log(valor)
        if(valor !==""){
            setNewCliente({...newCliente,["Contacto_nombre"]:valor })
        }
    }

    const closeModalCliente = () => {
        setNewCliente({
            "Nombre": "",
            "Alias": "",
            "Telefono": "",
            "Movil": "",
            "Email": "",
            "Contacto_nombre": "",
            "Es_activo": true,
            "Grupo": null
        })
        setmodalNuevaCliente(false)
        setShowAlertCliente(false)
        setValidated(false);
    }

    const addCliente = async (e) => {
        e.preventDefault();
        console.log(newCliente)
        // let validar = formAddCl.current
        let valido = false;

        for (const key in newCliente) {
            if (newCliente[key] === "") {
                e.preventDefault();
                e.stopPropagation();
                setValidated(true);
                // setBtnActiv(true)
                valido = true
                
            }
        }

        if (valido === true) {
            setMessaseErrorCliente('Ingrese los campos faltantes')
            setShowAlertCliente(true)
                setTimeout(() => {
                    setShowAlertCliente(false)
                    setMessaseErrorCliente('')
                }, 10000);
        }

        if(valido !== true){
            await SeveCliente(newCliente,Token).then(res => {
                console.log(res)
                let mess = res._MessageFull
                if(res.Number >= 0){
                    setmodalNuevaCliente(false)
                    setOpenMoCliente(true)
                }else{
                    setMessaseErrorCliente(mess)
                    setShowAlertCliente(true)
                    setTimeout(() => {
                        setShowAlertCliente(false)
                    }, 10000);
                }
            }).catch(e => {
                console.log(e)
            })
        }
    }

    const showModalMT = () =>{
        setoDataMaterialesTable([...dataOtList])
        setModalShowAddMaterial(true)
    }

    const buscarCliente = ({target: {name,value}}) => {
        setDataOT({...dataOT, [name]:value})
        const result = oDataClientes.filter(cliente => {
            return cliente.Nombre.toLowerCase().startsWith(value.toLowerCase())
        })

        if (value === "") {
            setMostrarValor(false)
            setFiltroMostrar(result)
        }else{
            setMostrarValor(true)
            setFiltroMostrar(result)
        }
    }

    const buscarMaterial = ({target: {value}}) => {
        setVistaMaterialesOT(value)
        const result = oDataMaterialesOT.filter(material => {
            return material.Nombre_Comp.toLowerCase().includes(value.toLowerCase())
        })

        if (value === "") {
            setBuscadorModal(false)
            setFilterModal(result)
        }else{
            setBuscadorModal(true)
            setFilterModal(result)
        }
    }

    const borrar = (valor) =>{
        switch (valor) {
            case "Cliente":
                setDataOT({...dataOT, ["Cliente"]:""})
                setMostrarValor(false)
                setFiltroMostrar([])
                break;
            default:
                break;
        }
    }

    const itemSelect = (item,name) => {
        switch (name) {
            case "Cliente":
                setDataOT({...dataOT, [name]:item.Nombre, ['Cliente_id']:item.Cliente_id})
                setMostrarValor(false)
                setFiltroMostrar([])
                break;
            case "bus-Modal":
                setVistaMaterialesOT('')
                // let largo = dataOtList.length
                let largo = dataOtList.length
                let formM = formAddM.current
                let obj = {Cantidad: item.Cantidad, ItemCode: item.ItemCode, Nombre: item.Descripcion, Clave: largo+1, Nuevo: 'Y'}
                let newArray = oDataMaterialesTable
                let limpia = newArray.find(mat => (mat.ItemCode === item.ItemCode))

                if(limpia === undefined){
                    newArray.push(obj)
                }
                setoDataMaterialesTable(newArray)
                setBuscadorModal(false)
                setFilterModal([])
                resetInputs()
                formM.reset()
                break;
            default:
                break;
        }
    }

    const closeModalMateriales = () => {
        setBuscadorModal(false)
        setFilterModal([])
        setModalShowAddMaterial(false)
        resetInputs()
        setVistaMaterialesOT('')
    }

    const deleteItemModal = (valor) => {
        let formM = formAddM.current
        let data = dataOtList.filter(item => (item.ItemCode !== valor))

        formM.reset()
        setDataOtList(data)
        setoDataMaterialesTable(data)
        resetInputs()

    }

    const qtyMaterial = (sec, {target: {value}}) => {
        console.log(`secuencia ${sec} cantidad del ingresada ${value}`)
        
        dataOtList.map(item => ((item.Clave === sec)&&(
                item.Cantidad = parseFloat(value)
            )))
    }

    const addMaterial = () => {
        setBuscadorModal(false)
        setFilterModal([])
        setModalShowAddMaterial(false)
        resetInputs()
        setDataOtList(oDataMaterialesTable)
    }

    const saveOT = () => {
        Loading(true)
        let hh = formHeader.current
        dataOT._Detalle = dataOtActiv
        dataOT._Materiales = dataOtList
        console.log(dataOT)
        let newData = {
            "OrdenTrabajo_id": 0,
            "Resumen": "",
            "Contacto_nombre": "",
            "Prioridad": "",
            "Cliente_id": 0,
            "Tipo_id": "",
            "Cliente":"",
            "Usuario_id_inserta":"",
            "Estatus_id":"",
            "Fecha_inserta":"",
            "Fecha_programada":"",
            "Usuario_id_asignado":"",
            "Folio":"",
            "Comentarios":"",
            "_Detalle": [],
            "_Materiales":[]
        }

        console.log(JSON.stringify(dataOT))

        SaveOT(dataOT, Token).then(res => {
            let data = res._MessageFull
            if(res.Number >= 0){
                console.log(res)
                hh.reset()
                setDataOT(newData)
                setDataOtActiv([])
                setDataOtList([])
                setVistaTipo('')
                setVistaEstatus('')
                setVistaTecnico('')

                setTimeout(function(){
                    Loading(false)
                    Success()
                }, 6000);
                

            }else{
                console.log(data)
                ErrorAlert()
            }
        }).catch(e => {
            console.log(e)
            ErrorAlert()
        })
    }

    return (
        <Menu menuTitle={"Nueva Orden de trabajo"}>
            <div className='row'>
                <div className='col-12'>
                    <Card 
                        style={"cardHeaderNone"}
                        StyleBody={"p-3"}
                        Footer={
                            <>
                                <div className="row align-items-start">
                                    <div className=" col d-flex flex-row-reverse bd-highlight">
                                        <Button
                                            id={"guardar-OT"}
                                            name={"guardar-OT"}
                                            size={"sm"}
                                            className={"btn btn-outline-success btn-sm"}
                                            Type={"button"}
                                            styleButton={"Success"}
                                            textButton={"Guardar OT"}
                                            Change={saveOT}
                                        />
                                        <span style={{ paddingRight:'10px' }}/>
                                        <Link to={"/OTLists"}>
                                            <Button
                                                id={"cancelar-filtros"}
                                                name={"cancelar-filtros"}
                                                size={"sm"}
                                                className={"btn btn-outline-danger btn-sm"}
                                                Type={"button"}
                                                styleButton={"Danger"}
                                                textButton={"Volver"}
                                                
                                            />
                                        </Link>
                                        <span style={{ paddingRight:'10px' }}/>
                                        <Button
                                            id={"imp-OT"}
                                            name={"imp-OT"}
                                            size={"sm"}
                                            className={"btn btn btn-outline-primary btn-sm"}
                                            Type={"button"}
                                            styleButton={"Primary"}
                                            textButton={"Imprimir"}
                                            
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    >
                        <form id='form-header' onSubmit={(e) => e.preventDefault()} ref={formHeader}>
                            <div  className="row mb-2">
                                <div  className="col-3">
                                    <div className='row p-0 '>
                                        <div className='col-3 mt-1 pe-0'>
                                            <Form.Label className='label'>Tipo</Form.Label>
                                        </div>
                                        <div className='col-9 ps-0'>
                                            <Select
                                                Mag={0}
                                                MarT={0}
                                                Data={dataTipo}
                                                Filter={"Clave"}
                                                optionText={"Opciones"}
                                                ForSelect={"tipo-ot"}
                                                StyleLable={"label p-0 show-lable"}
                                                colInput={12}
                                                idSelect={"Tipo_id"}
                                                Vista={vistaTipo}
                                                Name={"Nombre"}
                                                ActionSelect={selectsValue}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div  className="col-4">
                                    <div className='row p-0 '>
                                        <Forms.InputLin
                                            HtmlFor={"Prioridad"}
                                            colLabel={4}
                                            colInput={8}
                                            Style={"pe-0"}
                                            Type={"text"}
                                            LabelText={"Prioridad"}
                                            styleInp={"pt-1 ps-0"}
                                            idInp={"Prioridad"}
                                            name={"Prioridad"}
                                            Valueinp={dataOT.Prioridad}
                                            heightInp={'30px'}
                                            funcInp={changeInputUser}
                                        />
                                    </div>
                                </div>
                                <div  className="col">
                                    <div className='row p-0 '>
                                        <div className='col-3 mt-1 pe-0'>
                                            <Form.Label className='label'>Resumen</Form.Label>
                                        </div>
                                        <div className='col-9 ps-0'>
                                            <Forms.Textarea
                                                SizeSM={12}
                                                SizeMD={12}
                                                SizeLG={12}
                                                ForArea={"resumen-OT"}
                                                // TextLabelTextArea={"Resumen"}
                                                name={"Resumen"}
                                                IdTextArea={"Resumen"}
                                                Row={1}
                                                FuncArea={changeInputUser}
                                                StyleLable={"label p-0 fechas-label"}
                                                PlaceHolder={"Ingresa resumen"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div  className="row">
                                <div  className="col-4 ">
                                    <div className='row p-0 '>    
                                    <div className='col-3 mt-1 '>
                                            <Form.Label className='label cliente-ot-modal' onClick={() =>setmodalNuevaCliente(true)}>Cliente</Form.Label>
                                        </div>
                                        {
                                            !openMoCliente ? (
                                                <div className='col-9 ps-0 mt-1'>
                                                    <Search
                                                        SizeLG={12}
                                                        SizeMD={12}
                                                        SizeSM={12}
                                                        LabetStyle={"fechas-label"}
                                                        Data={mostrarValor}
                                                        name={"Cliente"}
                                                        Placeholder={'Ingresa Nombre'}
                                                        Value={dataOT.Cliente}
                                                        FuncOnChange={buscarCliente}
                                                        IconLeft={"90%"}
                                                        Delete={() => borrar("Cliente")}
                                                        disabled={oDataClientes.length === 0 ? true: false}
                                                    >
                                                        {
                                                            filtroMostrar.map((item, i) => (
                                                                <li className='lista' 
                                                                    key={i}
                                                                    onClick={() => itemSelect(item, "Cliente")}
                                                                >
                                                                    {item.Nombre}
                                                                </li>
                                                            ))
                                                        }
                                                    </Search>
                                                </div>
                                            ):(
                                                <div className='col-9'>
                                                    <Forms.InputLin
                                                        Type={"text"}
                                                        Style={"fechas-label pe-0"}
                                                        styleInp={"pt-1 ps-0"}
                                                        idInp={"Cliente"}
                                                        name={"Cliente"}
                                                        Valueinp={dataOT.Cliente}
                                                        Disabled={true}
                                                        heightInp={'30px'}
                                                        funcInp={changeInputUser}
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div  className="col-3">
                                    <Forms.InputLin
                                        HtmlFor={"Folio"}
                                        colLabel={3}
                                        colInput={9}
                                        Style={"pe-0"}
                                        Type={"text"}
                                        LabelText={"Folio"}
                                        styleInp={"pt-1 ps-0"}
                                        idInp={"Folio"}
                                        name={"Folio"}
                                        Valueinp={dataOT.Folio}
                                        Disabled={true}
                                        heightInp={'30px'}
                                        textStyle={'center'}
                                        funcInp={changeInputUser}
                                    />
                                </div>
                                <div  className="col-5">
                                    <Forms.InputLin
                                        HtmlFor={"Contacto_nombre"}
                                        colLabel={3}
                                        colInput={9}
                                        Style={"pe-0"}
                                        Type={"text"}
                                        LabelText={"Nombre"}
                                        styleInp={"pt-1 ps-0"}
                                        idInp={"Contacto_nombre"}
                                        name={"Contacto_nombre"}
                                        Valueinp={dataOT.Contacto_nombre}
                                        Disabled={false}
                                        heightInp={'30px'}
                                        funcInp={changeInputUser}
                                    />
                                    
                                </div>
                            </div>
                            <div  className="row">
                                <div  className="col">
                                    <Forms.InputLin
                                        HtmlFor={"user-cap-OT"}
                                        colLabel={5}
                                        colInput={7}
                                        Style={"pe-0"}
                                        Type={"text"}
                                        LabelText={"Usuario captura"}
                                        styleInp={"pt-1 "}
                                        idInp={"Usuario_id_inserta"}
                                        name={"Usuario_id_inserta"}
                                        Valueinp={userLog}
                                        Disabled={true}
                                        heightInp={'30px'}
                                    />
                                </div>
                                <div  className="col">
                                    {/* <Forms.InputLin
                                        HtmlFor={"Servicio"}
                                        colLabel={3}
                                        colInput={9}
                                        Style={"pe-0"}
                                        Type={"text"}
                                        LabelText={"Servicio"}
                                        styleInp={"pt-1 ps-0"}
                                        idInp={"Servicio"}
                                        name={"Servicio"}
                                        Valueinp={dataOT.Servicio}
                                        Disabled={false}
                                        heightInp={'30px'}
                                        funcInp={changeInputUser}
                                    /> */}
                                    <div className='row p-0'>
                                        <div className='col-3 mt-1 pe-0'>
                                            <Form.Label className='label'>Técnico</Form.Label>
                                        </div>
                                        <div className='col-9 ps-0'>
                                            <Select
                                                Mag={0}
                                                MarT={0}
                                                Data={dataTecnico}
                                                optionText={"Opciones"}
                                                ForSelect={"tecnico-ot"}
                                                StyleLable={"label p-0 show-lable"}
                                                colInput={12}
                                                idSelect={"Usuario_id_asignado"}
                                                Vista={vistaTecnico}
                                                Filter={"Clave"}
                                                Name={"Nombre"}
                                                ActionSelect={selectsValue}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div  className="col">
                                    <div className='row p-0'>
                                        <div className='col-3 mt-1 pe-0'>
                                            <Form.Label className='label'>Estatus</Form.Label>
                                        </div>
                                        <div className='col-9 ps-0'>
                                            <Select
                                                Mag={0}
                                                MarT={0}
                                                Data={dataEstatus}
                                                optionText={"Opciones"}
                                                ForSelect={"tipo-ot"}
                                                StyleLable={"label p-0 show-lable"}
                                                colInput={12}
                                                idSelect={"Estatus_id"}
                                                Vista={vistaEstatus}
                                                Filter={"Clave"}
                                                Name={"Nombre"}
                                                ActionSelect={selectsValue}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div  className="row mb-1">
                                <div  className="col">
                                    <div className='row p-0'>
                                        <div className='col-4 mt-1 pe-0'>
                                            <Form.Label className='label'>Fecha captura</Form.Label>
                                        </div>
                                        <div className='col-8 ps-2'>
                                            <DatePicker
                                                idControl={"fecha-captura"}
                                                StyleLabel={"fechas-label"}
                                                Disabled={true}
                                                FechaVista={fechaActual}
                                                TextAlign={"center"}
                                            ></DatePicker>
                                        </div>
                                    </div>
                                </div>
                                <div  className="col">
                                    <div className='row p-0'>
                                        <div className='col-6 mt-1 pe-0'>
                                            <Form.Label className='label'>Fecha programada</Form.Label>
                                        </div>
                                        <div className='col-6 ps-0'>
                                            <DatePicker
                                                idControl={"Fecha_programada"}
                                                StyleLabel={"fechas-label"}
                                                funcPicker={changeInputUser}
                                                Name={"Fecha_programada"}
                                            ></DatePicker>
                                        </div>
                                    </div>
                                </div>
                                <div  className="col">
                                    
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
            <div className='row'>
                <div className='col-12'>
                        <Card
                            style={"cardHeaderNone"}
                            footerStyle={"cardHeaderNone"}
                        >
                            <Tabs defaultActiveKey="actividades" id="uncontrolled-tab-example" >
                                <Tab eventKey="actividades" title="Actividades" >
                                    <Table
                                        Data={dataOtActiv}
                                        placeholderFilter={"Buscar por numero orden "}
                                        FilterProp={"Nombre_actividad"}
                                        Columnas={columnsActv}
                                        Header={false}
                                        HoverLine={false}
                                        Pagination={false}
                                        customStyles={customStyles}
                                        Loading={loading}
                                    />
                                </Tab>
                            <Tab eventKey="materiales" title="materiales">
                                <div className='row'>
                                    <div className='col-12 text-end mb-2 mt-2'>
                                        <Button
                                            id={"add-material"}
                                            name={"add-material"}
                                            size={"sm"}
                                            className={"btn btn-outline-primary"}
                                            Type={"button"}
                                            styleButton={"Primary"}
                                            textButton={"Agregar Material"}
                                            Change={() => showModalMT()}
                                        />
                                    </div>
                                </div>
                                <Table
                                        Data={dataOtList}
                                        Columnas={columnsList}
                                        placeholderFilter={"Buscar por numero orden "}
                                        FilterProp={"Nombre"}
                                        Header={false}
                                        HoverLine={false}
                                        Pagination={false}
                                        customStyles={customStyles}
                                        Loading={loading}
                                    />
                                </Tab>
                            </Tabs>
                            <div className='row mt-3'>
                                <div className='col'>
                                    <Forms.Textarea
                                        SizeSM={12}
                                        SizeMD={12}
                                        SizeLG={12}
                                        ForArea={"comentarios-des"}
                                        name={"Comentarios"}
                                        IdTextArea={"comentarios-des"}
                                        StyleLable={"label p-0 fechas-label"}
                                        Row={3}
                                        FuncArea={changeInputUser}
                                        PlaceHolder={"Ingresa Comentarios"}
                                    />
                                </div>
                            </div>
                        </Card>
                </div>
            </div>
            <Modal
                show={modalNuevaCliente} 
                size={"lg"}  
                onHide={closeModalCliente}
                fullscreen={false}
                titlemodal={"Agregar Cliente"}
                stylebodybard={"container-fluid  "}
                buttons={
                        <Button
                            id={"guardar-Ac"}
                            name={"guardar-Ac"}
                            size={"sm"}
                            className={"btn btn-outline-success"}
                            Type={"button"}
                            styleButton={"Success"}
                            textButton={"Agregar Cliente"}
                            Change={addCliente}
                        />
                    }
                    >
                <div className='row'>
                    {
                        showAlertCliente && (
                            <div className='row pe-0 ps-4'>
                                <div className='col p-0'>
                                    {
                                        
                                            
                                        <Alert variant='warning' style={{ fontSize: '14px' }}>
                                            Error!!:{' '} {messaseErrorCliente}
                                        </Alert>
                                            
                                    }
                                </div>
                            </div>
                        )
                    }
                    <Form id='clientes-add' className='needs-validation px-4' validated={validated} onSubmit={addCliente} noValidate ref={formAddCl}>
                        <div className='row'>
                            <div className='col-3 ps-0 '>
                                <Forms.InputLin 
                                    HtmlFor={"cliente-id"}
                                    LabelText={"Cliente#"}
                                    colLabel={5}
                                    colInput={7}
                                    name={"idCliente"}
                                    Type={"text"}
                                    Valueinp={'---'}
                                    styleInp={"ps-1"}
                                    Disabled={true}
                                />
                            </div>
                            <div className='col-9'>
                                <Forms.InputLin 
                                    HtmlFor={"nombre-cliente"}
                                    LabelText={<>{"Nombre/"}<br/>{"Razón Social"}</>}
                                    colLabel={3}
                                    colInput={9}
                                    name={"Nombre"}
                                    Style={"pe-0 pb-0"}
                                    styleInp={"pe-0 ps-0"}
                                    Valueinp={newCliente.Nombre}
                                    Type={"text"}
                                    PlaceHolder={"Ingresa Nombre"}
                                    funcInp={changeCliente}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className='row py-0 mb-0'>
                            <div className='col-6 ps-0'>
                                <div className='row'>
                                    <div className='col-3 mt-1'>
                                        <Form.Label className='label cliente-ot-modal' onClick={() => copiarNombre(newCliente.Nombre)}>Contacto</Form.Label>
                                    </div>
                                    <div className='col-9 ps-0'>
                                        <Forms.InputLin 
                                            colInput={12}
                                            name={"Contacto_nombre"}
                                            Style={"pe-0 fechas-label"}
                                            styleInp={"pe-0 ps-0"}
                                            Type={"text"}
                                            Valueinp={newCliente.Contacto_nombre}
                                            PlaceHolder={"Ingresa Nombre"}
                                            funcInp={changeCliente}
                                            required={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-6 '>
                                <Forms.InputLin 
                                    HtmlFor={"contacto-cliente"}
                                    LabelText={"Email"}
                                    colLabel={2}
                                    colInput={10}
                                    name={"Email"}
                                    Style={"pe-0"}
                                    styleInp={"pe-0 ps-0"}
                                    Type={"email"}
                                    Width={"86px"}
                                    Valueinp={newCliente.Email}
                                    PlaceHolder={"Ingresa Email"}
                                    funcInp={changeCliente}
                                    required={true}
                                />
                            </div>
                        </div>
                        <div className='row py-0 mb-0 '>
                            <div className='col ps-0'>
                                <Forms.InputLin 
                                    HtmlFor={"contacto-cliente"}
                                    LabelText={"Alias"}
                                    colLabel={3}
                                    colInput={9}
                                    name={"Alias"}
                                    Style={"pe-0"}
                                    styleInp={"pe-0 ps-0"}
                                    Type={"text"}
                                    Width={"86px"}
                                    Valueinp={newCliente.Alias}
                                    PlaceHolder={"Ingresa Alias"}
                                    funcInp={changeCliente}
                                    required={true}
                                />
                            </div>
                            <div className='col'>
                                <Forms.InputLin 
                                    HtmlFor={"contacto-cliente"}
                                    LabelText={"Telefono"}
                                    colLabel={4}
                                    colInput={8}
                                    name={"Telefono"}
                                    Style={"pe-0"}
                                    styleInp={"pe-0 ps-0"}
                                    Type={"text"}
                                    Width={"86px"}
                                    Valueinp={newCliente.Telefono}
                                    PlaceHolder={"Ingresa Telefono"}
                                    funcInp={changeCliente}
                                    required={true}
                                />
                            </div>
                            <div className='col'>
                                <Forms.InputLin 
                                    HtmlFor={"contacto-cliente"}
                                    LabelText={"Movil"}
                                    colLabel={3}
                                    colInput={9}
                                    name={"Movil"}
                                    Style={"pe-0"}
                                    styleInp={"pe-0 ps-0"}
                                    Type={"text"}
                                    Width={"86px"}
                                    Valueinp={newCliente.Movil}
                                    PlaceHolder={"Ingresa Movil"}
                                    funcInp={changeCliente}
                                    required={true}
                                />
                            </div>
                        </div>
                    </Form>
                </div>
            </Modal>
            <Modal
                show={modalShowAddMaterial} 
                size={"lg"}  
                onHide={() => closeModalMateriales()}
                fullscreen={false}
                titlemodal={"Agregar Material"}
                stylebodybard={"container-fluid py-0 pe-0"}
                buttons={
                        <Button
                            id={"guardar-Ac"}
                            name={"guardar-Ac"}
                            size={"sm"}
                            className={"btn btn-outline-success"}
                            Type={"button"}
                            styleButton={"Success"}
                            textButton={"Agregar Material"}
                            Change={() => addMaterial()}
                        />
                    }
                    >
                <div className=''>
                    <div className='row p-0 '>    
                        <div className='col-12 ps-0 mt-1 mb-2'>
                            <Search
                                SizeLG={12}
                                SizeMD={12}
                                SizeSM={12}
                                LabetStyle={"fechas-label"}
                                Data={buscadorModal}
                                name={"bus-Modal"}
                                Placeholder={'Ingresa Nombre'}
                                Value={vistaMaterialesOT}
                                FuncOnChange={buscarMaterial}
                                IconLeft={"95%"}
                                Delete={() => borrar("Nombre")}
                            >
                                {
                                    filterModal.map((item, i) => (
                                        <li className='lista' 
                                            key={i}
                                            onClick={() => itemSelect(item, "bus-Modal")}
                                        >
                                            {item.Nombre_Comp}
                                        </li>
                                    ))
                                }
                            </Search>
                        </div>
                    </div>
                    <form id="table-add-material" onSubmit={(e) => e.preventDefault()} ref={formAddM}>
                        <table className="table table-responsive mt-2">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">ItemCode</th>
                                    <th scope="col">Nombre de artículo</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col" className=' text-center'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    oDataMaterialesTable.length > 0 && (
                                        oDataMaterialesTable.map((item, index) => (
                                            <tr key={index}>
                                                <th scope="row" style={{ minHeight: '26px', paddingTop: '3px', paddingBottom: '1px', fontSize:'12px' }}>{item.Clave}</th>
                                                <td style={{ minHeight: '26px', paddingTop: '3px', paddingBottom: '1px', fontSize:'12px' }}>{item.ItemCode}</td>
                                                <td style={{paddingTop: '1px', paddingBottom: '1px', maxWidth: '10px' }}>{item.Nombre}</td>
                                                <td style={{paddingTop: '1px', paddingBottom: '1px', maxWidth: '10px' }}>
                                                    <Forms.Input
                                                        SizeSM={12}
                                                        SizeMD={12}
                                                        SizeLG={12}
                                                        Type={"number"}
                                                        StyleLable={"show-lable"}
                                                        ForImp={"inpTable"}
                                                        IdInp={"inpTable"}
                                                        Valueinp={item.Cantidad}
                                                        FuncInp={(e) => qtyMaterial(item.Clave , e)}
                                                        plusClass={"input-table-rec"}
                                                    />
                                                </td>
                                                <td style={{ minHeight: '26px', paddingTop: '0px', paddingBottom: '0px', textAlign: 'center' }}>
                                                    <Button
                                                        textButton={"Eliminar"}
                                                        Type={"button"}
                                                        id={"delete-item"}
                                                        name={"delete-item"}
                                                        Change={() => deleteItemModal(item.ItemCode)}
                                                        styleButton={"btn btn-outline-danger"}
                                                        size={"sm"}
                                                        className={"delete-buttom-rec"}
                                                        status={item.Nuevo === 'Y' ? false : true}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                                
                            </tbody>
                        </table>
                    </form>
                </div>
            </Modal>
        </Menu>
    )
}