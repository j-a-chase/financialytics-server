const app = require('../app');
const request = require('supertest');

describe('Test GET /', () => {
    describe('GET / Successful', () => {
        it('should return status 200 and render home page', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ name: 'Test User', id: 1, transactions: [], targets: [] }) });
            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET / Failed', () => {
        it('should return an error if initialization fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test GET /history', () => {
    describe('GET /history Successful', () => {
        it('should return status 200 and render history page', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
            request(app)
                .get('/history?uid=1')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /history Failed', () => {
        it('should return an error if fetching all transactions fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .get('/history?uid=1')
                .expect('Content-Type', /html/)
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test GET /details', () => {
    describe('GET /details Successful', () => {
        it('should return status 200 and render details page', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({id: '1-0', date: '', description: '', category: '', amount: 100, notes: ''}) });
            request(app)
                .get('/details?tid=1-0')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /details Failed', () => {
        it('should return an error if fetching transaction details fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .get('/details?tid=1-0')
                .expect('Content-Type', /html/)
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test POST /api/add', () => {
    describe('POST /api/add Successful', () => {
        it('should return status 200 if transaction is added successfully', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });
            request(app)
                .post('/api/add')
                .send({ date: '2021-01-01', amount: 100, description: 'Test' })
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/add Failed', () => {
        it('should return an error if adding a transaction fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .post('/api/add')
                .send({ date: '2021-01-01', amount: 100, description: 'Test' })
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test POST /api/edit', () => {
    describe('POST /api/edit Successful', () => {
        it('should return status 200 if transaction is edited successfully', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });
            request(app)
                .post('/api/edit')
                .send({ date: '2021-01-01', amount: 100, description: 'Test' })
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/edit Failed', () => {
        it('should return an error if editing a transaction fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .post('/api/edit')
                .send({ date: '2021-01-01', amount: 100, description: 'Test' })
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test POST /api/target/edit', () => {
    describe('POST /api/target/edit Successful', () => {
        it('should return status 200 if target is edited successfully', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });
            request(app)
                .post('/api/target/edit?uid=1')
                .send({ target: 100 })
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/edit Failed', () => {
        it('should return an error if editing a target fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .post('/api/target/edit?uid=1')
                .send({ target: 100 })
                .expect(500)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });
});
