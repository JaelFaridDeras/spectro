import React from 'react'
import Form from 'react-bootstrap/Form';
import "bootstrap/dist/css/bootstrap.min.css";

function SwitchComponent(idCheck, labelText, nombre) {
    return (
        <Form>
            <Form.Check 
                type="switch"
                name={nombre}
                id={idCheck}
                label={labelText}
            />
        </Form>
    )
}

export default SwitchComponent

