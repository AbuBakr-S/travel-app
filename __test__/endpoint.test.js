// Test a given endpoint on a test route
const app = require('../src/server/server');
const supertest = require('supertest');
const request = supertest(app);

app.get('/test', async (req, res) => {
    res.json({weather: 'Hot!'})
  })

it('Get the test endpoint and verify weather value', async done => {
    // Sends GET Request to /test endpoint
    const res = await request.get('/test');
    const weather = res.body.weather
    console.log(res.body.weather);
    expect(weather).toBe('Hot!');
    done();
});