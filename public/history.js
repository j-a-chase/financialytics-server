/**
 * history.js
 * James Chase
 * 240325
 * Client-side script for the history page.
*/

document.addEventListener('DOMContentLoaded', async () => {
    const uid = document.querySelector('body').getAttribute('data-user');
    const categoryString = await getCategoryString(uid);

    // adds a new row to the top of the table with input fields for the user to
    // fill out
    const addTransaction = document.querySelector('#add-button');
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
            <td></td>
        `;
        let dateInput = document.createElement('input')
        dateInput.setAttribute('type', 'date');
        let descriptionInput = document.createElement('input')
        descriptionInput.setAttribute('type', 'text');
        let categoryInput = document.createElement('select');
        categoryInput.innerHTML = categoryString;
        let amountInput = document.createElement('input');
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('step', '.01');
        amountInput.setAttribute('min', '0');
        const saveButton = createSaveButton(dateInput, descriptionInput, categoryInput, amountInput);
        const cancelButton = createCancelButton();

        let tableData = newTransaction.querySelectorAll('td');
        tableData[0].appendChild(dateInput);
        tableData[1].appendChild(descriptionInput);
        tableData[2].appendChild(categoryInput);
        tableData[3].appendChild(amountInput);
        tableData[4].appendChild(saveButton);
        tableData[5].appendChild(cancelButton);
        tbody.insertBefore(newTransaction, tbody.childNodes[0]);
    });

    // initializes input fields for the selected transaction using the data
    // currently in the table
    const editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tr = event.target.closest('tr');
            const rowChildren = tr.children;
            const date = rowChildren[0].firstChild.innerHTML;
            const description = rowChildren[1].firstChild.innerHTML;
            const category = rowChildren[2].firstChild.innerHTML;
            const amount = parseFloat(rowChildren[3].firstChild.innerHTML.slice(1)).toFixed(2);

            let dateInput = document.createElement('input');
            dateInput.setAttribute('type', 'date');
            dateInput.value = `${date.split('-')[2]}-${getMonthNumber(date.split('-')[1])}-${date.split('-')[0]}`;
            let descriptionInput = document.createElement('input');
            descriptionInput.setAttribute('type', 'text');
            descriptionInput.value = description;
            let categoryInput = document.createElement('select');
            categoryInput.innerHTML = categoryString;
            categoryInput.value = category.toLowerCase();
            console.log(categoryInput);
            let amountInput = document.createElement('input');
            amountInput.setAttribute('type', 'number');
            amountInput.setAttribute('step', '.01');
            amountInput.setAttribute('min', '0');
            amountInput.value = amount;
            const saveButton = createSaveButton(dateInput, descriptionInput, categoryInput, amountInput, false, tr);
            const cancelButton = createCancelButton();

            rowChildren[0].innerHTML = '';
            rowChildren[1].innerHTML = '';
            rowChildren[2].innerHTML = '';
            rowChildren[3].innerHTML = '';
            rowChildren[4].innerHTML = '';
            rowChildren[5].innerHTML = '';

            rowChildren[0].appendChild(dateInput);
            rowChildren[1].appendChild(descriptionInput);
            rowChildren[2].appendChild(categoryInput);
            rowChildren[3].appendChild(amountInput);
            rowChildren[4].appendChild(saveButton);
            rowChildren[5].appendChild(cancelButton);
        });
    });

    // deletes the selected transaction from the table and the database
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tr = event.target.closest('tr');
            const id = tr.getAttribute('data-transaction');
            fetch(`/api/delete?tid=${id}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete transaction');
                    }
                    return response.text();
                })
                .then(_ => location.reload())
                .catch(error => {
                    console.error(error)
                    alert('Failed to delete transaction! Verify your connection and try again.');
                });
        });
    });
});

// creates a save button for saving the transaction based on if it's adding a
// new transaction or editing an existing one
const createSaveButton = (
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

// creates a cancel button for the user to cancel adding or editing a transaction
const createCancelButton = () => {
    let cancelButton = document.createElement('button');
    cancelButton.innerText = 'Cancel';
    cancelButton.addEventListener('click', () => location.reload());
    return cancelButton;
};

// converts the month abbreviation to a zero-padded number for the date input
const getMonthNumber = month => {
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
