import React from 'react';
import {useState, useRef, useEffect} from 'react';
import styled from 'styled-components';

const Footer = () => {

  return (
    <FooterSection>
      <FooterContainer>
        <LeftContainer>
          © {new Date().getFullYear()} CMPSC 263
        </LeftContainer>
        <CenterContainer>
          <Link href="#">Privacy Policy</Link> | <Link href="#">Terms of Service</Link>
        </CenterContainer>
        <RightContainer>
          <SocialIcon href="#" aria-label="Facebook">FB</SocialIcon>
          <SocialIcon href="#" aria-label="Twitter">TW</SocialIcon>
          <SocialIcon href="#" aria-label="Instagram">IG</SocialIcon>
        </RightContainer>
      </FooterContainer>
    </FooterSection>
  );
};

const clickButton = styled.button`

`;

const FooterSection = styled.footer`

`;

const FooterContainer = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 20px 36px;
height: 40px;
background-color: #2E7D32;
color: white;

`;

const LeftContainer = styled.div`
font-size: 14px;`;

const CenterContainer = styled.div``;

const RightContainer = styled.div`
display: flex;
align-items: center;
gap: 16px;
`;

const Link = styled.a`
color: white;
text-decoration: none;
font-size: 14px;
`;

const SocialIcon = styled.a`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  &:hover {
    color: #007bff;
  }
`;

export default Footer;
