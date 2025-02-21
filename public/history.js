document.addEventListener('DOMContentLoaded', () => {
    const addTransaction = document.querySelector('button');
    addTransaction.addEventListener('click', () => {
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

        let tableData = newTransaction.querySelectorAll('td');
        tableData[0].appendChild(dateInput);
        tableData[1].appendChild(descriptionInput);
        tableData[2].appendChild(categoryInput);
        tableData[3].appendChild(amountInput);
        tableData[4].appendChild(saveButton);
        tbody.appendChild(newTransaction);
    });
});