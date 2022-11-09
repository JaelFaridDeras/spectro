import React from 'react'
import { FaSearch, FaPlus } from 'react-icons/fa';
import '../css/Search.css'
import '../css/General.css'

/* EJEMPLO DE USO 
    <SearchNew
        SizeLG={6}
        SizeMD={6}
        SizeSM={12}
        Placeholder={'Buscar parametro'}
        Data={busqueda}
        Value={busca}
        FuncOnChange={handleInputChange}
        IconLeft={"94%"}
        Delete={() => borrar()}
    >
        {
            busqueda.map(item =>(
                <li className='lista' 
                    key={item.Parametro_clave}
                    onClick={() => itemSelect(item)}
                >
                    {item.Descripcion}
                </li>
            ))
        }
    </SearchNew>
*/

const searchComponent = (props) => {
    return (
        <div className={`col-sm-${props.SizeSM} col-md-${props.SizeMD} col-lg-${props.SizeLG} wrapper`}>
            <label htmlFor={props.ForImp} className={`form-label label ${props.LabetStyle}`}>{props.TextLabelImp}</label>
            <div className={props.Data === true ?'search-input active' :'search-input' }>
                <input 
                    type="text" 
                    id='busca' 
                    placeholder={props.Placeholder} 
                    name={props.name} 
                    value={props.Value} 
                    onChange={props.FuncOnChange}
                    onKeyUp={props.onKeyUp}
                    onKeyDown={props.onKeyDown}
                    disabled={props.disabled}
                    autoComplete="off"
                />
                <div className='autocom-box'>
                    {
                        props.children
                    }
                </div>
                <FaSearch id='icon' className={props.Value === "" ? '' : "none"} style={{ left: `${props.IconLeft}` }}/>
                <FaPlus id='delete' className={props.Value !== "" ? "noneDelete" :'hidenDelete'} onClick={props.Delete} style={{ left: `${props.IconLeft}` }}/>
            </div>
        </div>
    )
}

export default searchComponent