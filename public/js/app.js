document.addEventListener('DOMContentLoaded', () => {

    // Globally available from firebase-config.js
    // const auth = firebase.auth();
    // const db = firebase.firestore();

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
            this.renderAll();
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
                addTransactionBtn: document.getElementById('add-transaction-btn'), // This might be a modal trigger
                transactionForm: document.getElementById('transaction-form'),
                transactionCancelBtn: document.getElementById('transaction-cancel-btn'),
                allTransactionsList: document.getElementById('all-transactions'),

                // Dashboard Widgets
                totalBalance: document.getElementById('total-balance'),
                monthlyIncome: document.getElementById('monthly-income'),
                monthlyExpenses: document.getElementById('monthly-expenses'),
                spendingChart: document.getElementById('spending-chart'),
                
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
            });
            
            this.elements.transactionForm?.addEventListener('submit', (e) => {
                e.preventDefault();
                // Handle transaction form submission
                // Implementation to be added
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
         * Fetches all required data from Firestore.
         */
        async loadAllData() {
            const [accounts, categories, transactions] = await Promise.all([
                dbManager.fetchCollection(this.user.uid, 'accounts'),
                dbManager.fetchCollection(this.user.uid, 'categories'),
                dbManager.fetchCollection(this.user.uid, 'transactions')
            ]);
            this.state.accounts = accounts;
            this.state.categories = categories;
            this.state.transactions = transactions;
        },
        
        /**
         * Renders all UI components with current state.
         */
        renderAll() {
            this.renderAccountList();
            this.renderCategoryList();
            // this.renderTransactionList();
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
            const list = this.elements.categoryList;
            if (!list) return;
            list.innerHTML = '';
            const fragment = document.createDocumentFragment();
            if (this.state.categories.length === 0) {
                list.innerHTML = '<div class="list-item-empty">No categories yet.</div>';
            return;
        }
            this.state.categories.forEach(cat => {
                const el = document.createElement('div');
                el.className = 'category-item';
                el.dataset.id = cat.id;
                el.innerHTML = `
                    <div class="category-info">
                        <i class="fas ${cat.icon}" style="color: ${cat.color};"></i>
                        <span>${cat.name}</span>
                        </div>
                    <div class="list-item-actions">
                        <button class="btn-icon btn-edit" data-action="edit"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn-icon btn-delete" data-action="delete"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                fragment.appendChild(el);
            });
            list.appendChild(fragment);
        },

        updateDashboardWidgets() {
            let totalBalance = 0;
            this.state.accounts.forEach(acc => {
                // Assuming credit card balances are negative
                if (acc.type === 'credit') {
                    totalBalance -= acc.balance;
                } else {
                    totalBalance += acc.balance;
                }
            });
            this.elements.totalBalance.textContent = this.formatCurrency(totalBalance);
            // More widget logic to come...
        },

        // --- MODAL & FORM HANDLERS ---
        
        // Account Handlers
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
        }
    };

    // --- INITIALIZATION ---
    auth.onAuthStateChanged(user => {
        if (user) {
            ui.initialize(user);
        } else {
            // If no user is logged in, redirect to the landing page.
            // Add a loading class to the body to prevent flash of content.
            document.body.classList.add('loading');
            window.location.href = 'index.html';
        }
    });

    // Set initial theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    const themeSwitch = document.getElementById('theme-switch');
    if(themeSwitch) themeSwitch.checked = savedTheme === 'dark';
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    if(mobileThemeSwitch) mobileThemeSwitch.checked = savedTheme === 'dark';

});
