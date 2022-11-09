import React from 'react'

const SelectComponent = ({Mag,MarT,ActionSelect,Data,optionText,ForSelect,TextLabelSelect,Vista,Filter,Name,colLabel,colInput,StyleLable,idSelect}) => {
    return (
        //g-3
        <div className={`row mb-${Mag} mt-${MarT}`}>
            <div className={`col-${colInput}`}>
                <label htmlFor={ForSelect} className={`col-${colLabel} col-form-label ${StyleLable}`}>{TextLabelSelect}</label>
                <select aria-label="Floating label select example" className='select' id={idSelect} onChange={ActionSelect} value={Vista} /*defaultValue={Vista}*/>
                    <option value="">{optionText}</option>
                    {
                        Data.map(item =>(
                            <option 
                                key={item[Filter]} 
                                value={item[Filter]}
                                defaultValue={item[Filter] === Vista ? true : false}
                                // selected={item[Filter] === Vista ? true : false}
                            >
                                {item[Name]}
                            </option>
                        ))
                    }
                </select>
            </div>
        </div>
    )
}

export default SelectComponent