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
const { getMonthNumber } = require('./utils/getMonthNumber');
const { getLeniencyValue, leniencyLevels } = require('./utils/getLeniencyValue');
const { toTitleCase } = require('./utils/toTitleCase');

// main app
const app = express();
dotenv.config();

// listen for requests
app.listen(process.env.PORT, () => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`Listening on port ${process.env.PORT}...`);
    }
});

// register view engine
app.set('view engine', 'ejs');
app.set('views', 'templates');

// add helpers for ejs
app.locals.getMonthNumber = getMonthNumber;
app.locals.getLeniencyValue = getLeniencyValue;
app.locals.toTitleCase = toTitleCase;

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// debugging middleware only for development
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method}: ${req.url} - Status ${res.statusCode}`);
        console.log(`Request body: ${JSON.stringify(req.body)}`);
        next();
    });
}

/*
    GET ENDPOINTS
*/

// home endpoint
app.get('/', (_, res) => {
    // fetch user data
    fetch(`http://${process.env.API_HOST}/user/initialize?uid=${process.env.TEST_USER_ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to initialize user!');
            }
            return response.json();
        })
        .then(data => {
            const user = { name: data.name, id: data.id };
            // retrieves 3 most recent transactions, or all if less than 4
            const transactions = (data.transactions.length >= 4) ? data.transactions.slice(-3) : data.transactions;

            res.status(200).render('home', {
                month: getStringMonth(new Date().getMonth()), // get current month
                chart: "under-construction.svg", // placeholder for chart
                user: user, // all user data
                recentTransactions: transactions, // recent transactions as defined above
                transactions: data.transactions, // entire transaction list for target data in sidebar
                targets: data.targets, // target info for sidebar
                leniency: data.budgetLeniency.toLowerCase() // leniency level for sidebar
            });
        })
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to initialize user!',
                link: ''
            });
        });
});

// currently reuses initialization endpoint, but will need changed
// when program is scaled to more than one local user.
app.get('/menu', (_, res) => {
    fetch(`http://${process.env.API_HOST}/user/initialize?uid=${process.env.TEST_USER_ID}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to initialize user!');
            }
            return response.json();
        })
        .then(user => {
            // set of categories used by the transactions
            const categories = new Set(user.transactions.map(transaction => transaction.category));

            res.status(200).render('settings', {
                user: user,
                targets: user.targets,
                categories: categories
            });
        })
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to initialize user!',
                link: ''
            });
        });
});

// webpage for managing entire transaction history, allowing for edits,
// additions, removals, etc.
app.get('/history', (req, res) => {
    // ensure user ID is provided and valid
    if (!parseInt(req.query.uid)) {
        res.status(400).render('error', {
            title: 'Bad Request - 400',
            message: 'Invalid user ID',
            link: ''
        });
        return;
    }

    // fetch all transactions for the user
    fetch(`http://${process.env.API_HOST}/transaction/all?uid=${req.query.uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch all transactions');
            }
            return response.json();
        })
        .then(data => {
            res.status(200).render('history', { uid: req.query.uid, transactions: data });
        })
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to fetch all transactions',
                link: ''
            });
        });
});

// webpage for viewing specific details of a single transaction
app.get('/details', (req, res) => {
    // ensure transaction ID is provided and valid
    if (!req.query.tid) {
        res.status(400).render('error', {
            title: 'Bad Request - 400',
            message: 'Invalid transaction ID',
            link: `history?uid=${process.env.TEST_USER_ID}`
        });
        return;
    }

    // fetch transaction details
    fetch(`http://${process.env.API_HOST}/transaction/detail?tid=${req.query.tid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch transaction details');
            }
            return response.json();
        })
        .then(data => {
            res.status(200).render('details', { transaction: data });
        })
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to fetch transaction details',
                link: `history?uid=${process.env.TEST_USER_ID}`
            });
        })
});

// simple get endpoint for retrieving all transaction data for the user
// used so that transactions don't have to be dumped to the template where
// the intimate details and implementation are viewable
app.get('/api/transactions', (req, res) => {
    if (!parseInt(req.query.uid)) {
        res.status(400).send('Invalid request!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/transaction/all?uid=${req.query.uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            return response.json();
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to fetch transactions');
        });
});

// simple get endpoint for retrieving all target data for the user
// used so that targets don't have to be dumped to the template where
// the intimate details and implementation are viewable
app.get('/api/targets', (req, res) => {
    if (!parseInt(req.query.uid)) {
        res.status(400).send('Invalid request!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/user/targets?uid=${req.query.uid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch targets');
            }
            return response.json();
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to fetch targets');
        });
});

// stubbed webpage endpoint for displaying charts
app.get('/charts', (_, res) => {
    const stubCharts = [
        { name: 'chart1', image: 'under-construction.svg' },
        { name: 'chart2', image: 'under-construction.svg' },
        { name: 'chart3', image: 'under-construction.svg' },
    ]

    res.status(200).render('charts', { charts: stubCharts });
});

/*
    POST ENDPOINTS
*/

// connects to add endpoint for transactions within the API
app.post('/api/add', (req, res) => {
    const date = req.body.date.toString();
    fetch(`http://${process.env.API_HOST}/transaction/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: null,
            date: `${date.slice(8, 10)}-${getStringMonth(parseInt(date.slice(5, 7)) - 1).slice(0, 3)}-${date.slice(0, 4)}`,
            description: req.body.description,
            category: req.body.category,
            amount: req.body.amount
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to add transaction');
        });
});

// connects to edit endpoint for transactions within the API
app.post('/api/edit', (req, res) => {
    const date = req.body.date.toString();
    const notes = req.body.notes ? req.body.notes : '';
    fetch(`http://${process.env.API_HOST}/transaction/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: req.body.id,
            date: `${date.slice(8, 10)}-${getStringMonth(parseInt(date.slice(5, 7)) - 1).slice(0, 3)}-${date.slice(0, 4)}`,
            description: req.body.description,
            category: req.body.category,
            amount: req.body.amount,
            notes: notes
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit transaction');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to edit transaction');
        });
});

// connects to edit endpoint for targets within the API
app.post('/api/target/edit', (req, res) => {
    if (!parseInt(req.query.uid)) {
        res.status(400).send('Invalid request!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/user/target?uid=${req.query.uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit target');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to edit target');
        });
});

// this endpoint is different from above due to it being able to add
// addition targets, rather than just edit existing ones
app.post('/api/target/update', (req, res) => {
    if (!parseInt(req.query.uid)) {
        res.status(400).send('Invalid request!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/user/targets/update?uid=${req.query.uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update target');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to update target');
        });
});

// connects to edit endpoint for leniency within the API
app.post('/api/leniency/edit', (req, res) => {
    if (!parseInt(req.body.uid) || !leniencyLevels.includes(req.body.leniency)) {
        res.status(400).send('Invalid request!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/user/leniency?uid=${req.body.uid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body.leniency)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit leniency');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to edit leniency');
        });
});

/*
    DELETE ENDPOINTS
*/

// connects to delete endpoint for transactions within the API
app.delete('/api/delete', (req, res) => {
    if (!req.query.tid) {
        res.status(400).send('Invalid tid!');
        return;
    }

    fetch(`http://${process.env.API_HOST}/transaction/delete?tid=${req.query.tid}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            if (process.env.NODE_ENV === 'development') {
                console.error(error);
            }

            res.status(500).send('Failed to delete transaction');
        });
});

// 404 page
// app.use runs in file order, so this should always be last, as it should only
// be reached if no other routes match
app.use((_, res) => {
    res.status(404).render('error', {
        title: 'Not Found - 404',
        message: "Sorry, the page you are looking for cannot be found.",
        link: ''
    });
});

// error handling middleware for when the template engine fails so that the
// error stack isn't displayed to the user but rather is contained on the
// server
app.use((err, _, res, __) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }
    
    res.status(500).render('error', {
        title: 'Internal Server Error - 500',
        message: 'Something went wrong on our end. Please try again later.',
        link: ''
    });
});

// export app for testing
module.exports = app;
