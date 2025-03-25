document.addEventListener('DOMContentLoaded', async () => {
    const uid = document.querySelector('body').getAttribute('data-user');
    
    const incomeLabel = document.querySelector('input');
    incomeLabel.disabled = true;

    const incomeIncluded = document.getElementById('income').children[2].children[0];
    console.log(document.getElementById('income').children[2].innerHTML);
    console.log(incomeIncluded);
    incomeIncluded.disabled = true;

    const transactionCategories = new Set();
    (await getUserTransactions(uid)).forEach(transaction => transactionCategories.add(transaction.category.toLowerCase()));

    document.querySelectorAll('.text-input').forEach(textInput => {
        if (transactionCategories.has(textInput.value.toLowerCase())) {
            textInput.disabled = true;
        }
    });

    document.getElementById('go-back').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            row.remove();
        });
    });

    document.getElementById('add-button').addEventListener('click', () => {
        const tableBody = document.querySelector('tbody');
        const buttonRow = tableBody.rows[tableBody.rows.length - 1];
        const row = tableBody.insertBefore(document.createElement('tr'), buttonRow);
        const text = row.insertCell(0);
        const value = row.insertCell(1);
        const included = row.insertCell(2);
        const cancel = row.insertCell(3);

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

        text.appendChild(textInput);
        value.appendChild(valueInput);
        included.appendChild(includedInput);
        cancel.appendChild(cancelButton);
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const textInputs = document.querySelectorAll('.text-input');
        const valueInputs = document.querySelectorAll('.value-input');
        const includedInputs = document.querySelectorAll('.included-input');
        const rows = document.querySelector('tbody').rows.length - 1; // it's including the button row

        let targets = [];

        for (let i = 0; i < rows; i++) {
            const text = textInputs[i].value;
            const value = valueInputs[i].value;
            const included = includedInputs[i].checked;

            if (text === '' || value === '') {
                alert('Please fill in all fields.');
                return;
            }

            targets.push({
                id: null,
                name: text.toLowerCase(),
                amount: parseInt(parseFloat(value) * 100),
                included: included
            });
        }

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
