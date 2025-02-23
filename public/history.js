createSaveButton = (
    dateInput, descriptionInput, categoryInput,
    amountInput, isAdding=true, tableRow=null
) => {
    const endpoint = isAdding ? '/api/add' : '/api/edit';
    const id = isAdding ? null : tableRow.getAttribute('data-transaction');
    let saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.addEventListener('click', () => {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
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

    return saveButton;
};

getMonthNumber = (month) => {
    switch (month) {
        case 'Jan':
            return '01';
        case 'Feb':
            return '02';
        case 'Mar':
            return '03';
        case 'Apr':
            return '04';
        case 'May':
            return '05';
        case 'Jun':
            return '06';
        case 'Jul':
            return '07';
        case 'Aug':
            return '08';
        case 'Sep':
            return '09';
        case 'Oct':
            return '10';
        case 'Nov':
            return '11';
        case 'Dec':
            return '12';
    }
};

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
        const saveButton = createSaveButton(dateInput, descriptionInput, categoryInput, amountInput);

        let tableData = newTransaction.querySelectorAll('td');
        tableData[0].appendChild(dateInput);
        tableData[1].appendChild(descriptionInput);
        tableData[2].appendChild(categoryInput);
        tableData[3].appendChild(amountInput);
        tableData[4].appendChild(saveButton);
        tbody.appendChild(newTransaction);
    });

    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tr = event.target.closest('tr');
            const rowChildren = tr.children;
            const date = rowChildren[0].innerHTML;
            const description = rowChildren[1].innerHTML;
            const category = rowChildren[2].innerHTML;
            const amount = parseFloat(rowChildren[3].innerHTML.slice(1)).toFixed(2);

            let dateInput = document.createElement('input');
            dateInput.setAttribute('type', 'date');
            dateInput.value = `${date.split('-')[2]}-${getMonthNumber(date.split('-')[1])}-${date.split('-')[0]}`;
            let descriptionInput = document.createElement('input');
            descriptionInput.setAttribute('type', 'text');
            descriptionInput.value = description;
            let categoryInput = document.createElement('select');
            categoryInput.innerHTML = `
                <option value="food">Food</option>
                <option value="living">Living</option>
                <option value="entertainment">Entertainment</option>
                <option value="supplies">Supplies</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
            `;
            categoryInput.value = category.toLowerCase();
            let amountInput = document.createElement('input');
            amountInput.setAttribute('type', 'number');
            amountInput.setAttribute('step', '.01');
            amountInput.setAttribute('min', '0');
            amountInput.value = amount;
            const saveButton = createSaveButton(dateInput, descriptionInput, categoryInput, amountInput, false, tr);

            rowChildren[0].innerHTML = '';
            rowChildren[1].innerHTML = '';
            rowChildren[2].innerHTML = '';
            rowChildren[3].innerHTML = '';
            rowChildren[4].innerHTML = '';

            rowChildren[0].appendChild(dateInput);
            rowChildren[1].appendChild(descriptionInput);
            rowChildren[2].appendChild(categoryInput);
            rowChildren[3].appendChild(amountInput);
            rowChildren[4].appendChild(saveButton);
        });
    });
});