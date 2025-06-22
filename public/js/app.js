// Expense Tracker Application

// Data Storage Utilities
const db = {
    // In-memory storage before implementing actual database
    accounts: [],
    transactions: [],
    categories: [],
    budgets: [],
    recurring: [],
    
    // Local storage management
    save() {
        localStorage.setItem('expenseTrackerData', JSON.stringify({
            accounts: this.accounts,
            transactions: this.transactions,
            categories: this.categories,
            budgets: this.budgets,
            recurring: this.recurring
        }));
    },
    
    load() {
        const data = JSON.parse(localStorage.getItem('expenseTrackerData') || '{}');
        this.accounts = data.accounts || [];
        this.transactions = data.transactions || [];
        this.categories = data.categories || [];
        this.budgets = data.budgets || [];
        this.recurring = data.recurring || [];
        
        if (this.categories.length === 0) {
            this.initializeDefaultCategories();
        }
        if (this.accounts.length === 0) {
            this.initializeDefaultAccount();
        }
    },
    
    initializeDefaultCategories() {
        const defaultCategories = [
            { id: 'cat_1', name: 'Food & Dining', icon: 'fa-utensils', color: '#FF6B6B', type: 'expense' },
            { id: 'cat_2', name: 'Transportation', icon: 'fa-car', color: '#4ECDC4', type: 'expense' },
            { id: 'cat_3', name: 'Housing', icon: 'fa-home', color: '#A06CD5', type: 'expense' },
            { id: 'cat_4', name: 'Entertainment', icon: 'fa-film', color: '#FFA500', type: 'expense' },
            { id: 'cat_5', name: 'Shopping', icon: 'fa-shopping-bag', color: '#FF6B6B', type: 'expense' },
            { id: 'cat_6', name: 'Utilities', icon: 'fa-bolt', color: '#36A2EB', type: 'expense' },
            { id: 'cat_7', name: 'Health', icon: 'fa-heart', color: '#FF6384', type: 'expense' },
            { id: 'cat_8', name: 'Education', icon: 'fa-book', color: '#4BC0C0', type: 'expense' },
            { id: 'cat_9', name: 'Salary', icon: 'fa-briefcase', color: '#10b981', type: 'income' },
            { id: 'cat_10', name: 'Investments', icon: 'fa-chart-line', color: '#667eea', type: 'income' }
        ];
        
        this.categories = defaultCategories;
    },
    
    initializeDefaultAccount() {
        this.accounts.push({
            id: 'acc_' + Date.now(),
            name: 'Default Account',
            type: 'checking',
            balance: 1000,
            icon: 'fa-wallet'
        });
    }
};

// UI Management
const ui = {
    // DOM References
    elements: {
        sidebar: document.querySelector('.sidebar'),
        mainContent: document.querySelector('.main-content'),
        sidebarToggle: document.getElementById('sidebar-toggle'),
        themeSwitch: document.getElementById('theme-switch'),
        pages: document.querySelectorAll('.page'),
        navLinks: document.querySelectorAll('.nav-link'),
        transactionForm: document.getElementById('transaction-form'),
        accountsList: document.getElementById('accounts-list'),
        categoriesList: document.getElementById('categories-list'),
        recentTransactions: document.getElementById('recent-transactions'),
        addTransactionBtn: document.querySelector('.add-transaction-btn'),
        categoriesForTransaction: document.getElementById('transaction-category'),
        accountsForTransaction: document.getElementById('transaction-account'),
        transferMoneyBtn: document.getElementById('transfer-money-btn'),
        transferModalBackdrop: document.getElementById('transfer-modal-backdrop'),
        closeTransferModalBtn: document.getElementById('close-transfer-modal'),
        cancelTransferBtn: document.getElementById('cancel-transfer-btn'),
        transferForm: document.getElementById('transfer-form'),
        categoryModalBackdrop: document.getElementById('category-modal-backdrop'),
        closeCategoryModalBtn: document.getElementById('close-category-modal'),
        cancelCategoryBtn: document.getElementById('cancel-category-btn'),
        categoryForm: document.getElementById('category-form'),
        categoryTypeSelect: document.getElementById('category-type'),
        addRecurringBtn: document.getElementById('add-recurring-btn'),
        recurringModalBackdrop: document.getElementById('recurring-modal-backdrop'),
        closeRecurringModalBtn: document.getElementById('close-recurring-modal'),
        cancelRecurringBtn: document.getElementById('cancel-recurring-btn'),
        recurringForm: document.getElementById('recurring-form'),
        recurringTransactionsList: document.getElementById('recurring-transactions-list'),
        transactionTypeSelect: document.getElementById('transaction-type'),
        recurringTypeSelect: document.getElementById('recurring-type'),
        toastContainer: document.getElementById('toast-container'),
        confirmationModalBackdrop: document.getElementById('confirmation-modal-backdrop'),
        transferFromAccountSelect: document.getElementById('transfer-from-account'),
        reassignModalBackdrop: document.getElementById('reassign-modal-backdrop'),
        saveSettingsBtn: document.querySelector('#settings-page button'),
        accountModalBackdrop: document.getElementById('account-modal-backdrop'),
        accountForm: document.getElementById('account-form'),
        budgetForm: document.getElementById('budget-form'),
        budgetList: document.getElementById('budget-list')
    },

    initialize() {
        this.setupEventListeners();
        this.setupTheme();
        this.renderDashboard();
        this.updateNavigationState();
    },

    setupEventListeners() {
        // Sidebar toggle
        this.elements.sidebarToggle?.addEventListener('click', () => {
            this.elements.sidebar.classList.toggle('collapsed');
            this.elements.mainContent.classList.toggle('collapsed');
        });

        // Theme toggle
        this.elements.themeSwitch?.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });

        // Navigation
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('href').substring(1); // Remove #
                this.changePage(targetPage);
            });
        });

        // Transaction form
        this.elements.transactionForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransactionSubmit();
        });

        // Add transaction button
        this.elements.addTransactionBtn?.addEventListener('click', () => {
            this.changePage('transactions');
        });

        // Transfer money button
        this.elements.transferMoneyBtn?.addEventListener('click', () => {
            this.showTransferModal();
        });

        // Close transfer modal
        this.elements.closeTransferModalBtn?.addEventListener('click', () => {
            this.hideTransferModal();
        });
        this.elements.cancelTransferBtn?.addEventListener('click', () => {
            this.hideTransferModal();
        });

        // Transfer form submission
        this.elements.transferForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTransferSubmit();
        });

        // Category modal
        this.elements.closeCategoryModalBtn?.addEventListener('click', () => categoriesManager.hideCategoryModal());
        this.elements.cancelCategoryBtn?.addEventListener('click', () => categoriesManager.hideCategoryModal());
        this.elements.categoryForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            categoriesManager.handleCategorySubmit();
        });

        this.elements.categoryTypeSelect?.addEventListener('change', (e) => {
            const currentCategoryId = document.getElementById('category-id').value;
            categoriesManager.populateParentCategoryDropdown(currentCategoryId, null, e.target.value);
        });

        // Recurring modal
        this.elements.addRecurringBtn?.addEventListener('click', () => recurringManager.showRecurringModal());
        this.elements.closeRecurringModalBtn?.addEventListener('click', () => recurringManager.hideRecurringModal());
        this.elements.cancelRecurringBtn?.addEventListener('click', () => recurringManager.hideRecurringModal());
        this.elements.recurringForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            recurringManager.handleRecurringSubmit();
        });

        // Add event listeners for type changes to filter categories
        this.elements.transactionTypeSelect?.addEventListener('change', (e) => {
            this.populateCategorySelect(this.elements.categoriesForTransaction, e.target.value);
        });

        this.elements.recurringTypeSelect?.addEventListener('change', (e) => {
            this.populateCategorySelect(document.getElementById('recurring-category'), e.target.value);
        });

        // Add event listener for transfer from account change
        this.elements.transferFromAccountSelect?.addEventListener('change', (e) => {
            const fromAccountId = e.target.value;
            const toAccountSelect = document.getElementById('transfer-to-account');
            const currentToId = toAccountSelect.value;
            
            toAccountSelect.innerHTML = '';
            db.accounts.forEach(account => {
                if (account.id !== fromAccountId) {
                    const option = document.createElement('option');
                    option.value = account.id;
                    option.textContent = `${account.name} ($${account.balance.toFixed(2)})`;
                    toAccountSelect.appendChild(option);
                }
            });

            // If the previously selected 'to' account is still valid, re-select it
            if (currentToId && currentToId !== fromAccountId) {
                toAccountSelect.value = currentToId;
            }
        });

        // Save settings button
        this.elements.saveSettingsBtn?.addEventListener('click', (e) => {
            const btn = e.target;
            const originalText = btn.textContent;
            btn.textContent = 'Saving...';
            btn.disabled = true;

            setTimeout(() => {
                // Here you would normally save the settings to a backend
                ui.showToast('Settings saved successfully!', 'success');
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1000);
        });

        // Account Modal Listeners
        this.elements.accountModalBackdrop?.addEventListener('click', (e) => {
            if (e.target === this.elements.accountModalBackdrop) {
                accountsManager.hideAccountModal();
            }
        });
        this.elements.accountForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            accountsManager.handleAccountSubmit();
        });
        const closeAccountModalBtn = this.elements.accountModalBackdrop?.querySelector('#close-account-modal');
        closeAccountModalBtn?.addEventListener('click', () => accountsManager.hideAccountModal());
        const cancelAccountBtn = this.elements.accountModalBackdrop?.querySelector('#cancel-account-btn');
        cancelAccountBtn?.addEventListener('click', () => accountsManager.hideAccountModal());

        // Budget Form
        this.elements.budgetForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            budgetManager.handleBudgetSubmit();
        });
    },

    setupTheme() {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.body.classList.add('dark-mode');
            if (this.elements.themeSwitch) {
                this.elements.themeSwitch.checked = true;
            }
        }
    },

    changePage(pageId) {
        // Hide all pages
        this.elements.pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show requested page
        const currentPage = document.getElementById(pageId + '-page');
        if (currentPage) {
            currentPage.classList.add('active');
        }

        if (pageId === 'recurring') recurringManager.renderRecurringList();
        if (pageId === 'budgets') {
            budgetManager.renderBudgetList();
            budgetManager.populateCategorySelect();
        }
        if (pageId === 'reports') {
            reportsManager.renderIncomeExpenseChart();
        }

        // Update navigation
        this.updateNavigationState(pageId);

        // Update dashboard summary
        this.updateDashboardSummary();
    },

    updateNavigationState(activePageId = null) {
        if (!activePageId && this.elements.pages) {
            // Find the visible page if none specified
            const visiblePage = Array.from(this.elements.pages).find(page => 
                page.classList.contains('active'));
            
            if (visiblePage) {
                activePageId = visiblePage.id.replace('-page', '');
            }
        }

        // Update active navigation link
        this.elements.navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').substring(1); // Remove #
            if (linkPage === activePageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        if (this.elements.categoriesForTransaction) {
            this.elements.categoriesForTransaction.innerHTML = '';
            
            this.populateCategorySelect(this.elements.categoriesForTransaction, 'expense'); // Default to expense
        }
    },

    renderDashboard() {
        this.renderAccountList();
        this.renderCategoryList();
        this.renderRecentTransactions();
        this.renderTransactionForm();
        this.updateDashboardSummary();

        // Populate category dropdown on transaction form
        this.populateCategorySelect(this.elements.categoriesForTransaction, this.elements.transactionTypeSelect.value);
    },
    
    renderAccountList() {
        if (!this.elements.accountsList) return;
        
        this.elements.accountsList.innerHTML = '';
        
        db.accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            accountCard.innerHTML = `
                <div class="account-header">
                    <div class="account-name">${account.name}</div>
                    <div class="account-icon">
                        <i class="fas ${account.icon}"></i>
                    </div>
                </div>
                <div class="account-balance">$${account.balance.toFixed(2)}</div>
                <div class="account-type">${account.type.charAt(0).toUpperCase() + account.type.slice(1)}</div>
                <div class="account-actions">
                    <button class="btn btn-secondary btn-sm" onclick="accountsManager.editAccount('${account.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="accountsManager.deleteAccount('${account.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.elements.accountsList.appendChild(accountCard);
        });
        
        // Add "Add Account" card
        const addAccountCard = document.createElement('div');
        addAccountCard.className = 'account-card add-account';
        addAccountCard.innerHTML = `
            <div class="account-add-btn" onclick="accountsManager.showAddAccountModal()">
                <i class="fas fa-plus"></i>
                <div>Add Account</div>
            </div>
        `;
        this.elements.accountsList.appendChild(addAccountCard);
        
        // Also update accounts dropdown in transaction form
        if (this.elements.accountsForTransaction) {
            this.elements.accountsForTransaction.innerHTML = '';
            db.accounts.forEach(account => {
                const option = document.createElement('option');
                option.value = account.id;
                option.textContent = account.name;
                this.elements.accountsForTransaction.appendChild(option);
            });
        }
    },
    
    renderCategoryList() {
        if (!this.elements.categoriesList) return;
        
        this.elements.categoriesList.innerHTML = '';
        const categories = db.categories.filter(c => !c.parentId); // Get top-level categories

        const renderCategory = (category, level) => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            categoryItem.style.marginLeft = `${level * 20}px`;
            categoryItem.innerHTML = `
                <div class="category-icon" style="background-color: ${category.color}">
                    <i class="fas ${category.icon}"></i>
                </div>
                <div class="category-details">
                    <div class="category-name">${category.name}</div>
                    <div class="category-description">Type: ${category.type.charAt(0).toUpperCase() + category.type.slice(1)}</div>
                </div>
                <div class="category-actions">
                    <button class="btn btn-secondary btn-sm" onclick="categoriesManager.editCategory('${category.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="categoriesManager.deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            this.elements.categoriesList.appendChild(categoryItem);

            const subCategories = db.categories.filter(c => c.parentId === category.id);
            subCategories.forEach(sub => renderCategory(sub, level + 1));
        };

        categories.forEach(category => renderCategory(category, 0));
        
        // Add "Add Category" button
        const addCategoryItem = document.createElement('div');
        addCategoryItem.className = 'category-item add-category';
        addCategoryItem.innerHTML = `
            <div class="category-add-btn" onclick="categoriesManager.showAddCategoryModal()">
                <i class="fas fa-plus"></i>
                <div>Add Category</div>
            </div>
        `;
        this.elements.categoriesList.appendChild(addCategoryItem);
    },
    
    renderRecentTransactions() {
        if (!this.elements.recentTransactions) return;
        
        this.elements.recentTransactions.innerHTML = '';
        
        // Sort transactions by date, most recent first
        const recentTransactions = [...db.transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);  // Get only the 5 most recent
        
        if (recentTransactions.length === 0) {
            this.elements.recentTransactions.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No transactions yet. Add your first transaction!</td>
                </tr>
            `;
            return;
        }
        
        recentTransactions.forEach(transaction => {
            const category = db.categories.find(cat => cat.id === transaction.categoryId);
            const account = db.accounts.find(acc => acc.id === transaction.accountId);
            
            const row = document.createElement('tr');
            
            // Format date properly
            const date = new Date(transaction.date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            
            row.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="category-icon" style="background-color: ${category?.color || '#ccc'}; width: 30px; height: 30px;">
                            <i class="fas ${category?.icon || 'fa-question'}"></i>
                        </div>
                        ${transaction.payee}
                    </div>
                </td>
                <td>${formattedDate}</td>
                <td>${category?.name || 'Uncategorized'}</td>
                <td>${account?.name || 'Unknown Account'}</td>
                <td class="${transaction.type === 'income' ? 'text-success' : 'text-danger'}">
                    ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
                </td>
            `;
            
            this.elements.recentTransactions.appendChild(row);
        });
    },
    
    renderTransactionForm() {
        // No specific code needed here as the form is rendered in HTML
        // But it could be used to reset the form or pre-fill values
    },
    
    updateDashboardSummary() {
        // Update total balance
        const totalBalance = db.accounts.reduce((sum, account) => sum + account.balance, 0);
        const totalBalanceElement = document.getElementById('total-balance');
        if (totalBalanceElement) {
            totalBalanceElement.textContent = `$${totalBalance.toFixed(2)}`;
        }
        
        // Update monthly income
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyIncome = db.transactions
            .filter(t => t.type === 'income' && 
                    !t.isTransfer &&
                    new Date(t.date).getMonth() === currentMonth && 
                    new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const monthlyIncomeElement = document.getElementById('monthly-income');
        if (monthlyIncomeElement) {
            monthlyIncomeElement.textContent = `$${monthlyIncome.toFixed(2)}`;
        }
        
        // Update monthly expenses
        const monthlyExpenses = db.transactions
            .filter(t => t.type === 'expense' && 
                    !t.isTransfer &&
                    new Date(t.date).getMonth() === currentMonth && 
                    new Date(t.date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0);
            
        const monthlyExpensesElement = document.getElementById('monthly-expenses');
        if (monthlyExpensesElement) {
            monthlyExpensesElement.textContent = `$${monthlyExpenses.toFixed(2)}`;
        }
        
        // Update spending chart
        this.updateSpendingChart();
    },
    
    updateSpendingChart() {
        const ctx = document.getElementById('spending-chart');
        if (!ctx) return;
        
        // Get current month's expenses by category
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const expensesByCategory = {};
        let totalExpenses = 0;
        
        db.transactions
            .filter(t => t.type === 'expense' && 
                    !t.isTransfer &&
                    new Date(t.date).getMonth() === currentMonth && 
                    new Date(t.date).getFullYear() === currentYear)
            .forEach(transaction => {
                const categoryId = transaction.categoryId;
                if (!expensesByCategory[categoryId]) {
                    expensesByCategory[categoryId] = 0;
                }
                expensesByCategory[categoryId] += transaction.amount;
                totalExpenses += transaction.amount;
            });
        
        // Prepare chart data
        const chartData = [];
        const chartLabels = [];
        const chartColors = [];
        
        for (const categoryId in expensesByCategory) {
            const category = db.categories.find(cat => cat.id === categoryId);
            if (category) {
                chartLabels.push(category.name);
                chartData.push(expensesByCategory[categoryId]);
                chartColors.push(category.color);
            }
        }
        
        // If we already have a chart, destroy it
        if (window.spendingChart) {
            window.spendingChart.destroy();
        }
        
        // Create new chart
        window.spendingChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 15
                }]
            },
            options: {
                cutout: '75%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: getComputedStyle(document.body).getPropertyValue('--text-color')
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const percentage = totalExpenses ? 
                                    Math.round((value / totalExpenses) * 100) : 0;
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        // Update center text
        const centerTextTotal = document.getElementById('spending-chart-total');
        if (centerTextTotal) {
            centerTextTotal.textContent = `$${totalExpenses.toFixed(2)}`;
        }
    },
    
    handleTransactionSubmit() {
        const form = this.elements.transactionForm;
        if (!this.validateForm(form)) {
            this.showToast('Please fix the errors on the form.', 'error');
            return;
        }

        const type = form.querySelector('#transaction-type').value;
        const amount = parseFloat(form.querySelector('#transaction-amount').value);
        const date = form.querySelector('#transaction-date').value;
        const payee = form.querySelector('#transaction-payee').value;
        const categoryId = form.querySelector('#transaction-category').value;
        const accountId = form.querySelector('#transaction-account').value;
        const notes = form.querySelector('#transaction-notes').value;
        
        if (!amount || !date || !payee || !categoryId || !accountId) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Create transaction object
        const transaction = {
            id: 'txn_' + Date.now(),
            type,
            amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
            date,
            payee,
            categoryId,
            accountId,
            notes,
            createdAt: new Date().toISOString()
        };
        
        // Add to transactions array
        db.transactions.push(transaction);
        
        // Update account balance
        const account = db.accounts.find(acc => acc.id === accountId);
        if (account) {
            account.balance += transaction.amount;
        }
        
        // Save to local storage
        db.save();
        
        // Reset form
        form.reset();
        
        // Set default date to today
        form.querySelector('#transaction-date').valueAsDate = new Date();
        
        // Update UI
        this.renderDashboard();
        
        // Show success message
        this.showToast('Transaction added successfully!', 'success');

        // Go back to dashboard
        this.changePage('dashboard');
    },

    showTransferModal() {
        if (!this.elements.transferModalBackdrop) return;

        // Populate account dropdowns
        const fromAccountSelect = document.getElementById('transfer-from-account');
        const toAccountSelect = document.getElementById('transfer-to-account');
        fromAccountSelect.innerHTML = '';
        toAccountSelect.innerHTML = '';

        if (db.accounts.length < 2) {
            this.showToast('You need at least two accounts to make a transfer.', 'error');
            return;
        }

        db.accounts.forEach(account => {
            const option1 = document.createElement('option');
            option1.value = account.id;
            option1.textContent = `${account.name} ($${account.balance.toFixed(2)})`;
            fromAccountSelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = account.id;
            option2.textContent = `${account.name} ($${account.balance.toFixed(2)})`;
            toAccountSelect.appendChild(option2);
        });
        
        // Trigger change event to filter 'To' account list initially
        this.elements.transferFromAccountSelect.dispatchEvent(new Event('change'));

        // Set date to today
        document.getElementById('transfer-date').valueAsDate = new Date();

        this.elements.transferModalBackdrop.classList.add('active');
    },

    hideTransferModal() {
        if (!this.elements.transferModalBackdrop) return;
        this.elements.transferModalBackdrop.classList.remove('active');
        this.elements.transferForm.reset();
    },

    handleTransferSubmit() {
        const form = this.elements.transferForm;
        if (!this.validateForm(form)) {
            this.showToast('Please fix the errors on the form.', 'error');
            return;
        }

        const fromAccountId = form.querySelector('#transfer-from-account').value;
        const toAccountId = form.querySelector('#transfer-to-account').value;
        const amount = parseFloat(form.querySelector('#transfer-amount').value);
        const date = form.querySelector('#transfer-date').value;
        const notes = form.querySelector('#transfer-notes').value;

        if (fromAccountId === toAccountId) {
            this.showToast('From and To accounts cannot be the same.', 'error');
            const fromGroup = form.querySelector('#transfer-from-account').closest('.form-group');
            const toGroup = form.querySelector('#transfer-to-account').closest('.form-group');
            fromGroup.classList.add('error');
            toGroup.classList.add('error');
            fromGroup.querySelector('.error-message').textContent = 'Cannot be the same as To account.';
            toGroup.querySelector('.error-message').textContent = 'Cannot be the same as From account.';
            return;
        }

        const fromAccount = db.accounts.find(acc => acc.id === fromAccountId);
        if (fromAccount.balance < amount) {
            this.showToast("Insufficient funds in the 'From' account.", 'error');
            return;
        }

        // Create two transactions for the transfer
        const expenseTransaction = {
            id: 'txn_' + Date.now(),
            type: 'expense',
            amount: -Math.abs(amount),
            date: date,
            payee: `Transfer to ${db.accounts.find(acc => acc.id === toAccountId).name}`,
            categoryId: 'cat_transfer', // Special category for transfers
            accountId: fromAccountId,
            notes: notes,
            isTransfer: true
        };

        const incomeTransaction = {
            id: 'txn_' + (Date.now() + 1),
            type: 'income',
            amount: Math.abs(amount),
            date: date,
            payee: `Transfer from ${fromAccount.name}`,
            categoryId: 'cat_transfer', // Special category for transfers
            accountId: toAccountId,
            notes: notes,
            isTransfer: true
        };

        db.transactions.push(expenseTransaction, incomeTransaction);

        // Update account balances
        accountsManager.updateBalance(fromAccountId, -amount);
        accountsManager.updateBalance(toAccountId, amount);

        db.save();
        this.renderDashboard();
        this.hideTransferModal();
        this.showToast('Transfer successful!', 'success');
    },

    populateCategorySelect(selectElement, type) {
        if (!selectElement) return;
        selectElement.innerHTML = '';

        const renderCategoryOptions = (categories, level, group) => {
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = `${'--'.repeat(level)} ${category.name}`;
                group.appendChild(option);

                const subCategories = db.categories.filter(c => c.parentId === category.id && c.type === type);
                if (subCategories.length > 0) {
                    renderCategoryOptions(subCategories, level + 1, group);
                }
            });
        };
        
        const filteredCategories = db.categories.filter(cat => cat.type === type && !cat.parentId);
        const group = document.createElement('optgroup');
        group.label = type.charAt(0).toUpperCase() + type.slice(1);
        renderCategoryOptions(filteredCategories, 0, group);
        selectElement.appendChild(group);
    },

    showToast(message, type = 'info') {
        if (!this.elements.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            info: 'fa-info-circle'
        };
        const icon = icons[type] || 'fa-info-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${icon}"></i></div>
            <div class="toast-message">${message}</div>
        `;

        this.elements.toastContainer.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    },

    showConfirmation(message, onConfirm) {
        if (!this.elements.confirmationModalBackdrop) return;

        const modal = this.elements.confirmationModalBackdrop;
        modal.querySelector('#confirmation-modal-message').textContent = message;
        modal.classList.add('active');

        const confirmBtn = modal.querySelector('#confirm-confirmation-btn');
        const cancelBtn = modal.querySelector('#cancel-confirmation-btn');
        const closeBtn = modal.querySelector('#close-confirmation-modal');

        const hide = () => modal.classList.remove('active');

        // Use .cloneNode(true) to remove old event listeners
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            hide();
        });

        cancelBtn.addEventListener('click', hide);
        closeBtn.addEventListener('click', hide);
    },

    showReassignmentModal(itemType, itemId, onConfirm) {
        if (!this.elements.reassignModalBackdrop) return;

        const item = itemType === 'account' 
            ? db.accounts.find(a => a.id === itemId) 
            : db.categories.find(c => c.id === itemId);

        const transactions = db.transactions.filter(t => t[itemType === 'account' ? 'accountId' : 'categoryId'] === itemId);
        
        const modal = this.elements.reassignModalBackdrop;
        modal.querySelector('#reassign-modal-message').textContent = 
            `The ${itemType} "${item.name}" is linked to ${transactions.length} transactions. Please select a new ${itemType} to reassign them to before deleting.`;
        
        const reassignSelect = modal.querySelector('#reassign-select');
        reassignSelect.innerHTML = '';
        
        const items = (itemType === 'account' ? db.accounts : db.categories)
            .filter(i => i.id !== itemId && i.type === item.type); // Filter out the item itself and ensure same type
        
        items.forEach(i => {
            const option = document.createElement('option');
            option.value = i.id;
            option.textContent = i.name;
            reassignSelect.appendChild(option);
        });

        if (items.length === 0) {
            this.showToast(`Cannot delete ${item.name}. No other ${itemType} available for reassignment.`, 'error');
            return;
        }

        modal.classList.add('active');

        const confirmBtn = modal.querySelector('#confirm-reassign-btn');
        const cancelBtn = modal.querySelector('#cancel-reassign-btn');
        const closeBtn = modal.querySelector('#close-reassign-modal');

        const hide = () => modal.classList.remove('active');

        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

        newConfirmBtn.addEventListener('click', () => {
            const newId = reassignSelect.value;
            onConfirm(newId);
            hide();
        });

        cancelBtn.addEventListener('click', hide);
        closeBtn.addEventListener('click', hide);
    },

    validateForm(form, customErrors = {}) {
        let isValid = true;
        // Clear previous errors
        form.querySelectorAll('.form-group').forEach(fg => {
            fg.classList.remove('error');
            const errorDiv = fg.querySelector('.error-message');
            if (errorDiv) errorDiv.textContent = '';
        });

        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                const formGroup = field.closest('.form-group');
                if (formGroup) {
                    formGroup.classList.add('error');
                    const errorDiv = formGroup.querySelector('.error-message');
                    if (errorDiv) {
                        const fieldName = field.name || field.id;
                        errorDiv.textContent = customErrors[fieldName] || 'This field is required.';
                    }
                }
            }
        });

        return isValid;
    }
};

// Accounts Manager
const accountsManager = {
    showAddAccountModal() {
        const modal = ui.elements.accountModalBackdrop;
        if (!modal) return;
        
        modal.querySelector('#account-modal-title').textContent = 'Add Account';
        ui.elements.accountForm.reset();
        modal.querySelector('#account-id').value = '';
        modal.querySelector('#account-balance').disabled = false;
        
        modal.classList.add('active');
    },

    hideAccountModal() {
        const modal = ui.elements.accountModalBackdrop;
        if (modal) {
            modal.classList.remove('active');
        }
    },

    handleAccountSubmit() {
        const form = ui.elements.accountForm;
        if(!ui.validateForm(form)) return;

        const id = form.querySelector('#account-id').value;
        const name = form.querySelector('#account-name').value;
        const type = form.querySelector('#account-type').value;
        const balance = parseFloat(form.querySelector('#account-balance').value);
        const icon = form.querySelector('#account-icon').value || 'fa-wallet';

        if (id) { // Editing
            const account = db.accounts.find(a => a.id === id);
            account.name = name;
            account.type = type;
            account.icon = icon;
            // Balance editing is handled separately to maintain integrity
        } else { // Creating
            db.accounts.push({
                id: 'acc_' + Date.now(),
                name,
                type,
                balance,
                icon
            });
        }
        db.save();
        ui.renderDashboard();
        this.hideAccountModal();
        ui.showToast(id ? 'Account updated!' : 'Account created!', 'success');
    },
    
    editAccount(accountId) {
        const account = db.accounts.find(acc => acc.id === accountId);
        if (!account) return;
        
        const modal = ui.elements.accountModalBackdrop;
        if (!modal) return;

        modal.querySelector('#account-modal-title').textContent = 'Edit Account';
        ui.elements.accountForm.reset();
        
        modal.querySelector('#account-id').value = account.id;
        modal.querySelector('#account-name').value = account.name;
        modal.querySelector('#account-type').value = account.type;
        modal.querySelector('#account-icon').value = account.icon;
        
        // Disable starting balance editing
        const balanceInput = modal.querySelector('#account-balance');
        balanceInput.value = account.balance;
        balanceInput.disabled = true;

        modal.classList.add('active');
    },
    
    deleteAccount(accountId) {
        const account = db.accounts.find(acc => acc.id === accountId);
        if (!account) return;
        
        const hasTransactions = db.transactions.some(t => t.accountId === accountId);
        
        if (hasTransactions) {
            ui.showReassignmentModal('account', accountId, (newAccountId) => {
                // Reassign transactions
                db.transactions.forEach(t => {
                    if (t.accountId === accountId) {
                        t.accountId = newAccountId;
                    }
                });
                // Now delete the account
                db.accounts = db.accounts.filter(acc => acc.id !== accountId);
                db.save();
                ui.renderDashboard();
                ui.showToast(`Account "${account.name}" deleted and transactions reassigned.`, 'success');
            });
            return;
        }
        
        ui.showConfirmation(`Are you sure you want to delete ${account.name}? This action cannot be undone.`, () => {
            db.accounts = db.accounts.filter(acc => acc.id !== accountId);
            db.save();
            ui.renderDashboard();
            ui.showToast('Account deleted successfully!', 'success');
        });
    },

    updateBalance(accountId, amount) {
        const account = db.accounts.find(acc => acc.id === accountId);
        if (account) {
            account.balance += amount;
        }
    }
};

// Categories Manager
const categoriesManager = {
    showAddCategoryModal() {
        const modal = ui.elements.categoryModalBackdrop;
        if (!modal) return;

        document.getElementById('category-modal-title').textContent = 'Add Category';
        ui.elements.categoryForm.reset();
        document.getElementById('category-id').value = '';
        
        const type = document.getElementById('category-type').value;
        this.populateParentCategoryDropdown(null, null, type);

        modal.classList.add('active');
    },

    hideCategoryModal() {
        const modal = ui.elements.categoryModalBackdrop;
        if (modal) {
            modal.classList.remove('active');
        }
    },
    
    editCategory(categoryId) {
        const category = db.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        const modal = ui.elements.categoryModalBackdrop;
        if (!modal) return;

        document.getElementById('category-modal-title').textContent = 'Edit Category';
        ui.elements.categoryForm.reset();
        
        const typeSelect = document.getElementById('category-type');
        const hasTransactions = db.transactions.some(t => t.categoryId === categoryId);
        typeSelect.disabled = hasTransactions;
        
        document.getElementById('category-id').value = category.id;
        document.getElementById('category-name').value = category.name;
        typeSelect.value = category.type;
        document.getElementById('category-icon').value = category.icon;
        document.getElementById('category-color').value = category.color;

        this.populateParentCategoryDropdown(category.id, category.parentId, category.type);

        modal.classList.add('active');
    },

    populateParentCategoryDropdown(currentCategoryId = null, parentId = null, type) {
        const parentSelect = document.getElementById('category-parent');
        parentSelect.innerHTML = '<option value="">None</option>'; // No parent option
        
        // Filter parents by the selected type
        const categories = db.categories.filter(c => c.id !== currentCategoryId && !c.parentId && c.type === type);

        const renderCategoryOptions = (categories, level) => {
            categories.forEach(category => {
                // Prevent a category from being its own descendant
                if(category.id === currentCategoryId) return;

                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = `${'--'.repeat(level)} ${category.name}`;
                parentSelect.appendChild(option);
            });
        };

        renderCategoryOptions(categories, 0);
        
        if (parentId) {
            parentSelect.value = parentId;
        }
    },
    
    deleteCategory(categoryId) {
        const category = db.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Check if it has sub-categories
        const hasSubCategories = db.categories.some(c => c.parentId === categoryId);
        if (hasSubCategories) {
            ui.showToast('This category has sub-categories. Please delete or reassign them first.', 'error');
            return;
        }

        // Check if transactions exist for this category
        const hasTransactions = db.transactions.some(t => t.categoryId === categoryId);
        
        if (hasTransactions) {
            ui.showReassignmentModal('category', categoryId, (newCategoryId) => {
                db.transactions.forEach(t => {
                    if (t.categoryId === categoryId) {
                        t.categoryId = newCategoryId;
                    }
                });
                db.categories = db.categories.filter(c => c.id !== categoryId);
                db.save();
                ui.renderDashboard();
                ui.showToast(`Category "${category.name}" deleted and transactions reassigned.`, 'success');
            });
            return;
        }
        
        ui.showConfirmation(`Are you sure you want to delete ${category.name}?`, () => {
            db.categories = db.categories.filter(cat => cat.id !== categoryId);
            db.save();
            ui.renderDashboard();
            ui.showToast('Category deleted successfully!', 'success');
        });
    },

    handleCategorySubmit() {
        const form = ui.elements.categoryForm;
        if (!ui.validateForm(form)) {
            ui.showToast('Please fix the errors on the form.', 'error');
            return;
        }

        const id = form.querySelector('#category-id').value;
        const name = form.querySelector('#category-name').value;
        const type = form.querySelector('#category-type').value;
        const parentId = form.querySelector('#category-parent').value || null;
        const icon = form.querySelector('#category-icon').value || 'fa-tag';
        const color = form.querySelector('#category-color').value;

        if (!name) {
            ui.showToast('Category name is required.', 'error');
            return;
        }

        if (id) { // Editing existing category
            const category = db.categories.find(c => c.id === id);
            category.name = name;
            category.type = type;
            category.parentId = parentId;
            category.icon = icon;
            category.color = color;
        } else { // Creating new category
            const newCategory = {
                id: 'cat_' + Date.now(),
                name,
                type,
                parentId,
                icon,
                color
            };
            db.categories.push(newCategory);
        }

        db.save();
        ui.renderDashboard();
        this.hideCategoryModal();
        ui.showToast(id ? 'Category updated!' : 'Category created!', 'success');
    }
};

const recurringManager = {
    renderRecurringList() {
        const list = ui.elements.recurringTransactionsList;
        if (!list) return;
        list.innerHTML = '';

        db.recurring.forEach(item => {
            const account = db.accounts.find(a => a.id === item.accountId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.payee}</td>
                <td>$${item.amount.toFixed(2)}</td>
                <td>${item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)}</td>
                <td>${new Date(item.nextDate).toLocaleDateString()}</td>
                <td>${account ? account.name : 'N/A'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="recurringManager.editRecurring('${item.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-secondary btn-sm" onclick="recurringManager.deleteRecurring('${item.id}')"><i class="fas fa-trash"></i></button>
                </td>
            `;
            list.appendChild(row);
        });
    },

    showRecurringModal() {
        const modal = ui.elements.recurringModalBackdrop;
        if (!modal) return;

        document.getElementById('recurring-modal-title').textContent = 'Add Recurring Transaction';
        ui.elements.recurringForm.reset();
        document.getElementById('recurring-id').value = '';
        document.getElementById('recurring-start-date').valueAsDate = new Date();
        
        // Populate categories and accounts
        ui.populateCategorySelect(document.getElementById('recurring-category'), 'expense'); // Default to expense
        this.populateSelect('recurring-account', db.accounts);

        modal.classList.add('active');
    },

    editRecurring(id) {
        const item = db.recurring.find(r => r.id === id);
        if (!item) return;

        this.showRecurringModal();
        document.getElementById('recurring-modal-title').textContent = 'Edit Recurring Transaction';
        
        document.getElementById('recurring-id').value = item.id;
        document.getElementById('recurring-type').value = item.type;
        document.getElementById('recurring-amount').value = item.amount;
        document.getElementById('recurring-payee').value = item.payee;
        document.getElementById('recurring-category').value = item.categoryId;
        document.getElementById('recurring-account').value = item.accountId;
        document.getElementById('recurring-frequency').value = item.frequency;
        document.getElementById('recurring-start-date').value = item.startDate;
        document.getElementById('recurring-notes').value = item.notes;

        // Repopulate dropdowns and set value
        ui.populateCategorySelect(document.getElementById('recurring-category'), item.type);
        document.getElementById('recurring-category').value = item.categoryId;
    },

    deleteRecurring(id) {
        ui.showConfirmation('Are you sure you want to delete this recurring transaction?', () => {
            db.recurring = db.recurring.filter(r => r.id !== id);
            db.save();
            this.renderRecurringList();
            ui.showToast('Recurring transaction deleted.', 'success');
        });
    },

    hideRecurringModal() {
        const modal = ui.elements.recurringModalBackdrop;
        if (modal) {
            modal.classList.remove('active');
        }
    },

    handleRecurringSubmit() {
        const form = ui.elements.recurringForm;
        if (!ui.validateForm(form)) {
            ui.showToast('Please fix the errors on the form.', 'error');
            return;
        }
        
        const id = form.querySelector('#recurring-id').value;
        const recurringData = {
            type: form.querySelector('#recurring-type').value,
            amount: parseFloat(form.querySelector('#recurring-amount').value),
            payee: form.querySelector('#recurring-payee').value,
            categoryId: form.querySelector('#recurring-category').value,
            accountId: form.querySelector('#recurring-account').value,
            frequency: form.querySelector('#recurring-frequency').value,
            startDate: form.querySelector('#recurring-start-date').value,
            notes: form.querySelector('#recurring-notes').value,
            nextDate: form.querySelector('#recurring-start-date').value,
            lastProcessedDate: null
        };

        if (id) {
            const index = db.recurring.findIndex(r => r.id === id);
            db.recurring[index] = { ...db.recurring[index], ...recurringData };
        } else {
            recurringData.id = 'rec_' + Date.now();
            db.recurring.push(recurringData);
        }

        db.save();
        this.renderRecurringList();
        this.hideRecurringModal();
        ui.showToast(id ? 'Recurring transaction updated!' : 'Recurring transaction saved!', 'success');
    },

    populateSelect(elementId, items) {
        const select = document.getElementById(elementId);
        select.innerHTML = '';
        items.forEach(item => {
            if(item.type === 'internal') return; // Skip transfer category
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            select.appendChild(option);
        });
    },

    processRecurringTransactions() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        db.recurring.forEach(item => {
            let nextDate = new Date(item.nextDate);
            nextDate.setHours(0, 0, 0, 0);

            while (nextDate <= today) {
                // Create the transaction
                const transactionAmount = item.type === 'expense' ? -Math.abs(item.amount) : Math.abs(item.amount);
                const newTransaction = {
                    id: 'txn_' + Date.now() + Math.random(),
                    type: item.type,
                    amount: transactionAmount,
                    date: new Date(nextDate).toISOString().split('T')[0],
                    payee: item.payee,
                    categoryId: item.categoryId,
                    accountId: item.accountId,
                    notes: `(Recurring) ${item.notes || ''}`
                };
                db.transactions.push(newTransaction);
                accountsManager.updateBalance(item.accountId, transactionAmount);

                // Calculate the next date
                switch (item.frequency) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }
            }
            item.nextDate = new Date(nextDate).toISOString().split('T')[0];
        });
        db.save();
    }
};

const budgetManager = {
    initialize() {
        ui.elements.budgetForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleBudgetSubmit();
        });
        this.renderBudgetList();
    },

    populateCategorySelect() {
        const select = document.getElementById('budget-category');
        if (!select) return;

        select.innerHTML = '<option value="">Select a category</option>';
        ui.populateCategorySelect(select, 'expense'); // Budgets are typically for expenses
    },

    renderBudgetList() {
        const list = ui.elements.budgetList;
        if (!list) return;

        list.innerHTML = '';
        db.budgets.forEach(budget => {
            const category = db.categories.find(c => c.id === budget.categoryId);
            if (!category) return;

            const spent = this.calculateSpent(budget.categoryId);
            const progress = (spent / budget.amount) * 100;

            const item = document.createElement('div');
            item.className = 'budget-item';
            item.innerHTML = `
                <div class="budget-item-info">
                    <p><strong>${category.name}</strong></p>
                    <p>$${spent.toFixed(2)} spent of $${budget.amount.toFixed(2)}</p>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${Math.min(progress, 100)}%;"></div>
                </div>
                <div class="budget-item-actions">
                    <button class="icon-btn" onclick="budgetManager.editBudget('${budget.id}')"><i class="fas fa-edit"></i></button>
                    <button class="icon-btn" onclick="budgetManager.deleteBudget('${budget.id}')"><i class="fas fa-trash"></i></button>
                </div>
            `;
            list.appendChild(item);
        });
    },

    calculateSpent(categoryId) {
        return db.transactions
            .filter(t => t.categoryId === categoryId && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
    },

    handleBudgetSubmit() {
        const form = ui.elements.budgetForm;
        const categoryId = form.querySelector('#budget-category').value;
        const amount = parseFloat(form.querySelector('#budget-amount').value);
        const id = form.querySelector('#budget-id').value;

        if (!categoryId || !amount) {
            ui.showToast('Please fill in all fields.', 'error');
            return;
        }

        if (id) { // Editing
            const budget = db.budgets.find(b => b.id === id);
            budget.categoryId = categoryId;
            budget.amount = amount;
        } else { // Adding
            db.budgets.push({
                id: 'bud_' + Date.now(),
                categoryId,
                amount
            });
        }
        
        db.save();
        this.renderBudgetList();
        form.reset();
        form.querySelector('#budget-id').value = '';
        ui.showToast('Budget saved!', 'success');
    },

    editBudget(id) {
        const budget = db.budgets.find(b => b.id === id);
        const form = ui.elements.budgetForm;
        form.querySelector('#budget-id').value = budget.id;
        form.querySelector('#budget-category').value = budget.categoryId;
        form.querySelector('#budget-amount').value = budget.amount;
        form.querySelector('button[type="submit"]').textContent = 'Update Budget';
    },

    deleteBudget(id) {
        ui.showConfirmation('Are you sure you want to delete this budget?', () => {
            db.budgets = db.budgets.filter(b => b.id !== id);
            db.save();
            this.renderBudgetList();
            ui.showToast('Budget deleted.', 'success');
        });
    }
};

const reportsManager = {
    incomeExpenseChart: null,

    initialize() {
        // We'll call the render function when the page is changed to 'reports'
    },

    getMonthlyData() {
        const data = {
            labels: [],
            income: [],
            expenses: []
        };
        const monthMap = {};

        db.transactions.forEach(t => {
            const date = new Date(t.date);
            const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            if (!monthMap[month]) {
                monthMap[month] = { income: 0, expenses: 0 };
            }
            if (t.type === 'income') {
                monthMap[month].income += t.amount;
            } else if (t.type === 'expense') {
                monthMap[month].expenses += Math.abs(t.amount);
            }
        });

        // Sort months chronologically
        const sortedMonths = Object.keys(monthMap).sort((a, b) => {
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            const aDate = new Date(`01 ${aMonth} 20${aYear}`);
            const bDate = new Date(`01 ${bMonth} 20${bYear}`);
            return aDate - bDate;
        });

        sortedMonths.forEach(month => {
            data.labels.push(month);
            data.income.push(monthMap[month].income);
            data.expenses.push(monthMap[month].expenses);
        });

        return data;
    },

    renderIncomeExpenseChart() {
        const ctx = document.getElementById('income-expense-chart')?.getContext('2d');
        if (!ctx) return;

        const monthlyData = this.getMonthlyData();

        if (this.incomeExpenseChart) {
            this.incomeExpenseChart.destroy();
        }

        this.incomeExpenseChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: monthlyData.income,
                        backgroundColor: 'rgba(16, 185, 129, 0.6)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: monthlyData.expenses,
                        backgroundColor: 'rgba(239, 68, 68, 0.6)',
                        borderColor: 'rgba(239, 68, 68, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add a transfer category if it doesn't exist
    if (!db.categories.some(cat => cat.id === 'cat_transfer')) {
        db.categories.push({
            id: 'cat_transfer',
            name: 'Transfer',
            icon: 'fa-exchange-alt',
            color: '#888',
            type: 'internal' // Special type to exclude from income/expense reports
        });
    }

    // Load data from local storage
    db.load();
    
    // Process recurring transactions
    recurringManager.processRecurringTransactions();

    // Initialize UI
    ui.initialize();
    reportsManager.initialize();
    
    // Set default date in transaction form to today
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}); 