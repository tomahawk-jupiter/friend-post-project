const request = require('supertest');
const app = require('../app');

/**
 * 
 * The tests need more work!
 * 
 * How to test routes that render pug templates???
 * 
 * 
*/

/// Test signup new user with localStrategy ///
describe('Test signup form', () => {
  test('GET /signup renders a form view', (done) => {
    request(app)
      .get('/signup')
      .expect(200, done);
  });

  test('POST /signup', (done) => {
    request(app)
      .post('/signup')
      .expect(200, done);
  });
});


/// Test login with localStrategy
describe('POST login form (for localStrategy)', () => {
  test('with valid user', (done) => {
    request(app)
      .post('/')
      .send({ username: 'bot@mail', password: 'test'})
      .expect(302, done);
  });
});

  // POST login form should redirect and contain req.user.id etc.

/// Tests profile routes ///
describe('GET /', () => {
  test('True should be true', () => {
    expect(true).toBe(true);
  });
  
  test('with no req.user should render login view', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });

  test('with req.user defined should render profile view', (done) => {
    request(app)
      .get('/')
      .set({ user: 'true'})
      .expect(200, done);
  });

  /// Test GET /profile with a real user ///
});


/// Tests for auth routes ///
describe('GET /auth/github', () => {
  test('True should be true', () => {
    expect(true).toBe(true);
  });

  test('should be 302 redirect', (done) => {
    request(app)
      .get('/auth/github')
      .expect(302, done);
  });

  test('/auth/github/callback should redirect', (done) => {
    request(app)
      .get('/auth/github')
      .expect(302, done);
  });

  test('logout should redirect', (done) => {
    request(app)
      .post('/logout')
      .expect(302, done);
  })
});

/// User posts ///
describe('POST /post', () => {
  test('Should be ok', (done) => {
    request(app)
      .post('/post')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
});


/// Tests for comment routes ///
describe('POST /post/comment', () => {
  test('Should be ok', (done) => {
    request(app)
      .post('/post/comment')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
});


/// Friend request routes ///
describe('POST /friend/makeRequest', () => {
  test('Should be ok', (done) => {
    request(app)
      .post('/friend/makeRequest')
      .expect(200, done);
  });
});

describe('POST /friend/accept', () => {
  test('Should be ok', (done) => {
    request(app)
      .post('/friend/accept')
      .expect(200, done);
  });
});

const mongoose = require('mongoose');
afterAll((done) => {
// Closing the DB connection allows Jest to exit successfully.
  try {
     mongoose.connection.close();
    done()
  } catch (err) {
    console.log(err);
    done()
  }
})

/// Helpful notes ///

/// .then().catch() ///

// describe('GET /users', function() {
//   it('responds with json', function(done) {
//     return request(app)
//       .get('/users')
//       .set('Accept', 'application/json')
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then(response => {
//           assert(response.body.email, 'foo@bar.com')
//           done();
//       })
//       .catch(err => done(err))
//   });
// });