import React from 'react';
import {auth} from "../../../firebase/firebaseConfig";
// this function determines what group a user belongs to
function getGroupUserBelongsTo(shelters, agents){
    let shelterContainingEmail = undefined;
    let agentContainingEmail = undefined;
    //if someone IS logged in 
    //if the email matches a shelter email
    // if logged in but no email == cease agent
    if (shelters != undefined) {
        shelterContainingEmail = shelters.find((shelter) => {
            if (auth.currentUser != null) {

                if (auth.currentUser.email.toUpperCase() == shelter.shelter.email.toUpperCase()) {
                    return shelter
                }
            }
        })
     }

         
         if(agents != undefined){
             agentContainingEmail = agents.find((agent) => {
              if (auth.currentUser != null) {
                if (
                  auth.currentUser.email.toUpperCase() == agent.email.toUpperCase()
                ) {
                  return agent;
                }
              }
            });
        }
   
    //auth.currentUser 
    if(auth.currentUser == null){
        return null
    }
    else{
        //we are logged in

        if(shelterContainingEmail != undefined){
            return "shelter"
        }
        if(agentContainingEmail != undefined){
            return "cease"
        }
        else{
            return"deleted"
        }
    }
}




export default getGroupUserBelongsTo;