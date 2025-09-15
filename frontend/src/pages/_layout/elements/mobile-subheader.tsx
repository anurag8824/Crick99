import { isMobile } from 'react-device-detect'
const subheader = (title: string) => {
  return isMobile ? (
    <div className='game-heading'>
      <span style={{color:"white"}} className='card-header-title'>{title}</span>
    </div>
  ) : (
    ''
  )
}
const subheaderdesktop = (title: string) => {
  return !isMobile ? (
    <div style={{textAlign:"center"}} className='card-header '>
      <h4 style={{color:"white"}} className='mb-2 py-2'>{title}</h4>
    </div>
  ) : (
    ''
  )
}
export default { subheader, subheaderdesktop }
