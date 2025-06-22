# Expense Tracker Feature Checklist

## Tier 1: Core Functionality (The Foundation)

- [x] **Manual Transaction Entry**
    - [x] Design transaction entry form UI (Web & Mobile).
    - [x] Implement the form with fields: type (income/expense), amount, payee/merchant, date, category, account, notes.
    - [x] Add input validation (e.g., amount is a number, date is valid).
    - [x] Create a database schema for transactions.
    - [x] Implement backend logic to save transactions to the database.
    - [x] Implement logic to edit and delete existing transactions.
- [ ] **Recurring Transactions**
    - [ ] Design UI for scheduling recurring transactions (frequency, start/end date).
    - [ ] Create a database schema for recurring transaction rules.
    - [ ] Implement a backend service/cron job to automatically generate transactions based on schedules.
    - [ ] Add functionality to view, edit, and delete recurring transaction rules.
- [x] **Multi-Account Tracking**
    - [x] Design UI for adding/editing financial accounts (name, type, starting balance).
    - [x] Create a database schema for accounts.
    - [x] Link transactions to specific accounts.
    - [x] Calculate and display the current balance for each account.
    - [x] Implement logic for transfers between accounts.
- [x] **Customizable Categories**
    - [x] Design UI for creating, editing, and deleting categories.
    - [ ] Create a database schema to support nested sub-categories (self-referencing table).
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