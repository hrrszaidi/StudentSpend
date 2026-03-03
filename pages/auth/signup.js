import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { useStateContext } from '@/context/StateContext'
import { isEmailInUse, register} from '@/backend/Auth'
import Link from 'next/link'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/backend/Firebase'
import { setDocument } from '@/backend/Database'
const Signup = () => {

  const { user, setUser } = useStateContext()
  const [ fullName, setFullName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ agreeTerms, setAgreeTerms ] = useState(false)

  const router = useRouter()

  async function validateEmail(){
    const emailRegex = /^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if(emailRegex.test(email) == false ){
        return false;
    }
    console.log('so far so good...')
    const emailResponse = await isEmailInUse(email)
    console.log('email response', emailResponse)
    if(emailResponse.length == 0 ){
        return false;
    }

    return true;
}

  async function handleSignup(){
    if(!agreeTerms){
        alert('You must agree to the terms and conditions to sign up.');
        return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        console.log(`User ${user.email} registered successfully!`);
        setUser(user);
        setDocument('users', user.uid, {
            fullName: fullName,
            email: email,
        })
        router.push('/dashboard')
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Error during registration:', errorCode, errorMessage);
        alert('Registration failed: ' + errorMessage);
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
          <FormTitle>Create Your Account</FormTitle>
          <FormSubtitle>Start for free</FormSubtitle>

          <InputGroup>
            <Input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Input type ="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </InputGroup>

          <InputGroup>
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </InputGroup>

          <CheckboxRow>
            <Checkbox type="checkbox" id="agreeTerms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <CheckboxLabel>
              I agree with the <Termslink href="/about">Terms & Condtions</Termslink>
            </CheckboxLabel>
          </CheckboxRow>

          <ContinueButton onClick={handleSignup}>Sign Up</ContinueButton>

          <LoginText>
            Already have an account? <LoginLink href="/auth/login">Log In</LoginLink>
          </LoginText>

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

@media (max-width: 768px) {
flex-direction: column;
}
`;

const ImageSide = styled.div`
flex: 1;
position: relative;
overflow: hidden;

@media (max-width: 768px) {
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
text-align: center;
color: #2E7D32;
margin-bottom: 6px;
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

const CheckboxRow = styled.div`
display: flex;
align-items: center;
gap: 8px;
`;

const Checkbox = styled.input`
width: 18px;
height: 18px;
cursor: pointer;
accent-color: #2E7D32;
`;

const CheckboxLabel = styled.label`
font-size: 14px;
color: #555;
`;

const Termslink = styled(Link)`
color: #007bff;
font-weight: 600;
text-decoration: none;  

&:hover {
text-decoration: underline;
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

&:hover{
background-color: #1B5E20;
}
`;

const LoginText = styled.p`
text-align: center;
font-size: 14px;
color: #666;
margin-top: 8px;
`;

const LoginLink = styled(Link)`
color: #1a1a1a;
font-weight: 600;
text-decoration: none;

&:hover {
text-decoration: underline;
}
`;



export default Signup