import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Link from 'next/link';

const AnimalPage = () => {
  const router = useRouter();
  const { animalSlug } = router.query;
  
  const [animalData, setAnimalData] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (animalSlug) {
      fetch(`/api/animals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({animal: animalSlug})
      })
        .then(response => response.json())
        .then(data => setAnimalData(data))
        .catch(error => console.log('Error fetching animal data:', error));
    }
  }, [animalSlug]);

  return (
    <Section ref={sectionRef}>
      <TopHeader>Animal Info</TopHeader>
      {animalData ? (
        <Content>
          <h2>{animalData.name}</h2>
          <p>{animalData.habitat}</p>
          <Image src={animalData.image} alt={animalData.name} />
        </Content>
      ) : (
        <p>Loading...</p>
      )}
      <BackLink href="/">Back to Landing Page</BackLink>
    </Section>
  );
};

// STYLED COMPONENTS
const Section = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const TopHeader = styled.h1`
  font-size: 28px;
  margin-bottom: 20px;
`;

const Content = styled.div`
  text-align: center;
  max-width: 600px;
`;

const Image = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-top: 10px;
  border-radius: 10px;
`;

const BackLink = styled(Link)`
  margin-top: 20px;
  font-size: 18px;
  color: blue;
  text-decoration: underline;
  cursor: pointer;
`;

export default AnimalPage;
