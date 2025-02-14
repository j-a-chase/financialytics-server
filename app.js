/**
 * app.js
 * James Chase
 * 280125
 * Main entry point for the application
*/

// imports
const express = require('express');
const dotenv = require('dotenv');
const { getCurrentMonth } = require('./utils/getCurrentMonth');

// main app
const app = express();
dotenv.config();

// listen for requests
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}...`);
});

// register view engine
app.set('view engine', 'ejs');
app.set('views', 'templates');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// home page GET
app.get('/', (_, res) => {
    // stub data using a test user
    fetch(`http://${process.env.API_HOST}/transaction/recent?userId=${process.env.TEST_USER_ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recent transactions');
            }
            return response.json();
        })
        .then(data => {
            res.status(200).render('home', { month: getCurrentMonth(), chart: "chart.jpg", transactions: data });
        })
        .catch(error => console.error(error));
});

app.get('/history', (_, res) => {
    fetch(`http://${process.env.API_HOST}/transaction/all?userId=${process.env.TEST_USER_ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch all transactions');
            }
            return response.json();
        })
        .then(data => {
            res.status(200).render('history', { transactions: data });
        })
        .catch(error => console.error(error));
});

app.get('/charts', (_, res) => {
    const stubCharts = [
        { name: 'chart1', image: 'chart.jpg' },
        { name: 'chart2', image: 'chart.jpg' },
        { name: 'chart3', image: 'chart.jpg' },
    ]

    res.status(200).render('charts', { charts: stubCharts });
});

// 404 page
// app.use runs in file order, so this should always be last, as it should only
// be reached if no other routes match
app.use((_, res) => {
    res.status(404).render('404');
});
