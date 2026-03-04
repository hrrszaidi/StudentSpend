import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { auth } from '@/backend/Firebase'
import { signOut } from 'firebase/auth'

const DashboardNavbar = () => {
  const { user, userName } = useStateContext() // Access user and userName (Full Name) from context
  const router = useRouter()

  // Handle user logout by signing out from Firebase Auth and redirecting to home page
  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log('User signed out successfully')
        router.push('/')
      })
      .catch((error) => {
        console.error('Error signing out:', error)
      })
  }

  return (
    <Nav>
        {/* Left side of the navbar with brand name and navigation links */}
        <NavLeft>
            {/* Brand name that links to the dashboard home */}
            <BrandName href="/dashboard">StudentSpend</BrandName>
            <NavLinks>
                <NavItem href="/dashboard" $active={router.pathname ==='/dashboard'}>Dashboard</NavItem>
                <NavItem href="/expense" $active={router.pathname ==='/add-expense'}>Add Expense</NavItem>
                <NavItem href="/reports" $active={router.pathname ==='/reports'}>Reports</NavItem>
            </NavLinks>
        </NavLeft>
        {/* Right side of the navbar showing user's name and logout button */}
        <NavRight>
            <UserName>{userName || user?.email}</UserName>
            <LogOutButton onClick={handleLogout}>Log Out</LogOutButton>
        </NavRight>
    </Nav>
  )
}

const Nav = styled.nav`
display: flex;
align-items: center;
justify-content: space-between;
padding: 16px 32px;
background-color: white;
border-bottom: 1px solid #e0e0e0;
position: sticky;
top: 0;
z-index: 100;
`;

const NavLeft = styled.div`
display: flex;
align-items: center;
gap: 32px;
`;

const BrandName = styled(Link)`
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

const NavItem = styled(Link)`
font-size: 16px;
font-weight: 500;
color: #2E7D32;
text-decoration: none;
padding: 8px 16px;
border-radius: 6px;

&:hover {
color: #2E7D32;
background-color: #E8F5E9;
}
`;

const NavRight = styled.div`
display: flex;
align-items: center;
gap: 16px;
`;

const UserName = styled.span`
font-size: 16px;
color: #666;
font-weight: 500;
`;

const LogOutButton = styled.a`
background: none;
border: 1px solid #ddd;
padding: 8px 16px;
border-radius: 6px;
cursor: pointer;
font-size: 16px;
color: #333;

&:hover {
background-color: #f5f5f5;
}
`;

export default DashboardNavbar