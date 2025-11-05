import React from 'react'
import './ParamWithIcon.css'

const ParamWithIcon = () => {
  return (
    <div>
        <dt className='paramWithIconTerm'>
            Mileage
        </dt>
        <dd data-parameter="mileage" className="paramWithIconDsc">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" className="paramIcon"><path fill="currentColor" d="M2 20.004 7.898 4h2.13L4.13 20.004H2ZM13.999 4l5.872 16.004h2.13L16.13 4h-2.131ZM11.002 8h2V6h-2v2ZM11.002 12.999h2v-3h-2v3ZM13.002 19h-2v-4h2v4Z"></path></svg>
            790 000 km
        </dd>
    </div>
  )
}

export default ParamWithIcon