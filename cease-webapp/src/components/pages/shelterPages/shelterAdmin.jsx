/*
      This component is our Admin page of the web application, for the Shelter side.
      Logged in Users are able to change their password.
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

const ShelterLogin = styled.div`
display: flex;
flex-wrap: wrap;
justify-content: center;
margin-top: 3rem;

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
  border-radius: 0.5rem;
  text-align: center;
}
.updatePasswordTextBox {
     padding-left:3rem;
}
.logo, .logininfo {
    text-align: center;
}
.textbox {
    width: 80%;
}
.loginpage {
    border: 2px solid #cccccc;
    border-radius: 10px;
    margin: auto;
    padding: 1.5rem;
}


.Buttons {
    margin-top: 1rem;
    .Submit {
        padding: 0.5rem;
        width:100%;
        display:block;
        background-color: #a4a3d8;
        border: 2px solid #cccccc;
        border-right: none;
        border-radius: 10px;
    }
    .Submit:hover {
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;

    }
}
.manageProfilePage{
  border: 2px solid #cccccc;
    border-radius: 10px;
    margin: auto;
    padding-left: 10rem;
    padding-right: 10rem;
    padding-top: 4.7rem;
    padding-bottom: 4.7rem;
    display: flex;
    flex-direction: column;

    button{
      margin-top: 1rem;
      width: 94%;
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

.updatePasswordTextBox{
  width: 90%;
  padding: 0.25rem;
  border: 1px solid #848484;
  border-radius: 0.5rem;
  text-align: center;
}
.ConfirmUpdatePasswordTextBox{
    width: 90%;
  padding: 0.25rem;
  margin-top: 0.25rem;
  border: 1px solid #848484;
  border-radius: 0.5rem;
  text-align: center;
}

`
const ShelterAdmin = (props) => {

  // function to update a user password
  function updateUserPassword(){
    const newPassword = document.getElementById("updatePasswordTextBox").value;
    const confirmPassword = document.getElementById("ConfirmUpdatePasswordTextBox").value;
    if (newPassword !== ""){
      if (newPassword.length > 6 ){
        if (newPassword === confirmPassword){  // if password input fields match
                    updatePassword(auth.currentUser, newPassword).then(() => {
          alert("Password update successful");
          document.getElementById("updatePasswordTextBox").value = "";
          document.getElementById("ConfirmUpdatePasswordTextBox").value = "";
        }).catch((error) => {
         
          alert("Please log out and log in again and try again the password update")
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
const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents);  // checking what group user belongs to
  if (loggedInUserGroup === "shelter"){
  return (
      <ShelterLogin>
      
        <div className="manageProfilePage">
            <h2>Update Profile Password</h2>
            <p>Currently signed-in user: {auth.currentUser.email}</p>
            <input type="text" className="updatePasswordTextBox" id="updatePasswordTextBox" placeholder="Enter New Password" />
            <input type="text" className="ConfirmUpdatePasswordTextBox" id="ConfirmUpdatePasswordTextBox" placeholder="Confirm New Password" />
            <button onClick={updateUserPassword}>Update Password</button>
          </div>

      </ShelterLogin>
  );
}
else if (loggedInUserGroup === "cease"){
  return (<Redirect to="/"/>);
}
else{
  return (<Redirect to="/login"/>);
}
}
export  { ShelterAdmin };
