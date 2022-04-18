/*
    This component is designed to hold the values for the tickets in a convenient card object-component.
*/
import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const SINGLECARD = styled.div`
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
.openTicketDeets{
    border-radius: 0rem 0rem 1rem 1rem;
    background-color: #a4a3d8;
}
.editSvg{
    display: flex;
    flex-direction: row-reverse;
    background-color: #a583ad8b;
    border-radius: 1rem 1rem 1rem 1rem;
    padding-right: 1rem;
}

#greenCard{
    background-color: 	#98FB98;
}
`

const OpenTicket = (props) => {
    let location = useLocation()
    const history = useHistory()
    function sentToTicketManagement(event) {
        if (location.pathname != "/ticketmanagement") {
            // history.push('/ticketmanagement')
            const eventTargetDataName = event.target.innerText.split('-')[0];

            history.push('/ticketmanagement' + '?ID=' + eventTargetDataName)
        }
    }

    function renderCards() {
        let ticket = props.ticket
        let ShelterReplys = ticket.ShelterReplys

        let acceptFound = ShelterReplys.find((reply) => {
            if (reply.Reply == true) {
                return reply;
            }
        })

        // if ticket is outstanding and a response has come
        if (ticket.Status == "Open" && acceptFound != undefined) {
            return (
                <div id="greenCard" className="openTicketDeets">
                    <p>Ticket ID: {props.ticket.TicketID}</p>
                    <p>Status: {props.ticket.Status}</p>
                    <p>Date Open: {props.ticket.DateOpen}</p>
                    <p>Date Closed: {props.ticket.DateClosed}</p>
                    <p>Notes: {props.ticket.Notes}</p>
                </div>
            );
        }
        else {  // if ticket is outstanding and a response has not come
            return (
                <div className="openTicketDeets">
                    <p>Ticket ID: {props.ticket.TicketID}</p>
                    <p>Status: {props.ticket.Status}</p>
                    <p>Date Open: {props.ticket.DateOpen}</p>
                    <p>Date Closed: {props.ticket.DateClosed}</p>
                    <p>Notes: {props.ticket.Notes}</p>
                </div>
            );
        }
    }





    if (props.ticket == undefined) {
        return (<></>)
    }
    else {
        return (

            <SINGLECARD>
                <div className="nameHeader" onClick={sentToTicketManagement}>
                    <h5 className='declared-name'>{props.ticket.TicketID}-{props.ticket.FirstName + " " + props.ticket.LastName}</h5>
                </div>
                {renderCards()}
            </SINGLECARD>
        );
    }

}

export default OpenTicket;