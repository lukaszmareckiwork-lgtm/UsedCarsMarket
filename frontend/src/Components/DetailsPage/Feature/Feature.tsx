import "./Feature.css"
import { FaCheck } from 'react-icons/fa'

interface Props {
    label: string
}

const Feature = ({ label }: Props) => {
  return (
    <div className='feature'>
        <span className='feature-label'>{label}</span>
        <span className='feature-tick'><FaCheck size={18} /></span>
    </div>
  )
}

export default Feature