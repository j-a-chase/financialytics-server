/**
 * app.js
 * James Chase
 * 280125
 * Main entry point for the application
*/

// imports
const express = require('express');
const dotenv = require('dotenv');
const { getStringMonth } = require('./utils/getStringMonth');

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
app.use(express.json());

// home page GET
app.get('/', (_, res) => {
    // stub data using a test user
    fetch(`http://${process.env.API_HOST}/user/initialize?uid=${process.env.TEST_USER_ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to initialize user!');
            }
            return response.json();
        })
        .then(data => {
            user = { name: data.name, id: data.id };
            transactions = (data.transactions.length >= 4) ? data.transactions.slice(-3) : data.transactions;
            res.status(200).render('home', {
                month: getStringMonth(new Date().getMonth()),
                chart: "chart.jpg",
                user: user,
                transactions: transactions
            });
        })
        .catch(error => console.error(error));
});

app.get('/history', (req, res) => {
    if (!parseInt(req.query.uid)) {
        res.status(400).render('error', {
            title: 'Bad Request - 400',
            message: 'Invalid user ID'
        });
        return;
    }

    fetch(`http://${process.env.API_HOST}/transaction/all?uid=${req.query.uid}`)
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

/*
    POST ENDPOINTS
*/

app.post('/api/add', (req, res) => {
    const date = new Date(req.body.date);
    fetch(`http://${process.env.API_HOST}/transaction/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: null,
            date: `${date.getDate() + 1}-${getStringMonth(date.getMonth()).slice(0, 3)}-${date.getFullYear()}`,
            description: req.body.description,
            category: req.body.category,
            amount: req.body.amount
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }
            return response.text();
        })
        .then(data => res.status(200).send(data))
        .catch(error => console.error(error));
});

// 404 page
// app.use runs in file order, so this should always be last, as it should only
// be reached if no other routes match
app.use((_, res) => {
    res.status(404).render('error', {
        title: 'Not Found - 404',
        message: "Sorry, the page you are looking for cannot be found."
    });
});
