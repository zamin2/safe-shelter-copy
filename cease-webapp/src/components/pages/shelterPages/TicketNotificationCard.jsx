/*
    The Ticket component is designed to hold the values for the unanswered tickets in a convenient card object-component.
    Information based on the Client's inputted information by CEASE is present (without names for security reasons), 
    as well as a REPLY, which gives the Shelter the option to ACCEPT or REJECT the client based on the information given.
*/
import React from 'react';
import styled from 'styled-components';
import {  useHistory, useLocation } from 'react-router-dom';
import { auth } from "../../../firebase/firebaseConfig";
import { ref, get, set } from "firebase/database";
import { firebaseApp, Rtdb } from '../../../firebase/firebaseConfig';
const ShelterNotification = styled.div`
background-color: #e7e5e5;
display: flex;
align-content: center;
flex-direction: column;
margin-top: 0.5rem;
border-radius: 1rem;

.nameHeader{
    text-align:center;
    font-size: 1.5rem;
    border: 1px solid grey;
    border-radius: 1rem 1rem 0 0;
    
    h5{
        margin: 0;
        padding: 0;
    }

}
.nameHeader:hover{
    cursor: pointer;
    background-color: gray;
}
.outstandingTicket{
    background-color: #a583ad8b;
    border-bottom-right-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
p{
    margin-left: 1rem;
}
}
.Buttons{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
     margin-top: 1rem;
     margin-bottom: 1rem;;
}
.shelterReply{
     text-decoration: underline;
      display: flex;    
      justify-content: center;
      font-size: 1.25rem;
      margin: 0;
      padding: 0.25rem;
}
.acceptanceNote{
    display: flex;    
      justify-content: center;
      font-size: 1.25rem;
      margin: 0;
      padding: 0.25rem;
      color: #98FB98;
}
.acceptButton{
    background-color: #b5dff0;
    width: 100px;
    border-radius: 5px;
  
}
.rejectButton{
    background-color: #f7bdbd;
    width: 100px;
    border-radius: 5px;
    
    
}
.acceptButton:hover , .rejectButton:hover{
    cursor: pointer;
    color: white;
    font-weight: bold;

}
`
const ShelterNotificationCard = (props) => {
    const shelter = props.shelter
  let ticket = props.ticket
  let client = props.ClientList.find(client => { // finding the client by clientID
      if(ticket.Ticket.ClientID == client.user.clientID){
          return client;
      }
  })
  if(client == undefined){ // if client has been deleted after a ticket has been issued
      client = {
        user: {
          clientID: 0,
          DOB: "DELETED USER",
          FirstName: "DELETED USER",
          Gender: "DELETED USER",
          Identify: "DELETED USER",
          LastName: "DELETED USER",
          Orientation: "DELETED USER",
          Phone: "DELETED USER",
          requirements: {
            accessibilty: false,
            drugAlcoholDep: true,
            kids: {
              kidsExist: false,
            },
            mentalHealthPrescrip: false,
            physicalHealthPrescrip: true,
            serviceAnimal: false,
          },
        },
      };
  }

  // function is called when accept button is clicked
  function replyToTicketAccept(e){
      e.preventDefault()
    //find index number of existing ticket
    let ticketIndexNumber = 0;
    let foundBool = false;
    props.allTickets.forEach(allticket => {
        if(allticket.Ticket.TicketID != ticket.Ticket.TicketID && !foundBool){
            ticketIndexNumber++;
        }
        if(allticket.Ticket.TicketID == ticket.Ticket.TicketID){
            foundBool = true;
        }
    });
    let replyIndexNumber = 0;
    foundBool = false;
    ticket.Ticket.ShelterReplys.forEach(reply => { // finding the ticket 
        if(shelter.shelter.shelterID != reply.ShelterID && !foundBool){
            replyIndexNumber++;
        }
        if(shelter.shelter.shelterID == reply.ShelterID){
            foundBool = true;
        }
    })
    if(window.confirm("Are you sure you would like to accept?")){
            set(ref(Rtdb, "Tickets/" +  ticketIndexNumber  + "/Ticket/ShelterReplys/" + replyIndexNumber + "/Reply"), true); // updated to database
            window.location.reload();
            
    }

  }

  // function is called when reject button is clicked
  function replyToTicketReject(e){
    e.preventDefault()
  //find index number of existing ticket
  let ticketIndexNumber = 0;
  let foundBool = false;
  props.allTickets.forEach(allticket => { // finding the ticket indexnumber
      if(allticket.Ticket.TicketID != ticket.Ticket.TicketID && !foundBool){
          ticketIndexNumber++;
      }
      if(allticket.Ticket.TicketID == ticket.Ticket.TicketID){
          foundBool = true;
      }
  });
  let replyIndexNumber = 0;
  foundBool = false;
  ticket.Ticket.ShelterReplys.forEach(reply => {  // finding the reply number inside ticket
      if(shelter.shelter.shelterID != reply.ShelterID && !foundBool){
          replyIndexNumber++;
      }
      if(shelter.shelter.shelterID == reply.ShelterID){
          foundBool = true;
      }
  })
  if(window.confirm("Are you sure you would like to reject?")){
          set(ref(Rtdb, "Tickets/" +  ticketIndexNumber  + "/Ticket/ShelterReplys/" + replyIndexNumber + "/Reply"), false); // updated in database
          window.location.reload();
  }

}

function renderButtons(){
    if (ticket.Ticket.Status === "Open"){  // if ticket is open
        let found = ticket.Ticket.ShelterReplys.find((reply) =>{
            if(shelter.shelter.shelterID == reply.ShelterID){
                return reply;
            }
        })
        if (found.Reply == true){ // if acceptance is already sent
            return (
                <><h2 className="acceptanceNote">Sent acceptance to agent</h2><div className="Buttons">
                    <button className="rejectButton" onClick={replyToTicketReject}>Reject</button>
                </div></>
            );
        }
        else if (found.Reply == "0"){ // no response has been provided yet by shelter
            return (
                <><h2 className="shelterReply">Reply</h2><div className="Buttons">
                    <button id="acceptButton" className="acceptButton" onClick={replyToTicketAccept}>Accept</button>
                    <button className="rejectButton" onClick={replyToTicketReject}>Reject</button>
                </div></>
            );
        }
    }
}


        return ( 
    <ShelterNotification>
           <div className="nameHeader" >
                 <h5 className='declared-name'>{ticket.Ticket.TicketID} - {client.user.Identify}</h5> 
            </div>
            <div className="outstandingTicket">
                <p>Ticket ID: {ticket.Ticket.TicketID}</p>
                <p>Date: {ticket.Ticket.DateOpen}</p>
                <p>Date of Birth: {client.user.DOB}</p>
                <p>Sex:  {client.user.Gender} - Identified Gender: {client.user.Identify} </p>
                <p>Requires Accessibility: {client.user.requirements.accessibilty.toString()}</p>
                <p>has Prescription Medication: {Boolean(client.user.requirements.physicalHealthPrescrip ^ client.user.requirements.mentalHealthPrescrip).toString()}</p>
                <p>has a Drug/Alcohol dependency: {client.user.requirements.drugAlcoholDep.toString()} </p>
                <p>Kids: {client.user.requirements.kids.kidsExist.toString()}</p>
                <p>Notes: {ticket.Ticket.Notes}</p>
                {renderButtons()}
            </div>
            
    </ShelterNotification> );
}

 
export default ShelterNotificationCard;