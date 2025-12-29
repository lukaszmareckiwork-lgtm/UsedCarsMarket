import { useState } from 'react'
import "./HiddenString.css"

interface Props {
    text: string
    signsVisible: number
}

const HiddenString = ({ text, signsVisible }: Props) => {
    const [isShown, setIsShown] = useState<boolean>(false);

  return (
    <div className='hidden-string'>
        {isShown ? 
        (
        <div className='hidden-string-shown'>
            {text}
        </ div>
        ) : (
        <div className='hidden-string-not-shown'> 
            {text.substring(0, signsVisible)+"..."}
            <button className='hidden-string-show-button' onClick={() => setIsShown(true)}>
                SHOW
            </button>
        </ div>
        )}
    </div>
  )
}

export default HiddenString