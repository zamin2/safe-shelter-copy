/*
        This component is our Shelter Profile Page on the web application (CEASE side only.)
        We use CRUD operations to create, update and delete Shelter information, and are able to select Shelters with the Shelter List.
        We are also able to see the shelter's recent Accepted Tickets on the right side of the page when a shelter has been selected.
        There is a Close Ticket button that closes a ticket when a Shelter has been found and selected.
*/
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import OpenTicket from '../mainMenu/openTicketCards';
import { Redirect } from 'react-router';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    setPersistence,
    browserSessionPersistence,
    deleteUser,
    getAuth
} from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig";
import { ShelterList } from '../ticketSearch/shelterList';
import ShelterCard from './shelterCard';
import { firebaseApp, Rtdb } from '../../../firebase/firebaseConfig';
import { ref, get, set, remove } from "firebase/database";
import uuid from 'react-uuid';
import getGroupUserBelongsTo from '../login/userGroupLookup';
import { useLocation } from 'react-router';

const ShelterPageStyles = styled.div`
    display: flex;
    flex-wrap: wrap;

    h2{
        text-align: center;
    }
    .Title {
    text-align: center;
    }
    
    .list{
        display: grid;
        gap: 0.25rem;
        grid-template-columns: repeat(3, 1fr);
       
    }
    
    .shelter_form {
        flex-basis: 20rem;
        flex-grow: 2;
        flex-shrink: 1;
        padding: 1.5rem;
        margin: 0.5rem;

    .ShelterInfo {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        background-color: #a4a3d8;
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

        .Input:nth-child(1), .Input:nth-child(2){
            width: 100%;
            
        }

        .RestrictionCheckArea
        {   display: flex;
            justify-content: space-between;
            margin-top: 1rem;
            label {
                min-width: 10%;
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
            .Add {
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
                background-color: rgb(92, 214, 92);
                border: 2px solid #cccccc;
                border-right: none;
                border-radius: 20px;
            }
            .Delete{
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
        .Add:hover, .Edit:hover, .Clear:hover, .Save:hover, .Create:hover, .Delete:hover {
            background-color: #a583ad8b;
            font-weight: bold;
            cursor: pointer;
        }
        .Add:disabled, .Edit:disabled, .Clear:disabled, .Save:disabled, .Create:disabled, .Delete:disabled {
            background-color: #a583ad8b;
            font-weight: bold;
            cursor: no-drop;
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
            padding: 0.5rem;
            overflow-y: scroll;
            max-height: 44.5rem;
            
            ::-webkit-scrollbar{width:1rem}
            ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
            ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}       

       
        }
    }

    @media (max-width: 1070px) and (min-width: 701px)
    {
        .OpenTicketsArea {
        padding: 1.5rem;   
        }
    }

    @media (max-width: 700px) {
    .Title {
       text-align: left;
       margin: -1.5rem 0 1.5rem 0;
   }

   .list {
    grid-template-columns: repeat(2, 1fr);
   }

   h2 {
       text-align: left;
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

    .shelter_form {      
        .RestrictionCheckArea
        {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            margin-top: 1rem;
            label {
                min-width: 50%;
                margin: 0.3rem;
                padding: 0.15rem;
            }            
        }       
        .Buttons {            
            Button { 
                padding: 0.4rem;                                             
                min-width: 10%;
            }
            .Add, .Edit, .Clear, .Save, .Delete {
                padding: 0.6rem;
                width: 100%;
                margin-bottom: 1rem;
            }
        }
        .Add:hover, .Edit:hover, .Clear:hover, .Save:hover, .Create:hover, .Delete:hover {
            background-color: rgba(127,126,126,0.68);
            font-weight: bold;
            cursor: pointer;
        }
    }
   
    .OpenTicketsArea {
        padding: 1.5rem;   
    }
        .previous_tickets {                   
          div{
              max-width: 70vw;
          }  
    }
    .RecentTicketsArea{
        margin-left: 7.5rem;
    }
}
.RecentTicketsArea{
    margin-top: 30px;
    min-width: 40%;
    h2 {
        text-align: center;
    }
    .recent_tickets{
           display: grid;
            border: 2px solid #cccccc;
            border-right: none;
            border-radius: 10px;
            justify-content: space-evenly;
            padding: 1.5rem;
            overflow-y: scroll;
            max-height: 50rem;
            //scrollbar will probably break at some point..... sorry lads
            ::-webkit-scrollbar{width:1rem}
            ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
            ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
            div {
                width: 100%;
            } 
    }
}
#SearchShelter{
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    padding: 0.5rem;
}
`

const ShelterPage = (props) => {
    const location = useLocation()
    let shelterList = props.shelters;
    if(shelterList == undefined){ // if no shelters exist in the database
        shelterList = [{shelter:{
            Address: "",
            Alcohol: "",
            Cell: "",
            City: "",
            Contact: " TEST",
            Name: "No shelters in Database",
            Phone: "",
            Postal: "",
            Province: "",
            email: "",
            requirements: {accessibilty: false, drugAlcoholDep: false, kids:{
              AgeRange: "",
              kidsExist: false}, mentalHealthPrescrip: false, physicalHealthPrescrip: false, serviceAnimal: false},
            shelterID: 10000
          }
    
        }]
    }
    const [filteredShelters, setfilteredShelters] = useState(shelterList)
    
    let tickets = props.tickets;
    let incomingID = new URLSearchParams(location.search).get('ID');
    
    const [chosenShelter, setChosenShelter] = useState(null)
    const [genderRadio, setGenderRadio] = useState('All')
    useEffect(()=> {
        chooseThisShelterByURL(incomingID)
    },[]);
    // when radio button is changed
    function onChangeRadioButton(e) {
        setGenderRadio(e);   
    }

    // when text is entered into the search text field, it filters shelters and gives the search results
    function onChangeShelter(){
        let search = document.getElementById("SearchShelter").value;

            let filteredShelters = shelterList.filter((shelter) =>{
            let shelterName = String(shelter.shelter.Name).toLowerCase()
            let searchvalue = String(search).toLowerCase()
            
            if (shelterName.includes(searchvalue)) {
                return shelter
            }
        })
        setfilteredShelters(filteredShelters)

    }

    // when a shelter card is selected
    function chooseThisShelter(event) {
        const chosenShelterID = event.currentTarget.querySelector('#shelter-id').innerText;
        const clickedShelter = shelterList.find((shelter) => {
            if (String(shelter.shelter.shelterID).trim() == chosenShelterID) {
                return shelter;
            }
        })
        if (tickets != null) {
            let chosenTickets = tickets.filter((ticket) => {
                if (ticket.Ticket.ShelterID == clickedShelter.shelter.shelterID) {
                    return ticket
                }
            })
            setChosenShelter({ clickedShelter, tickets: { chosenTickets } })
        }
        else {
            setChosenShelter({ clickedShelter, tickets: null })
        }
    }
    // choosing a shelter by passing URL
    function chooseThisShelterByURL(ID) {
        const chosenShelterID = ID;
        
        if(ID != null){

            const clickedShelter = shelterList.find((shelter) => {
                if (String(shelter.shelter.shelterID).trim() == chosenShelterID) {
                    return shelter;
                }
            })
            if (tickets != null) {
                let chosenTickets = tickets.filter((ticket) => {
                    if (ticket.Ticket.ShelterID == clickedShelter.shelter.shelterID) {
                        return ticket
                    }
                })
                setChosenShelter({ clickedShelter, tickets: { chosenTickets } })
            }
            else {
                setChosenShelter({ clickedShelter, tickets: null })
            }
        }
        
    }

    // checking if an email address is already assigned with another shelter in the database
    function isDuplicateEmail(email){
        const clickedShelter = shelterList.find((shelter) => {
            if (chosenShelter == null){
                if (String(shelter.shelter.email).trim() == String(email).trim()){
                    return shelter;
                }
            }
            else{
                if (String(shelter.shelter.shelterID).trim() != chosenShelter.clickedShelter.shelter.shelterID && String(shelter.shelter.email).trim() == String(email).trim()) {
                    return shelter;
                }
            }

        })
        
        if (clickedShelter != undefined){
            return true;
        }
        else{
            return false;
        }
    }
    // checking if shelter name is already assigned with another shelter in the database
    function isDuplicateName(name){
        const clickedShelter = shelterList.find((shelter) => {
            if (chosenShelter == null){
                if (String(shelter.shelter.Name).trim() == String(name).trim()){
                    return shelter;
                }
            }
            else{
                if (String(shelter.shelter.shelterID).trim() != chosenShelter.clickedShelter.shelter.shelterID && String(shelter.shelter.Name).trim() == String(name).trim()) {
                    return shelter;
                }
            }

        })
        
        if (clickedShelter != undefined){
            return true;
        }
        else{
            return false;
        }
    }
    // checking if Shelter address is already assigned with another shelter in the database
    function isDuplicateAddress(address){
        const clickedShelter = shelterList.find((shelter) => {
            if (chosenShelter == null){
                if (String(shelter.shelter.Address).trim() == String(address).trim()){
                    return shelter;
                }
            }
            else{
                if (String(shelter.shelter.shelterID).trim() != chosenShelter.clickedShelter.shelter.shelterID && String(shelter.shelter.Address).trim() == String(address).trim()) {
                    return shelter;
                }
            }

        })
        
        if (clickedShelter != undefined){
            return true;
        }
        else{
            return false;
        }
    }

    // before creating or updating records, input validation is checked.. if validation fails, database operation is cancelled
     function performInputValidation(){
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/; // phone number string format
        var postalcode = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/; // postal code string format
        var lettersonly = /^[A-Za-z]+$/; // letters only string format
        // email address string format
        var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        
        if (document.getElementById("ShelterName").value == ""){
            alert("Shelter Name can not be empty");
            return false;
        }
        else if (document.getElementById("Address").value == "") {
            alert("Address can not be empty");
            return false;
        }
        else if (document.getElementById("City").value == "") {
            alert("City can not be empty");
            return false;
        }
        else if (document.getElementById("Province").value == "") {
            alert("Province can not be empty");
            return false;
        }
        else if (document.getElementById("PostalCode").value == "") {
            alert("Postal Code can not be empty");
            return false;
        }
        else if (document.getElementById("PContact").value == "") {
            alert("Contact can not be empty");
            return false;
        }
        else if (document.getElementById("Phone").value == "") {
            alert("Phone cannot be empty")
            return false;
        }
        else if ((document.getElementById("Phone").value != "") && (phoneno.test(String(document.getElementById("Phone").value)) == false)) {
            alert("Enter a valid phone number.")
            return false;
        }
        else if ((document.getElementById("PostalCode").value != "") && (postalcode.test(String(document.getElementById("PostalCode").value)) == false)) {
            alert("Enter a valid postal code.")
            return false;
        }
        else if ((document.getElementById("Email").value != "") && (email.test(String(document.getElementById("Email").value)) == false)) {
            alert("Enter a valid email address.")
            return false;
        }
        else if ((document.getElementById("City").value != "") && (lettersonly.test(String(document.getElementById("City").value)) == false)) {
            alert("Enter a valid city. Letters are only accepted.")
            return false;
        }
        else if ((document.getElementById("Province").value != "") && (lettersonly.test(String(document.getElementById("Province").value)) == false)) {
            alert("Enter a valid province. Letters are only accepted.")
            return false;
        }
        else if ((document.getElementById("Cell").value != "") && (phoneno.test(String(document.getElementById("Cell").value)) == false)) {
            alert("Enter a valid cell phone number.")
            return false;
        }
        else if (document.getElementById("Email").value == "" ){
            alert("Email can not be empty");
            return false;
        }
        else if (isDuplicateEmail(document.getElementById("Email").value)){
            alert("Email address is already in use with an another shelter.");
            return false;
        }
        else if (isDuplicateName(document.getElementById("ShelterName").value)){
            alert("That Shelter name already exists in the database!");
            return false;
        }
        else if (isDuplicateAddress(document.getElementById("Address").value)){
            alert("A Shelter in our database already has this address!");
            return false;
        }
        else {
            return true;
        }
    }

    // function is called when save button is clicked
    function SaveShelter(e) {
        e.preventDefault()
        if (chosenShelter != null && window.confirm("Are you sure you want to update this shelter?")) {
            let indexNumber = 0;
            shelterList.find((shelter) => {
                indexNumber++
                if (shelter.shelter.shelterID == chosenShelter.clickedShelter.shelter.shelterID) {
                    return indexNumber;
                }
            })

            let shelterObject = {
                shelter: {
                    Address: document.getElementById("Address").value,
                    Cell: document.getElementById("Cell").value,
                    City: document.getElementById("City").value,
                    Contact: document.getElementById("PContact").value,
                    Name: document.getElementById("ShelterName").value,
                    Phone: document.getElementById("Phone").value,
                    Postal: document.getElementById("PostalCode").value,
                    email: document.getElementById("Email").value,
                    shelterID: chosenShelter.clickedShelter.shelter.shelterID,
                    Province: document.getElementById("Province").value,
                    requirements: {
                        acceptedGender: genderRadio,
                        accessability: document.getElementById("AccessibilityCheckbox").checked,
                        drugAlcoholDep: document.getElementById("alcoholCheckbox").checked,
                        mentalHealthPrescrip: document.getElementById("MentalPrescripCheckbox").checked,
                        physicalHealthPrescrip: document.getElementById("PhysicalPrescripCheckbox").checked,
                        serviceAnimal: document.getElementById("ServiceAnimalCheckbox").checked,
                        kids: {
                            kidsExist: document.getElementById("KidsCheckBox").checked
                        }

                    },
                    Notes: document.getElementById("notes").value
                }
            }

            let isInputValid = performInputValidation();


            if (isInputValid) {
                set(ref(Rtdb, "ShelterList/" + (indexNumber - 1)), shelterObject);  // saved to database
                window.location.reload();

            }
        }
    }

    // function is called when delete shelter button is clicked
    function onDelete(e) {
        e.preventDefault();
        if (chosenShelter != null && window.confirm("Are you sure you want to delete this shelter? This information will be deleted permanently and cannot be recovered."));
            {
            
            let newArray = [];
            const shelterEmail = chosenShelter.clickedShelter.shelter.email;
            shelterList.forEach(element => {
                if (element.shelter.shelterID !== chosenShelter.clickedShelter.shelter.shelterID) {
                    newArray.push(element)
                }
            })
            set(ref(Rtdb, 'ShelterList/'), newArray); 
            window.location.reload();
        }
    
    }

    // function is called when add shelter button is clicked
    function AddShelter(e) {
        e.preventDefault()
        if (chosenShelter == null && window.confirm("Are you sure you want to add this shelter?")) {
            let shelterObject = {
                shelter: {
                    Address: document.getElementById("Address").value,
                    Cell: document.getElementById("Cell").value,
                    City: document.getElementById("City").value,
                    Contact: document.getElementById("PContact").value,
                    Name: document.getElementById("ShelterName").value,
                    Phone: document.getElementById("Phone").value,
                    Postal: document.getElementById("PostalCode").value,
                    email: document.getElementById("Email").value,
                    shelterID: uuid(),
                    Province: document.getElementById("Province").value,
                    requirements: {
                        acceptedGender: genderRadio,
                        accessability: document.getElementById("AccessibilityCheckbox").checked,
                        drugAlcoholDep: document.getElementById("alcoholCheckbox").checked,
                        mentalHealthPrescrip: document.getElementById("MentalPrescripCheckbox").checked,
                        physicalHealthPrescrip: document.getElementById("PhysicalPrescripCheckbox").checked,
                        serviceAnimal: document.getElementById("ServiceAnimalCheckbox").checked,
                        kids: { kidsExist: document.getElementById("KidsCheckBox").checked }
                    },
                    Notes: document.getElementById("notes").value
                }
            }
            let isInputValid = performInputValidation()
            if (isInputValid) {
                if(props.shelters == undefined){ // if there are no existing shelters
                    set(ref(Rtdb, "ShelterList/" + 0), shelterObject);
                window.location.reload()
                }
                else{
                    set(ref(Rtdb, "ShelterList/" + shelterList.length), shelterObject);
                    window.location.reload()
                }
                
            }
        }
    }
    // function is called when clear button is clicked
    function clearForm(e) {
        e.preventDefault()
        if (window.confirm("Are you sure you want to clear all form fields?")) {
            document.getElementById("ShelterName").value = ""
            document.getElementById("Address").value = ""
            document.getElementById("City").value = ""
            document.getElementById("Province").value = ""
            document.getElementById("PostalCode").value = ""
            document.getElementById("PContact").value = ""
            document.getElementById("Phone").value = ""
            document.getElementById("Email").value = ""
            document.getElementById("Cell").value = ""
            document.getElementById("notes").value = ""
            document.getElementById(
                "MentalPrescripCheckbox"
            ).checked = false
            document.getElementById(
                "PhysicalPrescripCheckbox"
            ).checked = false
            document.document.getElementById(
                "AccessibilityCheckbox"
            ).checked = false
            document.getElementById(
                "ServiceAnimalCheckbox"
            ).checked = false
            document.getElementById("KidsCheckBox").checked = false
            document.getElementById("alcoholCheckbox").checked = false
            setChosenShelter(null)
        }
    }
    const loggedInUserGroup = getGroupUserBelongsTo(props.shelters, props.agents) // checking what group user belongs to
    if (loggedInUserGroup === "cease") {

        if (chosenShelter == null) {
            return (
                <ShelterPageStyles>

                    <div className="shelter_form">
                        <h2 className="Title">Shelter Information</h2>
                        
                        <form>
                            <div className="ShelterInfo">
                                <div className="Input">
                                    <label>
                                        Shelter Name:
                                    </label>
                                    <input type="text" name="ShelterName" id="ShelterName" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Address:
                                    </label>
                                    <input type="text" name="Address" id="Address" />
                                </div>
                                <div className="Input">
                                    <label>
                                        City:
                                    </label>
                                    <input type="text" name="City" id="City" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Province:
                                    </label>
                                    <input type="text" name="Province" id="Province" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Postal Code:
                                    </label>
                                    <input type="text" name="PostalCode" id="PostalCode" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Point of Contact:
                                    </label>
                                    <input type="text" name="PContact" id="PContact" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Phone:
                                    </label>
                                    <input type="phone" name="Phone" id="Phone" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Email:
                                    </label>
                                    <input type="email" name="Email" id="Email" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Cell:
                                    </label>
                                    <input type="phone" name="Cell" id="Cell" />
                                </div>

                            </div>
                            <h2>Able to accommodate</h2>
                            {/* https://www.npmjs.com/package/react-radio-buttons */}
                            <RadioGroup id="GenderButtonGroup" value={genderRadio} onChange={onChangeRadioButton} >
                                <RadioButton rootColor="black" value="Male">Male</RadioButton>
                                <RadioButton rootColor="black" value="Female">Female</RadioButton>
                                <RadioButton rootColor="black" value="All">All</RadioButton>
                            </RadioGroup>
                            <div className="RestrictionCheckArea">
                                <label>
                                    <input type="checkbox" id="MentalPrescripCheckbox" />
                                    Mental Health Rx

                                </label>
                                <label>
                                    <input type="checkbox" id="PhysicalPrescripCheckbox" />
                                    Physical Health Rx

                                </label>
                                <label>
                                    <input type="checkbox" id="alcoholCheckbox" />
                                    Drug/Alcohol Dependency

                                </label>
                                <label>
                                    <input type="checkbox" id="AccessibilityCheckbox" />
                                    Accessibility (Mobility Challenges)
                                </label>
                                <label>
                                    <input type="checkbox" id="ServiceAnimalCheckbox" />
                                    Service Animals
                                </label>
                                <label>
                                    <input type="checkbox" id="KidsCheckBox" />
                                    Kids
                                </label>
                            </div>
                            <div className="Notes">
                                <label>
                                    Additional notes:
                                </label>
                                <textarea className="TextBox" type="text" id="notes" rows="7" />
                            </div>
                            <div className="Buttons">
                                <button disabled="true" className="Delete" onClick={onDelete} >Delete Shelter</button>
                                <button className="Clear" onClick={clearForm}>Clear Form</button>
                                <button className="Add" onClick={AddShelter}>Add New</button>
                                <button disabled="true" className="Save" onClick={SaveShelter} >Update Shelter</button>
                            </div>
                        </form>

                    </div>
                    <div className="OpenTicketsArea">
                        <h2 className="Title">Shelter List</h2>
                        <input id="SearchShelter" placeholder="Type here to search shelters" type="text" onChange={onChangeShelter}/>
                        <div className="previous_tickets">
                            <div className="list">                                
                                {filteredShelters.map((shelter) => (
                                    <ShelterCard shelter={shelter.shelter} onClick={chooseThisShelter} />
                                ))}                                
                            </div>

                        </div>
                    </div>
                </ShelterPageStyles>
            );
        }
        else {
            document.getElementById("ShelterName").value = chosenShelter.clickedShelter.shelter.Name
            document.getElementById("Address").value = chosenShelter.clickedShelter.shelter.Address
            document.getElementById("City").value = chosenShelter.clickedShelter.shelter.City
            document.getElementById("Province").value = chosenShelter.clickedShelter.shelter.Province
            document.getElementById("PostalCode").value = chosenShelter.clickedShelter.shelter.Postal
            document.getElementById("PContact").value = chosenShelter.clickedShelter.shelter.Contact
            document.getElementById("Phone").value = chosenShelter.clickedShelter.shelter.Phone
            document.getElementById("Email").value = chosenShelter.clickedShelter.shelter.email
            document.getElementById("Cell").value = chosenShelter.clickedShelter.shelter.Cell
            document.getElementById("MentalPrescripCheckbox").checked = chosenShelter.clickedShelter.shelter.requirements.mentalHealthPrescrip
            document.getElementById("PhysicalPrescripCheckbox").checked = chosenShelter.clickedShelter.shelter.requirements.physicalHealthPrescrip
            document.getElementById("alcoholCheckbox").checked = chosenShelter.clickedShelter.shelter.requirements.drugAlcoholDep
            document.getElementById("AccessibilityCheckbox").checked = chosenShelter.clickedShelter.shelter.requirements.accessability
            document.getElementById("ServiceAnimalCheckbox").checked = chosenShelter.clickedShelter.shelter.requirements.serviceAnimal
            document.getElementById("KidsCheckBox").checked = chosenShelter.clickedShelter.shelter.requirements.kids.kidsExist
            document.getElementById("notes").value = chosenShelter.clickedShelter.shelter.Notes
            function clearForm(e) {
                if (window.confirm("Are you sure you want to clear all form fields?")) {
                    document.getElementById("ShelterName").value = ""
                    document.getElementById("Address").value = ""
                    document.getElementById("City").value = ""
                    document.getElementById("Province").value = ""
                    document.getElementById("PostalCode").value = ""
                    document.getElementById("PContact").value = ""
                    document.getElementById("Phone").value = ""
                    document.getElementById("Email").value = ""
                    document.getElementById("Cell").value = ""
                    document.getElementById("notes").value = ""
                    document.getElementById("MentalPrescripCheckbox").checked = false
                    document.getElementById("PhysicalPrescripCheckbox").checked = false
                    document.getElementById("alcoholCheckbox").checked = false
                    document.getElementById("AccessibilityCheckbox").checked = false
                    document.getElementById("ServiceAnimalCheckbox").checked = false
                    document.getElementById("KidsCheckBox").checked = false
                    setChosenShelter(null)
                }
             }
            function renderTickets(){
                if (chosenShelter.tickets != null){
                    return(
                        chosenShelter.tickets.chosenTickets.map((ticket) => (
                            <OpenTicket ticket={ticket.Ticket} />
                        ))
                    );
                }
            }
            return (
                <ShelterPageStyles>

                    <div className="shelter_form">
                        <h2 className="Title">Shelter Information</h2>

                        <form>
                            <div className="ShelterInfo">
                                <div className="Input">
                                    <label>
                                        Shelter Name:
                                    </label>
                                    <input type="text" name="ShelterName" id="ShelterName" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Address:
                                    </label>
                                    <input type="text" name="Address" id="Address" />
                                </div>
                                <div className="Input">
                                    <label>
                                        City:
                                    </label>
                                    <input type="text" name="City" id="City" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Province:
                                    </label>
                                    <input type="text" name="Province" id="Province" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Postal Code:
                                    </label>
                                    <input type="text" name="PostalCode" id="PostalCode" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Point of Contact:
                                    </label>
                                    <input type="text" name="PContact" id="PContact" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Phone:
                                    </label>
                                    <input type="phone" name="Phone" id="Phone" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Email:
                                    </label>
                                    <input type="email" name="Email" id="Email" />
                                </div>
                                <div className="Input">
                                    <label>
                                        Cell:
                                    </label>
                                    <input type="phone" name="Cell" id="Cell" />
                                </div>

                            </div>
                            <h2>Able to accommodate</h2>

                            {/* https://www.npmjs.com/package/react-radio-buttons */}
                            <RadioGroup id="GenderButtonGroup" value={chosenShelter.clickedShelter.shelter.requirements.acceptedGender} onChange={onChangeRadioButton} >
                                <RadioButton rootColor="black" value="Male">Male</RadioButton>
                                <RadioButton rootColor="black" value="Female">Female</RadioButton>
                                <RadioButton rootColor="black" value="All">All</RadioButton>
                            </RadioGroup>
                            <div className="RestrictionCheckArea">

                                <label>
                                    <input type="checkbox" id="MentalPrescripCheckbox" />
                                    Mental Health Rx
                                </label>

                                <label>
                                    <input type="checkbox" id="PhysicalPrescripCheckbox" />
                                    Physical Health Rx
                                </label>

                                <label>
                                    <input type="checkbox" id="alcoholCheckbox" />
                                    Drug/Alcohol dependency
                                </label>

                                <label>
                                    <input type="checkbox" id="AccessibilityCheckbox" />
                                    Accessibility (Mobility Challenges)
                                </label>

                                <label>
                                    <input type="checkbox" id="ServiceAnimalCheckbox" />
                                    Service Animal
                                </label>
                                <label>
                                    <input type="checkbox" id="KidsCheckBox" />
                                    Kids
                                </label>
                            </div>
                            <div className="Notes">
                                <label>
                                    Additional Notes:
                                </label>
                                <textarea placeholder="Notes" type="text" id="notes" rows="7" />
                            </div>
                            <div className="Buttons">
                                <button className="Delete" onClick={onDelete} >Delete Shelter</button>
                                <button className="Clear" onClick={clearForm}>Clear Form</button>
                                <button disabled="true" className="Add" onClick={AddShelter}>Add New</button>
                                <button className="Save" onClick={SaveShelter} >Update Shelter</button>
                            </div>
                        </form>
                    </div>
                    <div className="RecentTicketsArea">
                        <h2 className="Title">Recent Tickets</h2>
                        <div className="recent_tickets">
                            {renderTickets()}                            
                        </div>
                    </div>
                </ShelterPageStyles>);
       }
    }
    else if (loggedInUserGroup === "shelter") {
        return (<Redirect to="/shelter/mainmenu" />);
    }
    else {
        return (<Redirect to="/login" />);
    }
}

export default ShelterPage;