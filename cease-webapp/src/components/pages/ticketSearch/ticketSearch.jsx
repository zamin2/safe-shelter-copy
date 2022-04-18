/*Component NOT being used */

import React from 'react';
import styled from 'styled-components';
import { Colors } from '../../constantVars';
import { ShelterList } from './shelterList';
import { Redirect } from 'react-router';
import { Rtdb} from '../../../firebase/firebaseConfig';
import {ref, get, set, remove} from "firebase/database";
import getGroupUserBelongsTo from '../login/userGroupLookup';

const TicketSearch = styled.div`
display: flex;
    flex-wrap: wrap;

    .backButton{
        margin-bottom: 2rem;
        background-color: #a4a3d8;
        border: 2px solid #cccccc;
            border-right: none;
            border-radius: 10px;
    }
    .backButton:hover{
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
        cursor: pointer;
    }
    .Title {
     
       width: 200px;
       text-align: center;
       margin: 0 auto;
       margin-top: 1rem; 
       font-size: 30px;
       font-weight   :normal ;

   }
   .chosenShelter{
       margin-top: 0.5rem;
   }
   .Status{
       margin-bottom: 1rem;
       border-radius: 10px;
       font-size: 30px;
       display: flex;
       flex-direction: row; 
       
  
   .statusSelect{

    border: 1px solid black;
        text-align: center;
        margin-left: 20px;
        width: 500px;      
        background-color:${Colors.redPale};
        height: 3rem;
        width: 84%;
        height: 3rem;    
        border-radius: 1rem 1rem 1rem 1rem;
        background-color: #a4a3d8;
   }
}
    .createTicket{
        flex-basis: 10rem;
        flex-grow: 2;
        flex-shrink: 1;
        padding: 1.5rem;
        margin: 0.5rem;
        min-width: 20rem;

        .ticketInfo {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            background-color: #a4a3d8;
            border-radius: 0.5rem;
            

        .input {            
            display: flex;
            flex-direction: column;            
            margin: 0.25rem;
            justify-content: space-between;
            width: 47%;                               
        }
    
    }
    .Notes {
        margin-top: 1rem;
        display: flex;
        flex-direction: column;
    }
    .Buttons {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-top: 1rem;
        .Back {
            color: #fff !important;
            text-transform: uppercase;
            text-decoration: none;
            background: #fb4400;
            padding: 20px;
            border-radius: 50px;
            display: inline-block;
            border: none;
            transition: all 0.4s ease 0s;
        }
        .Edit {
            color: #fff !important;
            text-transform: uppercase;
            text-decoration: none;
            background: #20bf6b;
            padding: 20px;
            border-radius: 50px;
            display: inline-block;
            border: none;
            transition: all 0.4s ease 0s;
        }
        .Clear {
            color: #fff !important;
            text-transform: uppercase;
            text-decoration: none;
            background: #cf2e2e;
            padding: 20px;
            border-radius: 50px;
            display: inline-block;
            border: none;
            transition: all 0.4s ease 0s;
        }
        .Save {
            color: #fff !important;
            text-transform: uppercase;
            text-decoration: none;
            background: #60a3bc;
            padding: 20px;
            border-radius: 50px;
            display: inline-block;
            border: none;
            transition: all 0.4s ease 0s;
        }
        Button {               
            padding: 1rem;                
            min-width: 23.75%;
        }
    }
    .Save:hover, .Back:hover, .Edit:hover, .Clear:hover{
        background-color: rgba(127,126,126,0.68);
        font-weight: bold;
        cursor: pointer;
    }

    }
.shelterList {
    border: 1px solid gray;
    border-radius:0.5rem ;
    margin-top: 1.75rem;
    flex-basis: 20rem;
    flex-grow: 1;
    flex-shrink: 2;
        
        }
.shelterListView {
margin-top: 1.75rem;
flex-basis: 20rem;
flex-grow: 1;
flex-shrink: 2;
min-width:50%;

}
.shelterNames {
   border-radius: 0.5rem;
    margin-top: 0 auto;
    
   
}
#shelterDropdown{
    margin-left: 5px;
    text-align: center;
}

textarea {
    resize: none;
}

  .fiXCyB ul{
    column-count : 2 auto;

}

.shelterListView {
    h2 {
       text-align: left;
    }
}

@media (max-width: 700px) {
    .Buttons {            
            Button { 
                padding: 0.2rem;                                             
                min-width: 10%;
            }
            .Save, .Back, .Edit, .Clear {
                padding: 0.6rem;
                width: 100%;
                margin-bottom: 1rem;
            }
        }
}

`

// code will come in here as props to fill form fields as well as shelter responses

function TicketPage(props) {
 
    const ticket = props.ticket.Ticket;
    let TicketsList = props.allTickets;
    const shelterList = props.shelters;
    const allTickets = props.allTickets;

    document.getElementsByClassName("statusSelect").value = ticket.Status

    // function is called when save button is clicked
    function SaveTicket(e){
        e.preventDefault();
        if(window.confirm("Are you sure you would like to submit this ticket?")){
            const shelterDropdown = document.getElementById("shelterDropdown");
            let shelterName= shelterDropdown.options[shelterDropdown.selectedIndex].text
        //logic to save ticket here
        //create empty ticket
        let newTicketItem = {
            //populate empty ticket from form
            Ticket: {
              ClientID: document.getElementsByName('clientID')[0].value,
              DateClosed: document.getElementsByName('dateclosed')[0].value,
              DateOpen: document.getElementsByName('dateopened')[0].value,
              FirstName: document.getElementsByName('nameFirst')[0].value ,
              LastName: document.getElementsByName('nameLast')[0].value,
              Notes: document.getElementById('notesText').value,
              ShelterID: document.getElementById('shelterDropdown').value,
              ShelterName: shelterName,
              ShelterReplys: [],//leave off here
              Status:  document.getElementById('statusDropdown').value,
              TicketID: document.getElementsByName('ticketid')[0].value
            }
          };
        //get ticket from DB using - ticketID for matching TicketID - save position number
        let indexNumber = 0;
           let exsistingTicket = allTickets.find((ticket) => {
 
               if (ticket.Ticket.TicketID.toString() === newTicketItem.Ticket.TicketID) {
                       return ticket
                  }
              indexNumber ++;
              })

              
        exsistingTicket.Ticket.ClientID = newTicketItem.Ticket.ClientID;
        exsistingTicket.Ticket.DateClosed = newTicketItem.Ticket.DateClosed;
        exsistingTicket.Ticket.DateOpen = newTicketItem.Ticket.DateOpen;
        exsistingTicket.Ticket.FirstName = newTicketItem.Ticket.FirstName;
        exsistingTicket.Ticket.LastName = newTicketItem.Ticket.LastName;
        exsistingTicket.Ticket.Notes = newTicketItem.Ticket.Notes;
        exsistingTicket.Ticket.Status = newTicketItem.Ticket.Status;
        exsistingTicket.Ticket.TicketID = newTicketItem.Ticket.TicketID;
        exsistingTicket.Ticket.ShelterID = newTicketItem.Ticket.ShelterID;
        exsistingTicket.Ticket.ShelterName = newTicketItem.Ticket.ShelterName;  
        //save ticket to db
        set(ref(Rtdb, 'Tickets/' + indexNumber), exsistingTicket);
           
    }
        }
       


        // function is called when delete button is clicked
    function OnDelete(e){
        e.preventDefault();
        if (window.confirm("Are you sure you want to delete this ticket? This information will be permanently deleted and cannot be recovered.")){
        let newArray = [];
        TicketsList.forEach(element =>{
            if(element.Ticket.TicketID !== ticket.TicketID){
                newArray.push(element)
            }
            
        })

        set(ref(Rtdb, 'Tickets/'), newArray);
        window.location.reload();}
        


    }; 

    function goBack(e){
        e.preventDefault()
        window.location.reload()
    }

    // formatting date object to a string value
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

    // when status is changed by changing the dropdown... status can only be changed by using the close button. closed tickets can not be opened again
    function onChangeStatus(e){
        e.preventDefault()
        const statusDropdown = document.getElementById("statusDropdown");
        if ( statusDropdown.value == "Closed"){
            alert("Please close ticket through the close ticket button only")
            statusDropdown.value = "Open"
        }
        else if (statusDropdown.value == "Open"){
            alert("The ticket has already been closed")
            statusDropdown.value = "Closed"
        }
    }

    // function is called when close button is clicked
    function onCloseTicket(e){
        e.preventDefault()
        const statusDropdown = document.getElementById("statusDropdown");
        const shelterDropdown = document.getElementById("shelterDropdown");

        if (window.confirm("Are you sure you would like to close this ticket?")){
            statusDropdown.value = "Closed"
            let indexNumber = 0;
            let exsistingTicket = allTickets.find((tick) => {
    
                if (tick.Ticket.TicketID === ticket.TicketID) {
                        return tick
                   }
               indexNumber ++;
               })
               exsistingTicket.Ticket.DateClosed = formatDate(Date.now())
               exsistingTicket.Ticket.Status = "Closed"
               exsistingTicket.Ticket.ShelterID = String(document.getElementById("shelterDropdown").value)
               exsistingTicket.Ticket.Notes = String(document.getElementById('notesText').value)
               let shelterName= shelterDropdown.options[shelterDropdown.selectedIndex].text
              
               exsistingTicket.Ticket.ShelterName = shelterName
               set(ref(Rtdb, 'Tickets/' + indexNumber ), exsistingTicket);
               window.location.reload()
        } 
        

        




    }

    const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents) // checking what group user belongs to
    if (loggedInUserGroup === "cease") {
    return (
        <TicketSearch>
            <div className="createTicket">
                <div className="titleTicket">
                    <h2>Ticket Information: {ticket.FirstName} {ticket.LastName}</h2>
                </div>
            
            <div className="Status">
                        <label>
                            Status
                        </label>
                        <select onChange={onChangeStatus} className="statusSelect" id="statusDropdown" defaultValue={ticket.Status}>
                            <option value="Closed">Closed</option>
                            <option value="Open">Open</option>
                        </select>
                    </div>
                
                <form>
                <div className="ticketInfo">
                   
                <div className="input">
                    <label>
                     Ticket ID:
                </label>
                   <input type="text" name="ticketid" disabled="true"  defaultValue={ticket.TicketID} />
                       </div>
                       <div className="input">
                           <label>
                     Client ID:
                     </label>
                            <input type="text" name="clientID" disabled="true" defaultValue={ticket.ClientID} />
                        </div>
                        <div className="input">
                        <label>
                            Date Opened:
                            </label>
                            <input type="date" name="dateopened" disabled="true" defaultValue={ticket.DateOpen}/>
                            </div>
                            <div className="input">
                        <label>
                            Date Closed:
                            </label>
                            <input type="date" id="closedDate" disabled="true" name="dateclosed" defaultValue={ticket.DateClosed}/>
                            </div>
                            <div className="input">
                        <label>
                            First Name:
                            </label>
                            <input type="text" name="nameFirst" disabled="true" defaultValue={ticket.FirstName} />
                            </div>
                            <div className="input">
                        <label>
                            Last Name:
                            </label>
                            <input type="text" name="nameLast" disabled="true" defaultValue={ticket.LastName} />
                            </div>
                            <div className="input">                        
                        </div>           
                    </div>

                        <div className="chosenShelter"> 
                        <label >
                            Chosen Shelter:
                            <select id="shelterDropdown" defaultValue={ticket.ShelterID}>
                                <option value="">none</option>
                                {shelterList.map((shelter) => (
                                    <option value={shelter.shelter.shelterID}>{shelter.shelter.Name}</option>
                                ))}
                            </select>
                        </label>
                        </div>
                
                        <div className="Notes">
                        <label>
                            Client Profiles:
                        </label>
                        <textarea disabled="true" type="text" rows="12" id="Notes" defaultValue={ticket.ClientProfile}  />
                        <label  for="notesText">
                            Additional notes:                           
                        </label>
                        <textarea type="text" rows="7" id="notesText" defaultValue={ticket.Notes}/>                      
                    </div>

                    <div className="Buttons">
                        <button className="Clear" onClick={OnDelete}>Delete Ticket</button>
                        <button className="Back" onClick={goBack}>Back</button>
                        <button className="Edit" onClick={onCloseTicket}>Close Ticket</button>
                        <button className="Save" type="submit" onClick={SaveTicket}>Save Ticket</button>
                    </div>                    
                </form>                
                </div>
                
                <div className="shelterListView">
                      <h2 className="Title">Shelters</h2>   
            <ul>
           <div className="shelterNames">               
                <ShelterList ticket={ticket} shelters={shelterList}/>                  
           </div>
       </ul>
   </div>
           
        </TicketSearch>
    );
 }
 else if(loggedInUserGroup === "shelter"){
    return (<Redirect to="/shelter/mainmenu"/>);
  }
  else{
    return (<Redirect to="/login"/>);
  }
    
}

export default TicketPage;