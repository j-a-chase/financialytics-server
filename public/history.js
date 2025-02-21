document.addEventListener('DOMContentLoaded', () => {
    const addTransaction = document.querySelector('button');
    addTransaction.addEventListener('click', () => {
        addTransaction.disabled = true;
        let tbody = document.querySelector('table').querySelector('tbody');
        let newTransaction = document.createElement('tr');
        newTransaction.innerHTML = `
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        `;
        let dateInput = document.createElement('input')
        dateInput.setAttribute('type', 'date');
        let descriptionInput = document.createElement('input')
        descriptionInput.setAttribute('type', 'text');
        let categoryInput = document.createElement('select');
        categoryInput.innerHTML = `
            <option value="food">Food</option>
            <option value="living">Living</option>
            <option value="entertainment">Entertainment</option>
            <option value="supplies">Supplies</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
        `;
        let amountInput = document.createElement('input');
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('step', '.01');
        amountInput.setAttribute('min', '0');
        let saveButton = document.createElement('button');
        saveButton.innerText = 'Save';
        saveButton.addEventListener('click', () => {
            fetch('/api/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    date: dateInput.value,
                    description: descriptionInput.value,
                    category: categoryInput.value,
                    amount: amountInput.value * 100
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to add transaction');
                    }
                    return response.text();
                })
                .then(_ => location.reload())
                .catch(error => console.error(error));
        });

        let tableData = newTransaction.querySelectorAll('td');
        tableData[0].appendChild(dateInput);
        tableData[1].appendChild(descriptionInput);
        tableData[2].appendChild(categoryInput);
        tableData[3].appendChild(amountInput);
        tableData[4].appendChild(saveButton);
        tbody.appendChild(newTransaction);
    });
});