const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function Profile(app, options = {}) {
  let token;

  describe('Profile endpoints', () => {
    describe('POST /profile', () => {
      it('should get unauthorized', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .set('Authorization', 'Bearer ' + token)
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
            token = res.body.token;
            done();
          });
      });

      it('should get a profile', (done) => {
        chai.request(app.server)
          .get(`${options.apiPrefix}/profile`)
          .set('Authorization', 'Bearer ' + token)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('email').eql('test2@test.com');
            token = res.body.token;
            done();
          });
      });

    });

  });
}
