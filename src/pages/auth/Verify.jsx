import React, { useState } from 'react'
import "./auth.css"
import { Link, useNavigate } from 'react-router-dom'
import { useUserData } from '../../contexts/UserContexts'

const Verify = () => {
  const [otp, setotp] = useState("")
  const {btnLoading, verifyOtp} = useUserData()
  const navigate = useNavigate()

  const submitHandler = async(e) => {
    e.preventDefault()
    await verifyOtp(Number(otp), navigate)
  }
  return (
    <div className="auth-page">
        <div className="auth-form">
            <h2>Verify Account</h2>
            <form onSubmit={submitHandler}>
                <label htmlFor="otp">OTP</label>
                <input type='number'
                value={otp}
                onChange={(e) => setotp(e.target.value)}
                required></input>

                <button disabled={btnLoading} type='submit' className='common-btn'>
                  {
                    btnLoading ? "Please Wait" : "Verify"
                  }
                </button>
            </form>

            <p>Go to <Link to='/login'>Login</Link> page</p>
        </div>
    </div>
  )
}

export default Verify