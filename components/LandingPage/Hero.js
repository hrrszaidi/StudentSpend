import React, {useState, useEffect} from 'react';
import styled, {keyframes} from 'styled-components';
import Link from 'next/link';

const Hero = () => {

  return (
    <Section>
        <Container>
          <HeroTextColumn>
            <BrandName>StudentSpend</BrandName>
            <Header>
              Welcome to your budget, <Highlight>Student.</Highlight>
            </Header>

              <SubHeader>
                Telur dadar, Telur Mata, Telur Rebus, Telur Aku
              </SubHeader>
                <CTAButton href="/auth/signup">Get Started</CTAButton>
          </HeroTextColumn>
          <ImageColumn>
            <Image src="student-budget.jpg" alt="Student managing budget" />
          </ImageColumn>

        </Container>
    </Section>
  );
};

const Section = styled.section`
width: 100%;
min-height: 90vh;
background-color: #f9fafb;
display: flex;
align-items: center;
justify-content: center;
padding: 60px 20px;
`;

const Container = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
max-width: 1100px;
width: 100%;
gap: 40px;

@media (max-width: 768px) {
flex-direction: column;
text-align: center;
}
`;

const HeroTextColumn = styled.div`
flex: 1;
display: flex;
flex-direction: column;
gap: 20px;
`;


const BrandName = styled.h3`
font-size: 20px;
font-weight: 700;
color: #2E7D32;
letter-spacing: 3px; 
min-height: 27px;
`;

const Header = styled.h1`
font-size: 44px;
color: #1a1a1a;
font-weight: 700;
line-height: 1.2;
`;

const Highlight = styled.span`
color: #2E7D32;
`;

const SubHeader = styled.h2`
font-size: 18px;
color: #666;
line-height: 1.6;
`;

const CTAButton = styled(Link)`
background-color: #2E7D32;
color: white;
font-size: 16px;
font-weight: 600;
padding: 14px 32px;
border: none;
border-radius: 6px;
cursor: pointer;
width: fit-content;
text-decoration: none;
display: inline-block;

&:hover {
background-color: #1B5E20;
}

@media (max-width: 768px) {
align-self: center;
}
`;

const ImageColumn = styled.div`
flex: 1;
display: flex;
justify-content: center;
`;

const Image = styled.img`
max-width: 100%;
height: auto;
max-height: 500px;
border-radius: 12px;
object-fit: cover;
`;


export default Hero;
