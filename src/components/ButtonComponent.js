import React from 'react'
import "../css/style.css"
import Button from 'react-bootstrap/Button';

const ButtonComponent = ({textButton,styleButton,Type,link,size,className,id,status,Change,name,pestaña,style}) => {
    return (
        <Button
            className={className}
            disabled={status} //true, false
            href={link}
            id={id}
            name={name} 
            onClick={Change}
            size={size} //lg, sm 
            type={Type} //button,submit,reset,checkbox 
            variant={styleButton} //Primary,Secondary,Success,Warning,Danger,Info,Light,Dark,outline-primary,
            target={pestaña}
            style={style}
        >
            {textButton}
        </Button>
    )
}

export default ButtonComponent