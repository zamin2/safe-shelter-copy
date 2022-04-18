/* 
      This component is our login page to the web application.
      CEASE Agents and Shelters can use their credientials to gain their respective access to the web application.
*/
import React, {useContext} from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
import { useState } from "react";
import {
  
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  setPersistence,
  browserSessionPersistence
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import getGroupUserBelongsTo from '../login/userGroupLookup';
const eye = <FontAwesomeIcon icon={faEye} />;



const LoginPageStyles = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
margin-top: 10rem;
h2 {
    color: #a4a3d8;
}
.Title{
    text-align: center;
}
.logo, .logininfo {
    text-align: center;
}
.email-textbox, .password-textbox {
    width: 90%;
    padding: 0.25rem;
    border: 1px solid #848484;
    border-radius: 0.5rem;
    text-align: center;
}
.password-textbox {
  margin:0.5rem;
}
i {
  position: absolute;
  left: 59.5%;
  bottom: 51.25%;
}
i:hover {
  color: rgba(127,126,126,0.68);
  cursor: pointer;
}
.loginpage {
    border: 2px solid #cccccc;
    border-radius: 10px;
    margin: auto;
    padding: 1.5rem;
}
.Preferences {
    padding-top: 0.5rem;
    font-size: 85%;
    display: grid;
    grid-gap: 0.5rem;
}
.Forgot {
    padding-top: 0.5rem;
}
.Buttons {
    margin-top: 1rem;
    padding-left: 0.8rem;
    .Submit {
        padding: 0.5rem;
        display:block;
        background-color: #a4a3d8;
        width: 97%;
        padding: 0.25rem;
        border: 1px solid #848484;
        border-radius: 0.5rem;
        text-align: center;
    }
    .Submit:hover {
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
    }
} 


`


const LoginPage = (props) => {

  // const [registerEmail, setRegisterEmail] = useState("");
  // const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  const [isValid, setisValid] = useState(false);

  //SHOW PASSWORD 
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

//This current User will persist when the page is refreshed
// will only be removed when LogOut is used
  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  

 
  

  //Login Function
  const login = async () => {
    
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        try {
      
          const user = signInWithEmailAndPassword(
            auth,
            loginEmail,
            loginPassword
          ).then((userCreds) =>{
            setisValid(true);
          }).catch((error) => {
            alert("Sign in failed. Invalid Login credentials")
          });
          
        } catch (error) {
          //set an error flag - useState to render in error block
          
        }
        //return signInWithEmailAndPassword(auth, email, password);
      })
      .catch((error) => {
        // Handle Errors here.
        alert("error")
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  
    
  };

  //Logout
  const logout = async () => {
    await signOut(auth);
  };

  //HTML
  const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents)
  if (loggedInUserGroup == "cease"){
    return(<Redirect to='/'/>);
  }
  else if(loggedInUserGroup == "shelter"){
    return (<Redirect to="/shelter/mainmenu" />);
  }
  else{
    return(
      <LoginPageStyles>
      <div className="loginpage">
      <div className="logo">
      <img src="/CeaseLogo.png" alt="logo"/>
      <h2 className="Title">Sign In</h2>
      </div>
    
      <div className="logininfo">
      <label>
        <p></p>
        <input type="text" 
              className="email-textbox"
              placeholder="Email" required
              onChange={(event) => {
              setLoginEmail(event.target.value);
              }}
        />
      </label>
      <label>
        <input type={passwordShown ? "text" : "password"}
              className="password-textbox" required
              placeholder="Password"
              onChange={(event) => {
              setLoginPassword(event.target.value);
              }}
        />         
      </label>
      </div>
    
      <div className="Buttons">
        <button className='Submit' id="btnLogin" onClick={login}> Login</button>
    </div>
    </div>
    </LoginPageStyles>
  );
  }
    
  }

  export { LoginPage };