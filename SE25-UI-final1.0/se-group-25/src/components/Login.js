import React,{useState, useContext} from 'react'
import './styles/login.css'
import ResetPassword from './ResetPassword';
import LoopRoundedIcon from '@mui/icons-material/LoopRounded';
import { useDispatch } from 'react-redux';
import GoogleIcon from '@mui/icons-material/Google';
import { useNavigate } from 'react-router-dom';
import ThemeContext from '../context/ThemeContext';
import axios from 'axios';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import BASE_URL from '../shared/baseURL';
import { GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Login({setLoggedInUser,setLoading,setSuccess}) {
    const [togglePass, setTogglePass] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [resetPassword, setResetPassword] = useState(false);
    const {theme} = useContext(ThemeContext)
    const navigate = useNavigate()
    const errors = {
        email: "Invalid username",
        pass: "Invalid password"
    };
    
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>);

    function clear_inputs () {
        setEmail("");
        setPass("");
    }

   const dispatch = useDispatch()

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true)
        axios.post(`${BASE_URL}/api/users/login`, 
        {
          email: email, 
          password: pass
        }).then((response) => {
            setErrorMessages({});
            const data = response.data.user;
            const payload = {email:data.email,fname:data.fname,lname:data.lname,type:data.type}
            dispatch({
                type: 'LOGIN',
                payload
            })
            setLoading(false)
            setSuccess(true)
            setTimeout (() => {
                setSuccess(null)
                setLoggedInUser(payload)
                localStorage.setItem('jsonwebtoken',JSON.stringify(payload))
                navigate(payload?.type === 'Admin'?'/admindashboard':'/dashboard')
            },2000)
        }, (error) => {
            if(error.response.data.message === "Invalid Password")
            {
                setErrorMessages({ name: "pass", message: error.response.data.message });
                setLoading(false)
            }
            else if(error.response.data.message === "Email Not Found")
            {
                setErrorMessages({ name: "email", message: error.response.data.message });
                setLoading(false)
            }
            else
            {
                setErrorMessages({});
                console.log(error);
                setLoading(false)
            }
        });
    };

    const handlePasswordReset = ()=>{
        setResetPassword(true);
    }
    
    const handleGoogleOAuth = (data) => {
        setLoading(true)
        axios.post(`${BASE_URL}/api/users/login`, 
        {
          email: data.email, 
          password: 'GooglePassword'
        }).then((response) => {
            setErrorMessages({});
            const data = response.data.user;
            const payload = {email:data.email, fname:data.given_name, lname:data.family_name, type:'Unapproved'}
            dispatch({
                type: 'LOGIN',
                payload
            })
            setLoading(false)
            setSuccess(true)
            setTimeout (() => {
                setSuccess(null)
                setLoggedInUser(payload)
                localStorage.setItem('jsonwebtoken',JSON.stringify(payload))
                navigate(payload?.type === 'Admin'?'/admindashboard':'/dashboard')
            },2000)
        }, (error) => {
            if(error.response.data.message === "Invalid Password")
            {
                setErrorMessages({ name: "pass", message: error.response.data.message });
                setLoading(false)
            }
            else if(error.response.data.message === "Email Not Found")
            {
                setErrorMessages({ name: "email", message: error.response.data.message });
                setLoading(false)
            }
            else
            {
                setErrorMessages({});
                console.log(error);
                setLoading(false)
            }
        });
    }

    return (
        <div>
        {resetPassword ? 
            <ResetPassword setResetPassword={setResetPassword} theme={theme}/>
            : 
            <div className="form-wrapper">
            <form className='form' onSubmit={handleSubmit}>
                <div className="input-container">
                    <label>Email </label>
                    <input type="email" name="email" value={email} required onChange={(e)=>setEmail(e.target.value)}/>
                    {renderErrorMessage("email")}
                </div>
                <div className="input-container">
                    <label>Password </label>
                    <div className='password-bar'>
                        <input type={togglePass?'text':'password'} name="pass" value={pass} onChange = {(e)=>setPass(e.target.value)} required/>
                        <div className={`show-pass-${theme}`} onClick={() => setTogglePass(!togglePass)}>{togglePass?<VisibilityOffRoundedIcon/>:<VisibilityRoundedIcon/>}</div>
                    </div>
                    {renderErrorMessage("pass")}
                </div>
                <div className='button-container'>
                    <button className= "btn-red" type='submit'>Log In</button>
                    <GoogleLogin
                        theme={theme === 'light' ? 'outline':'filled_black'}
                        onSuccess={response => {
                            var userObject = jwtDecode(response.credential);
                            handleGoogleOAuth(userObject);
                        }}
                        onError={() => {
                            console.log('Login Failed!');
                        }}
                    />
                </div>
            </form>
            <div className='reset-password-container'>
                    <button className='reset-password-btn' onClick={handlePasswordReset}>
                        <LoopRoundedIcon style ={{color: "#FF472F"}}/>Reset Password
                    </button>
                </div>
        </div>}
        </div>
    )
}
export default Login