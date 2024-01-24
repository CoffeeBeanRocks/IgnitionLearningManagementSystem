import React, {useContext, useState} from 'react'
import {useDispatch} from 'react-redux'
import Google from '@mui/icons-material/Google';
import ThemeContext from '../context/ThemeContext';
import { GoogleLogin} from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function Register({users,setLoading,setSuccess}) {
    const [errorMessages, setErrorMessages] = useState({});
    const [fname,setFname] = useState("");
    const [lname,setLname] = useState("");
    const [email,setEmail] = useState("");
    const [pass,setPass] = useState("");
    const [repass,setRepass] = useState("");
    const {theme} = useContext(ThemeContext)

    const dispatch = useDispatch();

    const register =()=> {
        dispatch({
            type: 'REGISTER',
            payload: {
                id: (new Date).getTime(),
                fname,lname,email,pass
            }
        })
    }

    const errors = {
        email: "Invalid email",
        pass: "Invalid password",
        passMatch: "Passwords do not match",
        length: "Too short length for name",
        already_registered: "User is already registered"
    };
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div className="error">{errorMessages.message}</div>);

    function clear_inputs () {
        setFname("");
        setLname("");
        setEmail("");
        setPass("");
        setRepass("")
        setErrorMessages({});
    }

    const handleGoogleOAuth = (data) => {
        console.log('DATA IS HERE', data);
        setFname(`${data.given_name}`);
        setLname(`${data.family_name}`);
        setEmail(`${data.email}`);
        setPass('GooglePassword');
        setRepass('GooglePassword');
        dispatch({
            type: 'REGISTER',
            payload: {
                id: (new Date).getTime(),
                fname:`${data.given_name}`,lname:`${data.family_name}`,email:`${data.email}`,pass:'GooglePassword'
            }
        })
    }

    const handleRegistration = (e) =>{
        e.preventDefault();
        const payload = users.find((user) => user.email === email)
        console.log(payload)
        console.log('EMAIL: ', email);
        if (!(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))){
            setErrorMessages({name:"email", message:errors.email})
        }
        else {
            if (pass === repass){
                if(payload){
                    setErrorMessages({name:"already_registered", message: errors.already_registered})
                }
                else {
                register();
                console.warn("Registered")
                clear_inputs();}
            }
            else{
            setErrorMessages({name:"passMatch", message: errors.passMatch});
            }
        }
    };

  return (
    <div className="form-wrapper">
        <form onSubmit={handleRegistration} className='form'>
            <div className="input-container">
                <label>First Name</label>
                <input type="text"
                    name="fname"
                    autoFocus
                    required
                    value={fname}
                    onChange = {(e)=>setFname(e.target.value)} />
                {renderErrorMessage("length")}
            </div>
            <div className="input-container">
                <label>Last Name</label>
                <input type="text" name="lname" required value={lname}
                onChange = {(e)=>setLname(e.target.value)}/>
                {renderErrorMessage("length")}
            </div>
            <div className="input-container">
                <label>Email </label>
                <input type="email" name="Email" value={email} required onChange = {(e)=>setEmail(e.target.value)}/>
                {renderErrorMessage("email")}
            </div>
            <div className="input-container">
                <label>Passphrase </label>
                <input type="password" name="pass" required value={pass} onChange = {(e)=>setPass(e.target.value)}/>
            </div>

            <div className="input-container">
                <label>Re-enter Password </label>
                <input type="password" name="repass" required value={repass} onChange = {(e)=>setRepass(e.target.value)}/>
                {renderErrorMessage("passMatch")}
            </div>
            <div className="button-container">
                <button className="btn-red" type="submit">Sign Up</button>
                <GoogleLogin
                        onSuccess={response => {
                            var userObject = jwtDecode(response.credential);
                            handleGoogleOAuth(userObject)
                        }}
                        onError={() => {
                            console.log('Login Failed!');
                        }}
                />
            </div>
        </form>
        {renderErrorMessage("already_registered")}
    </div>
  )
}

export default Register