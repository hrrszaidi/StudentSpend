import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import {login, isEmailInUse} from '@/backend/Auth'
import Link from 'next/link'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/backend/Firebase'

const Login = () => {

  const { user, setUser } = useStateContext()
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const router = useRouter()


  async function handleLogin(){
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(`User ${user.email} logged in successfully!`);
        setUser(user);
        router.push('/dashboard')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error during login:', errorCode, errorMessage);
        alert('Login failed: ' + errorMessage);
    });
  }

  return (
    <>
    <Section>
      <ImageSide>
        <SideImage src="/signup-bg.jpg" alt="Side Image" />
      </ImageSide>

      <FormSide>
        <FormContainer>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <BrandName>StudentSpend</BrandName>
          </Link>
          <FormTitle>Log in to your account</FormTitle>
          <FormSubtitle>Welcome back! Please enter your details.</FormSubtitle> 

          <InputGroup>
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/> 
          </InputGroup>

          <InputGroup>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </InputGroup>

          <ContinueButton onClick={handleLogin}>Log In</ContinueButton>

          <SignUpText>Don't have an account? <SignUpLink href="/auth/signup">Sign Up</SignUpLink></SignUpText>
        </FormContainer>
      </FormSide>
    </Section>
    </>
  )
}

const Section = styled.div`
display: flex;
height: 100vh;
background-color: white;

@media(max-width: 768px) {
flex-direction: column;
}
`;

const ImageSide = styled.div`
flex: 1;
position: relative;
overflow: hidden;

@media(max-width: 768px) {
min-height: 200px;
}
`;

const SideImage = styled.img`
width: 100%;
height: 100%;
object-fit: cover;
`;

const FormSide = styled.div`
flex: 1;
display: flex;
align-items: center;
justify-content: center;
padding: 40px;
`;

const FormContainer = styled.div`
width: 100%;
max-width: 400px;
display: flex;
flex-direction: column;
gap: 16px;
`;

const BrandName = styled.h3`
font-size: 28px;
font-weight: 700;
color: #2E7D32;
text-align: center;
margin-bottom: 8px;
cursor: pointer;
`;

const FormTitle = styled.h2`
font-size: 28px;
font-weight: 700;
color: #1a1a1a;
`;

const FormSubtitle = styled.p`
font-size: 16px;
color: #888;
margin-bottom: 8px;
`;

const InputGroup = styled.div`
display: flex;
align-items: center;
border: 1px solid #ddd;
border-radius: 8px;
padding: 12px 16px;
gap: 12px;

&:focus-within {
border-color: #2E7D32;
}
`;

const Input = styled.input`
flex: 1;
border: none;
outline: none;
font-size: 16px;
color: #333;

&::placeholder {
color: #aaa;
}
`;

const ContinueButton = styled.button`
background-color: #2E7D32;
color: white;
font-size: 16px;
font-weight: 600;
padding: 14px;
border: none;
border-radius: 8px;
cursor: pointer;
width: 100%;

&:hover {
background-color: #1B5E20;
}
`;


const SignUpText = styled.p`
text-align: center;
font-size: 14px;
color: #666;
margin-top: 8px;
`;

const SignUpLink = styled(Link)`
color: #1a1a1a;
font-weight: 600;
text-decoration: none;

&:hover {
text-decoration: underline;
}
`;

export default Login