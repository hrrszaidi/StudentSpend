import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import emailjs from '@emailjs/browser'
import { useStateContext } from '@/context/StateContext'
import { getDocument } from '@/backend/Database'
import { useRouter } from 'next/router'
import DashboardNavbar from '@/components/Dashboard/DashboardNavbar'

const Reports = () => {
    const { user, userName } = useStateContext()
    const router = useRouter()

    const [budget, setBudget] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [sendStatus, setSendStatus] = useState('')

    const topCategoryRef = useRef(null)

    useEffect(() => {
        if(user){
            loadReportData()
        } else if(user === null){
            router.push('/')
        }
    }, [user])

    useEffect(() => {
        if(!loading && topCategoryRef.current){
            topCategoryRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [loading])

    function loadReportData() {
        getDocument('budgets', user.uid)
        .then((data) => {
            if(data){
                setBudget(data.amount)
            }
            return getDocument('expenses', user.uid)
        })
        .then((data) => {
            if(data && data.items){
                setExpenses(data.items)
            }
            setLoading(false)
        })
        .catch((error) => {
            console.error('Error loading report data:', error)
            setLoading(false)
        })
    }

    function sendReport(){
        setSendStatus('Sending')
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

        const catTotals = {}
        expenses.forEach((expense) => {
            if(catTotals[expense.category]){
                catTotals[expense.category] += expense.amount
            } else {
                catTotals[expense.category] = expense.amount
            }
        })

        const categoriesText = Object.entries(catTotals)
        .sort((a, b) => b[1] - a[1])
        .map(([cat, amt]) => cat + ': $' + amt.toFixed(2) + ' (' + ((amt / total) * 100).toFixed(0) + '%)').join('\n')

        const templateParams = {
            to_email: user.email,
            to_name: userName || 'User',
            total_spent: total.toFixed(2),
            total_expenses: expenses.length.toString(),
            categories: categoriesText
        }

        emailjs.send(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, templateParams, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)

        .then(() => {
            setSendStatus('Sent')
            setTimeout(() => setSendStatus(''), 3000)
        })
        .catch((error) => {
            console.error('Error sending email:', error)
            setSendStatus('Error sending')
            setTimeout(() => setSendStatus(''), 3000)
        })
    }

    const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0)
    const remainingBudget = budget ? budget - totalSpent : 0
    const averagePerExpense = expenses.length > 0 ? totalSpent / expenses.length : 0

    const categoryTotals = {}
    expenses.forEach((expense) => {
        if(categoryTotals[expense.category]){
            categoryTotals[expense.category] += expense.amount
        } else {
            categoryTotals[expense.category] = expense.amount
        }
    })

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])
    const topCategory = sortedCategories.length > 0 ? sortedCategories[0] : null

    const dailyTotals = {}
    expenses.forEach((expense) => {
        if(dailyTotals[expense.date]){
            dailyTotals[expense.date] += expense.amount
        } else {
            dailyTotals[expense.date] = expense.amount
        }
    })

    const sortedDailyTotals = Object.entries(dailyTotals).sort((a, b) => b[1] - a[1])
    const topDay = sortedDailyTotals.length > 0 ? sortedDailyTotals[0] : null

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
                <PageHeader>
                    <div>
                        <PageTitle>Spending Report</PageTitle>
                        <PageSubtitle>Here's a summary of your spending habits</PageSubtitle>
                    </div>
                    {expenses.length > 0 && (
                        <SendReportWrap>
                            <SendButton onClick={sendReport}>Send Report to Email</SendButton>
                            {sendStatus && <SendStatus>{sendStatus}</SendStatus>}
                        </SendReportWrap>
                    )}
                </PageHeader>

                {expenses.length === 0 ? (
                    <EmptyState>
                        <EmptyTitle>No data yet</EmptyTitle>
                        <EmptySubtitle>Start adding expenses to see your reports here!</EmptySubtitle>
                    </EmptyState> 
                ) : (
                    <>
                    <StatsGrid>
                        <StatCard>
                            <StatLabel>Total Expenses</StatLabel>
                            <StatValue>{expenses.length}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>Total Spent</StatLabel>
                            <StatValue>${totalSpent.toFixed(2)}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>Average Per Expense</StatLabel>
                            <StatValue>${averagePerExpense.toFixed(2)}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel>Average Per Day</StatLabel>
                            <StatValue>${Object.keys(dailyTotals).length > 0 ? (totalSpent / Object.keys(dailyTotals).length).toFixed(2) : 0}</StatValue>
                        </StatCard>
                    </StatsGrid>
                    <SidebySide>
                        <LeftStack>
                            {topCategory && (
                                <SideCard>
                                    <SideCardTitle>Top Spending Category</SideCardTitle>
                                    <InsightBig>{topCategory[0]}</InsightBig>
                                    <SideSubtext>${topCategory[1].toFixed(2)} spent ({((topCategory[1] / totalSpent) * 100).toFixed(0)}% of total)</SideSubtext>
                                </SideCard>
                            )}
                            {topDay && (
                                <SideCard>
                                    <SideCardTitle>Day with Highest Spending</SideCardTitle>
                                    <InsightBig>{topDay[0]}</InsightBig>
                                    <SideSubtext>${topDay[1].toFixed(2)} spent on this day</SideSubtext>
                                </SideCard>
                            )}
                        </LeftStack>
                        <SideCard>
                            <SideCardTitle>Category Breakdown</SideCardTitle>
                            {sortedCategories.map(([category, amount]) => {
                                const percent = (amount / totalSpent) * 100
                                return (
                                    <CategoryRow key={category}>
                                        <CategoryName>{category}</CategoryName>
                                        <CategoryPercent>{percent.toFixed(0)}%</CategoryPercent>
                                    </CategoryRow>
                                )
                            })}
                        </SideCard>
                    </SidebySide>
                    </>   
                    )
                }
            </Content>
        </Section>

    )


}

const Section = styled.div`
min-height: 100vh;
background-color: #f5f7f5;
`;

const Content = styled.div`
max-width: 800px;
margin: 0 auto;
padding: 32px 20px;
`;

const LoadingText = styled.p`
text-align: center;
font-size: 18px;
padding-top: 100px;
color: #888;
`;

const PageHeader = styled.div`
display: flex;
justify-content: space-between;
align-items: flex-start;
`;

const SendReportWrap = styled.div`
display: flex;
flex-direction: column;
align-items: flex-end;
gap: 8px;
`;

const SendButton = styled.button`
background-color: #2E7D32;
color: white;
border: none;
padding: 12px 24px;
border-radius: 8px;
font-size: 14px;
font-weight: 600;
cursor: pointer;
transition: background-color 0.2s;

&:hover {
background-color: #1B5E20;
}
`;

const SendStatus = styled.span`
font-size: 14px;
color: #2E7D32;
`;

const PageTitle = styled.h1`
font-size: 28px;
font-weight: 700;
color: #1a1a1a;
margin-bottom: 4px;
`;

const PageSubtitle = styled.p`
font-size: 16px;
color: #888;
margin-bottom: 32px;
`;

const EmptyState = styled.div`
text-align: center;
padding: 60px 20px;
background-color: white;
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
`;

const StatsGrid = styled.div`
display: grid;
grid-template-columns: repeat(4, 1fr);
gap: 16px;
margin-bottom: 24px;

@media (max-width: 768px) {
grid-template-columns: repeat(2, 1fr);
}
`;

const StatCard = styled.div`
background-color: white;
padding: 20px;
border-radius: 12px;
text-align: center;
`;

const StatLabel = styled.p`
font-size: 12px;
color: #888;
margin-bottom: 8px;
`;

const StatValue = styled.h3`
font-size: 24px;
font-weight: 700;
color: #1a1a1a;
`;

const SidebySide = styled.div`
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px;

@media (max-width: 600px) {
grid-template-columns: 1fr;
}
`;

const LeftStack = styled.div`
display: flex;
flex-direction: column;
gap: 16px;
`;

const SideCard = styled.div`
background-color: white;
border-radius: 12px;
padding: 24px;
`;

const SideCardTitle = styled.h4`
font-size: 14px;
color: #888;
margin-bottom: 16px;
font-weight: 600;
`;

const InsightBig = styled.h2`
font-size: 24px;
font-weight: 700;
color: #2E7D32;
margin-bottom: 4px;
`;

const SideSubtext = styled.p`
font-size: 14px;
color: #888;
line-height: 1.6;
`;

const CategoryRow = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
padding: 8px 0;
border-bottom: 1px solid #f0f0f0;

&:last-child {
border-bottom: none;
}
`;

const CategoryName = styled.span`
font-size: 15px;
color: #333;
font-weight: 500;
`;

const CategoryPercent = styled.span`
font-size: 15px;
color: #555;
font-weight: 600;
`;

export default Reports