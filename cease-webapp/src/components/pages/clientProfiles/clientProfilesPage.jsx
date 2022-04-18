/*
        This component is our Client Profile Page on the web application (CEASE side only.)
        We use CRUD operations to create, update and delete client information, and are able to search Client by name.
        We are also able to see the client's recent Tickets on the right side of the page when a client has been searched and selected.
        There is a Create Ticket button that creates a ticket based off of the client information, and sends it out to the Shelters that
        are able to accept the client based on their restrictions (and saves any updated information).
*/
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import OpenTicket from '../mainMenu/openTicketCards';
import uuid from 'react-uuid';
import { Link, useHistory, useLocation } from 'react-router-dom';
//import { useLocation } from 'react-router';
import { Redirect } from 'react-router';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { firebaseApp, Rtdb } from '../../../firebase/firebaseConfig';
import { ref, get, set } from "firebase/database";
import getGroupUserBelongsTo from '../login/userGroupLookup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const ClientStyles = styled.div`
    
    display: flex;
    flex-wrap: wrap;
    .clientDropdown{
        margin-bottom: 1rem;
    }
.form-validation{
    background-color: tomato;
    text-align: center;
    padding: 1rem;
    width: 100%;
}
    .Title {
       text-align: center;
   }

   .ClientSearch {
       margin-bottom: 2rem
       
   }

   .SearchBar {
    display: flex;
    justify-content: space-between; 
    flex-direction: row;
    padding: 0.25rem;
    border: 1px solid #848484;
    border-radius: 0.5rem;
    text-align: center;
    width: 30%;
    margin-bottom: 1rem;
   }

   .searchbox {
    width: 90%;
    outline: none;
    border: none;
    margin-bottom:0.2rem;  
   }

   .icon {

   }

    .client_form {
        flex-basis: 20rem;
        flex-grow: 2;
        flex-shrink: 1;
        padding: 1.5rem;
        margin: 0.5rem;

        .ClientInfo {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            background-color:#a4a3d8;
            border-radius: 0.5rem;
            padding: 0.5rem;
        

            .Input {
                display: flex;
                flex-direction: column;            
                margin: 0.25rem;
                justify-content: space-between;
                width: 47%;                               
            }
        
        }

        .RestrictionCheckArea
        {
            display: flex;
            justify-content: space-evenly;
            margin-top: 1rem;
            label {
                min-width: 16%;
                margin: 0.5rem;
                padding: 0.25rem;
                
            }
        }

        .Notes {
            margin-top: 1rem;
            display: flex;
            flex-direction: column;  
            textarea {
                resize: none;
            }      
        }

        .Buttons {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 1rem;
            .Edit {
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
            .Clear {
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
            
            .Create {
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
            .delete-client{
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
            Button {               
                padding: 1rem;                
                min-width: 23.75%;
            }
        }
        .Create:hover, .Edit:hover, .Clear:hover, .Save:hover, .delete-client:hover {
            background-color: #a4a3d8;
            font-weight: bold;
            cursor: pointer;
        }


    }

    .OpenTicketsArea {
        margin-top: 2rem;
        flex-basis: 10rem;
        flex-grow: 1;
        flex-shrink: 2;

        .previous_tickets {
            border: 2px solid #cccccc;
            border-right: none;
            border-radius: 10px;
            margin: auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            padding: 1.5rem;
            overflow-y: scroll;
            max-height: 50rem;
            //scrollbar will probably break at some point..... sorry lads
            ::-webkit-scrollbar{width:1rem}
            ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
            ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
        
    
        div{
            min-width: 40vw;
            
        }
    }
}

@media (max-width: 900px) {
    .Title {
       text-align: left;
       margin: -1.5rem 0 1.5rem 0;
   }

   .SearchBar {
    text-align: center;
    width: 98%;
    margin-bottom: 1rem;
   }

   .searchbox {
    text-align: flex-start;
    width: 30%;       
   }

    .client_form {       
        .RestrictionCheckArea
        {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            margin-top: 1rem;
            label {
                min-width: 100%;
                margin: 0.3rem;
                padding: 0.15rem;
            }            
        }       
        .Buttons {            
            Button { 
                padding: 0.4rem;                                             
                min-width: 100%;
                margin-top: 1rem;
            }
                .Create, .Edit, .Clear, .Save, .delete-client {
                padding: 0.8rem;
            }
        }
        .Create:hover, .Edit:hover, .Clear:hover, .Save:hover, .delete-client:hover {
            background-color: rgba(127,126,126,0.68);
            font-weight: bold;
            cursor: pointer;
        }
    }
    
    .OpenTicketsArea {
        padding: 1.5rem;        
    }
} 
#selectNumber{
    width: 50%;
    border-radius: 0.5em;
    

}  


`

const ClientPage = (props) => {

    //TO DO: IMPLIMENT UPKEEP FUNCTION THAT RUNS ON CREATION TO DELETE OLD CLIENTS
    //GET THE SEARCH DATA (IF ANY AVAILABLE)
    let location = useLocation()
    const history = useHistory() 
    const [ticketsForClient, setTickets] = useState([])
    const [clientChosen, setClient] = useState(null)
    const [shelterAcceptanceFlag, setShelterAcceptanceFlag] = useState({ flag: true, name: "" });

    let chosenClient = null;
    let chosenClientList = null;
    let clientList = props.clients
    if(clientList == undefined){
        clientList = [{
            "user": {
                "DOB": formatDate(Date.now),
                "clientID": 1000,
                "FirstName": "NULL Client",
                "Gender": "",
                "Identify": "NULL Client",
                "LastName": "NULL Client",
                "Orientation": "NULL Client",
                "Phone": "NULL Client",
                "requirements": {
                    "mentalHealthPrescrip": false,
                    "physicalHealthPrescrip": false,
                    "kids": {
                        "kidsExist": false,
                        "AgeRange": "kidsAgeRange"
                    },
                    "drugAlcoholDep": false,
                    "accessibilty": false,
                    "serviceAnimal": false,
                }
            }

        }]
    }

    // when we select another client from the dropdown, this function is called
    function onChangeClient(e) {
        var select = document.getElementById("selectNumber");

        chosenClient = clientList.find((client) => {
            let clientID = client.user.clientID
            if (select.value != null) {
                if (select.value == clientID) {
                    
                    return client
                }
            }
        })
        setClient(chosenClient)
        const allTickets = props.tickets

        if (chosenClient != null) {
            
            document.getElementById("firstName").value = chosenClient.user.FirstName
            document.getElementById("lastName").value = chosenClient.user.LastName
            document.getElementById("kidsDropdown").value = chosenClient.user.requirements.kids.kidsExist
            document.getElementById('kidsAge').value = chosenClient.user.requirements.kids.AgeRange
            document.getElementById("clientGender").value = chosenClient.user.Gender
            document.getElementById("identifiedGender").value = chosenClient.user.Identify
            document.getElementById("sexualOrientation").value = chosenClient.user.Orientation
            document.getElementById("phoneNumber").value = chosenClient.user.Phone
            document.getElementById("dateOfBirth").value = String(chosenClient.user.DOB)
            document.getElementById("additionalNotesTextArea").value = chosenClient.user.Notes
            document.getElementById("MentalPrescripCheckbox").checked = chosenClient.user.requirements.mentalHealthPrescrip
            document.getElementById("PhysicalPrescripCheckbox").checked = chosenClient.user.requirements.physicalHealthPrescrip
            document.getElementById("alcoholCheckbox").checked = chosenClient.user.requirements.drugAlcoholDep
            document.getElementById("AccessibilityCheckbox").checked = chosenClient.user.requirements.accessibilty
            document.getElementById("ServiceAnimalCheckbox").checked = chosenClient.user.requirements.serviceAnimal
            
            if (allTickets != undefined) {
                setTickets(allTickets.filter((ticket) => {    
                    if (ticket.Ticket.ClientID == chosenClient.user.clientID) {
                        return ticket
                    }
                }))
            }
            else {
                setTickets(null)
            }

        }
    }

    // function is called everytime we write something in the search text field
    function onChangeSearch(e) {
        e.preventDefault()
        if (document.getElementById("ClientSearch").value.length != 0) {
            var select = document.getElementById("selectNumber");
            const search = document.getElementById("ClientSearch")
            const clientList = props.clients


            chosenClientList = clientList.filter((client) => {
                let clientName = (client.user.FirstName + " " + client.user.LastName).toLowerCase()
                return (clientName.includes(search.value.toLowerCase()))
            })
        
            select.innerHTML = '';
            var el = document.createElement("option");
            el.textContent = "Search Result List";
            el.value = null;
            select.appendChild(el);
            for (var i = 0; i < chosenClientList.length; i++) {
                var opt = String(chosenClientList[i].user.FirstName).substring(0, 25) + " " + String(chosenClientList[i].user.LastName).substring(0, 25)
                var el = document.createElement("option");
                el.textContent = chosenClientList[i].user.clientID + " - " + opt;
                el.value = chosenClientList[i].user.clientID;
                select.appendChild(el);
            }

        }
        else {
            var select = document.getElementById("selectNumber");
            select.innerHTML = '';
            var el = document.createElement("option");
            el.textContent = "Select...";
            el.value = null;
            select.appendChild(el);
            for (var i = 0; i < clientList.length; i++) {
                var opt = String(clientList[i].user.FirstName).substring(0, 25) + " " + String(clientList[i].user.LastName).substring(0, 25)
                var el = document.createElement("option");
                el.textContent = clientList[i].user.clientID + " - " + opt;
                el.value = clientList[i].user.clientID;
                select.appendChild(el);
            }

        }
    }

    // clear all input form fields
    function ClearForm(e) {
        e.preventDefault();
        if(window.confirm("Are you sure you want to clear all form fields?")) {
        window.location.reload() }
    }


    var containsChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    
    function hasNumber(myString) {
        return /\d/.test(myString);
    }
    var now = new Date();
    now.setHours(0, 0, 0, 0);

    // function for inserting client
    // this function either updates if existing otherwise create new
    function InsertClient(e) {
        e.preventDefault();
        if (window.confirm("Are you sure you would like to save this client?")) {
            //collect all form data 
            //FirstName
            let firstName = document.getElementById('firstName').value;
            //LastName
            let lastName = document.getElementById('lastName').value;
            //Children bool
            let childrenBool = Boolean(document.getElementById('kidsDropdown').value === "true");
            //kids age
            let kidsAgeRange = document.getElementById('kidsAge').value;
            //Gender
            let gender = document.getElementById('clientGender').value;
            //IdentifiedGender
            let identifiedGender = document.getElementById('identifiedGender').value;
            //Sexuial Orientation
            let sexualOrientation = document.getElementById('sexualOrientation').value;
            //DOB
            let dOB = document.getElementById('dateOfBirth').value;
            //PhoneNumber
            let phoneNumber = document.getElementById('phoneNumber').value;
            //checkbox section
            //o   Mental Health Prescriptions
            let mentalHealthPrescrip = document.getElementById('MentalPrescripCheckbox').checked;
            //o   Physical Health Prescriptions
            let physicalHealthPrescrip = document.getElementById('PhysicalPrescripCheckbox').checked;
            //o   Drug/alcohol dependency
            let drugAlcoholDep = document.getElementById('alcoholCheckbox').checked;
            //o   Drug/alcohol dependency – need to detox
            //o   Accessibility (mobility challenges)
            let accessibility = document.getElementById('AccessibilityCheckbox').checked;
            //o   Has a Service Animal 
            let serviceAnimal = document.getElementById('ServiceAnimalCheckbox').checked;
            //additional Notes
            let notes = document.getElementById('additionalNotesTextArea').value;
            var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            //create an object identical to DB layout
            let clientObject = {
                "user": {
                    "DOB": dOB,
                    "FirstName": firstName,
                    "Gender": gender,
                    "Identify": identifiedGender,
                    "LastName": lastName,
                    "Orientation": sexualOrientation,
                    "Phone": phoneNumber,
                    "requirements": {
                        "mentalHealthPrescrip": mentalHealthPrescrip,
                        "physicalHealthPrescrip": physicalHealthPrescrip,
                        "kids": {
                            "kidsExist": childrenBool,
                            "AgeRange": kidsAgeRange
                        },
                        "drugAlcoholDep": drugAlcoholDep,
                        "accessibilty": accessibility,
                        "serviceAnimal": serviceAnimal,
                    }
                }

            }
            if (clientObject.user.FirstName == "" || clientObject.user.LastName == "") {
                alert("Please fill out valid First and Last Names")
                return null;
            }
            else if (clientObject.user.requirements.kids.kidsExist == "true" && clientObject.user.requirements.kids.AgeRange == "") {
                alert("Please enter ages of children")
                return null;
            }
            else if (clientObject.user.requirements.kids.kidsExist == "false" && clientObject.user.requirements.kids.AgeRange != "") {
                alert("Please select children as yes if client has kids");
                return null;
            }
            else if (containsChar.test(clientObject.user.Identify) || hasNumber(clientObject.user.Identify)) {
                alert("Please fill out a valid Identified Gender field")
                return null;
            }
            else if (containsChar.test(clientObject.user.Orientation) || hasNumber(clientObject.user.Orientation)) {
                alert("Please fill out a valid Sexual Orientation field")
                return null;
            }
            else if (clientObject.user.DOB == "" || (Date.parse(clientObject.user.DOB) > Date.parse(now))) {
                alert("Please fill out a valid Date of Birth field")
                return null;
            }
            else if (clientObject.user.Phone != "" && (phoneno.test(clientObject.user.Phone) == false)) {
                alert("Please fill out valid Phone Number")
                return null;
            }
            else {
                //check for existing client with matching details
                let indexNumber = 0;
                clientList.forEach((client) => {
                    client.indexNumber = indexNumber
                    indexNumber++;
                })
               
                //if-no client exists
                if (clientChosen === null) {

                    //insert new client into database
                    //grab the length of the current amount of users and add to the index number for a new user
                    let userCount = clientList.length;
                    if(props.clients == undefined){
                        userCount = 0;
                        clientObject.user.clientID = 1000
                    }
                    else{
                        clientObject.user.clientID = parseInt(clientList[userCount - 1].user.clientID) + 1
                    }
                    clientObject.user.Notes = notes
                    clientObject.user.dateCreated = formatDate(Date.now())
                   
                    set(ref(Rtdb, 'ClientList/' + (userCount)), clientObject);                   
                }
                //if- client exists -first+last+DOB
                else {
                    clientObject.user.dateCreated = clientChosen.user.dateCreated
                    clientObject.user.clientID = clientChosen.user.clientID;
                    clientObject.user.Notes = notes;
                    //update existing client - additional logic
                    set(
                        ref(Rtdb, "ClientList/" + clientChosen.indexNumber),
                        clientObject
                    );
                }
                return clientObject;
            }

        }

    }

    // function is called when save button is clicked
    function SaveClient(e) {
        let clientObject = InsertClient(e)
        if (clientObject != null) {
            window.location.reload()
        }
    }

    // checking if restrictions of client can be accomodated by checking against the limitations of every shelters
    const produceShelterRepliesArray = (clientObject, shelters) => {
        let repliesArray = [];

        
        shelters.forEach((shelter) => {
            let requirementCounter = 0;
            if (!((clientObject.user.requirements.mentalHealthPrescrip == true) && (shelter.shelter.requirements.mentalHealthPrescrip == false))) {             
                requirementCounter++;
            }
            if (!((clientObject.user.requirements.physicalHealthPrescrip == true) && (shelter.shelter.requirements.physicalHealthPrescrip == false))) {               
                requirementCounter++;
            }
            if (!((clientObject.user.requirements.drugAlcoholDep == true) && (shelter.shelter.requirements.drugAlcoholDep == false))) {              
                requirementCounter++;
            }
            if (!((clientObject.user.requirements.accessibilty == true) && (shelter.shelter.requirements.accessibilty == false))) {               
                requirementCounter++;
            }
            if (!((clientObject.user.requirements.serviceAnimal == true) && (shelter.shelter.requirements.serviceAnimal == false))) {                
                requirementCounter++;
            }
            if (!((Boolean(clientObject.user.requirements.kids.kidsExist) == true) && (shelter.shelter.requirements.kids.kidsExist == false))) {               
                requirementCounter++;
            }
            if (clientObject.user.Gender === shelter.shelter.requirements.acceptedGender) {              
                requirementCounter++;
            }
            else if (shelter.shelter.requirements.acceptedGender === "All") {                
                requirementCounter++;
            }
            if (requirementCounter == 7) {
                const reply = {
                    Reply: "0",
                    ShelterID: shelter.shelter.shelterID,
                };
              
                repliesArray.push(reply);
            }

        })
        return repliesArray;
       
    }

    // function called when create ticket button is clicked
    function CreateTicket(e) {
        e.preventDefault();
        //Run save client function
        let clientObject = InsertClient(e)
        if (clientObject != null && window.confirm("Are you sure you would like to create a ticket for this client?")) {
            const allTickets = props.tickets
            //create an empty ticket
            // fill said ticket
            let notesWithKidsInputs = clientObject.user.Notes

            notesWithKidsInputs = notesWithKidsInputs + "\n" + "Sex: " + clientObject.user.Gender + "\n" +
                "Identifies as: " + clientObject.user.Identify + "\n" +
                "Sexual Orientation: " + clientObject.user.Orientation + "\n" +
                "Accomodations Needed For:"
            if (clientObject.user.requirements.mentalHealthPrescrip == true) {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Prescriptions - Mental Health"
            }

            if (clientObject.user.requirements.physicalHealthPrescrip == true) {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Prescriptions - Physical Health"
            }

            if (clientObject.user.requirements.drugAlcoholDep == true) {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Dependancy on Drugs or Alcohol"
            }

            if (clientObject.user.requirements.accessibilty == true) {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Mobility Challenged"
            }

            if (clientObject.user.requirements.serviceAnimal == true) {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Service Animal"
            }

            if (clientObject.user.requirements.kids.kidsExist == "true") {
                notesWithKidsInputs = notesWithKidsInputs + "\n" + "             " + "Kids Age/s " + clientObject.user.requirements.kids.AgeRange
            }
            let tID;
            if (allTickets != null){
                tID = parseInt(allTickets[allTickets.length - 1].Ticket.TicketID) + 1
            }
            else{
                tID = 1000
            }

            let newTicketItem = {
                Ticket: {
                    ClientID: clientObject.user.clientID,
                    DateClosed: "",
                    DateOpen: formatDate(Date.now()),
                    FirstName: clientObject.user.FirstName,
                    LastName: clientObject.user.LastName,
                    ClientProfile: notesWithKidsInputs,
                    Notes: "",
                    ShelterID: "",
                    ShelterName: "",
                    ShelterReplys: [],
                    Status: "Open",
                    TicketID: tID,
                }
            };
            // get the shelters and their requirements
            let shelters = props.shelters;
            // logic our way around figuring out what shelter to put on the ticket for a response
            //create empty shelter replys object
            //populate array 
            let shelterRepliesArray = produceShelterRepliesArray(clientObject, shelters);
            //create list of response shelters - populate to non responded
            newTicketItem.Ticket.ShelterReplys = shelterRepliesArray.map((shelterReply) => { return shelterReply });
            if (shelterRepliesArray.length == 0) {
                
                setShelterAcceptanceFlag({ flag: false, name: clientObject.user.FirstName + " " + clientObject.user.LastName })
            }
            if (shelterRepliesArray.length > 0) {
                // send ticket to DB
                if (allTickets != undefined) {
                    set(
                        ref(Rtdb, "Tickets/" + allTickets.length),
                        newTicketItem
                    );
                }
                else {
                    set(
                        ref(Rtdb, "Tickets/0"),
                        newTicketItem
                    );
                }              
                        if(location.pathname != "/ticketmanagement"){          
                        history.push('/ticketmanagement' + '?ID=' + tID)    
                        window.location.reload();                    
                        }                        
            }

        }

    }

    // function called when delete client button is clicked
    function DeleteClient(e) {
        e.preventDefault();
        
        if (clientChosen != null && window.confirm("Are you sure you want to delete this client? This information will be permanently deleted and cannot be recovered.")) {
            let newArray = [];

            clientList.forEach(element => {
                if (element.user.clientID !== clientChosen.user.clientID) {
                    newArray.push(element)
                }
            })
            set(ref(Rtdb, 'ClientList/'), newArray);
            window.location.reload();
        }
    }

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


    const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents) // checking what group user belongs to
    if (loggedInUserGroup === "cease") {

        function renderTickets() {
            if (ticketsForClient != null) {
                return (
                    ticketsForClient.map((ticket) => (
                        <OpenTicket ticket={ticket.Ticket} />
                    ))
                );
            }

        }
        if (shelterAcceptanceFlag.flag == false) {
            return (
                <ClientStyles>
                    <div className="form-validation">
                        <p>No shelters can accept these parameters for {shelterAcceptanceFlag.name}</p>
                    </div>
                    <div className="client_form">
                        <h2 className="Title">Client Demographics</h2>
                        <div className='SearchBar'>
                            <input className='searchbox' id="ClientSearch"
                                placeholder='SEARCH...'
                                type="text" onChange={onChangeSearch} />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <div class="clientDropdown">
                            <label>Available clients: </label>
                            <select className="selectNumber" id="selectNumber" onChange={onChangeClient}>
                                <option>Select...</option>
                                {clientList.map((client) => <option value={client.user.clientID}>{client.user.clientID + " - " + String(client.user.FirstName).substring(0, 25) + " " + String(client.user.LastName).substring(0, 25)}</option>)}
                            </select>
                        </div>

                        <form>
                            <div className="ClientInfo">
                                <div className="Input">
                                    <label>
                                        First Name:
                                    </label>
                                    <input type="text" id="firstName" required />
                                </div>
                                <div className="Input">
                                    <label>
                                        Last Name:
                                    </label>
                                    <input type="text" id="lastName" required />
                                </div>
                                <div className="Input">
                                    <label>
                                        Children:
                                    </label>
                                    <select id="kidsDropdown">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div className="Input">
                                    <label>
                                        Kids Age Range:
                                    </label>
                                    <input type="text" name="name" id='kidsAge' />
                                </div>
                                <div className="Input">
                                    <label>
                                        Sex:
                                    </label>
                                    <select id="clientGender">
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="Input">
                                    <label>
                                        Identified Gender:
                                    </label>
                                    <input type="text" id="identifiedGender" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Sexual Orientation:
                                    </label>
                                    <input type="text" id="sexualOrientation" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Date of Birth:
                                    </label>
                                    <input type="date" id="dateOfBirth" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Phone:
                                    </label>
                                    <input type="phone" id="phoneNumber" />
                                </div>

                            </div>
                            <div className="RestrictionCheckArea">
                                <label>
                                    <input type="checkbox" id="MentalPrescripCheckbox" />
                                    Mental Health Prescriptions

                                </label>
                                <label>
                                    <input type="checkbox" id="PhysicalPrescripCheckbox" />
                                    Physical Health Prescriptions

                                </label>
                                <label>
                                    <input type="checkbox" id="alcoholCheckbox" />
                                    Drug/alcohol dependency

                                </label>
                                <label>
                                    <input type="checkbox" id="AccessibilityCheckbox" />
                                    Accessibility (mobility challenges)
                                </label>
                                <label>
                                    <input type="checkbox" id="ServiceAnimalCheckbox" />
                                    Service Animal
                                </label>
                            </div>
                            <div className="Notes">
                                <label>
                                    Additional notes:
                                </label>
                                <textarea type="text" rows="7" id="additionalNotesTextArea" />
                            </div>
                            <div className="Buttons">
                                <button className="delete-client" onClick={DeleteClient}>Delete Client</button>
                                <button className="Clear" onClick={ClearForm}>Clear</button>
                                <button className="Create" onClick={CreateTicket} >Create Ticket</button>
                                <button className="Save" type="submit" onClick={SaveClient}>Save</button>
                            </div>
                        </form>

                    </div>

                    <div className="OpenTicketsArea">
                        <h2 className="Title">Client Tickets</h2>
                        <div className="previous_tickets">
                            {renderTickets()}

                        </div>
                    </div>
                </ClientStyles>
            );
        }
        else {

            return (
                <ClientStyles>
                    <div className="client_form">
                        <h2 className="Title">Client Demographics</h2>
                        <div className="SearchBar">
                            <input className='searchbox'
                                id="ClientSearch"
                                placeholder='SEARCH...'
                                type="text" onChange={onChangeSearch}
                            />
                            <FontAwesomeIcon icon={faSearch} />
                        </div>
                        <div class="clientDropdown">
                            <label>Available clients: </label>
                            <select id="selectNumber" onChange={onChangeClient}>
                            <option>Select...</option>
                                {clientList.map((client) => <option value={client.user.clientID}>{client.user.clientID + " - " + String(client.user.FirstName).substring(0, 25) + " " + String(client.user.LastName).substring(0, 25)}</option>)}
                            </select>
                        </div>

                        <form>
                            <div className="ClientInfo">
                                <div className="Input">
                                    <label>
                                        First Name:
                                    </label>
                                    <input type="text" id="firstName" required />
                                </div>
                                <div className="Input">
                                    <label>
                                        Last Name:
                                    </label>
                                    <input type="text" id="lastName" required />
                                </div>
                                <div className="Input">
                                    <label>
                                        Children:
                                    </label>
                                    <select id="kidsDropdown">
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                    </select>
                                </div>
                                <div className="Input">
                                    <label>
                                        Kids Age Range:
                                    </label>
                                    <input type="text" name="name" id='kidsAge' />
                                </div>
                                <div className="Input">
                                    <label>
                                        Sex:
                                    </label>
                                    <select id="clientGender">
                                        <option value="">Select...</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="Input">
                                    <label>
                                        Identified Gender:
                                    </label>
                                    <input type="text" id="identifiedGender" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Sexual Orientation:
                                    </label>
                                    <input type="text" id="sexualOrientation" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Date of Birth:
                                    </label>
                                    <input type="date" id="dateOfBirth" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Phone:
                                    </label>
                                    <input type="phone" id="phoneNumber" />
                                </div>

                            </div>
                            <div className="RestrictionCheckArea">
                                <label>
                                    <input type="checkbox" id="MentalPrescripCheckbox" />
                                    Mental Health Prescriptions

                                </label>
                                <label>
                                    <input type="checkbox" id="PhysicalPrescripCheckbox" />
                                    Physical Health Prescriptions

                                </label>
                                <label>
                                    <input type="checkbox" id="alcoholCheckbox" />
                                    Drug/alcohol dependency

                                </label>
                                <label>
                                    <input type="checkbox" id="AccessibilityCheckbox" />
                                    Accessibility (mobility challenges)
                                </label>
                                <label>
                                    <input type="checkbox" id="ServiceAnimalCheckbox" />
                                    Service Animal
                                </label>
                            </div>
                            <div className="Notes">
                                <label>
                                    Additional notes:
                                </label>
                                <textarea type="text" rows="7" id="additionalNotesTextArea" />
                            </div>
                            <div className="Buttons">
                                <button className="delete-client" onClick={DeleteClient}>Delete Client</button>
                                <button className="Clear" onClick={ClearForm}>Clear</button>
                                <button className="Create" onClick={CreateTicket} >Create Ticket</button>
                                <button className="Save" type="submit" onClick={SaveClient}>Save</button>
                            </div>
                        </form>

                    </div>
                    <div className="OpenTicketsArea">
                        <h2 className="Title">Client Tickets</h2>
                        <div className="previous_tickets">
                            {renderTickets()}
                        </div>
                    </div>
                </ClientStyles>

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

export { ClientPage };

