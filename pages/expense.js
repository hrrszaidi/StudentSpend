import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useStateContext } from '@/context/StateContext'
import { getDocument, setDocument } from '@/backend/Database'
import { useRouter } from 'next/router'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'

const AddExpense = () => {
    const { user } = useStateContext()
    const router = useRouter()

    const [amount, setAmount] = useState('') // Amount input
    const [category, setCategory] = useState('') // Category selection
    const [description, setDescription] = useState('') // Short description of the expense
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // Default to today's date

    const amountRef = useRef(null)
    // List of predefined categories for expenses 
    const categories = ['Food', 'Transportation', 'Education', 'Shopping', 'Utilities', 'Other']

    // Redirect to home if user is not authenticated
    useEffect(() => {
        if(user===null){
            router.push('/')
        }
    }, [user])

    // Focus the amount input field when the component mounts
    useEffect(() => {
        if (amountRef.current) {
            amountRef.current.focus()
        }
    }, [])

    /* -Validates the form inputs before adding an expense
       -Creates the expense object
       -Reads existing expenses array from DB
       -Appends new expense
       -Writes updated array back to DB
       -Redirects user back to dashboard */
    function handleAddExpense() {
        if(!user || !amount || !category || !description){
            alert("Please fill in all fields.")
            return
        }
        // Proceed with adding the expense
        const expense = {
            id: Date.now().toString(),
            amount: parseFloat(amount),
            category: category,
            description: description,
            date: date
        }
        
        getDocument('expenses', user.uid)
        .then((data) => {
            const currentItems = data?.items || []
            const updatedItems = [...currentItems, expense]
            return setDocument('expenses', user.uid, { items: updatedItems })
        })
        .then(() => {
            console.log('Expense added successfully')
            router.push('/dashboard')
        })
        .catch((error) => {
            console.error('Error adding expense:', error)
        })
    }

    return (
        <Section>
            <DashboardNavbar />
            <Content>
                <FormCard>
                    <FormTitle>Add Expense</FormTitle>
                    <FormSubtitle>Fill in the details of your expense</FormSubtitle>
                    {/* Amount input field */}
                    <Label>Amount</Label>
                    <InputGroup>
                        <InputAmount ref={amountRef} type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    </InputGroup>
                    {/* Category selection buttons - highlight the selected category */}
                    <Label>Category</Label>
                    <CategoryGrid>
                        {/* Map through predefined categories and create a button for each. The selected category is highlighted. */}
                        {categories.map((cat) => (
                            <CategoryBtn key={cat} selected={category === cat} onClick={() => setCategory(cat)}>{cat}</CategoryBtn>
                        ))}
                    </CategoryGrid>
                    {/* Description input field */}
                    <Label>Description</Label>
                    <Input type="text" placeholder="Enter a description" value={description} onChange={(e) => setDescription(e.target.value)} />
                    {/* Date input field */}
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <SubmitButton onClick={handleAddExpense}>Add Expense</SubmitButton>
                </FormCard>
            </Content>
        </Section>
    )
}

const Section = styled.section`
min-height: 100vh;
background-color: #f5f5f5;
`;

const Content = styled.div`
max-width: 500px;
margin: 0 auto;
padding: 32px 20px;
`;

const FormCard = styled.div`
background-color: white;
padding: 32px;
border-radius: 12px;
`;

const FormTitle = styled.h1`
font-size: 24px;
font-weight: 700;
color: #1a1a1a;
margin-bottom: 4px;
`;

const FormSubtitle = styled.p`
font-size: 14px;
color: #888;
margin-bottom: 24px;
`;

const Label = styled.label`
font-size: 14px;
font-weight: 600;
color: #333;
display: block;
margin-bottom: 8px;
margin-top: 20px;
`;

const InputGroup = styled.div`
display: flex;
align-items: center;
border: 1px solid #ddd;
border-radius: 8px;
padding: 12px 16px;
gap: 8px;

&:focus-within {
border-color: #2E7D32;
}
`;

const InputAmount = styled.input`
flex: 1;
border: none;
outline: none;
font-size: 16px;
color: #333;
width: 100%;

&::placeholder {
color: #aaa;
}

&:focus {
border-color: #2E7D32;
}
`;

const Input = styled.input`
padding: 12px 16px;
border 1px solid #ddd;
border-radius: 8px;
`;

const CategoryGrid = styled.div`
display: flex;
flex-wrap: wrap;
gap: 8px;
`;

const CategoryBtn = styled.button`
padding: 8px 16px;
border-radius: 20px;
font-size: 14px;
cursor: pointer;
border: 1px solid ${props => props.selected ? '#2E7D32' : '#ddd'};
background-color: ${props => props.selected ? '#2E7D32' : 'white'};
color: ${props => props.selected ? 'white' : '#555'};
font-weight: ${props => props.selected ? '600' : '400'};

&:hover {
border-color: #2E7D32;
}
`;

const SubmitButton = styled.button`
width: 100%;
background-color: #2E7D32;
color: white;
font-size: 16px;
font-weight: 600;
padding: 14px;
border: none;
border-radius: 8px;
cursor: pointer;
margin-top: 28px;

&:hover {
background-color: #1B5E20;
}
`;

export default AddExpense