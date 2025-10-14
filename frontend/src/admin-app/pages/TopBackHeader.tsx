import React from 'react'
import { useNavigate } from 'react-router-dom'

interface TopBackHeaderProps {
  name: string
}

const TopBackHeader: React.FC<TopBackHeaderProps> = ({ name }) => {
  const navigate = useNavigate()

  return (
    <div
      style={{ background: '#0f2327' }}
      className="bg-grey mb-2 flex items-center justify-between px-5 py-3 gx-bg-flex"
    >
      <span className="text-2xl font-weight-normal text-white gx-align-items-center gx-pt-1 gx-text-capitalize">
        {name}
      </span>
      <button
        onClick={() => navigate(-1)}
        type="button"
        className="btn bg-primary text-white"
      >
        <span>Back</span>
      </button>
    </div>
  )
}

export default TopBackHeader
