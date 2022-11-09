import React from "react";
import "../css/TableComponent.css"

const FilterComponent = ({ filterText, onFilter, onClear, placeholder, TitleTable }) => (
    <>
    <div className="container titleTable" >
        <div className="row">
            <div className="col-8 align-self-start titleTable">
                <h3>{TitleTable}</h3> 
            </div>
            <div className="col align-self-end">
                <div className="input-group mb-3">
                <input  type="text" 
                        className="form-control" 
                        placeholder={placeholder} 
                        aria-label="Example text with button addon" 
                        aria-describedby="button-addon1"
                        value={filterText}
                        onChange={onFilter}
                        />
                <button 
                    className="btn btn-danger" 
                    type="button" 
                    id="button-addon1"
                    onClick={onClear}
                    >X</button>
                </div>
            </div>
        </div>
    </div>
    </>
);

export default FilterComponent;