document.addEventListener('DOMContentLoaded', () => {
    const incomeLabel = document.querySelector('input');
    incomeLabel.disabled = true;

    document.getElementById('go-back').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('add-button').addEventListener('click', () => {
        const tableBody = document.querySelector('tbody');
        const buttonRow = tableBody.rows[tableBody.rows.length - 1];
        const row = tableBody.insertBefore(document.createElement('tr'), buttonRow);
        const text = row.insertCell(0);
        const value = row.insertCell(1);

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.classList = 'text-input';
        const valueInput = document.createElement('input');
        valueInput.type = 'number';
        valueInput.classList = 'value-input';
        valueInput.min = 0;
        valueInput.step = 0.01;

        text.appendChild(textInput);
        value.appendChild(valueInput);
    });

    document.getElementById('save-button').addEventListener('click', () => {
        const textInputs = document.querySelectorAll('.text-input');
        const valueInputs = document.querySelectorAll('.value-input');
        const rows = document.querySelector('tbody').rows.length - 1; // it's including the button row

        let targets = {};

        for (let i = 0; i < rows; i++) {
            const text = textInputs[i].value;
            const value = valueInputs[i].value;

            if (text === '' || value === '') {
                alert('Please fill in all fields.');
                return;
            }

            targets[text.toLowerCase()] = parseInt(parseFloat(value) * 100);
        }

        const uid = document.querySelector('body').getAttribute('data-user');
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
            .then(_ => location.reload())
            .catch(error => {
                console.error(error);
                alert('Error saving settings.');
            });
    });
});