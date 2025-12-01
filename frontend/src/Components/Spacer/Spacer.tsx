import "./Spacer.css"

interface Props {
    size: number
}

const Spacer = ({ size }: Props) => {
  return (
    <div className='spacer' style={ {height: size} }></div>
  )
}

export default Spacer