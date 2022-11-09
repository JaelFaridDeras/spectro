import { React, useState, useEffect } from 'react';
import CardsComponent from '../components/CardsComponent';
import { Link } from "react-router-dom";
import { FiFilePlus, FiList, FiClipboard } from "react-icons/fi";
import Modal from '../components/ModalComponent'
import Button from '../components/ButtonComponent'
import { getEmpresa, getCurrentUser } from '../components/ProtectedRouter'
import Select from '../components/SelectComponent'
import { ListadoGen } from '../service/catalogos/Catalogos.service'

//
import Menu from '../components/pagesMenu'

export const Home = () => {
    //modal
    const [modalEmpresa, setModalEmpresa] = useState(false)
    const [dataEmpresa, setDataEmpresa] = useState([])
    const [vistaEmpresa, setVistaEmpresa] = useState("")
    const [btnActivo, setBtnActivo] = useState(true)

    useEffect(() => {
        let Empresa = getEmpresa()
        const user = getCurrentUser();
    
        if (Empresa.empresa === "") {
            getEmpresas(user.Code)
            setModalEmpresa(true)
        }
    }, [])
    
    const getEmpresas = async (Token) => {
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

    const selectsValue = ({target: {id, value}}) => {
        switch (id) {
            case "Empresa":
                if (value !== '') {
                    setVistaEmpresa(value)
                    setBtnActivo(false)
                }
            break;
        }
    }

    const guardarEmpresa = () => {
        const data = {
            'empresa': vistaEmpresa
        }

        if (vistaEmpresa !== '') {
            sessionStorage.setItem("empresa", JSON.stringify(data));
            setModalEmpresa(false)
        }

    }

    return (
        <>
            <Menu menuTitle={"Menu"}/>
            <div className="row align-items-center mt-4">
                <div className="col">
                    <Link to={"/OTLists"} className="link-card">
                        <CardsComponent className='col' style={"cardHeaderNone"} footerStyle={"cardHeaderNone"}>
                            <div className="row align-items-center p-3 px-2">
                                <div className="col-4">
                                    <FiList className='sicon'/>
                                </div>
                                <div className="col-8 text-center">
                                    <p className="h5">Listado de OT</p>
                                </div>
                            </div>
                        </CardsComponent>
                    </Link>    
                </div>
                <div className="col">
                    <Link to={"/OTNuevo"} className="link-card">
                        <CardsComponent className='col' style={"cardHeaderNone"} footerStyle={"cardHeaderNone"}>
                            <div className="row align-items-center p-3 px-2">
                                <div className="col-4 align-content-center">
                                    <FiFilePlus className='sicon'/>
                                </div>
                                <div className="col-8 text-center">
                                    <p className="h5">Agregar OT</p>
                                </div>
                            </div>
                        </CardsComponent>
                    </Link> 
                </div>
                {/* <div className="col">
                    <Link to={"/ActividadesLista"} className="link-card">
                        <CardsComponent className='col' style={"cardHeaderNone"} footerStyle={"cardHeaderNone"}>
                            <div className="row align-items-center p-3 px-2">
                                <div className="col-3">
                                    <FiClipboard className='sicon'/>
                                </div>
                                <div className="col-9 text-end">
                                    <p className="h5">Tipos de Trabajo</p>
                                </div>
                            </div>
                        </CardsComponent>
                    </Link> 
                </div> */}
            </div>
            <Modal 
                    show={modalEmpresa}  
                    onHide={() => setModalEmpresa(false)}
                    size={"sm"}  
                    titlemodal={"Empresa"}
                    stylebodybard={"container-fluid mt-0 pt-0 pe-0"}
                    buttons={
                            <>
                                <div>
                                    <Button
                                        styleButton={"btn btn-outline-success"}
                                        Change={guardarEmpresa}
                                        status={btnActivo}
                                        Type={"button"}
                                        size={'sm'}
                                        textButton={"Guardar"}
                                    >
                                    </Button>
                                </div>
                            </>
                            }
                    btn={"sm"}
                >
                    <Select
                        Mag={0}
                        MarT={0}
                        Data={dataEmpresa}
                        optionText={"Seleccione opción"}
                        ForSelect={"empresa-ot"}
                        TextLabelSelect={"Empresa"}
                        StyleLable={"label p-0 cardHeaderNone"}
                        colInput={'12 ps-0'}
                        idSelect={"Empresa"}
                        Vista={vistaEmpresa}
                        Filter={"Clave"}
                        Name={"Nombre"}
                        ActionSelect={selectsValue}
                    />
                </Modal>
        </>
        
    )
}