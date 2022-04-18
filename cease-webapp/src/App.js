import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import styled from 'styled-components';
import { MainNavBar } from './components/elements/hotbar/nav';
import MainMenu from './components/pages/mainMenu/mainMenu';
import {ClientPage} from './components/pages/clientProfiles/clientProfilesPage'
import {LoginPage} from './components/pages/login/loginpage';
import { TicketManagementPage } from './components/pages/ticketManagement/ticketManagement';
import { Admin } from "./components/pages/admin/admin";

import { ShelterAdmin } from "./components/pages/shelterPages/shelterAdmin";
import { ShelterNavBar } from "./components/pages/shelterPages/navShelter";
import ShelterPage from './components/pages/shelterProfiles/shelterProfilesPage';
import ShelterViewPage from "./components/pages/shelterPages/shelterMainMenu";

import {Rtdb, auth} from './firebase/firebaseConfig';
import {ref, get} from "firebase/database";
import {  signInWithEmailAndPassword } from "firebase/auth";





//styling object here 
const APPCONTAINER = styled.div`


 overflow-y:scroll;
    height: 100vh;
 ::-webkit-scrollbar{width:1rem}
   ::-webkit-scrollbar-track{background:#cccccc;border-radius:6px}
   ::-webkit-scrollbar-thumb{background:#3c3b67;border-radius:6px}
    

`




function App() {
 const [databaseImage, setDatabaseImage] = useState(null)



  useEffect(()=>{
    // fetching database image from firebase
    get(ref(Rtdb)).then((x) => {
      setDatabaseImage(x.val())  
       }).catch((error) => {
        console.log("Get database Error", error)
         if(error != null){                  
            try {
              signInWithEmailAndPassword(
                auth,
                "loginpageuser@login.ca",
                "loginpage"
              ).then(() => {
                window.location.reload();
              });                            
                  
            } catch (error) {
              console.log(error.message); 
                         
           };
      }
      
      });
  }, []);

  if(databaseImage == null){
    return(<></>);
  }
  else{
    // passing the database image objects as props into various routes as appropriate and needed
    // this way we are calling the database only once after reload
    return (
    <APPCONTAINER>

      <Router>
   
      
      <Switch>
        
        <Route exact path='/'>
        <MainNavBar></MainNavBar>
          <MainMenu tickets={databaseImage.Tickets} shelters={databaseImage.ShelterList} agents = {databaseImage.Agents}></MainMenu>
        </Route>


        <Route exact path='/clientprofile'>
        <MainNavBar></MainNavBar>
          <ClientPage clients={databaseImage.ClientList} tickets = {databaseImage.Tickets} shelters = {databaseImage.ShelterList} agents = {databaseImage.Agents}></ClientPage>
        </Route>

        <Route exact path='/shelterprofile'>
        <MainNavBar></MainNavBar>
          <ShelterPage tickets={databaseImage.Tickets} shelters={databaseImage.ShelterList} agents = {databaseImage.Agents}></ShelterPage>
        </Route>

        <Route exact path='/ticketmanagement'>
        <MainNavBar></MainNavBar>
       <TicketManagementPage tickets={databaseImage.Tickets} shelters={databaseImage.ShelterList} agents={databaseImage.Agents}></TicketManagementPage>
        </Route>

        <Route exact path='/login'>
          <LoginPage  shelters={databaseImage.ShelterList} agents={databaseImage.Agents}/>
        </Route>

        <Route exact path='/admin' >
        <MainNavBar></MainNavBar>
          <Admin shelters={databaseImage.ShelterList} agents = {databaseImage.Agents}></Admin>
        </Route>


        {/* Shelter pages  */}
        <Route exact path='/shelter/mainmenu'>
        <ShelterNavBar></ShelterNavBar>
        <ShelterViewPage shelters={databaseImage.ShelterList} tickets={databaseImage.Tickets} ClientList={databaseImage.ClientList} agents = {databaseImage.Agents}></ShelterViewPage>
        </Route>

        <Route exact path='/shelter/admin'>
        <ShelterNavBar></ShelterNavBar>
        <ShelterAdmin shelters={databaseImage.ShelterList} agents = {databaseImage.Agents}></ShelterAdmin>
        </Route>
        
        
          
      </Switch>
    </Router>

    </APPCONTAINER>
  );
  }
  
}

export default App;
