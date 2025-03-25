document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelector('body').getAttribute('data-targets').split(',');

    categories.forEach(category => {
        const trimmedCategory = category.replace(' ', '');
        let currentSpan = document.getElementById(`${trimmedCategory}Current`);
        let budgetSpan = document.getElementById(`${trimmedCategory}Budget`);
        const current = parseFloat(currentSpan.getAttribute(`data-${trimmedCategory}`));
        const budget = parseFloat(budgetSpan.getAttribute('data-budget'));
        const progressPercentage = Math.min((current / budget) * 100, 100).toFixed(2);

        let progressBar = document.getElementById(`progressBar${trimmedCategory}`);

        progressBar.style.width = `${progressPercentage}%`;
        if (progressPercentage >= 100.0) {
            progressBar.style.backgroundColor = 'red';
        }
        currentSpan.innerText = `$${current.toFixed(0)}`;
        budgetSpan.innerText = `$${budget.toFixed(0)}`;
    });

    let monthlyCurrent = document.getElementById('monthlyCurrent');
    let monthlyBudget = document.getElementById('monthlyBudget');
    const monthlyCurrentValue = parseFloat(monthlyCurrent.innerText.slice(1));
    const monthlyBudgetValue = parseFloat(monthlyBudget.innerText.slice(1));
    const percentage = Math.min((monthlyCurrentValue / monthlyBudgetValue) * 100, 100).toFixed(2);
    let progressBarMonthly = document.getElementById('progressBarMonthly');
    progressBarMonthly.style.width = `${percentage}%`;
    if (percentage >= 100.0) {
        progressBarMonthly.style.backgroundColor = 'red';
    }
    monthlyCurrent.innerText = `$${monthlyCurrentValue.toFixed(0)}`;
    monthlyBudget.innerText = `$${monthlyBudgetValue.toFixed(0)}`;

    document.getElementById('edit-button').addEventListener('click', () => {
        const configPanel = document.querySelector('#target-config');
        configPanel.style.display = 'flex';

        const targetsPanel = document.querySelector('#target-panel');
        targetsPanel.style.display = 'none';

    });

    document.getElementById('cancel-button').addEventListener('click', () => location.reload());

    document.getElementById('save-button').addEventListener('click', () => {
        const uid = document.querySelector('body').getAttribute('data-user');
        let targetList = [];
        for (const category of categories) {
            const trimmedCategory = category.replace(' ', '');
            const targetInput = document.getElementById(`${trimmedCategory}BudgetInput`);
            const originalTargetSpan = document.getElementById(`${trimmedCategory}Budget`);
            const originalTarget = parseInt(parseFloat(originalTargetSpan.getAttribute('data-budget')) * 100);
            const target = parseInt(parseFloat(targetInput.value) * 100);
            if (target !== originalTarget) {
                targetList.push({
                    id: originalTargetSpan.getAttribute('data-targetid'),
                    name: category,
                    amount: target,
                    included: originalTargetSpan.getAttribute('data-included') === 'true'
                });
            }
        }

        // update targets
        fetch(`/api/target/edit?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(targetList)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit target');
                }
                return response.body;
            })
            .then(_ => location.reload())
            .catch(error => {
                console.error(error);
                alert('Failed to edit target!');
            });
        
        // update leniency
        const leniency = document.getElementById('leniency-selector').value.toUpperCase();
        fetch('api/leniency/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({uid: uid, leniency: leniency})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit leniency');
                }
                return response.body;
            })
            .then(_ => location.reload())
            .catch(error => {
                console.error(error);
                alert('Failed to edit leniency!');
            });
    });

    document.getElementById('menu-icon').addEventListener('click', () => {
        location.href = '/menu';
    });
});