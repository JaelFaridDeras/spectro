import React, { useState, useRef, useEffect }  from 'react'
import Menu from '../components/pagesMenu'
import Card from '../components/CardsComponent'
import Forms from '../components/FormComponent'
import Search from '../components/SearchComponent'
import Select from '../components/SelectComponent'
import DatePicker from '../components/DatePickerComponent'
import Button from '../components/ButtonComponent'
import Table from '../components/TableComponent'
import { ListadoGen, TipoOT, TecnicoList, EtatusOT, GetClientes } from '../service/catalogos/Catalogos.service'
import { getCurrentUser } from '../components/ProtectedRouter';
import { useNavigate } from 'react-router-dom';
import { Loading, Success, ErrorAlert } from '../components/AlertComponent'
import { Link } from 'react-router-dom';


export const OrdenesTrabajo = () => {
    const [Token, setToken] = useState(undefined)
    const navigate = useNavigate()
    //Estatus
    const [vistaStatus, setVistaStatus] = useState("")
    const [dataEstatus, setDataEstatus] = useState([])

    //Clientes
    const [vistaClientes, setVistaClientes] = useState("")
    const [dataClientes, setDataClientes] = useState([])
    const [mostrarValor, setMostrarValor] = useState(false)
    const [filtroMostrar, setFiltroMostrar] = useState([])

    //Tipo
    const [vistaTipo, setVistaTipo] = useState("")
    const [dataTipo, setDataTipo] = useState([])

    //tecnico
    const [vistaTecnico, setVistaTecnico] = useState("")
    const [dataTecnico, setDataTecnico] = useState([])
    
    //Empresa
    const [vistaEmpresa, setVistaEmpresa] = useState("")
    const [dataEmpresa, setDataEmpresa] = useState([])
    //Table
    const [dataOT, setDataOT] = useState([])
    const [loading, setLoading] = useState(false)

    const formOT = useRef();

    //filter data 
    const [filtarData, setFiltarData] = useState({
        Estatus_id: "",
        Tipo_id: "",
        Fecha_Desde: "",
        Fecha_Hasta:"",
        Cliente_id:"",
        ///
        Folio: "",
        Tecnico: "",
        Empresa: ""
    })

    const columns = [
        {
            name : 'Folio',
            selector: row => row.OrdenTrabajo_id,
            sortable: true,
            width: '100px',
        },
        {
            name : <>{'Fecha'} <br/> {'Programada'}</>,
            // selector: row => row.DocEntry,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Servicio',
            // selector: row => row.DocEntry,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Cliente',
            // selector: row => row.DocEntry,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Estatus',
            selector: row => row.Estatus_id,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Tipo',
            selector: row => row.Tipo_id,
            sortable: true,
            width: '100px',
        },
        {
            name : <>{'Técnico'} <br/> {'Asignado'}</>,
            selector: row => row.Usuario_id_asignado,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Resumen',
            selector: row => row.Resumen,
            sortable: true,
            width: '300px',
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
        const user = getCurrentUser();
        const data = {
            "Tabla":"ot",
            "Campos":[]
            }

        if (user !== null) {
            console.log("Desde el OT lista: ",user.Code)
            setToken(user.Code)
        }
        Loading(true)
        setLoading(true)
        ListadoGen(data, user.Code).then(res => {
            if (res.OData !== null) {
                setDataOT(res.OData)
                Loading(false)
                setLoading(false)
            }else{
                Loading(false)
                setLoading(false)
            }
        }).catch(e=>{
            console.log(e)
            ErrorAlert()
        })

        GetClientes(Token).then(res => {
            let data = res.OData;

            console.log(res.OData)
            if (data !== null) {
                setDataClientes(res.OData)
            }
        }).catch(e => {
            console.log(e)
        })

        return () => {
            newTipoOT(user.Code)
            tecnicoOT(user.Code)
            newEstatusOT(user.Code)
            getEmpresa(user.Code)
            GetClientes(user.Code)
        }
    }, [])
    

    const formatData = () =>{
        const newData = {
            "Tabla":"ot",
            "Campos":[]
        }

        for (const key in filtarData) {
            let data = newData.Campos
            let obj = {"Nombre":"", "Valor": "" ,"Operador": "=" }
            
            switch (key) {
                case "Fecha_Desde":
                    if(filtarData[key] !== ''){
                        obj.Nombre = "Fecha_inserta";
                        obj.Valor = filtarData[key]
                        obj.Operador = ">="
                        data.push(obj)
                    }
                    break;
                case "Fecha_Hasta":
                    if(filtarData[key] !== ''){
                        obj.Nombre = "Fecha_inserta";
                        obj.Valor = filtarData[key]
                        obj.Operador = "<="
                        data.push(obj)
                    }
                break;
                default:
                    if(filtarData[key] !== ''){
                        obj.Nombre = key;
                        obj.Valor = filtarData[key] === "" ? null : filtarData[key]
                        data.push(obj)
                    }
                    break;
            }
        }
        console.log(newData)
        filterOT(newData, Token)
    } 

    const filterOT = (Data, Token) =>{
        Loading(true)
        ListadoGen(Data, Token).then(res => {
            if (res.OData !== null) {
                setDataOT(res.OData)
                setLoading(false)
                Loading(false)
            }else{
                Loading(false)
            }
        }).catch(e=>{
            console.log(e)
            ErrorAlert()
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

    const newTipoOT = async (Token) =>{
        await TipoOT(Token).then(res =>{
            let data = res.OData[0].Items
            if((data !== undefined) && (data !== null)){
                setDataTipo(data)
            }
            console.log(data)
        }).catch(e => {
            console.log(e)
        })
    }

    const getEmpresa = async (Token) => {
        let Tabla ={"Tabla":"cat_empresa"}
        await ListadoGen(Tabla, Token).then(res => {
            let data = res.OData
            let formatoData = [];

            for (const key in data) {
                const obj = {Nombre: data[key].Nombre, Clave: data[key].Empresa_cod, Email: data[key].TaxId}
                formatoData.push(obj)
            }

            if((data !== undefined) && (data !== null)){
                setDataEmpresa(formatoData)
            }
        }).catch(e => {
            console.log()
        })
    }

    const tecnicoOT = async (Token) => {
        await TecnicoList('tecnico', Token).then(res => {
            let data = res.OData
            let formatoData = [];

            for (const key in data) {
                const obj = {Nombre: data[key].Nombre, Clave: data[key].Usuario_id, Email: data[key].Email}
                formatoData.push(obj)
            }

            if((data !== undefined) && (data !== null)){
                setDataTecnico(formatoData)
            }
        }).catch( e => {
            console.log(e)
        })
    }

    const cambioSubmit = (e) => {
        e.preventDefault();
        const newData = {
            "Tabla":"ot",
            "Campos":[]
        }
        let formOt =formOT.current
        setFiltarData({
            Estatus_id: "",
            Tipo_id: "",
            Fecha_Desde: "",
            Fecha_Hasta:"",
            Cliente_id:"",
            ///
            Folio: "",
            Tecnico: "",
            Empresa: ""
        })
        setVistaTipo("")
        setVistaTecnico("")
        setVistaStatus("")
        filterOT(newData, Token)
        formOt.reset()
    }

    const changeInputUser = ({target: {name, value}}) =>{
        setFiltarData({...filtarData, [name]:value})
    }

    const selectsValue = ({target: {id, value}}) => {
        // if(value !== ""){
            switch (id) {
                case "Tipo_id":
                    setVistaTipo(value)
                    setFiltarData({...filtarData, [id]:value})
                    break;
                case "Estatus_id":
                    setVistaStatus(value)
                    setFiltarData({...filtarData, [id]:value})
                    break;
                case "Tecnico":
                    setVistaTecnico(value)
                    setFiltarData({...filtarData, [id]:value})
                break;
                case "Empresa":
                    setVistaEmpresa(value)
                    setFiltarData({...filtarData, [id]:value})
                break;
                default:
                    break;
            }
        // }
    }

    const handleButtonClick = (state) => {
        let conver = parseInt(state.OrdenTrabajo_id)
        let Orden = conver
        let Estauts = state.Estatus_id
        let Tecnico = (state.Usuario_id_asignado === "") || (state.Usuario_id_asignado === null) ? "-" : state.Usuario_id_asignado
        let Tipo = state.Tipo_id        
        const url = `/OT/${Orden}/${Tipo}/${Estauts}/${Tecnico}/${Token}`
        navigate(url)
    };

    const buscarCliente = ({target: {value}}) => {
        setVistaClientes(value)
        const result = dataClientes.filter(cliente => {
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

    const itemSelect = (item,name) => {
        switch (name) {
            case "Cliente_id":
                setFiltarData({...filtarData, [name]:item.Cliente_id})
                setVistaClientes(item.Nombre)
                setMostrarValor(false)
                setFiltroMostrar([])
                break;
            default:
                break;
        }
    }

    const borrar = (valor) =>{
        switch (valor) {
            case "Cliente_id":
                setFiltarData({...filtarData, ['Cliente_id']:''})
                setMostrarValor(false)
                setVistaClientes('')
                setFiltroMostrar([])
                break;
            default:
                break;
        }
    }

    return (
        <Menu 
            menuTitle={"Ordenes de trabajo"}
            actionesHeader={
                <Link to={"/OTNuevo"}>
                    <Button
                        id={"new-OT"}
                        name={"new-OT"}
                        size={"sm"}
                        className={"btn btn-outline-primary btn-sm"}
                        Type={"button"}
                        styleButton={"Primary"}
                        textButton={"Crear Orden de Trabajo"}
                    />
                </Link>
            }
        >
            <div className='row'>
                <div className='col-12'>
                    <Card 
                        style={"cardHeaderNone"}
                        StyleBody={"p-2"}
                        Footer={
                            <>
                                <div className="row align-items-start">
                                    <div className=" col d-flex flex-row-reverse bd-highlight">
                                        <Button
                                            id={"buscar-OT"}
                                            name={"buscar-OT"}
                                            size={"sm"}
                                            className={"btn btn-outline-success btn-sm"}
                                            Type={"button"}
                                            styleButton={"Success"}
                                            textButton={"Buscar OT"}
                                            Change={formatData}
                                        />
                                        <span style={{ paddingRight:'10px' }}/>
                                        <Button
                                            id={"quitar-filtros"}
                                            name={"quitar-filtros"}
                                            size={"sm"}
                                            className={"btn btn-outline-primary btn-sm"}
                                            Type={"button"}
                                            styleButton={"Primary"}
                                            textButton={"Quitar filtros"}
                                            Change={(e)=> cambioSubmit(e)}
                                            
                                        />
                                    </div>
                                </div>
                            </>
                        }
                    >
                        <form id='formOT' ref={formOT} onSubmit={cambioSubmit}>
                            <div className='container-fluid'>
                                <div className="row align-items-start">
                                    <div className="col mb-1">
                                        <DatePicker
                                            idControl={"Fecha_Desde"}
                                            Name={"Fecha_Desde"}
                                            LabelText={"Fecha Desde"}
                                            funcPicker={changeInputUser}
                                        ></DatePicker>
                                    </div>
                                    <div className="col mb-1">
                                        <DatePicker
                                            LabelText={"Fecha Hasta"}
                                            Name={"Fecha_Hasta"}
                                            idControl={"Fecha_Hasta"}
                                            funcPicker={changeInputUser}
                                        ></DatePicker>
                                    </div>
                                    <div className="col mb-1">
                                        <Select
                                            Mag={0}
                                            MarT={0}
                                            Data={dataEstatus}
                                            optionText={"Opciones"}
                                            ForSelect={"estatus-ot"}
                                            TextLabelSelect={"Estatus"}
                                            StyleLable={"label p-0"}
                                            colInput={12}
                                            idSelect={"Estatus_id"}
                                            Vista={vistaStatus}
                                            Filter={"Clave"}
                                            Name={"Nombre"}
                                            ActionSelect={selectsValue}
                                        />
                                    </div>
                                    <div className="col mb-1">
                                        {/* <Select
                                            Mag={0}
                                            MarT={0}
                                            Data={dataClientes}
                                            optionText={"Opciones"}
                                            ForSelect={"cliente-ot"}
                                            TextLabelSelect={"Clientes"}
                                            StyleLable={"label p-0"}
                                            colInput={12}
                                            idSelect={"Cliente"}
                                            Filter={"Clave"}
                                            Name={"Nombre"}
                                            Vista={vistaClientes}
                                            ActionSelect={selectsValue}
                                        /> */}
                                        <Search
                                            SizeLG={12}
                                            SizeMD={12}
                                            SizeSM={12}
                                            // LabetStyle={"fechas-label"}
                                            Data={mostrarValor}
                                            name={"Cliente_id"}
                                            TextLabelImp={'Clientes'}
                                            Placeholder={'Ingresa Cliente'}
                                            Value={vistaClientes}
                                            FuncOnChange={buscarCliente}
                                            IconLeft={"90%"}
                                            Delete={() => borrar("Cliente_id")}
                                            disabled={dataClientes.length === 0 ? true: false}
                                        >
                                            {
                                                filtroMostrar.map((item, i) => (
                                                    <li className='lista' 
                                                        key={i}
                                                        onClick={() => itemSelect(item, "Cliente_id")}
                                                    >
                                                        {item.Nombre}
                                                    </li>
                                                ))
                                            }
                                        </Search>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col mb-1">
                                        <Forms.Input
                                            SizeLG={12}
                                            SizeSM={12}
                                            SizeMD={12}
                                            Mar={0}
                                            ForImp={"folio-inp"}
                                            TextLabelImp={"Folio"}
                                            Type={"number"}
                                            IdInp={"folio-inp"}
                                            PlaceHolder={"Ingresa folio"}
                                            StyleLable={"label p-0"}
                                            plusclassName={"input-gen"}
                                            Valueinp={filtarData.Folio}
                                            name={"Folio"}
                                            FuncInp={changeInputUser}
                                        />
                                    </div>
                                    <div className="col mb-1">
                                        <Select
                                            Mag={0}
                                            MarT={0}
                                            Data={dataTipo}
                                            optionText={"Opciones"}
                                            ForSelect={"Tipo_id"}
                                            TextLabelSelect={"Tipo"}
                                            StyleLable={"label p-0"}
                                            colInput={12}
                                            idSelect={"Tipo_id"}
                                            Vista={vistaTipo}
                                            Filter={"Clave"}
                                            Name={"Nombre"}
                                            ActionSelect={selectsValue}
                                        />
                                    </div>
                                    <div className="col mb-1">
                                        <Select
                                            Mag={0}
                                            MarT={0}
                                            Data={dataTecnico}
                                            optionText={"Opciones"}
                                            ForSelect={"Tecnico"}
                                            TextLabelSelect={"Técnico"}
                                            StyleLable={"label p-0"}
                                            colInput={12}
                                            idSelect={"Tecnico"}
                                            Vista={vistaTecnico}
                                            Filter={"Clave"}
                                            Name={"Nombre"}
                                            ActionSelect={selectsValue}
                                        />
                                    </div>
                                    <div className="col mb-1">
                                        <Select
                                            Mag={0}
                                            MarT={0}
                                            Data={dataEmpresa}
                                            optionText={"Opciones"}
                                            ForSelect={"empresa-ot"}
                                            TextLabelSelect={"Empresa"}
                                            StyleLable={"label p-0"}
                                            colInput={12}
                                            idSelect={"Empresa"}
                                            Vista={vistaEmpresa}
                                            Filter={"Clave"}
                                            Name={"Nombre"}
                                            ActionSelect={selectsValue}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
            <div className='row mb-5'>
                <div className='col-12'>
                    <div className='container-fluid'>
                        <Table
                            Data={dataOT}
                            placeholderFilter={"Buscar por numero orden "}
                            FilterProp={"Resumen"}
                            Columnas={columns}
                            Header={false}
                            HoverLine={true}
                            Pagination={true}
                            customStyles={customStyles}
                            Loading={loading}
                            AccionFila={handleButtonClick}
                        />
                    </div>
                </div>
            </div>
        </Menu>
    )
}