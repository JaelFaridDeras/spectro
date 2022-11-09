import React from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css"
import Card from 'react-bootstrap/Card';
import Nav from 'react-bootstrap/Nav';

const CardsComponent = ({children ,variantNav,ancho,Titulo,subtitulo,style,ClassFooter,Footer,StyleBody, footerStyle}) => {
    return (
        <div className='container-fluid mb-4 '>
            <Card className={'shadow bg-body rounded ' + ancho}>
            <Card.Header className={style}>
                <Nav variant={variantNav} defaultActiveKey="#first" className='bg'>
                    <Card.Title>{Titulo}</Card.Title>
                </Nav>
            </Card.Header>
            <Card.Body className={StyleBody}>
                <Card.Title className={style}>{subtitulo}</Card.Title>
                    {children}
            </Card.Body>
            <Card.Footer className={`text-muted ${ClassFooter} bg-transparent ${footerStyle}`}>{Footer}</Card.Footer>
        </Card>
    </div>
    )
}

export default CardsComponent