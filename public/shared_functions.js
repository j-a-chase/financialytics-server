// capitalizes the first letter of each word in a string
const toTitleCase = str => {
    return str.split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join(' ');
}

// leverages the server to retrieve the categories for the user so that the
// intimate details do not need to be revealed to the client
const getCategoryString = async uid => {
    return fetch(`/api/targets?uid=${uid}`, { method: 'GET' })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    })
    .then(data => {
        options = '';
        data.forEach(target => {
            options += `<option value="${target.name}">${toTitleCase(target.name)}</option>`;
        })
        return options;
    })
    .catch(error => console.error(error));
}
