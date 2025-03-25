const app = require('../app');
const request = require('supertest');

describe('Test GET /', () => {
    describe('GET / Successful', () => {
        it('should return status 200 and render home page', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({
                name: 'Test User',
                id: 1,
                transactions: [],
                targets: [],
                budgetLeniency: "" }) });
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

describe('Test GET /menu', () => {
    describe('GET /menu Successful', () => {
        it('should return status 200 and render settings page', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ transactions: [], targets: [] })})
            request(app)
                .get('/menu')
                .expect('Content-Type', /html/)
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /menu Failed', () => {
        it('should return an error if fetching user information fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .get('/menu')
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

    describe('GET /history No UID', () => {
        it('should return a bad request error if UID is not present', (done) => {
            // shouldn't need to mock fetch since it should never get there
            request(app)
                .get('/history')
                .expect('Content-Type', /html/)
                .expect(400)
                .end((err) => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('GET /history Invalid UID', () => {
        it('should return a bad request error if UID is not parsable', (done) => {
            // shouldn't need to mock fetch since it should never get there
            request(app)
                .get('/history?uid=asdf')
                .expect('Content-Type', /html/)
                .expect(400)
                .end((err) => {
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

    describe('GET /details No TID', () => {
        it('should return a bad request error if TID is not present', (done) => {
            request(app)
                .get('/details')
                .expect('Content-Type', /html/)
                .expect(400)
                .end(err => {
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

describe('Test GET /api/transactions', () => {
    describe('GET /api/transactions Successful', () => {
        it('should return status 200 and a list of transactions', done => {
            // mock the fetch function
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({id: '1-0', date: '', description: '', category: '', amount: 100, notes: ''})})
            request(app)
                .get('/api/transactions?uid=1')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/transactions No UID', () => {
        it('should return a bad request error if UID is not present', done => {
            request(app)
                .get('/api/transactions')
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/transactions Invalid UID', () => {
        it('should return a bad request error if UID is invalid', done => {
            request(app)
                .get('/api/transactions?uid=asdf')
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/transactions Failed', () => {
        it('should return an error if fetching transactions fails', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });
            
            request(app)
                .get('/api/transactions?uid=1')
                .expect('Content-Type', /text/)
                .expect(500)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
    
});

describe('Test GET /api/targets', () => {
    describe('GET /api/targets Successful', () => {
        it('should return status 200 and a list of targets', done => {
            // mock the fetch function
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({})})
            request(app)
                .get('/api/targets?uid=1')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/targets No UID', () => {
        it('should return a bad request error if UID is not present', done => {
            request(app)
                .get('/api/targets')
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/targets Invalid UID', () => {
        it('should return a bad request error if UID is invalid', done => {
            request(app)
                .get('/api/targets?uid=asdf')
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('GET /api/targets Failed', () => {
        it('should return an error if fetching targets fails', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });
            
            request(app)
                .get('/api/targets?uid=1')
                .expect('Content-Type', /text/)
                .expect(500)
                .end(err => {
                    global.fetch = originalFetch;
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
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/edit No UID', () => {
        it('should return a bad requet error if UID is not present', done => {
            request(app)
                .post('/api/target/edit')
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/edit Invalid UID', () => {
        it('should return a bad requet error if UID is invalid', done => {
            request(app)
                .post('/api/target/edit?uid=asdf')
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(400)
                .end(err => {
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

describe('Test POST /api/target/update', () => {
    describe('POST /api/target/update Successful', () => {
        it('should return status 200 if target is edited successfully', (done) => {
            // Mock the fetch function so that it returns a successful response without the need for the API
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });
            request(app)
                .post('/api/target/update?uid=1')
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(200)
                .end((err) => {
                    global.fetch = originalFetch; // restore the original fetch function
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/update No UID', () => {
        it('should return a bad requet error if UID is not present', done => {
            request(app)
                .post('/api/target/update')
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/update Invalid UID', () => {
        it('should return a bad requet error if UID is invalid', done => {
            request(app)
                .post('/api/target/update?uid=asdf')
                .send({ id: 0, name: 'target', amount: 100, included: true })
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/target/update Failed', () => {
        it('should return an error if editing a target fails', (done) => {
            // Mock the fetch function to simulate a failed response
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .post('/api/target/update?uid=1')
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

describe('Test POST /api/leniency/edit', () => {
    describe('POST /api/leniency/edit Successful', () => {
        it('should return status 200', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });

            request(app)
                .post('/api/leniency/edit')
                .send({ uid: 1, leniency: 'STRICT' })
                .expect(200)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/leniency/edit No UID', () => {
        it('should return a bad request error if UID is not present', done => {
            request(app)
                .post('/api/leniency/edit')
                .send({ leniency: 'STRICT' })
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/leniency/edit Invalid UID', () => {
        it('should return a bad request error if UID is invalid', done => {
            request(app)
                .post('/api/leniency/edit')
                .send({ uid: 'asdf', leniency: 'STRICT' })
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('POST /api/leniency/edit Invalid Leniency Level', () => {
        it('should return a bad request error if leniency level is invalid', done => {
            request(app)
                .post('/api/leniency/edit')
                .send({ uid: 1, leniency: 'bogus' })
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('POST /api/leniency/edit Failed', () => {
        it('should return an error if editing the leniency fails', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .post('/api/leniency/edit')
                .send({ uid: 1, leniency: 'STRICT' })
                .expect('Content-Type', /text/)
                .expect(500)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test DELETE /api/delete', () => {
    describe('DELETE /api/delete Successful', () => {
        it('should return status 200', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true });

            request(app)
                .delete('/api/delete?tid=1-0')
                .expect(200)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });

    describe('DELETE /api/delete No TID', () => {
        it('should return a bad reqest error', done => {
            request(app)
                .delete('/api/delete')
                .expect('Content-Type', /text/)
                .expect(400)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
    
    describe('DELETE /api/delete Failed', () => {
        it('should return status 200', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: false });

            request(app)
                .delete('/api/delete?tid=1-0')
                .expect('Content-Type', /text/)
                .expect(500)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test 404 Error /notfound', () => {
    describe('GET /notfound', () => {
        it('should return 404 and render the error page', done => {
            request(app)
                .get('/notfound')
                .expect('Content-Type', /html/)
                .expect(404)
                .end(err => {
                    if (err) return done(err);
                    done();
                });
        });
    });
});

describe('Test Template Errors', () => {
    describe('GET /notfound/stillnotfound', () => {
        it('should return 500 off any template errors', done => {
            const originalFetch = global.fetch;
            global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });

            request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(500)
                .end(err => {
                    global.fetch = originalFetch;
                    if (err) return done(err);
                    done();
                });
        });
    });
});
