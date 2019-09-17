const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function Profile(app, options = {}) {
  let accessToken;
  let refreshToken;
  let newAccessToken;

  describe('Profile endpoints', () => {
    describe('POST /profile', () => {
      it('should get unauthorized', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .send()
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });


      it('should authorize with correct email/password and get a token', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('refreshToken');
            accessToken = res.body.token;
            refreshToken = res.body.refreshToken;
            done();
          });
      });

      it('should get a profile', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .set('Authorization', 'Bearer ' + accessToken)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('email').eql('test2@test.com');
            done();
          });
      });

      it('should get new tokens using refreshToken', (done) => {
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token/refresh`)
          .send()
          .set('Authorization', `Bearer ${refreshToken}`)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            res.body.should.have.property('refreshToken');
            newAccessToken = res.body.token;
            done();
          });
      });

      it('should get a profile with new token', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .set('Authorization', 'Bearer ' + newAccessToken)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('email').eql('test2@test.com');
            done();
          });
      });

      it('should get a profile with old token', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .set('Authorization', 'Bearer ' + accessToken)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('email').eql('test2@test.com');
            done();
          });
      });

    });

  });
}
