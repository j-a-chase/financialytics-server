/**
 * settings.js
 * James Chase
 * 240325
 * Client-side script for the settings page.
*/

document.addEventListener('DOMContentLoaded', async () => {
    const uid = document.querySelector('body').getAttribute('data-user');
    
    // disable editing name for income target (it's always 'income')
    const incomeLabel = document.querySelector('input');
    incomeLabel.disabled = true;

    // disable including income target in monthly budget (it's never included)
    const incomeIncluded = document.getElementById('income').children[2].children[0];
    console.log(document.getElementById('income').children[2].innerHTML);
    console.log(incomeIncluded);
    incomeIncluded.disabled = true;

    // create a set of all categories used in the user's transactions
    const transactionCategories = new Set();
    (await getUserTransactions(uid)).forEach(transaction => transactionCategories.add(transaction.category.toLowerCase()));

    // disable editing categories that are used in the user's transactions
    // NOTE: this will be changed so that edits to the text are reflected to
    // affected categories in a future update
    document.querySelectorAll('.text-input').forEach(textInput => {
        if (transactionCategories.has(textInput.value.toLowerCase())) {
            textInput.disabled = true;
        }
    });

    // add click listener to go-back arrow image
    document.getElementById('go-back').addEventListener('click', () => {
        window.location.href = '/';
    });

    // remove row for target if delete button is clicked
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            row.remove();
        });
    });

    document.getElementById('add-button').addEventListener('click', () => {
        const tableBody = document.querySelector('tbody');
        // insert before new row before last row (the button row)
        const row = tableBody.insertBefore(document.createElement('tr'), tableBody.rows[tableBody.rows.length - 1]);
        const text = row.insertCell(0);
        const value = row.insertCell(1);
        const included = row.insertCell(2);
        const cancel = row.insertCell(3);

        // intialize inputs and cancel button properly
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.classList = 'text-input';
        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.classList = 'value-input';
        valueInput.min = 0;
        valueInput.step = 0.01;
        const includedInput = document.createElement('input');
        includedInput.type = 'checkbox';
        includedInput.classList = 'included-input';
        includedInput.checked = true;
        const cancelButton = document.createElement('button');
        cancelButton.innerText = 'Cancel';
        cancelButton.classList = 'cancel-button';
        cancelButton.addEventListener('click', () => row.remove());

        // add elements to the row td elements
        text.appendChild(textInput);
        value.appendChild(valueInput);
        included.appendChild(includedInput);
        cancel.appendChild(cancelButton);
    });

    document.getElementById('save-button').addEventListener('click', () => {
        // get all inputs
        const textInputs = document.querySelectorAll('.text-input');
        const valueInputs = document.querySelectorAll('.value-input');
        const includedInputs = document.querySelectorAll('.included-input');
        const rows = document.querySelector('tbody').rows.length - 1; // exclude button row

        // stores all created target objects
        let targets = [];

        for (let i = 0; i < rows; i++) {
            // retrieve values from inputs
            const text = textInputs[i].value;
            const value = valueInputs[i].value;
            const included = includedInputs[i].checked;

            // don't allow empty name or amount
            if (text === '' || value === '') {
                alert('Please fill in all fields.');
                return;
            }

            // add target object to array
            targets.push({
                id: null,
                name: text.toLowerCase(),
                amount: parseInt(parseFloat(value) * 100),
                included: included
            });
        }

        // write changes to database
        fetch(`/api/target/update?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(targets)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error saving settings.');
                }
                return response.text();
            })
            .then(_ => location.href = '/')
            .catch(error => {
                console.error(error);
                alert('Error saving settings.');
            });
    });
});

// utilizes server to retrieve transactions without needing to expose the 
// intimate details of a transaction to the client
const getUserTransactions = async uid => {
    return await fetch(`/api/transactions?uid=${uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching transactions.');
            }
            return response.json();
        })
        .catch(error => {
            console.error(error);
            alert('Error fetching transactions.');
        });
};
