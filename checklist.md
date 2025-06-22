# Expense Tracker Feature Checklist

## Tier 1: Core Functionality (The Foundation)

- [x] **Manual Transaction Entry**
    - [x] Design transaction entry form UI (Web & Mobile).
    - [x] Implement the form with fields: type (income/expense), amount, payee/merchant, date, category, account, notes.
    - [x] Add input validation (e.g., amount is a number, date is valid).
    - [x] Create a database schema for transactions.
    - [x] Implement backend logic to save transactions to the database.
    - [x] Implement logic to edit and delete existing transactions.
- [x] **Recurring Transactions**
    - [x] Design UI for scheduling recurring transactions (frequency, start/end date).
    - [x] Create a database schema for recurring transaction rules.
    - [x] Implement a backend service/cron job to automatically generate transactions based on schedules.
    - [x] Add functionality to view, edit, and delete recurring transaction rules.
- [x] **Multi-Account Tracking**
    - [x] Design UI for adding/editing financial accounts (name, type, starting balance).
    - [x] Create a database schema for accounts.
    - [x] Link transactions to specific accounts.
    - [x] Calculate and display the current balance for each account.
    - [x] Implement logic for transfers between accounts.
- [x] **Customizable Categories**
    - [x] Design UI for creating, editing, and deleting categories.
    - [x] Create a database schema to support nested sub-categories (self-referencing table).
    - [x] Implement backend logic for CRUD operations on categories.
    - [x] Ensure transaction entry form can handle category/sub-category selection.
- [x] **Basic Budgeting**
    - [x] Design UI for setting monthly spending limits per category.
    - [x] Create a database schema for budgets.
    - [x] Implement logic to calculate progress against each budget.
    - [x] Create a simple view to display budget progress (e.g., progress bars).

## Tier 2: Automation & Intelligence (The "Magic")

- [ ] **Secure Bank & Credit Card Sync**
    - [ ] Choose and integrate with a third-party aggregator (Plaid, Yodlee).
    - [ ] Implement the OAuth flow for users to securely link their bank accounts.
    - [ ] Create a service to fetch and standardize transaction data from the aggregator.
    - [ ] Implement logic to handle initial and ongoing transaction syncing.
    - [ ] Securely store access tokens and user credentials.
- [ ] **AI-Powered Auto-Categorization**
    - [ ] Develop a categorization engine using rules-based logic and/or a machine learning model.
    - [ ] Train the model on sample transaction data (merchant names, descriptions).
    - [ ] Implement a feedback loop where the system learns from user's manual corrections.
    - [ ] Create a confidence score for auto-categorizations and flag low-confidence ones for user review.
- [ ] **Custom Rules Engine**
    - [ ] Design UI for users to create "if-then" categorization rules (e.g., if merchant contains 'X', set category to 'Y').
    - [ ] Create a database schema to store user-defined rules.
    - [ ] Apply user rules to new transactions before the AI engine.
- [ ] **Receipt Scanning (OCR)**
    - [ ] Choose and integrate a third-party OCR service (e.g., Google Vision AI, Tesseract.js).
    - [ ] Implement camera functionality in the mobile app to capture receipts.
    - [ ] Implement a file upload feature for web.
    - [ ] Process the OCR result to extract merchant, date, and amount.
    - [ ] Pre-fill the transaction form with extracted data and attach the receipt image.
- [ ] **Email Receipt & E-bill Integration**
    - [ ] Set up a dedicated email inbox service (e.g., Mailgun, SendGrid) to receive forwarded emails.
    - [ ] Develop a parser to extract transaction details from various email receipt formats.
    - [ ] Create a system to link a unique email address to each user account.
    - [ ] Automatically create draft transactions from parsed emails for user approval.
- [ ] **Transaction Splitting**
    - [ ] Design UI to split a single transaction into multiple line items with different categories and amounts.
    - [ ] Update the transaction database schema to support split transactions (e.g., one-to-many relationship).
    - [ ] Ensure reports and budgets correctly handle split transactions.

## Tier 3: Insight & Analytics (The "Enlightenment")

- [ ] **Customizable Dashboard**
    - [ ] Design a modular/widget-based dashboard layout.
    - [ ] Develop individual widgets (Net Worth, Cash Flow, Budget, etc.).
    - [ ] Implement drag-and-drop functionality for users to customize their dashboard.
    - [ ] Save user's dashboard layout preferences.
- [ ] **Advanced Reporting**
    - [ ] Implement a flexible reporting engine with filtering by date, account, and category.
    - [ ] **Spending by Category/Payee:**
        - [ ] Generate data for pie or bar charts.
        - [ ] Integrate a charting library (e.g., D3.js, Chart.js) to visualize the data.
    - [ ] **Income vs. Expense:**
        - [ ] Generate time-series data.
        - [ ] Create line or bar charts to show trends over time.
    - [ ] **Net Worth Trend:**
        - [ ] Define assets (account balances) and liabilities (loan accounts).
        - [ ] Calculate and plot net worth over time.
    - [ ] **Trend Analysis:**
        - [ ] Develop logic to compare data from different time periods.
- [ ] **Powerful Search & Filtering**
    - [ ] Implement a dedicated search API endpoint.
    - [ ] Add full-text search capabilities on transaction fields (notes, payee).
    - [ ] Implement advanced filtering options (amount range, date range, category, tags).
- [ ] **Tagging System**
    - [ ] Create database schemas for tags and transaction-to-tag relationships (many-to-many).
    - [ ] Add UI for creating and applying tags to transactions.
    - [ ] Integrate tag filtering into the search and reporting features.

## Tier 4: Proactive & Predictive Features (The "Co-Pilot")

- [ ] **Upcoming Bill Prediction & Reminders**
    - [ ] Develop an algorithm to identify recurring bills from transaction history.
    - [ ] Create a UI for users to confirm and manage predicted bills.
    - [ ] Implement a notification system (push, email) to remind users before due dates.
- [ ] **Subscription Management**
    - [ ] Enhance the bill prediction algorithm to specifically find subscriptions.
    - [ ] Create a dedicated UI to list all detected subscriptions.
    - [ ] Implement logic to detect price changes on the same subscription.
- [ ] **Unusual Spending Alerts**
    - [ ] Establish a baseline for normal spending patterns for each user/category.
    - [ ] Implement a job to monitor for transactions that deviate significantly from the baseline.
    - [ ] Trigger alerts for user review.
- [ ] **Predictive Forecasting**
    - [ ] Use historical income and spending data to build a forecasting model.
    - [ ] Project future account balances for a given timeframe (e.g., next 30 days).
    - [ ] Visualize the forecast on a chart.
- [ ] **"What-If" Scenarios**
    - [ ] Design a UI for the planning tool.
    - [ ] Create a backend module that takes a scenario (e.g., reduced spending) and re-calculates financial outcomes (e.g., debt payoff date).
- [ ] **Financial Health Score**
    - [ ] Define the formula and metrics for the score (e.g., savings rate, debt-to-income).
    - [ ] Implement the calculation logic.
    - [ ] Create a UI to display the score and provide actionable improvement tips.

## Tier 5: Goals & Collaboration (The "Motivation")

- [ ] **Financial Goal Setting**
    - [ ] Design UI for creating and tracking goals.
    - [ ] Create a database schema for goals.
    - [ ] Link savings account balances or tagged transactions to goals to track progress.
- [ ] **Digital Envelope Budgeting**
    - [ ] Implement an alternative budgeting mode in the app.
    - [ ] Create UI for assigning income to virtual "envelopes".
    - [ ] Ensure transactions are deducted from the correct envelope balance.
- [ ] **Shared Finances**
    - [ ] Design the data model for sharing access between users.
    - [ ] Implement an invitation system (e.g., via email).
    - [ ] Modify data access logic to respect sharing permissions.
- [ ] **Shared Expense Tracking**
    - [ ] Develop a "group" or "trip" feature.
    - [ ] Implement logic to track who paid for what within a group.
    - [ ] Create a "settle up" view that calculates who owes whom.
- [ ] **User Permissions**
    - [ ] Implement role-based access control (RBAC).
    - [ ] Define roles (e.g., owner, viewer, editor) and their permissions.
    - [ ] Enforce permissions throughout the backend.

## Tier 6: User Experience & Ecosystem (The "Polish")

- [ ] **Cross-Platform Sync**
    - [ ] Set up a cloud database (e.g., Firestore, PostgreSQL on AWS/Azure).
    - [ ] Build a robust and secure API for the backend.
    - [ ] Ensure client apps (Web, iOS, Android) sync data in real-time or near-real-time.
- [ ] **Impeccable UI/UX**
    - [ ] Create a complete design system (component library, style guide).
    - [ ] Conduct user testing to refine workflows and usability.
    - [ ] Focus on performance and responsiveness.
- [ ] **Customization**
    - [ ] Implement a theme switcher for light/dark mode.
    - [ ] Add options for users to choose colors for charts or app icons.
- [ ] **Home Screen Widgets (Mobile)**
    - [ ] Develop native widgets for iOS and Android.
    - [ ] API endpoints to provide summary data for the widgets.
- [ ] **Data Export**
    - [ ] Implement a feature to generate and download transaction data as CSV.
    - [ ] Implement a feature to generate PDF reports.
- [ ] **Multi-Currency Support**
    - [ ] Integrate with a reliable exchange rate API.
    - [ ] Add a currency field to accounts and transactions.
    - [ ] Convert and display all amounts in the user's primary currency.
- [ ] **API & Integrations**
    - [ ] Design and document a public API.
    - [ ] Implement API key authentication for developers.
    - [ ] Set up webhooks for integrations with services like IFTTT/Zapier.

## Tier 7: Security & Privacy (The "Trust")

- [ ] **Bank-Level Security**
    - [ ] Enforce HTTPS on all communication.
    - [ ] Encrypt sensitive data in the database (at rest).
- [ ] **Two-Factor Authentication (2FA)**
    - [ ] Integrate with an authentication service (e.g., Twilio Authy).
    - [ ] Implement UI for setting up and using 2FA.
- [ ] **Biometric Login**
    - [ ] Implement Face ID/Touch ID for iOS.
    - [ ] Implement fingerprint unlock for Android.
- [ ] **Privacy-First Approach**
    - [ ] Write a clear and transparent privacy policy.
    - [ ] Ensure no unnecessary user data is collected.
- [ ] **Optional Local-Only Mode**
    - [ ] Architect the apps to work with a local database (e.g., SQLite).
    - [ ] Implement a cloud-sync toggle in the settings.

## Website Fixes Checklist
### 🔴 High-Priority Bugs (Data Integrity & Core Logic)

*These issues can lead to incorrect data, user confusion, and a broken experience.*

- [x] **Category Filtering is Broken:** On the Add New Transaction and Add Recurring Transaction pages, the "Category" dropdown is not filtered by the "Transaction Type".
    - **To Reproduce (0:04 & 2:04):** Select "Expense" as the type, but the category dropdown still shows "Income" categories like "Salary" and "Investments". Select "Income" and it still shows "Expense" categories.
    - **Required Fix:** The category dropdown list must dynamically update to show only relevant categories based on the selected transaction type (Income/Expense).

- [x] **Invalid Category Parenting Logic:** The Edit Category modal allows assigning a parent category of a different type.
    - **To Reproduce (1:22):** The user edits "Food & Dining" (an expense), changes its type to "Income", and is then able to select "Transportation" (an expense) as its parent.
    - **Required Fix:** The "Parent Category" dropdown should be filtered to only show categories of the same type as the one being edited. You should not be able to make an income category a sub-category of an expense, or vice-versa.

- [x] **Changing Category Type Corrupts Data:** A category's type (Income/Expense) can be changed even when it has transactions linked to it.
    - **To Reproduce (1:34):** The "Food & Dining" category, which has a $50 expense transaction, was successfully changed to an "Income" type. This creates a logical data conflict (an expense transaction is now in an income category).
    - **Required Fix:** If a category has existing transactions, the "Type" dropdown in the "Edit Category" modal should be disabled to prevent data corruption.

### 🟡 Major UX/UI Fixes

*These issues make the application feel unprofessional, jarring, and difficult to use.*

- [x] **Replace Native Browser Alerts (alert()):** The site heavily relies on `localhost:8000 says...` alerts for feedback. This is poor practice.
    - **Examples:** "Transaction added successfully" (0:38), "Edit Account... will be implemented soon" (0:49), "Cannot delete Default Account..." (0:53), etc.
    - **Required Fix:** Implement a consistent, modern, in-app notification system. "Toast" or "Snackbar" popups are standard for success/error messages. For "coming soon" features, the button should either be disabled with a tooltip or removed.

- [x] **Improve Deletion/Reassignment Flow:** The app prevents deleting accounts and categories with transactions but offers a poor user experience.
    - **Issue (0:53 & 1:48):** The alert just says "Please delete/reassign the transactions first." It forces the user to manually go find and edit every single transaction, which is tedious and error-prone.
    - **Required Fix:** When a user tries to delete a category/account with transactions, the confirmation modal should offer a solution, such as: "This category has 5 transactions. Please select a new category to reassign them to before deleting." followed by a dropdown of other valid categories.

- [x] **Prevent Invalid User Actions:** The UI allows users to get into obvious error states.
    - **Issue (1:01):** On the "Transfer Money" modal, the user can select the same account for both "From" and "To".
    - **Required Fix:** The "To Account" dropdown list should automatically exclude the account selected in the "From Account" dropdown.

- [x] **Provide Feedback on Save Actions:** Saving user settings provides no confirmation.
    - **Issue (2:49):** On the "User Settings" page, clicking "Save Settings" gives no visual feedback (no spinner, no success message). The user doesn't know if the action worked.
    - **Required Fix:** After clicking save, show a loading indicator on the button, and upon success, display a success toast (e.g., "Settings saved successfully.").

### 🟠 General Usability & Inconsistencies

*These are smaller issues that detract from the overall quality and polish of the application.*

- [x] **Inconsistent Confirmation Dialogs:** The application uses different methods for confirming deletion.
    - **Issue (2:32):** Deleting a recurring transaction uses a native browser `confirm()` box ("Are you sure..."), while other actions use `alert()`.
    - **Required Fix:** Use a single, consistently styled, in-app modal for all critical confirmations (e.g., "Delete Item?").

- [x] **Validation Message Style Inconsistency:** The app has one good example of validation that should be used everywhere else.
    - **Good Example (2:00):** On the "Budgets" page, the "Please select an item in the list" message is a well-styled, non-blocking, inline notification.
    - **Required Fix:** All form validation should follow this "good" model instead of relying on native browser alerts.

### ⚪ Missing / Incomplete Features

*These are features that are clearly planned but not yet functional.*

- [x] **Accounts Page Functionality:**
    - [x] Implement "Edit Account".
    - [x] Implement "Add Account".

- [x] **Budgets Page Functionality:**
    - [x] The "Add New Budget" form is incomplete. The category dropdown is empty and saving doesn't work.

- [x] **Reports Page:**
    - [x] The entire page is a placeholder. "Income vs. Expenses" report needs to be built.

- [x] **Categories Page Functionality:**
    - [x] The ability to add/edit category icons and colors needs to be fully implemented and saved correctly.

# Website Checklist

- [x] Change the hardcoded Total Balance from `$0.00` to `$50.00`.
- [x] Remove the "Recent Transactions" table from the dashboard page to match the cleaner design in the image.
- [x] Ensure the "Spending by Category" widget is correctly styled for its empty state, displaying "$0.00 Monthly Spending" in the center.
- [x] Refine the CSS to match the visual design from the image, including:
  - [x] Implementing the dark theme color scheme (backgrounds, text, etc.).
  - [x] Adjusting fonts, spacing, padding, and margins for a polished look.
  - [x] Applying correct border-radius and box-shadows to widgets.
  - [x] Styling the active sidebar link with a purple background. 