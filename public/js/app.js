document.addEventListener('DOMContentLoaded', () => {

    // Globally available from firebase-config.js
    // const auth = firebase.auth();
    // const db = firebase.firestore();

    const PRESET_CATEGORIES = [
        // Expenses
        { name: 'Food & Drink', icon: 'fas fa-utensils', type: 'expense' },
        { name: 'Shopping', icon: 'fas fa-shopping-bag', type: 'expense' },
        { name: 'Housing', icon: 'fas fa-home', type: 'expense' },
        { name: 'Transportation', icon: 'fas fa-car', type: 'expense' },
        { name: 'Bills & Utilities', icon: 'fas fa-file-invoice-dollar', type: 'expense' },
        { name: 'Entertainment', icon: 'fas fa-film', type: 'expense' },
        { name: 'Health & Fitness', icon: 'fas fa-heartbeat', type: 'expense' },
        { name: 'Travel', icon: 'fas fa-plane', type: 'expense' },
        { name: 'Education', icon: 'fas fa-graduation-cap', type: 'expense' },
        { name: 'Groceries', icon: 'fas fa-shopping-cart', type: 'expense' },
        { name: 'Gifts', icon: 'fas fa-gift', type: 'expense' },
        { name: 'Family', icon: 'fas fa-users', type: 'expense' },
        { name: 'Personal Care', icon: 'fas fa-spa', type: 'expense' },
        { name: 'Investments', icon: 'fas fa-chart-line', type: 'expense' },
        { name: 'Other', icon: 'fas fa-receipt', type: 'expense' },
        // Income
        { name: 'Salary', icon: 'fas fa-briefcase', type: 'income' },
        { name: 'Freelance', icon: 'fas fa-laptop-code', type: 'income' },
        { name: 'Investment', icon: 'fas fa-piggy-bank', type: 'income' },
        { name: 'Business', icon: 'fas fa-store', type: 'income' },
        { name: 'Rental', icon: 'fas fa-key', type: 'income' },
        { name: 'Other', icon: 'fas fa-dollar-sign', type: 'income' },
    ];

    /**
     * Data management object for Firestore interactions.
     */
    const dbManager = {
        /**
         * Fetches a collection for a specific user.
         * @param {string} userId - The user's unique ID.
         * @param {string} collectionName - The name of the collection to fetch.
         * @returns {Promise<Array>} A promise that resolves to an array of documents.
         */
        fetchCollection: async (userId, collectionName) => {
            if (!userId) return [];
            try {
                const snapshot = await db.collection('users').doc(userId).collection(collectionName).get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error(`Error fetching ${collectionName}:`, error);
                ui.showToast(`Failed to load ${collectionName}.`, 'error');
                return [];
            }
        },

        /**
         * Saves (adds or updates) a document in a user's collection.
         * @param {string} userId - The user's unique ID.
         * @param {string} collectionName - The name of the collection.
         * @param {object} data - The document data to save. It must have an 'id' property.
         * @returns {Promise<void>}
         */
        saveData: async (userId, collectionName, data) => {
            if (!userId || !data.id) return;
            try {
                await db.collection('users').doc(userId).collection(collectionName).doc(data.id).set(data, { merge: true });
            } catch (error) {
                console.error(`Error saving ${collectionName}:`, error);
                ui.showToast(`Failed to save ${collectionName}.`, 'error');
            }
        },

        /**
         * Deletes a document from a user's collection.
         * @param {string} userId - The user's unique ID.
         * @param {string} collectionName - The name of the collection.
         * @param {string} docId - The ID of the document to delete.
         * @returns {Promise<void>}
         */
        deleteData: async (userId, collectionName, docId) => {
            if (!userId || !docId) return;
            try {
                await db.collection('users').doc(userId).collection(collectionName).doc(docId).delete();
            } catch (error) {
                console.error(`Error deleting ${collectionName}:`, error);
                ui.showToast(`Failed to delete ${collectionName}.`, 'error');
            }
        },
    };

    /**
     * UI management object.
     */
    const ui = {
        user: null,
        state: {
            accounts: [],
            categories: [],
            transactions: [],
        },
        elements: {},

        /**
         * Initializes the UI after authentication.
         * @param {object} user - The authenticated Firebase user object.
         */
        async initialize(user) {
            this.user = user;
            this.queryElements();
            this.setupEventListeners();
            this.renderUserInfo();
            await this.loadAllData();
            document.body.classList.remove('loading');
        },

        /**
         * Queries and caches all necessary DOM elements.
         */
        queryElements() {
            this.elements = {
                // User Info & Global Actions
                userNameDisplay: document.getElementById('user-name'),
                logoutBtn: document.getElementById('logout-btn'),
                themeToggle: document.getElementById('theme-switch'),
                mobileThemeToggle: document.getElementById('mobile-theme-switch'),
                toastContainer: document.getElementById('toast-container'),

                // Accounts
                accountList: document.getElementById('accounts-list'),
                addAccountBtn: document.getElementById('add-account-btn'),
                accountModalBackdrop: document.getElementById('account-modal-backdrop'),
                accountForm: document.getElementById('account-form'),
                
                // Categories
                categoryList: document.getElementById('categories-list'),
                addCategoryBtn: document.getElementById('add-category-btn'),
                categoryModalBackdrop: document.getElementById('category-modal-backdrop'),
                categoryForm: document.getElementById('category-form'),

                // Transactions
                addTransactionBtn: document.getElementById('add-transaction-btn'),
                transactionForm: document.getElementById('transaction-form'),
                transactionCancelBtn: document.getElementById('transaction-cancel-btn'),
                allTransactionsList: document.getElementById('all-transactions'),

                // Dashboard Widgets
                totalBalance: document.getElementById('total-balance'),
                monthlyIncome: document.getElementById('monthly-income'),
                monthlyExpenses: document.getElementById('monthly-expenses'),
                spendingChart: document.getElementById('spending-chart'),
                totalBalanceTrend: document.getElementById('total-balance-trend'),
                totalBalanceTrendPercentage: document.getElementById('total-balance-trend-percentage'),
                monthlyIncomeTrend: document.getElementById('monthly-income-trend'),
                monthlyIncomeTrendPercentage: document.getElementById('monthly-income-trend-percentage'),
                monthlyExpensesTrend: document.getElementById('monthly-expenses-trend'),
                monthlyExpensesTrendPercentage: document.getElementById('monthly-expenses-trend-percentage'),
                
                // Modal elements
                transferMoneyBtn: document.getElementById('transfer-money-btn'),
                transferModalBackdrop: document.getElementById('transfer-modal-backdrop'),
                transferForm: document.getElementById('transfer-form'),
                closeTransferModal: document.getElementById('close-transfer-modal'),
                cancelTransferBtn: document.getElementById('cancel-transfer-btn'),
                
                closeAccountModal: document.querySelector('#account-modal-backdrop .modal-close'),
                cancelAccountBtn: document.getElementById('cancel-account-btn'),
                
                closeCategoryModal: document.getElementById('close-category-modal'),
                cancelCategoryBtn: document.getElementById('cancel-category-btn'),
                
                closeRecurringModal: document.getElementById('close-recurring-modal'),
                cancelRecurringBtn: document.getElementById('cancel-recurring-btn'),
                
                // Recurring transactions
                addRecurringBtn: document.getElementById('add-recurring-btn'),
                recurringModalBackdrop: document.getElementById('recurring-modal-backdrop'),
                recurringForm: document.getElementById('recurring-form'),
            };
        },

        /**
         * Sets up all global event listeners.
         */
        setupEventListeners() {
            // Global
            this.elements.logoutBtn.addEventListener('click', () => auth.signOut());
            const themeHandler = () => {
                const isChecked = this.elements.themeToggle.checked;
                this.elements.mobileThemeToggle.checked = isChecked;
                this.toggleTheme(isChecked);
            };
            this.elements.themeToggle.addEventListener('change', themeHandler);
            this.elements.mobileThemeToggle.addEventListener('change', (e) => {
                this.elements.themeToggle.checked = e.target.checked;
                themeHandler();
            });

            // --- Accounts ---
            this.elements.addAccountBtn?.addEventListener('click', () => this.showAccountModal());
            this.elements.accountForm?.addEventListener('submit', (e) => { e.preventDefault(); this.handleAccountSubmit(); });
            this.elements.accountModalBackdrop?.addEventListener('click', (e) => { if (e.target === this.elements.accountModalBackdrop) this.hideAccountModal(); });
            this.elements.closeAccountModal?.addEventListener('click', () => this.hideAccountModal());
            this.elements.cancelAccountBtn?.addEventListener('click', () => this.hideAccountModal());
            this.elements.accountList?.addEventListener('click', (e) => this.handleAccountListClick(e));

             // --- Categories ---
            this.elements.addCategoryBtn?.addEventListener('click', () => this.showCategoryModal());
            this.elements.categoryForm?.addEventListener('submit', (e) => { e.preventDefault(); this.handleCategorySubmit(); });
            this.elements.categoryModalBackdrop?.addEventListener('click', (e) => { if (e.target === this.elements.categoryModalBackdrop) this.hideCategoryModal(); });
            this.elements.closeCategoryModal?.addEventListener('click', () => this.hideCategoryModal());
            this.elements.cancelCategoryBtn?.addEventListener('click', () => this.hideCategoryModal());
            this.elements.categoryList?.addEventListener('click', (e) => this.handleCategoryListClick(e));
            
            // --- Transactions ---
            this.elements.addTransactionBtn?.addEventListener('click', () => {
                // Navigate to transactions page
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.getElementById('transactions-page').classList.add('active');
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                document.querySelector('a[href="#transactions"]').classList.add('active');
                document.getElementById('page-title').textContent = 'New Transaction';
                this.populateTransactionFormDropdowns();
            });
            
            this.elements.transactionForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTransactionSubmit();
            });

            this.elements.transactionForm?.elements['transaction-type'].addEventListener('change', () => {
                this.populateTransactionFormDropdowns();
            });
            
            // Add cancel button handler for transaction form
            this.elements.transactionCancelBtn?.addEventListener('click', () => {
                // Navigate to dashboard page
                document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                document.getElementById('dashboard-page').classList.add('active');
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                document.querySelector('a[href="#dashboard"]').classList.add('active');
            });
            
            // --- Transfers ---
            this.elements.transferMoneyBtn?.addEventListener('click', () => this.showTransferModal());
            this.elements.transferModalBackdrop?.addEventListener('click', (e) => { if (e.target === this.elements.transferModalBackdrop) this.hideTransferModal(); });
            this.elements.closeTransferModal?.addEventListener('click', () => this.hideTransferModal());
            this.elements.cancelTransferBtn?.addEventListener('click', () => this.hideTransferModal());
            this.elements.transferForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle transfer form submission
                // Implementation to be added
                this.hideTransferModal();
            });
            
            // --- Recurring Transactions ---
            this.elements.addRecurringBtn?.addEventListener('click', () => this.showRecurringModal());
            this.elements.recurringModalBackdrop?.addEventListener('click', (e) => { if (e.target === this.elements.recurringModalBackdrop) this.hideRecurringModal(); });
            this.elements.closeRecurringModal?.addEventListener('click', () => this.hideRecurringModal());
            this.elements.cancelRecurringBtn?.addEventListener('click', () => this.hideRecurringModal());
            this.elements.recurringForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle recurring form submission
                // Implementation to be added
                this.hideRecurringModal();
            });
            
            // --- Navigation ---
            // Handle navigation links
            document.querySelectorAll('.nav-link, .mobile-nav .nav-item').forEach(link => {
                link.addEventListener('click', (e) => {
                    const target = e.currentTarget.getAttribute('href').substring(1);
                    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
                    document.getElementById(`${target}-page`).classList.add('active');
                    document.querySelectorAll('.nav-link, .mobile-nav .nav-item').forEach(navLink => navLink.classList.remove('active'));
                    document.querySelectorAll(`a[href="#${target}"]`).forEach(navLink => navLink.classList.add('active'));
                    document.getElementById('page-title').textContent = target.charAt(0).toUpperCase() + target.slice(1);
                });
            });
        },

        /**
         * Fetches all data from Firestore and renders the UI.
         */
        async loadAllData() {
            if (!this.user) return;
            const userId = this.user.uid;

            const [accounts, categories, transactions] = await Promise.all([
                dbManager.fetchCollection(userId, 'accounts'),
                dbManager.fetchCollection(userId, 'categories'),
                dbManager.fetchCollection(userId, 'transactions')
            ]);

            this.state.accounts = accounts;
            this.state.categories = categories;
            this.state.transactions = transactions;

            // If no categories, add presets
            if (this.state.categories.length === 0) {
                await this.addPresetCategories();
                // Refetch categories after adding them
                this.state.categories = await dbManager.fetchCollection(userId, 'categories');
            }

            this.renderAll();
        },
        
        /**
         * Renders all UI components with current state.
         */
        renderAll() {
            this.renderAccountList();
            this.renderCategoryList();
            this.renderTransactionList();
            this.populateTransactionFormDropdowns();
            this.updateDashboardWidgets();
        },

        /**
         * Renders user-specific information in the header.
         */
        renderUserInfo() {
            if (!this.user) return;
            this.elements.userNameDisplay.textContent = this.user.displayName || 'User';
            this.elements.logoutBtn.style.display = 'block';
        },

        /**
         * Toggles between dark and light theme.
         * @param {boolean} isDark - The desired state of the dark mode.
         */
        toggleTheme(isDark) {
            document.body.classList.toggle('dark-mode', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        },
        
        /**
         * Formats a number as a currency string.
         * @param {number} amount - The amount to format.
         * @param {string} [currency='USD'] - The currency code.
         * @returns {string} The formatted currency string.
         */
        formatCurrency(amount, currency = 'USD') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
        },

        /**
         * Displays a toast message.
         * @param {string} message - The message to display.
         * @param {string} [type='success'] - The type of toast ('success', 'error', 'info').
         */
        showToast(message, type = 'success') {
            const container = this.elements.toastContainer;
            if (!container) return;
            const toast = document.createElement('div');
            toast.className = `toast ${type} show`;
            toast.textContent = message;
            container.appendChild(toast);
            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => toast.remove());
            }, 3000);
        },
        
        // --- RENDER FUNCTIONS ---
        renderAccountList() {
            const list = this.elements.accountList;
            if (!list) return;
            list.innerHTML = '';
            const fragment = document.createDocumentFragment();
            if (this.state.accounts.length === 0) {
                list.innerHTML = '<div class="list-item-empty">No accounts yet. Add one to get started!</div>';
                return;
            }
            this.state.accounts.forEach(account => {
                const card = document.createElement('div');
                card.className = 'account-card';
                card.dataset.id = account.id;
                card.innerHTML = `
                <div class="account-header">
                         <div class="account-name"><i class="fas ${account.icon || 'fa-wallet'}"></i> ${account.name}</div>
                <div class="account-actions">
                             <button class="btn-icon btn-edit" data-action="edit" aria-label="Edit Account"><i class="fas fa-pencil-alt"></i></button>
                             <button class="btn-icon btn-delete" data-action="delete" aria-label="Delete Account"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
                    <div class="account-balance">${this.formatCurrency(account.balance)}</div>
                    <div class="account-type">${account.type}</div>
                `;
                fragment.appendChild(card);
            });
            list.appendChild(fragment);
        },
        
        renderCategoryList() {
            if (!this.elements.categoryList) return;
            const fragment = document.createDocumentFragment();
            this.elements.categoryList.innerHTML = '';
            ['expense', 'income'].forEach(type => {
                const header = document.createElement('div');
                header.className = 'category-list-header';
                header.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} Categories`;
                fragment.appendChild(header);

                const filteredCategories = this.state.categories.filter(c => c.type === type);
                if (filteredCategories.length === 0) {
                    const noCategories = document.createElement('div');
                    noCategories.className = 'category-item-empty';
                    noCategories.textContent = `No ${type} categories defined.`;
                    fragment.appendChild(noCategories);
                } else {
                    filteredCategories.forEach(cat => {
                        const item = document.createElement('div');
                        item.className = 'category-item';
                        item.dataset.id = cat.id;
                        item.innerHTML = `
                            <div class="category-info">
                                <i class="${cat.icon}" style="color: ${cat.color};"></i>
                                <span>${cat.name}</span>
                            </div>
                            <div class="category-actions">
                                <button class="btn-icon edit-category-btn" data-action="edit"><i class="fas fa-pencil-alt"></i></button>
                                <button class="btn-icon delete-category-btn" data-action="delete"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        `;
                        fragment.appendChild(item);
                    });
                }
            });
            this.elements.categoryList.appendChild(fragment);
        },

        renderTransactionList() {
            if (!this.elements.allTransactionsList) return;

            const fragment = document.createDocumentFragment();
            this.elements.allTransactionsList.innerHTML = '';

            if (this.state.transactions.length === 0) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="5" class="empty-state">No transactions yet. Add one to get started!</td>`;
                fragment.appendChild(row);
            } else {
                this.state.transactions
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .forEach(tx => {
                        const category = this.state.categories.find(c => c.id === tx.category) || {};
                        const account = this.state.accounts.find(a => a.id === tx.account) || {};
                        const row = document.createElement('tr');
                        row.dataset.id = tx.id;
                        row.innerHTML = `
                            <td>
                                <div class="transaction-payee">
                                    <i class="fas ${category.icon || 'fa-question-circle'}" style="color:${category.color || '#ccc'}"></i>
                                    <span>${tx.payee}</span>
                                </div>
                            </td>
                            <td>${new Date(tx.date).toLocaleDateString()}</td>
                            <td>${category.name || 'Uncategorized'}</td>
                            <td>${account.name || 'N/A'}</td>
                            <td class="${tx.type}">${this.formatCurrency(tx.amount)}</td>
                        `;
                        fragment.appendChild(row);
                    });
            }
            
            this.elements.allTransactionsList.appendChild(fragment);
        },

        populateTransactionFormDropdowns() {
            const form = this.elements.transactionForm;
            if (!form) return;
            
            const categorySelect = form.elements['transaction-category'];
            const accountSelect = form.elements['transaction-account'];
            const typeSelect = form.elements['transaction-type'];

            const selectedType = typeSelect.value;

            if (categorySelect) {
                const currentCategory = categorySelect.value;
                categorySelect.innerHTML = '<option value="">Select Category</option>';
                this.state.categories
                    .filter(c => c.type === selectedType)
                    .forEach(cat => {
                        const option = new Option(cat.name, cat.id);
                        categorySelect.add(option);
                    });
                // Try to preserve selection if category is still valid for the new type
                if (this.state.categories.some(c => c.id === currentCategory && c.type === selectedType)) {
                    categorySelect.value = currentCategory;
                }
            }

            if (accountSelect) {
                const currentAccount = accountSelect.value;
                accountSelect.innerHTML = '<option value="">Select Account</option>';
                this.state.accounts.forEach(acc => {
                    const option = new Option(acc.name, acc.id);
                    accountSelect.add(option);
                });
                accountSelect.value = currentAccount;
            }
        },

        updateDashboardWidgets() {
            console.log("updateDashboardWidgets called");
            console.log("Current transactions:", this.state.transactions);
            
            const now = new Date();
            const currentMonth = now.getUTCMonth();
            const currentYear = now.getUTCFullYear();
            console.log("Current month/year:", currentMonth, currentYear);
            
            // Calculate totals for the current month
            const monthlyTransactions = this.state.transactions.filter(t => {
                const transactionDate = new Date(`${t.date}T12:00:00Z`); // Assume noon UTC to avoid timezone shifts
                return transactionDate.getUTCMonth() === currentMonth && transactionDate.getUTCFullYear() === currentYear;
            });
            console.log("Current month transactions:", monthlyTransactions);
            
            const monthlyIncome = monthlyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const monthlyExpenses = monthlyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            console.log("Current month income/expenses:", monthlyIncome, monthlyExpenses);

            // Calculate totals for the previous month
            const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            console.log("Previous month/year:", previousMonth, previousMonthYear);

            const previousMonthTransactions = this.state.transactions.filter(t => {
                const transactionDate = new Date(`${t.date}T12:00:00Z`); // Assume noon UTC
                return transactionDate.getUTCMonth() === previousMonth && transactionDate.getUTCFullYear() === previousMonthYear;
            });
            console.log("Previous month transactions:", previousMonthTransactions);

            const previousMonthIncome = previousMonthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);

            const previousMonthExpenses = previousMonthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
                
            console.log("Previous month income/expenses:", previousMonthIncome, previousMonthExpenses);

            // Calculate Total Balance and its trend
            const totalBalance = this.state.accounts.reduce((sum, acc) => sum + acc.balance, 0);
            const netChangeCurrentMonth = monthlyIncome - monthlyExpenses;
            const balanceAtStartOfMonth = totalBalance - netChangeCurrentMonth;
            console.log("Total balance, net change, balance at start:", totalBalance, netChangeCurrentMonth, balanceAtStartOfMonth);

            // Update DOM
            this.elements.totalBalance.textContent = this.formatCurrency(totalBalance);
            this.elements.monthlyIncome.textContent = this.formatCurrency(monthlyIncome);
            this.elements.monthlyExpenses.textContent = this.formatCurrency(monthlyExpenses);

            // Update Trends
            const incomeTrend = calculateTrend(monthlyIncome, previousMonthIncome);
            console.log("Income trend:", incomeTrend);
            this.updateTrendElement(this.elements.monthlyIncomeTrend, this.elements.monthlyIncomeTrendPercentage, incomeTrend);
            
            const expenseTrend = calculateTrend(monthlyExpenses, previousMonthExpenses);
            console.log("Expense trend:", expenseTrend);
            this.updateTrendElement(this.elements.monthlyExpensesTrend, this.elements.monthlyExpensesTrendPercentage, expenseTrend, true);

            const balanceTrend = calculateTrend(totalBalance, balanceAtStartOfMonth);
            console.log("Balance trend:", balanceTrend);
            this.updateTrendElement(this.elements.totalBalanceTrend, this.elements.totalBalanceTrendPercentage, balanceTrend);

            this.renderSpendingChart(monthlyTransactions);
        },

        /**
         * Updates a trend indicator element.
         * @param {HTMLElement} trendElement - The container for the trend icon and text.
         * @param {HTMLElement} percentageElement - The element that displays the percentage.
         * @param {object} trendData - The trend data from calculateTrend.
         * @param {boolean} isExpense - Flag to invert positive/negative color for expenses.
         */
        updateTrendElement(trendElement, percentageElement, trendData, isExpense = false) {
            console.log("updateTrendElement called with:", trendElement?.id, percentageElement?.id, trendData, isExpense);
            
            if (!trendElement || !percentageElement) {
                console.error("Missing trend elements:", trendElement, percentageElement);
                return;
            }

            const { percentage, direction, isPositive } = trendData;
            
            // Determine visual representation (color)
            let visualIsPositive = isPositive;
            if (isExpense) {
                visualIsPositive = !isPositive; // Increase in expense is negative visually
            }

            trendElement.classList.remove('positive', 'negative');
            trendElement.classList.add(visualIsPositive ? 'positive' : 'negative');
            
            const icon = trendElement.querySelector('i');
            if (icon) {
                icon.className = `fas fa-arrow-${direction}`;
            } else {
                console.error("Icon element not found in:", trendElement);
            }

            percentageElement.textContent = `${percentage} from last month`;
            console.log("Updated trend element:", trendElement.className, percentageElement.textContent);
        },

        showAccountModal(accountId = null) {
            this.elements.accountModalBackdrop.classList.add('active');
            const form = this.elements.accountForm;
            form.reset();
            const modalTitle = this.elements.accountModalBackdrop.querySelector('.modal-title');
            const balanceInput = form.querySelector('#account-balance');

            if (accountId) {
                modalTitle.textContent = 'Edit Account';
                const account = this.state.accounts.find(a => a.id === accountId);
                if (account) {
                    form.querySelector('#account-id').value = account.id;
                    form.querySelector('#account-name').value = account.name;
                    form.querySelector('#account-type').value = account.type;
                    balanceInput.value = account.balance;
                    balanceInput.disabled = true;
                    form.querySelector('#account-icon').value = account.icon;
                }
            } else {
                modalTitle.textContent = 'Add Account';
                balanceInput.disabled = false;
                form.querySelector('#account-id').value = '';
            }
        },
        hideAccountModal() { this.elements.accountModalBackdrop.classList.remove('active'); },
        async handleAccountSubmit() {
            const form = this.elements.accountForm;
            const id = form.querySelector('#account-id').value;
            const accountData = {
                id: id || 'acc_' + Date.now(),
                name: form.querySelector('#account-name').value.trim(),
                type: form.querySelector('#account-type').value,
                icon: form.querySelector('#account-icon').value.trim() || 'fa-wallet',
            };
            
            if (!accountData.name) {
                return this.showToast('Account name is required.', 'error');
            }

            if (id) {
                const existingAccount = this.state.accounts.find(a => a.id === id);
                Object.assign(existingAccount, { name: accountData.name, type: accountData.type, icon: accountData.icon });
            } else {
                accountData.balance = parseFloat(form.querySelector('#account-balance').value) || 0;
                this.state.accounts.push(accountData);
            }
            
            await dbManager.saveData(this.user.uid, 'accounts', accountData);
            this.renderAccountList();
            this.updateDashboardWidgets();
            this.hideAccountModal();
            this.showToast(id ? 'Account updated!' : 'Account created!', 'success');
        },
        async deleteAccount(accountId) {
            const account = this.state.accounts.find(a => a.id === accountId);
            if (confirm(`Delete account "${account.name}"? This cannot be undone.`)) {
                await dbManager.deleteData(this.user.uid, 'accounts', accountId);
                this.state.accounts = this.state.accounts.filter(a => a.id !== accountId);
                this.renderAccountList();
                this.updateDashboardWidgets();
                this.showToast('Account deleted.');
            }
        },
        handleAccountListClick(event) {
            const button = event.target.closest('button[data-action]');
            if (!button) return;
            const accountId = button.closest('.account-card').dataset.id;
            if (button.dataset.action === 'edit') this.showAccountModal(accountId);
            else if (button.dataset.action === 'delete') this.deleteAccount(accountId);
        },

        // Category Handlers
        showCategoryModal(categoryId = null) {
            this.elements.categoryModalBackdrop.classList.add('active');
            const form = this.elements.categoryForm;
            form.reset();
            const modalTitle = this.elements.categoryModalBackdrop.querySelector('.modal-title');
            
            if (categoryId) {
                modalTitle.textContent = 'Edit Category';
                const category = this.state.categories.find(c => c.id === categoryId);
                if (category) {
                    form.querySelector('#category-id').value = category.id;
                    form.querySelector('#category-name').value = category.name;
                    form.querySelector('#category-icon').value = category.icon;
                    form.querySelector('#category-color').value = category.color;
                }
            } else {
                modalTitle.textContent = 'Add Category';
                form.querySelector('#category-id').value = '';
            }
        },
        hideCategoryModal() { this.elements.categoryModalBackdrop.classList.remove('active'); },
        async handleCategorySubmit() {
            const form = this.elements.categoryForm;
            const id = form.querySelector('#category-id').value;
            const categoryData = {
                id: id || 'cat_' + Date.now(),
                name: form.querySelector('#category-name').value.trim(),
                icon: form.querySelector('#category-icon').value.trim() || 'fa-tag',
                color: form.querySelector('#category-color').value,
            };

            if (!categoryData.name) {
                 return this.showToast('Category name is required.', 'error');
            }

            if (id) {
                const existing = this.state.categories.find(c => c.id === id);
                Object.assign(existing, categoryData);
            } else {
                this.state.categories.push(categoryData);
            }

            await dbManager.saveData(this.user.uid, 'categories', categoryData);
            this.renderCategoryList();
            this.hideCategoryModal();
            this.showToast(id ? 'Category updated!' : 'Category created!', 'success');
        },
        async deleteCategory(categoryId) {
            const category = this.state.categories.find(c => c.id === categoryId);
             if (confirm(`Delete category "${category.name}"?`)) {
                await dbManager.deleteData(this.user.uid, 'categories', categoryId);
                this.state.categories = this.state.categories.filter(c => c.id !== categoryId);
                this.renderCategoryList();
                this.showToast('Category deleted.');
            }
        },
        handleCategoryListClick(event) {
            const button = event.target.closest('button[data-action]');
            if (!button) return;
            const categoryId = button.closest('.category-item').dataset.id;
            if (button.dataset.action === 'edit') this.showCategoryModal(categoryId);
            else if (button.dataset.action === 'delete') this.deleteCategory(categoryId);
        },
        
        // Transfer Modal Handlers
        showTransferModal() {
            this.elements.transferModalBackdrop.classList.add('active');
            const fromSelect = document.getElementById('transfer-from-account');
            const toSelect = document.getElementById('transfer-to-account');
            
            // Clear existing options
            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';
            
            // Populate account options
            this.state.accounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.id;
                option.textContent = account.name;
                fromSelect.appendChild(option.cloneNode(true));
                toSelect.appendChild(option);
            });
            
            // Set today's date as default
            document.getElementById('transfer-date').valueAsDate = new Date();
        },
        hideTransferModal() {
            this.elements.transferModalBackdrop.classList.remove('active');
        },
        
        // Recurring Transaction Modal Handlers
        showRecurringModal(recurringId = null) {
            this.elements.recurringModalBackdrop.classList.add('active');
            // Additional implementation to be added
        },
        hideRecurringModal() {
            this.elements.recurringModalBackdrop.classList.remove('active');
        },

        async handleTransactionSubmit() {
            const form = this.elements.transactionForm;
            const newTx = {
                id: `txn_${new Date().getTime()}`,
                type: form.elements['transaction-type'].value,
                amount: parseFloat(form.elements['transaction-amount'].value),
                date: form.elements['transaction-date'].value,
                payee: form.elements['transaction-payee'].value.trim(),
                category: form.elements['transaction-category'].value,
                account: form.elements['transaction-account'].value,
                notes: form.elements['transaction-notes'].value.trim(),
                userId: this.user.uid,
            };

            if (!newTx.amount || !newTx.date || !newTx.payee || !newTx.category || !newTx.account) {
                this.showToast('Please fill out all required fields.', 'error');
                return;
            }

            // Find the account to update
            const accountToUpdate = this.state.accounts.find(acc => acc.id === newTx.account);
            if (!accountToUpdate) {
                this.showToast('Selected account not found.', 'error');
                return;
            }

            // Update account balance
            if (newTx.type === 'income') {
                accountToUpdate.balance += newTx.amount;
            } else {
                accountToUpdate.balance -= newTx.amount;
            }

            // --- Database Operations ---
            // Use a batch write to ensure both operations succeed or fail together
            const batch = db.batch();
            const userRef = db.collection('users').doc(this.user.uid);

            // 1. Save the new transaction
            const transactionRef = userRef.collection('transactions').doc(newTx.id);
            batch.set(transactionRef, newTx);

            // 2. Update the account balance
            const accountRef = userRef.collection('accounts').doc(accountToUpdate.id);
            batch.update(accountRef, { balance: accountToUpdate.balance });
            
            await batch.commit();
            
            // --- UI Updates ---
            this.state.transactions.push(newTx);
            this.renderAll();

            form.reset();
            this.showToast('Transaction added successfully!', 'success');

            // Navigate back to dashboard after submission
            document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
            document.getElementById('dashboard-page').classList.add('active');
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelector('a[href="#dashboard"]').classList.add('active');
            document.getElementById('page-title').textContent = 'Dashboard';
        },

        renderSpendingChart(transactions) {
            // TODO: Implementation of renderSpendingChart method
            if (!this.elements.spendingChart) return;
        },

        /**
         * Adds preset categories for a new user.
         */
        async addPresetCategories() {
            if (!this.user) return;
            const userId = this.user.uid;

            const categoryPromises = PRESET_CATEGORIES.map(category => {
                const categoryId = db.collection('users').doc(userId).collection('categories').doc().id;
                const newCategory = {
                    id: categoryId,
                    name: category.name,
                    icon: category.icon,
                    type: category.type
                };
                return dbManager.saveData(userId, 'categories', newCategory);
            });

            await Promise.all(categoryPromises);
            this.showToast('Welcome! We have added some preset categories to get you started.', 'success');
        },
    };

    // --- INITIALIZATION ---
    auth.onAuthStateChanged(user => {
        if (user) {
            ui.initialize(user);
        } else {
            // Redirect to login if not authenticated
            if (window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html' && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
                window.location.href = 'login.html';
            }
        }
    });

    /**
     * Calculates the percentage trend between two values.
     * @param {number} currentValue The value for the current period.
     * @param {number} previousValue The value for the previous period.
     * @returns {{percentage: string, direction: string, isPositive: boolean}}
     */
    const calculateTrend = (currentValue, previousValue) => {
        console.log("calculateTrend called with:", currentValue, previousValue);
        
        if (previousValue === 0) {
            if (currentValue > 0) return { percentage: '+100.0%', direction: 'up', isPositive: true };
            if (currentValue < 0) return { percentage: '-100.0%', direction: 'down', isPositive: false };
            return { percentage: '0.0%', direction: 'up', isPositive: true };
        }

        const percentageChange = ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
        
        // Avoid -0.0%
        if (Math.abs(percentageChange) < 0.01) {
             return { percentage: '0.0%', direction: 'up', isPositive: true };
        }

        const isPositive = percentageChange >= 0;
        const result = {
            percentage: `${isPositive ? '+' : ''}${percentageChange.toFixed(1)}%`,
            direction: isPositive ? 'up' : 'down',
            isPositive: isPositive,
        };
        
        console.log("calculateTrend result:", result);
        return result;
    };

    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    const themeSwitch = document.getElementById('theme-switch');
    if(themeSwitch) themeSwitch.checked = savedTheme === 'dark';
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    if(mobileThemeSwitch) mobileThemeSwitch.checked = savedTheme === 'dark';

});
