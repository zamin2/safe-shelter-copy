/*
    This component is the navigation bar for the Shelter side that consists of two nav links:
    Tickets and Admin.
    This also contains the CEASE logo that redirects to the Shelter's main page (Tickets).
    Logout button also is there
*/
import React from 'react'
import Button  from '../../elements/buttons';
import styled from 'styled-components';
import { Link, useHistory, useLocation, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import {Colors} from '../../constantVars'
import {signOut} from "firebase/auth";
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
      background-color:#a4a3d8;
      margin-bottom: 10px;
      min-width: 15vw;
    }
    .logout:hover {
      cursor: pointer;
      background-color:${Colors.purpleDark};
      color: white;
      font-weight: bold;
     
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
        font-size: 0.6rem;
      }
      .main-logo {
        width: 12rem;
        height: 1.9rem;       
      }
    }
    
`




const ShelterNavBar = (props) => {
  let ClientChosen = props.clientID;
  let location = useLocation()
  const history = useHistory()
  function homeImgClick(){
    history.push('/')
  }

  const logoutClick = async () => {
    await signOut(auth);
    window.location.reload();
  };

 

    return (
      <NavDeck>
        {/* create dropdown component that uses the location hook?*/} 
        <picture> 
            <source media="(max-width:554px)" srcset="SmallCeaseLogo.png"></source>   
            <img className="main-logo" src="/CeaseLogo.png" alt="logo" onClick={homeImgClick}/>
          </picture>
          
            <div className="ShelterName">
            
              <button className='logout' onClick={logoutClick}>LOG OUT</button></div>
        <div className="titlesNav">          
          <NavLink to="/shelter/mainmenu" className="ticket-management" activeClassName="a-ticket-management"><h3>Tickets</h3></NavLink>
          <NavLink to="/shelter/admin" className="admin-page" activeClassName="a-admin-page"><h3>Admin</h3></NavLink>
        </div>
      </NavDeck>
    );
}

export {ShelterNavBar};