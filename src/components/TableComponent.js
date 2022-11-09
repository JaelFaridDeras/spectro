import React from 'react'
import DataTable from 'react-data-table-component';
import 'styled-components';
import FilterComponent from './FilterComponent'
import { FiAlertTriangle } from "react-icons/fi";

//cuando salga el error: Uncaught TypeError: Data.filter is not a function,
//revisar que el estdo SEA UN ARRAY: const [otVentas, setOtVentas] = useState([])
const TableComponent = ({Data, Columnas, Altura, AccionFila, placeholderFilter, FilterProp, TitleTable, Loading,HoverLine,rowStyles, Pagination, Header,customStyles,Expande, FuctionData}) => {

    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    const FiltroTabla = (item)  => {
        let ColumnasBus=FilterProp
        if (FilterProp == "" || FilterProp == null || FilterProp == undefined){
            ColumnasBus = '';
            for(let d in item)
                ColumnasBus+=d+','	
        }	
        // console.log(ColumnasBus)
        if (ColumnasBus.includes(',')){
            let cols = ColumnasBus.split(',');
            for(let d in cols){
                if (item[cols[d]] && item[cols[d]].toString().toLowerCase().includes(filterText.toLocaleLowerCase()))
                    return true;		
            }
            return false;
        }else
        {
            return item[FilterProp] && item[FilterProp].toString().toLowerCase().includes(filterText.toLocaleLowerCase());
        }
    }
    
    const filteredItems  = Data.filter(FiltroTabla)

    const subHeaderComponent = React.useMemo(() =>{
        const handleClear = () => {
            if(filterText){
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        }

        return (
            //Funcionalidad del input de busqueda
            <FilterComponent 
                onFilter={ e => setFilterText(e.target.value)} 
                onClear={handleClear} 
                filterText={filterText} 
                placeholder={placeholderFilter} 
                TitleTable={TitleTable}
            />
        );
    }, [filterText, resetPaginationToggle])

    const Carga = () => {
        return(
            <div className='row mt-2 mb-2'>
                <div className='col text-center mt-2 mb-2'>
                    <p className="h2">Cargando...</p>
                </div>
            </div>
        )
    }

    const NoDatos = () => {
        return(
            <div className='row mt-2 mb-2'>
                <div className='col text-center mt-2 mb-2'>
                    <p className="h5">No hay datos para mostrar <FiAlertTriangle style={{ color:'#ffc107'}}/></p>
                </div>
            </div>
        )
    }

    const ExpandedComponent = ( {data:{Maquinas}} ) => {
        return(
            <div className='col-2' style={{ marginLeft: '47px' }}>
                <ol className="list-group list-group">
                    
                    {
                        Maquinas.length > 1 && (
                            Maquinas.map((item, index )=> (
                                <li className="list-group-item d-flex justify-content-between align-items-start py-1" style={{ borderBottom: '1px solid #e0e0e0' }} key={index}>
                                    <div className="ms-2 me-auto">
                                        <div style={{ fontSize: '12px'}}>{item.U_Maquina}</div>
                                        {/* Content for list item */}
                                    </div>
                                    <span className="badge bg-primary rounded-pill" style={{ fontSize: '12px', fontWeight: '0px'}}>{item.U_Qty}</span>
                                </li>
                            ))
                        )
                    }
                </ol>
            </div>
        )
    }

    return (
        <div className='row'>
            <div className='col'>
                <div className="card">
                    <div className='card-body'>
                        <DataTable
                            columns={Columnas}
                            data={filteredItems}
                            pagination={Pagination === undefined ? true : Pagination}
                            highlightOnHover
                            pointerOnHover={HoverLine === undefined ? true : HoverLine}
                            fixedHeader
                            noDataComponent={<NoDatos/>}
                            progressComponent={<Carga/>}
                            fixedHeaderScrollHeight={Altura}
                            onRowClicked={AccionFila}
                            persistTableHead
                            paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                            subHeader={Header === undefined ? true : Header}
                            subHeaderComponent={subHeaderComponent}
                            conditionalRowStyles={rowStyles}
                            customStyles={customStyles}
                            progressPending={Loading}
                            expandableRows={Expande === undefined ? false : Expande}
                            expandableRowsComponent={ExpandedComponent}
                            expandableRowDisabled={row => row.disabled}
                            onChangePage={FuctionData}
                        >
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableComponent;