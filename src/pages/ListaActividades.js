import React, {useState} from 'react'
import Menu from '../components/pagesMenu'
import Forms from '../components/FormComponent'
import Table from '../components/TableComponent'
import Button from '../components/ButtonComponent'
import Modal from '../components/ModalComponent'

export const ListaActividades = () => {
    //tabla
    const [oDataActiv, setoDataActiv] = useState([])
    const [modalNuevaActiv, setModalNuevaActiv] = useState(false);
    const [actividad, setActividad] = useState({
        nombre:'',
        descripción:''
    })


    const columns = [
        {
            name : 'Columna 1',
            // selector: row => row.DocEntry,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Columna 2',
            // selector: row => row.DocEntry,
            sortable: true,
            // width: '100px',
        },
        {
            name : 'Columna 3',
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

    const ingresa = ({target:{name, value}}) => {
        setActividad({...actividad, [name]:value})
    }

    return (
        <Menu menuTitle={"Catálogo de actividades"}
            actionesHeader={
                <Button
                    id={"agregar-Ac"}
                    name={"agregar-Ac"}
                    size={"sm"}
                    className={"btn btn-outline-primary btn-sm"}
                    Type={"button"}
                    styleButton={"Primary"}
                    textButton={"Agregar Actividad"}
                    Change={() => setModalNuevaActiv(true)}
                />
            }
        >
            <div className='row'>
                <div className='col-12'>
                    <Table
                        Data={oDataActiv}
                        Columnas={columns}
                        Header={false}
                        customStyles={customStyles}
                    />
                    <Modal
                        show={modalNuevaActiv} 
                        size={"lg"}  
                        onHide={() => setModalNuevaActiv(false)}
                        fullscreen={false}
                        titlemodal={"Agregar tipo de actividad"}
                        buttons={
                            <Button
                                id={"guardar-Ac"}
                                name={"guardar-Ac"}
                                size={"sm"}
                                className={"btn btn-outline-success"}
                                Type={"button"}
                                styleButton={"Success"}
                                textButton={"Agregar Actividad"}
                                // Change={() => setModalNuevaActiv(true)}
                            />
                        }
                    >
                        <div className='col-12'>
                            <Forms.InputLin 
                                HtmlFor={"nombre-actividad"}
                                LabelText={"Nombre corto"}
                                colLabel={2}
                                colInput={10}
                                name={"nombre"}
                                Type={"text"}
                                PlaceHolder={"Ingresa Nombre"}
                                funcInp={ingresa}
                            />
                            <Forms.Textarea
                                SizeSM={12}
                                SizeMD={12}
                                SizeLG={12}
                                ForArea={"acividad-des"}
                                TextLabelTextArea={"Descripción"}
                                name={"descripción"}
                                IdTextArea={"acividad-des"}
                                Row={3}
                                FuncArea={ingresa}
                                PlaceHolder={"Ingresa Descripción"}
                            />
                        </div>
                    </Modal>
                </div>
            </div>
        </Menu>
    )
}