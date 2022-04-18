/*
    The ShelterCard component is designed to hold the values for the Shelters in a convenient card object-component.
    We are able to see the Shelter Names, in order of when they were entered in the database.
*/
import React from 'react';
import styled from 'styled-components';

const CARD = styled.div`
border: 1px solid grey;
border-radius: 0.25rem;
text-align:center;
position: relative;
display: grid;
padding-left: 0.25rem;
grid-template-columns: max-content;
display: flex;
align-items: center;
justify-content: center;
:hover{
    cursor: pointer;
    background-color: #afafaf;
}
#shelter-id{
    visibility: hidden;
    display: none;
}

`

const ShelterCard = (props) => {
    const shelter = props.shelter
    return ( 
        <CARD {...props}>
                <p id="shelter-id">{shelter.shelterID}</p>
                <p id={shelter.shelterID}>{shelter.Name}</p>         
        </CARD>

     );
}
 
export default ShelterCard;