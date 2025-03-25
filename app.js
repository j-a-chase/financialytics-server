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

app.get('/', (_, res) => {
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
                chart: "under-construction.svg",
                user: user,
                recentTransactions: transactions,
                transactions: data.transactions,
                targets: data.targets,
                leniency: data.budgetLeniency.toLowerCase()
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
            const categories = new Set(user.transactions.map(transaction => transaction.category));
            res.status(200).render('settings', { user: user, targets: user.targets, categories: categories});
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
            res.status(200).render('history', { uid: req.query.uid, transactions: data });
        })
        .catch(error => {
            console.error(error);
            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to fetch all transactions',
                link: ''
            });
        });
});

app.get('/details', (req, res) => {
    if (!req.query.tid) {
        res.status(400).render('error', {
            title: 'Bad Request - 400',
            message: 'Invalid transaction ID',
            link: `history?uid=${process.env.TEST_USER_ID}`
        });
        return;
    }

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
            console.error(error);
            res.status(500).render('error', {
                title: 'Internal Server Error - 500',
                message: 'Failed to fetch transaction details',
                link: `history?uid=${process.env.TEST_USER_ID}`
            });
        })
});

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
            console.error(error);
            res.status(500).send('Failed to fetch transactions');
        });
});

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
            console.error(error);
            res.status(500).send('Failed to fetch targets');
        });
});

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
            console.error(error);
            res.status(500).send('Failed to add transaction');
        });
});

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
            console.error(error);
            res.status(500).send('Failed to edit transaction');
        });
});

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
            console.error(error);
            res.status(500).send('Failed to edit target');
        });
});

// this endpoint is different from above due to it being able to add
// additional targets, rather than just edit existing ones
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
            console.error(error);
            res.status(500).send('Failed to update target');
        });
});

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
            console.error(error);
            res.status(500).send('Failed to edit leniency');
        });
});

/*
    DELETE ENDPOINTS
*/

app.delete('/api/delete', (req, res) => {
    fetch(`http://${process.env.API_HOST}/transaction/delete?tid=${req.query.tid}`, { method: 'DELETE' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            return response.body;
        })
        .then(data => res.status(200).send(data))
        .catch(error => {
            console.error(error);
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

module.exports = app;
