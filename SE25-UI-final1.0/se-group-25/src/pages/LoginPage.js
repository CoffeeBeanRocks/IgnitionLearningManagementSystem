import React, {useState, useContext} from 'react'
import Login from '../components/Login';
import Register from '../components/Register';
import ThemeContext from '../context/ThemeContext';
import LoginFormContext from '../context/Login-Form-Context';
import Loading from '../components/Loading';
import Success from '../components/Success';

function LoginPage({users,setLoggedInUser}) {
    const {formType, setFormType} = useContext(LoginFormContext);
    const {theme} = useContext(ThemeContext)   
    const [isLoading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)

  return (
    <div className='login-container'>
        {isLoading ? <Loading />
        :
        success=== null ?
        
        <div className={`${formType}-component`}>
            {isLoading ? <div className='loader'> <Loading /> </div>:
            <div className='login-wrapper'>
                <div className={`select-sign select-sign-${theme}`}>
                    <button name = "sign-in" onClick={(e) => setFormType(e.target.name)} className={formType === "sign-in" ? "sign-in-active":"sign-in"}>Sign In</button>
                    <div></div>
                    <button name ="sign-up" onClick={(e) => setFormType(e.target.name)} className={formType === "sign-up" ? "sign-up-active":"sign-up"}> Sign Up </button>
                </div>
                <div className={`login-form login-form-${theme}`}>
                    <div className='form-type'>
                        {formType === "sign-in" ? <Login setLoggedInUser={setLoggedInUser} setLoading={setLoading} setSuccess={setSuccess}/> : <Register users={users} setLoading={setLoading} setSuccess={setSuccess}/>}
                    </div>
                </div>
            </div>}
        </div>
        : <Success success={success} />}
    </div>
  )
}

export default LoginPage