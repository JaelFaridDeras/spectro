import React from 'react'

const pagesMenu = ({menuTitle, children, actionesHeader}) => {
    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">{menuTitle}</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        {/* <button type="button" className="btn btn-sm btn-outline-secondary">prueba</button>
                        <button type="button" className="btn btn-sm btn-outline-secondary">prueba</button> */}
                        {actionesHeader}
                    </div>
                    {/* <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                    prueba
                    </button> */}
                </div>
            </div>
            <div className='container-fluid p-0 m-0'>
                {children}
            </div>
        </>

    )
}

export default pagesMenu