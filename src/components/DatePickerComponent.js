import React, {useState} from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css"
import Form from 'react-bootstrap/Form';

//styles
import '../css/General.css'

const DatePickerComponent = ({className, controlId, placeholder, idControl, funcPicker,LabelText, StyleLabel,Disabled,FechaVista, TextAlign,Name}) => {

    return (
        <div>
            <div className="row">
                <div className={className}>
                    <Form.Group controlId={controlId}>
                        <Form.Label className={`label ${StyleLabel}`}>{LabelText}</Form.Label>
                        <Form.Control onChange={funcPicker} id={idControl} type="date" defaultValue={FechaVista} disabled={Disabled} name={Name} placeholder={placeholder} className='datepicker' style={{ fontSize: '13px', textAlign: TextAlign }}/>
                    </Form.Group>                               
                </div>
            </div>
        </div>                  
    )
}

export default DatePickerComponent