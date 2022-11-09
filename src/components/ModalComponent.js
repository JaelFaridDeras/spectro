import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import { BsXLg } from "react-icons/bs";
/* Como llamar el componente 

    import Modal from 'Ruta';

    generas un estado por cada modal
    const [modalShow, setModalShow] = useState(false);

    Creas un boton por cada modal 
        <button variant="primary" onClick={() => setModalShow(true)}>
            Modal 1
        </button>

    Modal con sus propiedades
    <Modal 
        show={modalShow} 
        size={"lg"}  
        onHide={() => setModalShow(false)}
        fullscreen={false}
        titlemodal={"Prueba"}
    >
        ---Contenido---
        
    </Modal>
*/

const ModalComponent = (props) => {
    return (
        <Modal 
            {...props} 
            aria-labelledby="contained-modal-title-vcenter"
            size={props.size && props.size}
            fullscreen={props.fullscreen && (props.fullscreen)}
            scrollable={props.scrollable && (props.scrollable)}
            centered
            className={props.stylemodal}
            backdropClassName={props.backdrop}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" >
                    {props.titlemodal !== undefined ? props.titlemodal : "Ingresa texto del titulo"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`${props.stylebodybard}`}>
                    {/* <Row> */}
                        {props.children && (props.children)}
                    {/* </Row> */}
                </div>
            </Modal.Body>
        <Modal.Footer className='px-3 py-2' >
            {props.buttons}
            {
                props.btn === undefined && (
                    <Button onClick={props.onHide} variant="outline-danger" size="sm">Cerrar <BsXLg/></Button>
                )
            }
            
        </Modal.Footer>
    </Modal>
    )
}

export default ModalComponent