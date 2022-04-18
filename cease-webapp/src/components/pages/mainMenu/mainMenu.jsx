/*
    This component is our CEASE main menu, where it will redirect once logged in as a CEASE agent.
    On this page, there are "New Client", "Tickets" and "Shelters" buttons, that all redirect to its respective page.
    "Open Tickets" are shown on the Main Menu as well, which shows the CEASE agent every Ticket that has not been closed yet.
*/
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus, faTags, faHouseUser } from '@fortawesome/free-solid-svg-icons';
import OpenTicket from './openTicketCards';
import { Colors } from '../../constantVars';
import { map } from '@firebase/util';
import getGroupUserBelongsTo from '../login/userGroupLookup';


import { auth } from "../../../firebase/firebaseConfig";


const MAINMENU = styled.div`
margin:1.5rem;

.mainButtons{
    background-color: #fff;
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin: 3rem 0;

    .image-overlay{
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0;
      background-color:${Colors.offWhiteGrey};
      padding: 1.5rem 0.5rem;
      border: 2px outset rgba(127,126,126,0.68);
      border-radius: 12px;
      width: 20vw;
      text-align: center;
    }

    a{
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        margin: 0.5rem;
               
        svg{
            font-size: 4rem;
        }

        .icon{             
            margin-bottom: -3rem;        
        }

        p{
          opacity: 0;
        }

        @media (max-width: 682px) and (min-width: 545px){
          .icon {
            width: 4rem;
            height: 4rem;
          }         
        }

        @media (max-width: 544px) and (min-width: 376px) {
          .icon {
            width: 3rem;
            height: 3rem;
          }         
        }

        @media (max-width: 375px) and (min-width: 361px)  {
          .icon {
            width: 2.5rem;
            height: 2.5rem;
          }
          .long-title {
            font-size: 0.9rem;
          }          
        }

        @media (max-width: 360px) {
          .long-title {
            font-size: 0.935rem;
          }                  
        }

    }
    a:hover{
      .image-overlay{
        padding: 0.65rem 0.5rem;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      }
        .image-blur{
          background: #3c3b67;
        }
        .icon{          
          color:#7170b3;
          z-index: 1;
          
        }
        p{
          position: relative;
          font-size: 1.5rem;
          font-weight: bold;
          opacity: 1;
          color:#7170b3;
          z-index: 10;
          transform: translateY(25px);
          transition: transform 0.3s;
        } 

        @media (max-width: 682px) and (min-width: 545px) {
          .long-title {
            font-size: 1.2rem;
          }
          .long-image-overlay {
            padding: 1.1rem 0.5rem;
            }            
        }

        @media (max-width: 544px) and (min-width: 376px) {          
          .long-title {
            font-size: 0.9rem;
            padding: 0.1rem 0.1rem 0.1rem 0.1rem;
          }

          .long-image-overlay {
            padding: 1.3rem 0.5rem;
          }

          .l-icon {
            margin-bottom: -2.7rem
          }          
        }

        @media (max-width: 375px) {          
          .long-title {
            font-size: 0.85rem;
            padding: 0.15rem 0.15rem 0.15rem 0.15rem;
          }

          .long-image-overlay {
            padding: 1rem 0.5rem;
          }

          .l-icon {
            margin-bottom: -2rem
          }

          .ticketCardBlock{           
          div{
              min-width: 60vw;
              
              }  
          }
        }
    }
}
h4{
    margin: auto;
    background-color: ${Colors.offWhiteGrey};
        width: 50vw;
       text-align:center;
       border: 2px outset rgba(127,126,126,0.68);
        border-radius: 12px;

   }

   .ticketCardBlock{
    background-color: #fff;
    border: 2px solid #cccccc;
    border-right: none;
    border-radius: 10px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 1.5rem;
    overflow-y:scroll;
    max-height: 25rem;
    //scrollbar will probably break at some point..... sorry lads
   ::-webkit-scrollbar{width:1rem}
   ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
   ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
    
    
   div{
       min-width: 40vw;
      
   }   
}

@media (max-width: 700px) {
    .ticketCardBlock{
        width: 90%;
        div{
            min-width: 72vw;      
        } 
    }
}
.ticketHeader{
  margin-bottom: 20px;
}


`

const MainMenu = (props) => {
  setInterval(function(){ window.location.reload() }, 120000); // timer function.. updates every two minutes if there are any updates to the open tickets from the shelters
  const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents) // checking what group user belongs to
  if (loggedInUserGroup === "cease") {
    //this space to get data
    if (props.tickets != undefined) {
      let openTickets = props.tickets.filter((ticket) => {
        //loop through object to find and return proper tickets
        if (ticket.Ticket.Status == "Open") {
          return ticket.Ticket
        }
      })
      return (
        <MAINMENU>
          <div className="mainButtons">
            <Link to="/clientProfile">
              <div className="image-overlay image-blur long-image-overlay">
                <FontAwesomeIcon icon={faUserPlus} className="icon l-icon" />
                <p className="long-title">New Client</p>
              </div>
            </Link>
            <Link to="/ticketmanagement">
              <div className="image-overlay image-blur">
                <FontAwesomeIcon icon={faTags} className="icon" />
                <p>Tickets</p>
              </div>
            </Link>
            <Link to="/shelterprofile">
              <div className="image-overlay image-blur">
                <FontAwesomeIcon icon={faHouseUser} className="icon" />
                <p>Shelters</p>
              </div>
            </Link>
          </div>
          <h4 className="ticketHeader">Open Tickets</h4>
          <div className="ticketCardBlock">
            {/* populate 1 card per open ticket */}
            {openTickets.map((ticket) => (

              <OpenTicket ticket={ticket.Ticket} />
            ))}
          </div>
        </MAINMENU>
      );
    }
    else{
      return (
        <MAINMENU>
          <div className="mainButtons">
            <Link to="/clientProfile">
              <div className="image-overlay image-blur long-image-overlay">
                <FontAwesomeIcon icon={faUserPlus} className="icon l-icon" />
                <p className="long-title">New Client</p>
              </div>
            </Link>
            <Link to="/ticketmanagement">
              <div className="image-overlay image-blur">
                <FontAwesomeIcon icon={faTags} className="icon" />
                <p>Tickets</p>
              </div>
            </Link>
            <Link to="/shelterprofile">
              <div className="image-overlay image-blur">
                <FontAwesomeIcon icon={faHouseUser} className="icon" />
                <p>Shelters</p>
              </div>
            </Link>
          </div>
          <h4>Open Tickets</h4>
          <div className="ticketCardBlock">

          </div>
        </MAINMENU>
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



//logic to see if cease agent -> bool





export default MainMenu;