# Co-Pilot Finance: The Ultimate Expense Tracker

A beautiful, feature-rich expense tracker web application built with HTML, CSS, JavaScript, and Firebase integration.

## Features

- **Manual Transaction Entry**: Add, edit, and delete expenses and income transactions with fields for date, amount, payee/merchant, category, account, and notes.
- **Multi-Account Tracking**: Manage multiple accounts with different balances and transaction histories.
- **Customizable Categories**: Create and manage hierarchical categories for both expenses and income to better organize your finances.
- **Basic Budgeting**: Set monthly spending limits per category and track your progress.
- **Interactive Dashboard**: Get a visual overview of your financial status with charts and summaries.
- **Recurring Transactions**: Set up recurring expenses or income with flexible frequency options.
- **Dark/Light Mode**: Toggle between dark and light themes for a better viewing experience.
- **Multi-Currency Support**: Track expenses in USD, EUR, GBP, JPY, and MYR with proper formatting.
- **Mobile-Responsive Design**: Access your finances on any device with a responsive layout.
- **Data Persistence**: Store your financial data locally or with Firebase (optional).

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Open the `index.html` file in a web browser or use a local server:
   ```
   python -m http.server 8000
   ```
4. Access the application at http://localhost:8000

## Firebase Setup (Optional)

The application can work with local storage only, but for cloud synchronization:

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore Database in your project
3. Update the Firebase configuration in `public/js/app.js` with your credentials

## Technologies Used

- HTML5 for structure
- CSS3 for styling and responsive design
- JavaScript for functionality
- Chart.js for data visualization
- Local Storage for local data persistence
- Firebase (optional) for cloud storage and synchronization
- Font Awesome for icons

## Coming Soon

- Account synchronization with banks and credit cards
- AI-powered auto-categorization
- Receipt scanning
- Mobile apps (iOS & Android)
- Subscription management
- Financial insights and forecasting

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

