/**
 * app.js
 * James Chase
 * 280125
 * Main entry point for the application
*/

// imports
const express = require('express');
const dotenv = require('dotenv');

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
    const stubTransactions = [
        { date: '1-28-2025', description: 'something else', category: 'category', amount: 100 },
        { date: '1-28-2025', description: 'something else', category: 'category', amount: 100 },
        { date: '1-28-2025', description: 'something else', category: 'category', amount: 100 }
    ];

    res.status(200).render('home', { title: 'Financialytics', month: 'January', chart: "chart.jpg", transactions: stubTransactions });
});

// 404 page
// app.use runs in file order, so this should always be last, as it should only
// be reached if no other routes match
app.use((_, res) => {
    res.status(404).render('404');
});
