import React,{useEffect,useState} from 'react'
import {Routes, Route, Link} from 'react-router-dom'
import {ProtectedRouter, getCurrentUser, logout, getMenu } from './components/ProtectedRouter'
import { EstatusOrden } from './pages/EstatusOrden'
import { EstatusOTFinal } from './pages/EstatusOTFinal'
import { Home } from './pages/Home'
import { ListaActividades } from './pages/ListaActividades'
import { Login } from './pages/Login'
import { OrdenesTrabajo } from './pages/OrdenesTrabajo'
import { OrdenTrabajo } from './pages/OrdenTrabajo'
import { Tareas } from './pages/Tareas'
import { TareasTipo } from './pages/TareasTipo'
import { AuthProvider } from './context/authContext'

//
import Nav from "react-bootstrap/Nav";
import Collapse from 'react-bootstrap/Collapse';
import { FaAngleDown,FaRegFileAlt,FaPlus,FaList,FaPaintBrush,FaRegCalendarCheck,FaRegClipboard,FaWindowRestore} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BsCircleFill } from 'react-icons/bs';
import ViewOT from './pages/ViewOT'

const EventBus = require('js-event-bus')();

const App = () => {
    const [currentUser, setCurrentUser] = useState(undefined)
    const [open, setOpen] = useState(false);
    const [openTT, setopenTT] = useState(false);
    const [openAdmin, setopenAdmin] = useState(false);
    const [active, setActive] = useState("");

    const logOut = () => {
        logout()
        setCurrentUser(undefined);
    }

    useEffect(()=>{
        const user = getCurrentUser()
        const Menu = getMenu()

        if (user !== null) {
            console.log("Desde el app: ",user)
            setCurrentUser(user)
        }

        if (Menu !== '') {
            changeMenu(Menu)
        }

        EventBus.on("logout", () => {
            logOut();
        });
        EventBus.on("logout", () => {
            logOut();
        });
    },[])

    const changeMenu = (e) => {
        let optionMenu = e

        const data = {
            'menu': e
        }

        if (e !== '') {
            sessionStorage.setItem("menu", JSON.stringify(data));
        }

        switch (optionMenu) {
            case "listado-OT":
                setActive("listado-OT")
                setOpen(true)
                setopenAdmin(false)
                break;
            case "agregar-OT":
                setActive("agregar-OT")
                setOpen(true)
                setopenAdmin(false)
                break;
            case "listado-trabajo":
                setActive("listado-trabajo")
                setopenTT(true)
                setopenAdmin(false)
                break;
            case "agregar-trabajo":
                setActive("agregar-trabajo")
                setopenTT(true)
                break;
            case "estatus-OT":
                setActive("estatus-OT")
                setopenTT(false)
                setOpen(false)
                setopenAdmin(true)
                break
            case "estatus-OT-final":
                setActive("estatus-OT-final")
                setopenTT(false)
                setOpen(false)
                setopenAdmin(true)
                break
            case "tipo-de-tareas":
                setActive("tipo-de-tareas")
                setopenTT(false)
                setOpen(false)
                setopenAdmin(true)
                break
            case "tareas":
                setActive("tareas")
                setopenTT(false)
                setOpen(false)
                setopenAdmin(true)
                break
            default:
                setActive("")
                setOpen(true)
                setopenAdmin(false)
                break;
        }
    }   

    return (
        <>
        {currentUser !== undefined ? (
            <>
            <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 pb-2 shadow">
                <Link to={"/"} className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" onClick={() => changeMenu('')}>
                    <div className='navbar-nav'>
                        <img id='img-nav' src='https://crm.spectro.mx/qas/Content/images/logo.png'/>
                    </div>
                </Link>
                <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                    <div className="navbar-nav">
                        <div className="d-flex align-items-center">
                                <NavDropdown
                                    id="nav-dropdown-dark-example"
                                    title={<><BsCircleFill className='login'/>{currentUser.OData.Usuario_id}</>}
                                    menuVariant="dark"
                                    align="start"
                                >
                                    <Nav.Link to={"/"} onClick={logOut} style={{ textDecoration:'none' }}>
                                        <div className='item-dow'>
                                            <span className='text'>
                                                Cerrar sesión 
                                                <MdLogout className="icon-log"/> 
                                            </span>
                                        </div>
                                    </Nav.Link>
                                </NavDropdown>
                                <Nav.Link style={{ color:'black' , padding:'0px'}}>
                                    <img
                                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                                        alt="profile-img"
                                        className="profile-img-navd"
                                    />
                                </Nav.Link>
                            <div >
                        </div>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <div className="row">
                    <nav id="sidebarMenu" className="col-md-3 col-lg-3 d-md-block bg-light sidebar collapse min-vh-100">
                        <div className="position-sticky pt-3 sidebar-sticky">
                            <ol className="list-group list-group-flush nav">
                                <li className="list-group-item d-flex justify-content-between align-items-start prueba" onClick={() => setOpen(!open)}>
                                    <span className='icon' ><FaRegFileAlt/></span>
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold mt-1"> Ordenes de trabajo</div>
                                    </div>
                                    <span className='flecha'><FaAngleDown/></span>
                                </li>
                                <Collapse in={open} >
                                    <ul className="linea ps-5 mb-2">
                                        <li className="item" onClick={() => changeMenu("listado-OT")}>
                                            <Link to={"/OTLists"}  className={active === "listado-OT" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaList/>
                                                </span>
                                                <span className="titleNav">Listado de OT</span>
                                            </Link>
                                        </li>
                                        <li className="item" onClick={() => changeMenu("agregar-OT")}>
                                            <Link to={"/OTNuevo"}  className={active === "agregar-OT" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaPlus/>
                                                </span>
                                                <span className="titleNav">Agregar OT</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Collapse> 
                                {/* <li className="list-group-item d-flex justify-content-between align-items-start prueba" onClick={() => setopenTT(!openTT)}>
                                    <span className='icon' ><FaRegFileAlt/></span>
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold mt-1">Tipos de trabajo</div>
                                    </div>
                                    <span className='flecha'><FaAngleDown/></span>
                                </li> */}
                                {/* <Collapse in={openTT} >
                                    <ul className="linea ps-5 mb-2">
                                        <li className="item" onClick={() => changeMenu("listado-trabajo")}>
                                            <Link to={"/ActividadesLista"}  className={active === "listado-trabajo" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaList/>
                                                </span>
                                                <span className="titleNav">Listado de Trabajo</span>
                                            </Link>
                                        </li>
                                        <li className="item" onClick={() => changeMenu()}>
                                            <Link to={"#"}  className="navLink">
                                                <span className="icon">
                                                    <FaPlus/>
                                                </span>
                                                <span className="titleNav" id="agregar-trabajo">Agregar Trabajo</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Collapse> */}
                            </ol>
                            <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase" style={{ cursor: 'pointer' }} onClick={() => setopenAdmin(!openAdmin)}>
                                <span>Menu de Administrador</span>
                                {/* <a className="link-secondary" href="#" aria-label="Add a new report">
                                
                                </a> */}
                            </h6>
                            <ul className="nav flex-column mb-2">
                                <Collapse in={openAdmin} >
                                    
                                    <ul className="linea ps-5 mb-2">
                                        <li className="item" onClick={() => changeMenu("estatus-OT")}>
                                            <Link to={"/EstatusOT"}  className={active === "estatus-OT" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaPaintBrush/>
                                                </span>
                                                <span className="titleNav">Estatus OT</span>
                                            </Link>
                                        </li>
                                        <li className="item" onClick={() => changeMenu("estatus-OT-final")}>
                                            <Link to={"/EstatusOTFinal"}  className={active === "estatus-OT-final" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaRegCalendarCheck/>
                                                </span>
                                                <span className="titleNav">Estatus OT Final</span>
                                            </Link>
                                        </li>
                                        <li className="item" onClick={() => changeMenu("tipo-de-tareas")}>
                                            <Link to={"/TareasTipo"}  className={active === "tipo-de-tareas" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaRegClipboard/>
                                                </span>
                                                <span className="titleNav">Tipo de Tareas</span>
                                            </Link>
                                        </li>
                                        <li className="item" onClick={() => changeMenu("tareas")}>
                                            <Link to={"/Tareas"}  className={active === "tareas" ? "navLink active-lat":"navLink"}>
                                                <span className="icon">
                                                    <FaWindowRestore/>
                                                </span>
                                                <span className="titleNav">Tareas</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </Collapse>
                            </ul>
                        </div>
                    </nav>
                    <main className="col-md-9 ms-sm-auto col-lg-9 ">
                        <div className="chartjs-size-monitor">
                            <div className="chartjs-size-monitor-expand">
                            </div>
                        </div>
                        <AuthProvider>
                            <Routes>
                                <Route path='/Menu' element={<ProtectedRouter><Home/></ProtectedRouter> }/>
                                <Route path='/OTLists' element={<ProtectedRouter><OrdenesTrabajo/> </ProtectedRouter>}/>
                                <Route path='/OTNuevo' element={ <ProtectedRouter><OrdenTrabajo/></ProtectedRouter>}/>
                                <Route path='/OT/:Id/:Tipo/:Estatus/:Tecnico/:Token' element={ <ProtectedRouter><ViewOT/></ProtectedRouter>}/>
                                <Route path='/ActividadesLista' element={ <ProtectedRouter><ListaActividades/></ProtectedRouter>}/>
                                <Route path='/EstatusOT' element={ <ProtectedRouter><EstatusOrden/></ProtectedRouter>}/>
                                <Route path='/EstatusOTFinal' element={ <ProtectedRouter><EstatusOTFinal/></ProtectedRouter>}/>
                                <Route path='/TareasTipo' element={ <ProtectedRouter><TareasTipo/></ProtectedRouter>}/>
                                <Route path='/Tareas' element={<ProtectedRouter><Tareas/></ProtectedRouter>} />
                                <Route path="*" element={<ProtectedRouter><Home /></ProtectedRouter>} />
                            </Routes>
                        </AuthProvider>
                    </main>
                </div>
            </div>
        </>
        ):(
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path="*" element={<Login />} />
                </Routes>
            </AuthProvider>
        )}
    </>
    )
}

export default App
