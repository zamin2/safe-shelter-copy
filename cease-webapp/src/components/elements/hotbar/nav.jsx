import React from 'react'
import Button  from '../buttons';
import styled from 'styled-components';
import { Link, useHistory, useLocation, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {Colors} from '../../constantVars'
import {signOut,
        signInWithEmailAndPassword} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";


const NavDeck = styled.div`
    background-color: #ffffff;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 1rem 0 0 0;

    .search-bar{
      margin: 1rem 0.5rem;
      padding: 4px;
      border: 1px solid grey;
      border-radius: 1rem;
    
      input{
        border: none;
        outline: none;
      }
      svg{
        padding:0 0.5rem;
        
      }
      svg:hover{
        cursor: pointer;
        color: ${Colors.purpleDark};
      }
    }
    .titlesNav {
      border: 1px solid gray;
      display: flex;    
      justify-content: space-around;
      flex-direction: row;
      flex-wrap: nowrap;
      width: 100%;
      margin: 1rem 0;
    }

    .logout {
      padding: 0.25rem;
      border: 1px solid #848484;
      border-radius: 0.5rem;
      text-align: center;
      width: 150%;
      background-color:#a4a3d8;
    }
    .logout:hover {
      cursor: pointer;
      background-color:${Colors.purpleDark};
      color: white;
      font-weight: bold;
      width: 170%;
    }

    h3 {
      display: flex;    
      justify-content: center;
      font-size: 1.25rem;
      color:${Colors.purpleDark};
      margin: 0;
      padding: 0.25rem;
    }

    a {
        text-decoration: none;
        width: 100%;
    }

    a:hover {
      background-color:${Colors.purpleDark};  
    }

    h3:hover {
      text-decoration: none;
      color:${Colors.purpleLight};
    }

    .a-client-profiles,
    .a-shelter-profiles,
    .a-ticket-management,
    .a-admin-page {
      background-color:${Colors.purpleDark};
    }

    .a-client-profiles h3,
    .a-shelter-profiles h3,
    .a-ticket-management h3,
    .a-admin-page h3 {
      text-decoration: none;
      color:${Colors.purpleLight};
    }

    @media (max-width: 886px) and (min-width: 721px) {
    h3 {
        font-size: 1rem;
      }
    .main-logo {
        width: 20.15rem;
        height: 2.5rem;       
      }
    }

    @media (max-width: 720px) and (min-width: 555px) {
      h3 {
        font-size: 0.75rem;
      }
      .main-logo {
        width: 20.15rem;
        height: 2.5rem;       
      }
    }

    @media (max-width: 554px) {
      h3 {
        font-size: 0.5rem;
      }
      .main-logo {
        width: 12rem;
        height: 1.9rem; 
        margin-right: -3rem       
      }
    }

    @media (max-width: 375px) {
      h3 {
        font-size: 0.4rem;
      }
      .main-logo {
        width: 8rem;
        height: 1.3rem;  
        margin-right: -3rem     
      }
    }
    
`


// victim profiles, shelter profiles, ticket management, admin

const MainNavBar = (props) => {
  let ClientChosen = props.clientID;
  let location = useLocation()
  const history = useHistory()
  function homeImgClick(){
    history.push('/')
  }

  function RouteToClientProfile(){
    if(location.pathname != "/clientProfile"){
      history.push('/clientProfile')
    }
    else{
      //force refresh of route
    }
  }
   
  // log out function
  const logoutClick = async () => {    
      const user = await signInWithEmailAndPassword(
        auth,
        "loginpageuser@login.ca",
        "loginpage"
      );
    window.location.reload();
  };

    return (
      <NavDeck>
        {/* create dropdown component that uses the location hook?*/} 
          <picture> 
            <source media="(max-width:554px)" srcset="SmallCeaseLogo.png"></source>   
            <img className="main-logo" src="/CeaseLogo.png" alt="logo" onClick={homeImgClick}/>
          </picture>
         
          <div><button className='logout' onClick={logoutClick}>LOG OUT</button></div>
        <div className="titlesNav">
          <NavLink to="/clientProfile" className="client-profiles" activeClassName="a-client-profiles"><h3>Client Profiles</h3></NavLink>
          <NavLink to="/shelterprofile" className="shelter-profiles" activeClassName="a-shelter-profiles"><h3>Shelter Profiles</h3></NavLink>
          <NavLink to="/ticketmanagement" className="ticket-management" activeClassName="a-ticket-management"><h3>Ticket Management</h3></NavLink>
          <NavLink to="/admin" className="admin-page" activeClassName="a-admin-page"><h3>Admin</h3></NavLink>
        </div>
      </NavDeck>
    );
}

export {MainNavBar};