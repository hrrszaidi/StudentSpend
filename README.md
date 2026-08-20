# StudentSpend

StudentSpend is a budgeting web app for keeping track of student expenses. Users can create an account, set a monthly budget, add expenses, review their spending, convert totals into other currencies, and send a spending summary by email.

This project uses a full-stack MVP framework provided by the lecturer as its starting point. The application demonstrates connections between a user interface, authentication, cloud database services, external APIs, and third-party email functionality.

## Live Demo

[View Live Application](https://centralized-full-stack-website-cmps.vercel.app/)

## Tech Stack

- **Frontend:** React 18, Next.js 13, styled-components, React Icons
- **Backend services:** Firebase Authentication, Cloud Firestore, Firebase Storage setup
- **Integrations:** EmailJS and the ExchangeRate API
- **Language:** JavaScript
- **Routing:** Next.js Pages Router and API routes

## Main Features

- **Account creation and login:** Users can register and sign in with email and password.
- **Monthly budgeting:** Users can save a monthly budget to Firestore and view their remaining balance.
- **Expense tracking:** Users can add an amount, category, description, and date for each expense.
- **Dashboard overview:** The dashboard shows total budget, total spending, remaining funds, spending by category, and recent expenses.
- **Currency conversion:** Spending and remaining balances can be viewed in selected currencies using live exchange-rate data.
- **Spending reports:** The reports page calculates totals, averages, top spending categories, and the day with the highest spending.
- **Email summaries:** Users can send a summary of their spending to their registered email address.
- **Responsive user experience:** The application includes responsive layouts for the landing, authentication, dashboard, and reporting screens.

## Project Structure

```text
backend/       Firebase configuration and service helpers
components/    Reusable landing page and dashboard UI components
context/       Shared authentication and user state
pages/         Application screens, authentication pages, and API routes
public/        Static images and application assets
```

The main application flow is:

```text
Landing page -> Sign up / Log in -> Dashboard -> Add Expense -> Reports
```

## Getting Started

### Prerequisites

- Node.js and npm
- A Firebase project with Authentication and Cloud Firestore enabled
- EmailJS credentials if the email report feature is being used

### Installation

1. Clone the repository and open the project folder.
2. Install dependencies:

	```bash
	npm install
	```

3. Add the EmailJS values to a local `.env.local` file:

	```env
	NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
	NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
	NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
	```

4. Start the development server:

	```bash
	npm run dev
	```

5. Open [http://localhost:3000](http://localhost:3000) in a browser.

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Create a production build
npm run start    # Run the production build locally
npm run lint     # Run the project's lint command
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page and entry point for StudentSpend |
| `/auth/signup` | Create a new account |
| `/auth/login` | Log in to an existing account |
| `/dashboard` | View budget, spending totals, categories, and recent expenses |
| `/expense` | Add a new expense |
| `/reports` | View spending analytics and category insights |

