document.addEventListener('DOMContentLoaded', () => {
    let incomeCurrentSpan = document.getElementById('incomeCurrent');
    let incomeBudgetSpan = document.getElementById('incomeBudget');
    const incomeCurrent = parseFloat(incomeCurrentSpan.getAttribute('data-income'));
    const incomeBudget = parseFloat(incomeBudgetSpan.getAttribute('data-budget'));
    const incomeProgressPercentage = Math.min((incomeCurrent / incomeBudget) * 100, 100).toFixed(1);

    let incomeProgressBar = document.getElementById('progressBarIncome');

    incomeProgressBar.style.width = `${incomeProgressPercentage}%`;
    incomeCurrentSpan.innerText = `$${incomeCurrent.toFixed(0)}`;
    incomeBudgetSpan.innerText = `$${incomeBudget.toFixed(0)}`;
});