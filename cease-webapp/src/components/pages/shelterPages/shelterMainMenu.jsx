/*
    This component is the Main Menu on the Shelter Side (as well as the Ticket nav link).
    It contains our TicketNotificationCard component which will appear when a CEASE agent creates a ticket, if 
    that Shelter fits in the filter of the client's restrictions.
*/
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import OutstandingTicket from './TicketNotificationCard';
import { Colors } from '../../constantVars';
import {signOut} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import getGroupUserBelongsTo from '../login/userGroupLookup';

const ShelterView = styled.div`
.ShelterNav{
    background-color: #ffffff;
    display: flex;
    flex-wrap: wrap;
   
}
.ShelterName{
    text-align: center;
    margin: 10px;
    min-width: 20vw;
    font-size: 80%;
    border: 1px solid #848484;
    border-radius: 0.5rem;
}
.logo {
    padding-right: 45rem;
    margin: 2rem;
}
h4{
        margin: auto;
        margin-top: 2rem;
        background-color: ${Colors.offWhiteGrey};
        width: 50vw;
        text-align:center;
        border: 2px outset rgba(127,126,126,0.68);
        border-radius: 12px;
        margin-bottom: 1rem;

   }
   .logout {
    border: 1px solid #848484;
    border-radius: 0.5rem;
    text-align: center;
    margin-top: 1rem;
    background-color:#a4a3d8;
    width: 90px;
  
    
  }
  .logout:hover {
    cursor: pointer;
    background-color:${Colors.purpleDark};
    color: white;
    font-weight: bold;
   
  }
   .ticketCardBlock{
    border: 2px solid #cccccc;
    border-right: none;
    border-radius: 10px;
    margin: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 1.5rem;
    overflow-y:scroll;
    max-height: 30rem;    
    //scrollbar will probably break at some point..... sorry lads
   ::-webkit-scrollbar{width:1rem}
   ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
   ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
    
    
   div{
      min-width: 40vw;    
      
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
   .a-ticket,
   .a-admin {
     background-color:${Colors.purpleDark};
  }
 
  .a-ticket h3,
  .a-admin h3{
      text-decoration: none;
      color:${Colors.purpleLight};}

`

const ShelterViewPage = (props) => {
  setInterval(function(){ window.location.reload() }, 120000);  // timer function.. will update every 2 seconds
  const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents);  // checking what group user belongs to
  if (loggedInUserGroup === "shelter"){
     //get shelter user belongs to
 //iterate through shelters -> return shelter object with matching email
 const loggedInShelter = props.shelters.find(shelter => {
  if(auth.currentUser.email.toUpperCase() == shelter.shelter.email.toUpperCase()){
      return shelter
  }
})

// get list of shelter replies objects -> ticket ids
let openTicketsWithSheltersID = props.tickets.filter(ticket => {

  const shelterOnTicket = ticket.Ticket.ShelterReplys.find((reply) => {
    if (reply.ShelterID == loggedInShelter.shelter.shelterID) {
      if(ticket.Ticket.ShelterID == "" || ticket.Ticket.ShelterID == "0"){
        if (reply.Reply === "0") {
          return reply;
        }
        else if (reply.Reply === true && ticket.Ticket.Status === "Open"){
          return reply;
        }
      }
    }
  });
if(shelterOnTicket != null){
return ticket
}
})


    return ( <ShelterView>

      <div className="titlesNav">
 
      </div>
      <h4>Outstanding Tickets</h4>
      <div className="ticketCardBlock">
      {openTicketsWithSheltersID.map(ticketIndex => (
       
         <OutstandingTicket ticket={ticketIndex} ClientList={props.ClientList} shelter={loggedInShelter} allTickets={props.tickets}/>
      ))}
      
      </div>


  </ShelterView> );
  }
  else if (loggedInUserGroup === "cease"){
    return (<Redirect to="/"/>);
  }
  else{
    return (<Redirect to="/login"/>);
  }



}
 
export default ShelterViewPage;