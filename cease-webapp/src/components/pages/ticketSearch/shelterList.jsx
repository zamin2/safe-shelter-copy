/*
    The ShelterList component is designed to hold the values for the Shelters in a convenient card object-component.
    We are able to see the Shelter Names, in order of when they were entered in the database.
*/

import React from 'react';
import styled from "styled-components";
import { useHistory } from "react-router-dom";


const ShelterCard = styled.div`


.shelterNames {
    margin-top: 1rem;
    overflow-y: scroll;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25rem;
    width: max-content;
    max-height: 37rem;
    
    ::-webkit-scrollbar{width:1rem}
    ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
    ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
    div{
        min-width: 40vw;      
        
    }

}

.shelterList {
  // max-height: 20%;
  // max-width: 80%;
    width: max-content;
}
  
  ul {
    list-style-type: none;
    padding: 0;
    
  }
  
  ul li {
    border: 2px solid #dbdbed;    
    text-decoration: none;
    max-width: 15rem;
    min-width: 8rem;
    position: relative;
    
  }
  
    ul li:hover {
        background-color: #afafaf;
        cursor: pointer;
        
      }
    .shelter-red {
        display: flex;
        background-color: #F4C3CB;
        justify-content: space-between;
    }
    .shelter-green {
        display: flex;
        background-color: #c3f4c3;
        justify-content: space-between;
    }
    .shelter-white {
        display: flex;
        background-color: #ffffff;
        justify-content: space-between;
    }

    @media (max-width: 700px) {
      .shelterNames {    
        grid-template-columns: repeat(2, 1fr);    
        div{
            max-width: 40vw;                 
        }        
    }
    ul li {
      max-width: 9rem;
    }
  }
`

const ShelterList = (props) =>
{
  let history = useHistory();
  const shelterList = props.shelters;
  const ticket = props.ticket;

  //create an array of all the shelters on the ticket reply list by ID 
  const shelterReplysObject = ticket.ShelterReplys.map(shelterResponse => {
    let matchingShelter = shelterList.find(shelter => {
      if(shelter.shelter.shelterID == shelterResponse.ShelterID){
        return shelter; 
      }
      
    })
    if(matchingShelter == undefined){ // if shelter has been deleted after ticket is issued
      
      matchingShelter = {shelter:{
        Address: "",
        Alcohol: "",
        Cell: "",
        City: "",
        Contact: " TEST",
        Name: "DELETED OR NULL SHELTER",
        Phone: "",
        Postal: "",
        Province: "",
        email: "",
        requirements: {accessibilty: false, drugAlcoholDep: false, kids:{
          AgeRange: "",
          kidsExist: false}, mentalHealthPrescrip: false, physicalHealthPrescrip: false, serviceAnimal: false},
        shelterID: 10000
      }

    }}
    return{matchingShelter, shelterResponse}
  })

  function sendToThisShelter(e){
    history.push("/shelterprofile?ID=" + e.currentTarget.id)
  }
    return (
        <ShelterCard>
        <div className="shelterList">
   
       <ul>
           <div className="shelterNames">
           
          {/* create 1 line per shelter response in ticket object */}
          {
            shelterReplysObject.map(shelter => {
              if (shelter.shelterResponse.Reply === "0") {
                return(<li onClick={sendToThisShelter} id={shelter.matchingShelter.shelter.shelterID} className="shelter-white">{shelter.matchingShelter.shelter.Name} <br/> {shelter.matchingShelter.shelter.Address}  </li>);
              }
              else if(shelter.shelterResponse.Reply === true){
                return(<li onClick={sendToThisShelter}  id={shelter.matchingShelter.shelter.shelterID} className="shelter-green">{shelter.matchingShelter.shelter.Name} <br/> {shelter.matchingShelter.shelter.Address}  </li>);
              }
              else{
                return(<li onClick={sendToThisShelter}  id={shelter.matchingShelter.shelter.shelterID} className="shelter-red">{shelter.matchingShelter.shelter.Name} <br/>{shelter.matchingShelter.shelter.Address} </li>);
              }
               
            })
          }
            
           </div>
       </ul>
   </div>
   </ShelterCard>
    );
}
   

export {ShelterList};