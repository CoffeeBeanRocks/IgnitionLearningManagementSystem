import React from 'react'
import './styles/success.css'

const Success = ({success}) => {
  return (
    <div className='success-error-container'>
        {success?
        <div className='success-box'>
          <div class="success-animation">
            <svg class="checkmark addClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="checkmark__circle addClass" cx="26" cy="26" r="25" fill="none"/><path class="checkmark__check addClass" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg>
          </div>
        </div>
        : 
        <div className='error-box'>
          <div class="error-animation">
          <svg class="crossmark addClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="crossmark__circle addClass" cx="26" cy="26" r="25" fill="none"/>
            <path class="cross__path cross__path--right addClass" fill="none" d="M16,16 l20,20" />
              <path class="cross__path cross__path--left addClass" fill="none" d="M16,36 l20,-20" />
            </svg>
          </div>
        </div>}
    </div>
  )
}

export default Success