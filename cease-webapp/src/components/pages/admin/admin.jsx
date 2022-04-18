/*
      This component is our Admin page of the web application.
      Logged in Users (that are CEASE agents) are able to change their password, as well as create new users (CEASE agents OR Shelters).
      Emails are linked to the Shelter when they have added the Shelter in the database.
      They have the option with the use of a checkbox if they want to grant the new User access to CEASE side of the application.
*/
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useState } from "react";
import {
  updatePassword,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { Redirect } from 'react-router';
import getGroupUserBelongsTo from '../login/userGroupLookup';
import { firebaseApp, Rtdb } from '../../../firebase/firebaseConfig';
import { ref, get, set } from "firebase/database";


const RegisterPageStyles = styled.div`

.footer {
  display: flex;
  justify-content: center;
}
.FirebaseButton{
  display: flex;
  justify-content: center;
    button{      
      padding: 1rem;
      margin-top: 3rem;
      background-color: #a4a3d8;
      border: 1px solid #cccccc;
      border-radius: 5px;
    }
    button:hover{
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
        cursor: pointer;
    }  
}
.adminCards{
  display: flex;
flex-wrap: wrap;
justify-content: center;
margin-top: 3rem;
}
h2 {
    color: #a4a3d8;
}
.Title{
    text-align: center;
}
.email-textbox, .password-textbox {
  width: 90%;
  padding: 0.25rem;
  border: 1px solid #848484;
  border-radius: 5px;
  text-align: center;
}
.password-textbox {
margin:0.5rem;
}

.logo, .logininfo {
    text-align: center;
}
.loginpage{
  border: 2px solid #cccccc;
    border-radius: 5px;
    margin: auto;
    padding : 1.15rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input {
      max-width: 30rem;
    }
  }
.manageProfilePage{
  border: 2px solid #cccccc;
    border-radius: 5px;
    padding: 1.15rem;
    margin: auto;
    height: 18.5rem;
    width: 40rem;
    min-width: 10rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    input {
       max-width: 60%;
      } 
    button{
      padding: 0.65rem;
      margin-top: 2rem;
      background-color: #a4a3d8;
      border: 1px solid #cccccc;
      border-radius: 5px;
    }
    button:hover{
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
        cursor: pointer;
    }
    
    
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
    
    padding-right: 2rem;
    .Submit {
        padding: 0.5rem;
        width:200%;
        display:block;
        background-color: #a4a3d8;
        border: 2px solid #cccccc;
        border-radius: 5px;
    }
    .Submit:hover {
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
        cursor: pointer;
    }
}

.error{
  background-color: tomato;
  padding: 1rem;
  border-radius: 5px;
}
.updatePasswordTextBox{
  width: 90%;
  padding: 0.25rem;
  border: 1px solid #848484;
  border-radius: 5px;
  text-align: center;
}

.ConfirmUpdatePasswordTextBox{
    width: 90%;
  padding: 0.25rem;
  margin-top: 0.5rem;
  border: 1px solid #848484;
  border-radius: 5px;
  text-align: center;
}

.ceaseAgentCheck{
  margin:auto;
}
.updatePassButton{
    min-width: 20%;
    
}

`


const Admin = (props) => {

  // state hooks
  const [flag, setFlag] = useState(false)
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //SHOW PASSWORD 
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  let agents = props.agents;

  //User Registration function
  const register = async () => {

    // if password inputs matches
    if (confirmPassword === registerPassword) {
      const loggedInUser = auth.currentUser;//capture currently logged in user
      try {                

        const user = await createUserWithEmailAndPassword( // firebase function to create a new user with email and password
          auth,
          registerEmail,
          registerPassword
        ).then(() => {
          auth.currentUser = loggedInUser
        });
        if(document.getElementById("ceaseAgentCheck").checked){
          let agentListLength = 0;
          
          if (agents != null){
            agentListLength = agents.length;
          }
          let agentDataObject = {
            name: document.getElementById("name").value,
            email: registerEmail
          };
          if (window.confirm("Are you sure you want to grant user access to CEASE agent?")) {
            let duplicateEmail = agents.find((agent) =>{
              if (agent.email == agentDataObject.email){
                return agent
              }
            })
            if (duplicateEmail == undefined){  // agent record is saved to database
              set(ref(Rtdb, "Agents/" + agentListLength), agentDataObject);
            }            
          }
        }
        document.getElementById("email").value = ""
        document.getElementById("password").value = ""
        document.getElementById("confPass").value = ""
        document.getElementById("name").value = ""
        alert("User has been added")
      } catch (error) {
        alert("this email already exists")
      }
    }
    else {
      setFlag(true);
    }

  };

  function RedirectToFirebase(e){
    e.preventDefault();
    if (window.confirm("Are you sure you want to leave this page?")){
    document.location.href="https://console.firebase.google.com/u/0/project/cease-shelter-webapp/overview";}
  }

  // function to update user password
  function updateUserPassword(){ 
    const newPassword = document.getElementById("updatePasswordTextBox").value;
    const confirmPassword = document.getElementById("ConfirmUpdatePasswordTextBox").value;
    if (newPassword !== ""){
      if (newPassword.length > 6 ){
        if (newPassword === confirmPassword & window.confirm("Are you sure you want to change your password?")){
                    updatePassword(auth.currentUser, newPassword).then(() => {
          alert("Password update successful");
          document.getElementById("updatePasswordTextBox").value = "";
          document.getElementById("ConfirmUpdatePasswordTextBox").value = "";
        }).catch((error) => {
          alert("Error: Please log out and try again")
        });
        }
        else{
          alert("Passwords don't match");
        }

      }
      else{
        alert("Password must be at least 6 characters");
      }

    }
    else{
      alert("Please enter your new password");
    }

  }

  //HTML\
  const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents) // checking what group user belongs to

  if (loggedInUserGroup === "cease") {
    if (!flag) {
      return (
        <RegisterPageStyles>
          <div className="adminCards">
          <div className="manageProfilePage">
            <h2>Update Profile Details</h2>
            <p>Currently signed-in: <br/> {auth.currentUser.email}</p>
            <input type="text" className="updatePasswordTextBox" id="updatePasswordTextBox" placeholder="Enter New Password" />
            <input type="text" className="ConfirmUpdatePasswordTextBox" id="ConfirmUpdatePasswordTextBox" placeholder="Confirm New Password" />
            <button className="updatePassButton" onClick={updateUserPassword}>Update Password</button>
          </div>

          <div className="loginpage">
            <div className="logo">
              <h2 className="Title">Add New User</h2>
            </div>

            <div className="logininfo">

            <label>
                <input type="text" id="name"
                  className="password-textbox"
                  placeholder="Name" required
                />
              </label>

              <label>
                <input
                  type="text"
                  id="email"
                  className="email-textbox" required
                  placeholder="Email"
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                  }}
                />
              </label>
              <label>
                <input
                  type={passwordShown ? "text" : "password"}
                  id="password"
                  className="password-textbox"
                  placeholder="Password" required
                  onChange={(event) => {
                    setRegisterPassword(event.target.value);
                  }}
                />
                
              </label>
              <label for="confPass"></label>
              <input
                type={passwordShown ? "text" : "password"}
                id="confPass"
                className="password-textbox"
                placeholder="Confirm Password" required
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}

              />
            </div>
            <div className="ceaseAgentCheck">
            <input type="checkbox" name="ceaseAgentCheck" id="ceaseAgentCheck" />
              <label htmlFor="ceaseAgentCheck"> Cease Agent Access</label>
            </div>
            <div className="Buttons">
              <button className="Submit" id="btnLogin" onClick={register}>Register</button>
            </div>
            
          </div>
          </div>
              <div className="FirebaseButton">
                <button className="LinkFirebaseButton" onClick={RedirectToFirebase}>Firebase Portal</button>
              </div>
        </RegisterPageStyles>
      );
    }
    else {
      return (
        <RegisterPageStyles>
        <div className="adminCards">
          <div className="manageProfilePage">
            <h2>Update Profile Details</h2>
            <p> Currently signed-in user: {auth.currentUser.email}</p>
            <input type="text" className="updatePasswordTextBox" id="updatePasswordTextBox" placeholder="Enter New Password" />
            <button  onClick={updateUserPassword}>Update Password</button>
          </div>
          <div className="loginpage">
            <div className="logo">
              <img src="/CeaseLogo.png" alt="logo" />
              <h2 className="Title">Add New User</h2>
            </div>

            <div className="logininfo">
            <label>
                <input type="text" id="name"
                  className="email-textbox"
                  placeholder="Name" required
                />
              </label>
              <label>
                <input type="text" id="email"
                  className="email-textbox"
                  placeholder="Email" required
                  onChange={(event) => {
                    setRegisterEmail(event.target.value);
                  }}
                />
              </label>
              <label>
                <input type={passwordShown ? "text" : "password"} id="password"
                  className="password-textbox"
                  placeholder="Password" required
                  onChange={(event) => {
                    setRegisterPassword(event.target.value);                    
                  }}
                />
               {" "}
              </label>
              <label for="confPass"></label>
              <input type={passwordShown ? "text" : "password"} id="confPass"
                className="password-textbox"
                placeholder="Confirm Password" required
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                }}
              />
              <p className="error">Passwords do not match</p>
            </div>
            <div className="ceaseAgentCheck">
              <label htmlFor="ceaseAgentCheck"> checked if this user gets agent access</label>
              <input type="checkbox" name="ceaseAgentCheck" id="ceaseAgentCheck" />
            </div>
            <div className="Buttons">
              <button className='Submit' id="btnLogin" onClick={register}> Register</button>
            </div>


          </div>
          </div>
              <div className="footer">
              <div className="FirebaseButton">
                <button className="LinkFirebaseButton" onClick={RedirectToFirebase}>Firebase Portal</button>
              </div>
              </div>
        </RegisterPageStyles>
      );
    }

  }
  else if (loggedInUserGroup === "shelter") {
    return (<Redirect to="/shelter/mainmenu" />);
  }
  else {
    return (<Redirect to="/login" />);
  }

}
export { Admin };