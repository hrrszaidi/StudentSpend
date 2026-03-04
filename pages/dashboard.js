import React, { useState, useEffect, useRef, use } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'
import { useStateContext } from '@/context/StateContext'
import { useRouter } from 'next/router'
import { setDocument, getDocument } from '@/backend/Database'


const Dashboard = () => {

  const { user } = useStateContext()  
  const router = useRouter()

  const [budget, setBudget] = useState(null) // Default budget
  const [budgetInput, setBudgetInput] = useState('') // Input state for budget
  const [showBudgetForm, setShowBudgetForm] = useState(false) // Toggle for budget form
  const [expenses, setExpenses] = useState([]) // State to hold expenses
  const [loading, setLoading] = useState(true) // Loading state for budget fetch
  const [exchangeRate, setExchangeRate] = useState(null) // State for exchange rate
  const [selectedCurrency, setSelectedCurrency] = useState('EUR') // State for selected currency

  const budgetInputRef = useRef(null) // Ref for budget input field

  /* When user logs in, we want to load their budget + expenses
     We also want to fetch the exchange rates after the dashboard is accessed
     If user is not logged in, redirect to login page */
  useEffect(() => {
    if (user) {
      loadUserData() // Load user data when component mounts or user changes
      loadExchangeRate() // Load exchange rates when component mounts
    } else if(user === null) {
      router.push('/') // Redirect to home if not authenticated
    }
  }, [user])
  
  /* Focus the budget input when the form is displayed 
     When the form is showed, we want the cursor to automatically focus in the input field
     We check "budgetInputRef.current" to make sure the element is mounted before calling focus() */
  useEffect(() => {
    if (showBudgetForm && budgetInputRef.current) {
      budgetInputRef.current.focus() // Focus the input when form is shown
    }
  }, [showBudgetForm])

  // Data loading function
  function loadUserData(){
    getDocument('budgets', user.uid)
    // If a budget doc exists, set the budget amount
    .then((data) => {
      if (data) {
        setBudget(data.amount)
      } 
      // Chain the next fetch: get expenses doc
      return getDocument('expenses', user.uid)
    })
    .then((data) => {
      // If expenses doc exists and has an "items" array, store it
      if(data && data.items){
        setExpenses(data.items)
      }
      // Once both calls finish, set loading to false -> stop showing loading state UI
      setLoading(false)
    })
    .catch((error) => {
      console.error('Error fetching budget:', error)
      setLoading(false)
    })
  }

  // Function to save the user's budget to Firestore and update state
  function handleSetBudget() {
    const amount = parseFloat(budgetInput)
    // Validation
    if (!amount || amount <= 0) {
      alert('Please enter a valid budget amount')
      return
    }
    // Writes budgets/{userId} document with { amount, month, year }
    setDocument('budgets', user.uid, {
      amount: amount,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    })
    .then(() => {
      console.log('Budget set successfully')
      setBudget(amount) // Update local state with new budget
      setShowBudgetForm(false)
      setBudgetInput('')
    })
    .catch((error) => {
      console.error('Error setting budget:', error)
    })
  }

  /* Loads currency exchange rates from a public API
     Base currency is USD, Rates are stored in state for conversion and calculations*/
  function loadExchangeRate(){
    fetch('https://open.er-api.com/v6/latest/USD')
    .then((response) => {
      // Validation to check if API call was successful
      if(!response.ok){
        throw new Error('Failed to fetch exchange rates')
      }
      return response.json()
    })
    .then((data) => {
      // Only store rates if API response indicates success and contains rates data
      if(data.result === 'success' && data.rates){
        setExchangeRate(data.rates)
      }
    })
    .catch((error) => {
      console.error('Error fetching exchange rates:', error)
    })
  }

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0) // Calculate total spent from expenses
  const remaining = budget ? budget - totalSpent : 0 // Calculate remaining budget

  // Builds an object mapping category -> total amount spent 
  const categoryTotals = {}
  expenses.forEach(expense => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount
    } else {
      categoryTotals[expense.category] = expense.amount
    }
  })

  // If we are still loading user data, show a loading UI instead of the dashboard
  if(loading){
    return (
      <Section>
        <LoadingText>Loading...</LoadingText>
      </Section>
    )
  }

  return (
    <Section>
      <DashboardNavbar />
      <Content>
        {/* If user has no budget and is not currently setting one, show empty state with button to set budget */}
        {!budget && !showBudgetForm && (
          <EmptyState>
            <EmptyTitle>No budget set yet</EmptyTitle>
            <EmptySubtitle>Set a monthly budget to start tracking your spending</EmptySubtitle>
            {/* Clicking button toggles budget form */}
            <GreenButton onClick={() => setShowBudgetForm(true)}>Set Your Budget</GreenButton>
          </EmptyState>
        )}

        {/* If form is toggled on, show the budget form */}
        {showBudgetForm && !budget && (
          <EmptyState>
            <EmptyTitle>Set Your Monthly Budget</EmptyTitle>
            <EmptySubtitle>Enter your monthly budget amount below</EmptySubtitle>
            <BudgetInputGroup>
              <BudgetInput ref={budgetInputRef} type="number" placeholder="Enter budget amount" value={budgetInput} onChange={(e) => setBudgetInput(e.target.value)} />
            </BudgetInputGroup>
            {/* Clicking button saves the budget to Firestore and updates state */}
            <GreenButton onClick={handleSetBudget}>Save Budget</GreenButton>
          </EmptyState>
        )}

        {/* If a budget exists, show the main dashboard with budget overview, category breakdown, and recent expenses */}
        {budget && (
          <>
          {/* Overview cards showing budget, total spent, and remaining amount */}
          <Grid>
            <Card>
              <CardLabel>Monthly Budget</CardLabel>
              <CardValue>${budget.toFixed(2)}</CardValue>
            </Card>
            <Card>
              <CardLabel>Total Spent</CardLabel>
              <CardValue>${totalSpent.toFixed(2)}</CardValue>
            </Card>
            <Card>
              <CardLabel>Remaining</CardLabel>
              <CardValue>${remaining.toFixed(2)}</CardValue>
            </Card>
          </Grid>
          {/*Currency conversion card - only show if exchange rates have loaded */}
          {exchangeRate && exchangeRate[selectedCurrency] && (
            <CurrencyCard>
              <CurrencyHeader>
                <CurrencyTitle>Convert your spending</CurrencyTitle>
                {/* Dropdown to select currency for conversion, updates selectedCurrency state */}
                <CurrencySelect value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CNY">CNY - Chinese Yuan</option>
                  <option value="INR">INR - Indian Rupee</option>
                </CurrencySelect>
              </CurrencyHeader>
              <CurrencyGrid>
                <CurrencyItem>
                  <CurrencyLabel>Total Spent</CurrencyLabel>
                  <CurrencyValue>{selectedCurrency} {(totalSpent * exchangeRate[selectedCurrency]).toFixed(2)}</CurrencyValue>
                </CurrencyItem>
                <CurrencyItem>
                  <CurrencyLabel>Remaining</CurrencyLabel>
                  <CurrencyValue>{selectedCurrency} {(remaining * exchangeRate[selectedCurrency]).toFixed(2)}</CurrencyValue>
                </CurrencyItem>
                <CurrencyItem>
                  <CurrencyLabel>Exchange Rate</CurrencyLabel>
                  <CurrencyValue>1 USD = {exchangeRate[selectedCurrency].toFixed(4)} {selectedCurrency}  </CurrencyValue>
                </CurrencyItem>
              </CurrencyGrid>
            </CurrencyCard>
          )}
          {/* Section showing spending by category with a button to add new expenses */}
          <SectionRow>
            <SectionTitle>Spending by Category</SectionTitle>
            <Link href="/expense" style={{ textDecoration: 'none' }}>
              <AddButton>Add New Expense</AddButton>
            </Link>
          </SectionRow>
          {/* If there are no expenses, show an empty state. otherwise, show the category list */}
          {expenses.length === 0 ? (
            <EmptyExpense>
              <p>No expenses recorded yet. Start adding your spending!</p>
            </EmptyExpense>
          ) : (
            <CategoryList>
              {/* .localCompare() sort categories alphabetically */}
              {Object.entries(categoryTotals).sort((a, b) => a[0].localeCompare(b[0])).map(([category, amount]) => (
                <CategoryItem key={category}>
                  <CategoryName>{category}</CategoryName>
                  <CategoryAmount>${amount.toFixed(2)}</CategoryAmount>
                </CategoryItem>
              ))}
            </CategoryList>
          )}
          <RecentTitle>Recent Expenses</RecentTitle>
          {expenses.length === 0 ? (
            <EmptyExpense>
              <p>No expenses recorded yet. Start adding your spending!</p>
              </EmptyExpense>
          ) : (
            <ExpenseList>
              {expenses
              .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date, newest first
              .slice(0, 5) // Show only the 5 most recent expenses
              .map((exp) => (
                <ExpenseItem key={exp.id}>
                  <ExpenseLeft>
                    <ExpenseDescription>{exp.description}</ExpenseDescription>
                    <ExpenseMeta>{exp.category} · {new Date(exp.date).toLocaleDateString()}</ExpenseMeta>
                  </ExpenseLeft>
                  <ExpenseAmount>${exp.amount.toFixed(2)}</ExpenseAmount>
                </ExpenseItem>
              ))}
            </ExpenseList>
          )}
          </>
        )}
      </Content>
    </Section>
  )
}


//STYLED COMPONENTS
const Section = styled.section`
min-height: 100vh;
background-color: #f5f7f5;
`

const LoadingText = styled.p`
text-align: center;
padding-top: 100px;
font-size: 18px;
color: #888;
`;

const Content = styled.div`
max-width: 800px;
margin: 0 auto;
padding: 32px 20px;
`;

const EmptyState = styled.div`
text-align: center;
padding: 60px 20px;
background: white;
border-radius: 12px;
`;

const EmptyTitle = styled.h2`
font-size: 24px;
color: #1a1a1a;
margin-bottom: 8px;
`;

const EmptySubtitle = styled.p`
font-size: 16px;
color: #888;
margin-bottom: 24px;
`;

const GreenButton = styled.button`
background-color: #2E7D32;
color: white;
font-size: 16px;
font-weight: 600;
padding: 12px 28px;
border: none;
border-radius: 8px;
cursor: pointer;

&:hover {
  background-color: #1B5E20;
}
`;

const BudgetInputGroup = styled.div`
display: flex;
align-items: center;
justify-content: center;
gap: 8px;
margin-bottom: 20px;
`;

const BudgetInput = styled.input`
font-size: 28px;
font-weight: 700;
width: 160px;
border: none;
border-bottom: 2px solid #2E7D32;
text-align: center;
outline: none;
color: #333;
`;

const Grid = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;
margin-bottom: 24px;

@media (max-width: 600px) {
grid-template-columns: 1fr;
}
`;

const Card = styled.div`
background-color: white;
padding: 24px;
border-radius: 12px;
text-align: center;
`;

const CardLabel = styled.p`
font-size: 14px;
color: #888;
margin-bottom: 8px;
`;

const CardValue = styled.h2`
font-size: 28px;
font-weight: 700;
`;

const SectionRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
margin-top: 32px;
`;

const SectionTitle = styled.h3`
font-size: 18px;
font-weight: 600;
color: #1a1a1a;
margin: 0;
`;

const RecentTitle = styled.h3`
font-size: 18px;
font-weight: 600;
color: #1a1a1a;
margin-top: 32px;
margin-bottom: 16px;
`;

const AddButton = styled.button`
background-color: #2E7D32;
color: white;
font-size: 13px;
font-weight: 600;
padding: 8px 16px;
border: none;
border-radius: 8px;
cursor: pointer;

&:hover {
background-color: #1B5E20;
}
`;

const EmptyExpense = styled.div`
background-color: white;
padding: 32px;
border-radius: 12px;
text-align: center;
color: #888;
margin-bottom: 24px;
`;

const CategoryList = styled.div`
background-color: white;
border-radius: 12px;
margin-bottom: 24px;
overflow: hidden;
`;

const CategoryItem = styled.div`
display: flex;
justify-content: space-between;
padding: 16px 24px;
border-bottom: 1px solid #f0f0f0;

&:last-child {
border-bottom: none; 
}
`;

const CategoryName = styled.span`
font-size: 16px;
color: #333;
font-weight: 500;
`;

const CategoryAmount = styled.span`
font-size: 16px;
font-weight: 600;
`;

const ExpenseList = styled.div`
background-color: white;
border-radius: 12px;
margin-bottom: 24px;
overflow: hidden
`;

const ExpenseItem = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 16px 24px;
border-bottom: 1px solid #f0f0f0;

&:last-child {
border-bottom: none;
}
`;

const ExpenseLeft = styled.div`
display: flex;
flex-direction: column;
gap: 4px;
`;

const ExpenseDescription = styled.span`
font-size: 16px;
color: #333;
font-weight: 500;
`;

const ExpenseMeta = styled.span`
font-size: 12px;
color: #888;
`;

const ExpenseAmount = styled.span`
font-size: 16px;
font-weight: 600;
`;

const CurrencyCard = styled.div`
background-color: white;
border-radius: 12px;
padding: 24px;
margin-bottom: 8px;
`;

const CurrencyHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 16px;
`;

const CurrencyTitle = styled.h3`
font-size: 16px;
font-weight: 600;
color: #1a1a1a;
margin: 0;
`;

const CurrencySelect = styled.select`
padding: 6px 12px;
border: 1px solid #ddd;
border-radius: 8px;
font-size: 13px;
color: #333;
background-color: white;
cursor: pointer;
outline: none;

&:focus {
border-color: #2E7D32;
}
`;

const CurrencyGrid = styled.div`
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 12px;

@media (max-width: 600px) {
grid-template-columns: 1fr;
}
`;

const CurrencyItem = styled.div`
text-align: center;
padding: 12px;
background-color: #f9f9f9;
border-radius: 8px;
`;

const CurrencyLabel = styled.p`
font-size: 12px;
color: #888;
margin-bottom: 4px;
`;

const CurrencyValue = styled.p`
font-size: 16px;
font-weight: 600;
`;

export default Dashboard