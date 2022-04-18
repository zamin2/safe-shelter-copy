/*
    This component is the Ticket Management Page on the CEASE Side (as well as the Ticket Management nav link).
    It contains our Ticket component which is designed to hold the values for the recent tickets in a convenient 
    card object-component, with the ability to search up tickets based on Client Name or Client ID.
    Once you click on a Ticket, it will take you to that Ticket's information, that displays our Shelter replies 
    (GREEN = accepted, RED = rejected, WHITE = unanswered). The card component contains information such as the status of the ticket
    (Open/Closed), and the Chosen Shelter if closed Ticket.

*/
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import OpenTicket from '../mainMenu/openTicketCards';
import TicketPage from './../ticketSearch/ticketSearch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { Colors } from '../../constantVars';
import { useLocation } from 'react-router';
import { Redirect } from 'react-router';
import getGroupUserBelongsTo from '../login/userGroupLookup';


const TicketManagement = styled.div`

.search-bar{
    padding: 4px;
    width: 60%;
    border: 1px solid grey;
    border-radius: 1rem;
    display: block;
    margin: 0 auto;
    margin-top: 5rem;
    display: flex;
    justify-content: space-between;
    outline: none;
} 

.searchbox {
    width: 90%;
    outline: none;
    border: none;
    text-align: center;
}

    input{
      border: none;
    
    }
    svg {
     margin: 0 0 auto;
    
      
    }
    svg:hover{
      cursor: pointer;
      color: #3c3b67;
    }

     h4{
        margin: auto;
        margin-top: 3rem;
        background-color: ${Colors.offWhiteGrey};
        width: 50vw;
        text-align:center;
        border: 2px outset rgba(127,126,126,0.68);
        border-radius: 12px;

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
    max-height: 25rem;
    width: 90%;
    //scrollbar will probably break at some point..... sorry lads
   ::-webkit-scrollbar{width:1rem}
   ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
   ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
    
    
   div{
       min-width: 40vw;
      
   } 
}
.ticketHeader{
    margin-bottom: 20px;
}

@media (max-width: 700px) {
    .ticketCardBlock{
        width: 80%;
        div{
            min-width: 72vw;      
        } 
    }
}

`
// search bar to return search params
//ticket management search bar to parse cards and add/remove .hide me class
//get handle on the cardblocks => return an array of objects for each card block.
//for each card if they contain matching data remove .hideme class else add .hideme


const TicketManagementPage = (props) => {

    const shelterList = props.shelters;
    const location = useLocation()
    let tickets = props.tickets
    const urlParams = new URLSearchParams(location.search).get('ID');
    const [CardContainer, setCardContainer] = useState(tickets);
    const [chosenCardObject, setChosenCardObject] = useState(props.chosenCard);

    useEffect(() => {
        if(urlParams !== null && CardContainer != undefined){
            setChosenCardObject(CardContainer.find((ticket) => {
                let ticketID = ticket.Ticket.TicketID
                if(ticketID == urlParams){
                    return ticket
                }
            }))
        }
    }, [])
   

    function updateSearchParams(){
        if (CardContainer != undefined){
            const searchValue = document.getElementById('ticket-search').value.toLowerCase();
            //loop through tickets      
                //remove the ticket from the card container - setCardContainer to new array with/without ticket
                //reset the cardContainer to the origional
                setCardContainer(tickets.map(function (element){return element}));
                //create new object without matching tickets
    
                let newTempCardsObj = tickets.filter(function (ticket){
                    let nameAndId =ticket.Ticket.TicketID +'-'+ ticket.Ticket.FirstName + " " + ticket.Ticket.LastName;
                    if(nameAndId.toLowerCase().includes(searchValue.toLowerCase())){
                        return ticket
                    }             
    
                   })           
                //setCardContainer()
                setCardContainer(newTempCardsObj)
        }

    }

    // when a particular card is selected
    function selectedCardToEdit(event){
        if (CardContainer != undefined){
            if(event.target.classList.contains('declared-name')){
                const eventTargetDataName = event.target.innerText.split('-')[0];
                setChosenCardObject(CardContainer.find((ticket) => {
                    let ticketID = ticket.Ticket.TicketID
                    if(ticketID == eventTargetDataName){
                        return ticket
                    }
                }))
            }
        }

    }

    function renderTickets(){
        if (CardContainer != null){
            return(
                CardContainer.map((ticket)=>(
                    <OpenTicket ticket ={ticket.Ticket}/>
                    ))
            );
        }
    }
    const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents); // checking what group user belongs to
    if (loggedInUserGroup === "cease"){
        if(chosenCardObject == null){
            return (
                <TicketManagement>
                     <div className="search-bar">
                    <input className='searchbox' id='ticket-search' placeholder="SEARCH..."
                    onKeyUp = {updateSearchParams}
                    ></input>
                    
                    <FontAwesomeIcon icon={faSearch}/>
                   
                    </div>    
                    <h4 className="ticketHeader">All Tickets</h4>
                        <div className="ticketCardBlock" onClick={selectedCardToEdit} >
                        {renderTickets()}
                        </div>
                </TicketManagement>
            );
        }
        else{
            return (
                <>
    
    
                    <TicketPage ticket={chosenCardObject} shelters = {shelterList} allTickets = {tickets} agents = {props.agents}/>
    

                </>
            );
        }
    }
    else if(loggedInUserGroup === "shelter"){
        return (<Redirect to="/shelter/mainmenu"/>);
      }
      else{
        return (<Redirect to="/login"/>);
      }
    

    
}

export {TicketManagementPage};