import React, { useState, useEffect } from 'react';
//      /** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import peopleData from '../data/people.json';

const PeoplePage = () => {
    const [people, setPeople] = useState([]);
  
    useEffect(() => {
      // Simulating async data loading using setTimeout
      setTimeout(() => {
        setPeople(peopleData);
      }, 1000);
    }, []);
  
    return (
      <div css={pageStyles}>
        <h1>Meet Our People</h1>
        <div css={cardsContainer}>
          {people.map(person => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </div>
    );
};

const PersonCard = ({ person }) => (
  <Card>
    <Name>{person.name}</Name> {/* Bold name with blue color */}
    <Bio>{person.bio}</Bio>
    <a href={person.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </Card>
);

const pageStyles = css`
  padding: 20px;
`;

const cardsContainer = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

const Name = styled.h3`
  margin-top: 10px;
  font-size: 20px;
  font-weight: bold; /* Bold name */
  color: blue; /* Blue color */
`;

const Bio = styled.p`
  margin-top: 10px;
  font-size: 16px;
`;

export default PeoplePage;

  
