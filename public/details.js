/**
 * James Chase
 * 130325
 * details.js
 * Front-end js for the details page of a transaction
*/

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', () => {
        const tid = document.querySelector('main').getAttribute('data-tid');
        const date = document.getElementById('date-content').value;
        const description = document.getElementById('description-content').value;
        const category = document.getElementById('category-content').value;
        const amount = parseFloat(document.getElementById('amount-content').value) * 100;
        const notes = document.getElementById('notes-content').value;

        fetch('/api/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: tid,
                date: date,
                description: description,
                category: category,
                amount: amount,
                notes: notes
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit transaction');
                }
                return response.body;
            })
            .then(_ => window.location.href = `/history?uid=${tid.split('-')[0]}`)
            .catch(error => {
                console.error(error);
                alert('Failed to update transaction! Verify your connection and try again.');
            });
    });
});
