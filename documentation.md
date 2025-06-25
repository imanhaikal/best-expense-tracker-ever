# Co-Pilot Finance: Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Installation](#installation)
3. [File Structure](#file-structure)
4. [Key Components](#key-components)
5. [Data Management](#data-management)
6. [User Interface](#user-interface)
7. [Customization](#customization)
8. [Advanced Features](#advanced-features)
9. [Troubleshooting](#troubleshooting)

## System Overview

Co-Pilot Finance is a client-side expense tracking application built with vanilla HTML, CSS, and JavaScript. It leverages modern web technologies to provide a responsive, feature-rich financial management experience that works across devices.

The application uses local storage by default to persist data on the user's device and optionally integrates with Firebase for cloud synchronization. No server-side processing is required for the core functionality.

## Installation

### Prerequisites
- A modern web browser
- Node.js and npm (for dependencies)
- Optional: Firebase account for cloud synchronization

### Basic Setup
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd best-expense-tracker-ever
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the application:
   - Using a local server:
     ```bash
     python -m http.server 8000
     ```
   - Or simply open `index.html` in your browser for the landing page, then navigate to `app.html` for the application.

4. Access the application at http://localhost:8000/app.html (if using a local server)

### Firebase Integration (Optional)
1. Create a project in the [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database in your Firebase project
3. Find your Firebase configuration (Project Settings > General > Your Apps)
4. Replace the firebaseConfig object in `public/js/app.js` with your configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

## File Structure

```
best-expense-tracker-ever/
├── index.html             # Landing page HTML file
├── app.html               # Main application HTML file
├── package.json           # Dependencies and project metadata
├── package-lock.json      # Locked dependencies
├── public/                # Public assets
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── app.js         # Main application logic
├── README.md              # Project overview
└── documentation.md       # This documentation
```

## Key Components

### 1. Currency Formatter
Handles currency formatting for different supported currencies (USD, EUR, GBP, JPY, MYR) using the `Intl.NumberFormat` API.

Usage:
```javascript
// Format amount in the selected currency
currencyFormatter.format(100.50); // "$100.50" (if USD is selected)

// Get the symbol for a specific currency
currencyFormatter.getCurrencySymbol("EUR"); // "€"
```

### 2. Data Storage (db)
Manages application data including accounts, transactions, categories, budgets, and recurring transactions. Provides methods for saving to and loading from localStorage, with optional Firebase synchronization.

Key methods:
- `db.save()`: Persists data to localStorage
- `db.load()`: Loads data from localStorage
- `db.initializeDefaultCategories()`: Sets up default expense/income categories
- `db.initializeDefaultAccount()`: Creates a default account for new users

### 3. User Interface (ui)
Handles all UI rendering and interactions. Manages page navigation, form handling, modals, and dynamic content updates.

Key methods:
- `ui.initialize()`: Sets up the UI and event listeners
- `ui.changePage(pageId)`: Navigates between application pages
- `ui.renderDashboard()`: Updates the dashboard with current data
- `ui.showToast(message, type)`: Displays notification messages

## Data Management

### Data Structure
The application maintains the following data collections:

1. **Accounts**
   ```javascript
   {
     id: "acc_123456789",
     name: "Checking Account",
     type: "checking", // checking, savings, credit, investment
     balance: 1000.00,
     icon: "fa-wallet"
   }
   ```

2. **Transactions**
   ```javascript
   {
     id: "txn_123456789",
     date: "2023-05-15",
     amount: 50.25,
     type: "expense", // expense, income
     payee: "Grocery Store",
     category: "cat_1", // Reference to category ID
     account: "acc_123456789", // Reference to account ID
     notes: "Weekly grocery shopping"
   }
   ```

3. **Categories**
   ```javascript
   {
     id: "cat_1",
     name: "Food & Dining",
     icon: "fa-utensils",
     color: "#FF6B6B",
     type: "expense" // expense, income
   }
   ```

4. **Budgets**
   ```javascript
   {
     id: "budget_123",
     categoryId: "cat_1",
     amount: 500.00,
     period: "monthly"
   }
   ```

5. **Recurring Transactions**
   ```javascript
   {
     id: "rec_123",
     title: "Salary",
     amount: 2000.00,
     type: "income", // income, expense
     frequency: "monthly", // daily, weekly, monthly, yearly
     nextDate: "2023-06-01",
     categoryId: "cat_9",
     accountId: "acc_123456789"
   }
   ```

### Persistence
- **Local Storage**: All data collections are automatically saved to the browser's localStorage.
- **Firebase** (optional): When Firebase is configured, data can be synchronized with Firestore.

## User Interface

### Pages
The application features several main pages accessed via sidebar navigation:

1. **Dashboard**: Overview of financial status with charts and summary widgets
2. **Transactions**: View, add, edit, and delete transactions
3. **Accounts**: Manage bank accounts and other financial accounts
4. **Categories**: Customize expense and income categories
5. **Budgets**: Set and track spending limits by category
6. **Recurring**: Set up scheduled transactions
7. **Reports**: Detailed financial analysis and reports
8. **Settings**: Application preferences and configuration

### Theme Support
The application supports both light and dark themes, toggled via the theme switch in the header. Theme preference is saved in localStorage.

### Responsive Design
The UI automatically adapts to different screen sizes:
- Desktop: Full sidebar navigation and expanded content
- Tablet: Collapsible sidebar and adjusted layouts
- Mobile: Bottom navigation and stacked interface elements

## Customization

### Categories
Users can create custom categories with:
- Custom name
- Icon selection (using Font Awesome icons)
- Color selection
- Category type (income or expense)

### Accounts
Multiple accounts can be created with:
- Custom name
- Account type (checking, savings, credit card, investment)
- Custom icon

### Settings
The application settings allow customization of:
- Default currency
- Theme preference
- Date format
- Starting day of week

## Advanced Features

### Recurring Transactions
The application can automatically generate transactions based on recurring schedules:
- Frequencies: daily, weekly, monthly, yearly
- Auto-creation of transactions when due
- Notification system for upcoming recurring transactions

### Account Transfers
Transfer money between accounts with:
- Source and destination account selection
- Transfer amount
- Transfer date
- Optional notes

### Budget Tracking
Track spending against budget with:
- Visual progress indicators
- Warnings when approaching budget limits
- Monthly budget resets

## Troubleshooting

### Data Reset
If you encounter persistent data issues:
1. Open browser developer tools (F12 or Ctrl+Shift+I)
2. Go to Application > Storage > Local Storage
3. Find and delete the `expenseTrackerData` key
4. Refresh the page (this will reset to default data)

### Firebase Connectivity
If Firebase integration is not working:
1. Check your internet connection
2. Verify Firebase credentials in `app.js`
3. Ensure Firestore is enabled in your Firebase project
4. Check browser console for specific error messages

### Browser Compatibility
For optimal experience, use the latest versions of:
- Chrome
- Firefox
- Safari
- Edge

Internet Explorer is not supported. 