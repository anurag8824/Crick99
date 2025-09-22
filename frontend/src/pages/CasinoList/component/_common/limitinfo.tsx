import React from "react"

const LimitInfo = (props:any) => {
    const { nameString, min, max, clsName} = props;
    const clsNameFinal = clsName?'text-right':'tx-left';
    return <div className={`info-block ${clsNameFinal}`}>
    <a
      href=''
      data-toggle='collapse'
      data-target={`#min-max-info${nameString.replace(' ', '')}`}
      aria-expanded='false'
      className='info-icon collapsed'
    >
      {/* <i className='fas fa-info-circle m-l-10'></i> */}
    </a>
    <div  className='min-max-infoj '>
      <span className='m-r-5 d-none'>
        <b>Min:</b>
        {min}
      </span>{' '}
      <span style={{fontSize:"12px"}} className='m-r-5 text-danger'>
        <span >Max:</span>
        {/* {max} */}
        50000
      </span>
    </div>
  </div>
}
export default React.memo(LimitInfo)
