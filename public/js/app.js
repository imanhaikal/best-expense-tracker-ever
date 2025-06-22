// Expense Tracker Application

// Data Storage Utilities
const db = {
    // In-memory storage before implementing actual database
    accounts: [],
    transactions: [],
    categories: [],
    budgets: [],
    
    // Local storage management
    save() {
        localStorage.setItem('expenseTrackerData', JSON.stringify({
            accounts: this.accounts,
            transactions: this.transactions,
            categories: this.categories,
            budgets: this.budgets
        }));
    },
    
    load() {
        const data = JSON.parse(localStorage.getItem('expenseTrackerData') || '{}');
        this.accounts = data.accounts || [];
        this.transactions = data.transactions || [];
        this.categories = data.categories || [];
        this.budgets = data.budgets || [];
        
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
        accountsForTransaction: document.getElementById('transaction-account')
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

        // Update navigation
        this.updateNavigationState(pageId);
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
    },

    renderDashboard() {
        this.renderAccountList();
        this.renderCategoryList();
        this.renderRecentTransactions();
        this.renderTransactionForm();
        this.updateDashboardSummary();
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
        
        db.categories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
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
        });
        
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
        
        // Also update categories dropdown in transaction form
        if (this.elements.categoriesForTransaction) {
            this.elements.categoriesForTransaction.innerHTML = '';
            
            // Group categories by type
            const incomeCategories = db.categories.filter(cat => cat.type === 'income');
            const expenseCategories = db.categories.filter(cat => cat.type === 'expense');
            
            // Add income categories
            const incomeGroup = document.createElement('optgroup');
            incomeGroup.label = 'Income';
            incomeCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                incomeGroup.appendChild(option);
            });
            this.elements.categoriesForTransaction.appendChild(incomeGroup);
            
            // Add expense categories
            const expenseGroup = document.createElement('optgroup');
            expenseGroup.label = 'Expenses';
            expenseCategories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                expenseGroup.appendChild(option);
            });
            this.elements.categoriesForTransaction.appendChild(expenseGroup);
        }
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
        if (!form) return;
        
        const type = form.querySelector('#transaction-type').value;
        const amount = parseFloat(form.querySelector('#transaction-amount').value);
        const date = form.querySelector('#transaction-date').value;
        const payee = form.querySelector('#transaction-payee').value;
        const categoryId = form.querySelector('#transaction-category').value;
        const accountId = form.querySelector('#transaction-account').value;
        const notes = form.querySelector('#transaction-notes').value;
        
        if (!amount || !date || !payee || !categoryId || !accountId) {
            alert('Please fill in all required fields');
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
        alert('Transaction added successfully!');
    }
};

// Accounts Manager
const accountsManager = {
    showAddAccountModal() {
        // Implement modal for adding accounts
        alert("Add Account functionality will be implemented soon!");
    },
    
    editAccount(accountId) {
        const account = db.accounts.find(acc => acc.id === accountId);
        if (!account) return;
        
        // Implement edit account functionality
        alert(`Edit Account functionality for ${account.name} will be implemented soon!`);
    },
    
    deleteAccount(accountId) {
        const account = db.accounts.find(acc => acc.id === accountId);
        if (!account) return;
        
        // Check if transactions exist for this account
        const hasTransactions = db.transactions.some(t => t.accountId === accountId);
        
        if (hasTransactions) {
            alert(`Cannot delete ${account.name} because it has transactions. Please delete the transactions first or transfer them to another account.`);
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${account.name}?`)) {
            // Remove account from array
            db.accounts = db.accounts.filter(acc => acc.id !== accountId);
            
            // Save to local storage
            db.save();
            
            // Update UI
            ui.renderDashboard();
            
            alert('Account deleted successfully!');
        }
    }
};

// Categories Manager
const categoriesManager = {
    showAddCategoryModal() {
        // Implement modal for adding categories
        alert("Add Category functionality will be implemented soon!");
    },
    
    editCategory(categoryId) {
        const category = db.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Implement edit category functionality
        alert(`Edit Category functionality for ${category.name} will be implemented soon!`);
    },
    
    deleteCategory(categoryId) {
        const category = db.categories.find(cat => cat.id === categoryId);
        if (!category) return;
        
        // Check if transactions exist for this category
        const hasTransactions = db.transactions.some(t => t.categoryId === categoryId);
        
        if (hasTransactions) {
            alert(`Cannot delete ${category.name} because it has transactions. Please reassign those transactions first.`);
            return;
        }
        
        if (confirm(`Are you sure you want to delete ${category.name}?`)) {
            // Remove category from array
            db.categories = db.categories.filter(cat => cat.id !== categoryId);
            
            // Save to local storage
            db.save();
            
            // Update UI
            ui.renderDashboard();
            
            alert('Category deleted successfully!');
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load data from local storage
    db.load();
    
    // Initialize UI
    ui.initialize();
    
    // Set default date in transaction form to today
    const dateInput = document.getElementById('transaction-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
}); 