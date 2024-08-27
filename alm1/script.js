// script.js
document.addEventListener('DOMContentLoaded', function () {
    const incomeForm = document.getElementById('income-form');
    const expenseForm = document.getElementById('expense-form');
    const transactionsList = document.getElementById('transactions');
    const balanceAmount = document.getElementById('balance-amount');

    let balance = 0;

    function updateBalance(amount) {
        balance += amount;
        balanceAmount.textContent = balance.toFixed(2);
    }

    function addTransaction(amount, description, type) {
        const li = document.createElement('li');
        li.textContent = `${(type === 'income') ? '+' : '-'}INR ${amount} ${description ? '=> ' + description : ''}`;
        transactionsList.appendChild(li);
    }

    incomeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('income-amount').value);
        const description = document.getElementById('income-description').value;

        updateBalance(amount);
        addTransaction(amount, description, 'income');

        incomeForm.reset();
    });

    expenseForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const description = document.getElementById('expense-description').value;

        updateBalance(-amount);
        addTransaction(amount, description, 'expense');

        expenseForm.reset();
    });
});