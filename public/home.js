document.addEventListener('DOMContentLoaded', () => {
    const categories = ['income', 'food', 'living', 'entertainment', 'supplies', 'education', 'other'];
    categories.forEach(category => {
        let currentSpan = document.getElementById(`${category}Current`);
        let budgetSpan = document.getElementById(`${category}Budget`);
        const current = parseFloat(currentSpan.getAttribute(`data-${category}`));
        const budget = parseFloat(budgetSpan.getAttribute('data-budget'));
        const progressPercentage = Math.min((current / budget) * 100, 100).toFixed(1);

        let progressBar = document.getElementById(`progressBar${category.charAt(0).toUpperCase()}${category.slice(1)}`);

        progressBar.style.width = `${progressPercentage}%`;
        currentSpan.innerText = `$${current.toFixed(0)}`;
        budgetSpan.innerText = `$${budget.toFixed(0)}`;
    });
});