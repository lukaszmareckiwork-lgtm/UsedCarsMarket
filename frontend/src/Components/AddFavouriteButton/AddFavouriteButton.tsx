import React from 'react'
import './AddFavouriteButton.css'

const AddFavouriteButton = () => {
  return (
    <button aria-label='Dodaj do obserwowanych' tabIndex={0} className='addFavouriteButton' type='button' data-button-variant='flat' onClick={() => console.log("Asd")}>
        <div className='n-button-svg-wrapper n-button-svg-wrapper-pre' aria-hidden='true'>
            <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' fill='none' viewBox='0 0 24 24' className='addFavouriteIcon'>
                <path fill='currentColor' fillRule='evenodd' d='M20.219 10.367 12 20.419 3.806 10.4A3.96 3.96 0 0 1 3 8c0-2.206 1.795-4 4-4a4.004 4.004 0 0 1 3.868 3h2.264A4.003 4.003 0 0 1 17 4c2.206 0 4 1.794 4 4 0 .868-.279 1.698-.781 2.367ZM17 2a5.999 5.999 0 0 0-5 2.686A5.999 5.999 0 0 0 7 2C3.692 2 1 4.691 1 8a5.97 5.97 0 0 0 1.232 3.633L10.71 22h2.582l8.501-10.399A5.943 5.943 0 0 0 23 8c0-3.309-2.692-6-6-6Z' clipRule='evenodd'>
                </path>
            </svg>
        </div>
        <span className='n-button-text-wrapper'></span>
    </button>
  )
}

export default AddFavouriteButton