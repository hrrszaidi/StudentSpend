import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { logOut } from '@/backend/Auth';
import { useStateContext } from '@/context/StateContext';
import Home from '@/components/Dashboard/Home'
const Navbar = () => {
  const { setUser } = useStateContext()

  return (
    <Nav>
      <Logo onClick={() => logOut(setUser)} href="/">StudentSpend</Logo>
      <NavLinks>
        <ButtonLink href="/auth/signup">Sign Up</ButtonLink>
        <LoginButton href="/auth/login">Login</LoginButton>
      </NavLinks>
    </Nav>
  );
};

const Nav = styled.nav`
display: flex;
align-items: center;
justify-content: space-between;
padding: 16px 40px;
background-color: white;
border-bottom: 1px solid #e0e0e0;
position: sticky;
top: 0;
z-index: 100;
`;

const Logo = styled(Link)`
font-size: 30px;
font-weight: 900;
color: #2E7D32;
text-decoration: none;
letter-spacing: 1px;
`;

const NavLinks = styled.div`
display: flex;
align-items: center;
gap: 24px;
`;

const ButtonLink = styled(Link)`
font-size: 16px;
color: #333;
text-decoration: none;
font-weight: 500;

&:hover {
color: #2E7D32;
}
`;
const LoginButton = styled(Link)`
font-size: 16px;
font-weight: 600;
color: white;
background-color: #2E7D32;
padding: 10px 24px;
border-radius: 6px;
text-decoration: none;

&:hover {
background-color: #1B5E20;
}
`;
export default Navbar;
