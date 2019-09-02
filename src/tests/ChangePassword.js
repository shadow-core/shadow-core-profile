const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSubset = require('chai-subset');

const should = chai.should();
const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiSubset);

export default function ChangePassword(app, options = {}) {
  let token = '';

//Our parent block
  describe('Profile endpoints', () => {
    describe('POST /profile/change_password', () => {
      it('should return an unathorized without token', (done) => {
        var data = {};
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .send(data)
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

      it('should return error if there is empty data sent', (done) => {
        var data = {};
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.not.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return error if old password is incorrect', (done) => {
        var data = {
          'oldPassword': 'wrongpassword'
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.not.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return error if old password is correct but no new passwords provided', (done) => {
        var data = {
          'oldPassword': 'test'
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.not.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return error if old password is correct but no password_check', (done) => {
        var data = {
          'oldPassword': 'test',
          'newPassword': 'password',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.not.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return error if old password is correct but no password', (done) => {
        var data = {
          'oldPassword': 'test',
          'newPasswordCheck': 'password',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.not.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.not.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return error if old password is correct but new passwords are not equal', (done) => {
        var data = {
          'oldPassword': 'test',
          'newPassword': 'Password',
          'newPasswordCheck': 'password',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('success').eq(false);
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('array');
            res.body.errors.should.not.containSubset([{code: 1, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 2, param: 'oldPassword'}]);
            res.body.errors.should.not.containSubset([{code: 3, param: 'newPassword'}]);
            res.body.errors.should.not.containSubset([{code: 4, param: 'newPasswordCheck'}]);
            res.body.errors.should.containSubset([{code: 5, param: 'newPasswordCheck'}]);
            done();
          });
      });

      it('should return success if data is correct', (done) => {
        var data = {
          'oldPassword': 'test',
          'newPassword': 'password',
          'newPasswordCheck': 'password',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

      it('should NOT authorize with old password', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(401);
            done();
          });
      });

      it('should authorize with new password', (done) => {
        let data = {
          'email': 'test2@test.com',
          'password': 'password',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/auth/user/token`)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('token');
            done();
          });
      });

      it('change password back', (done) => {
        var data = {
          'oldPassword': 'password',
          'newPassword': 'test',
          'newPasswordCheck': 'test',
        };
        chai.request(app.server)
          .post(`${options.apiPrefix}/profile/change_password`)
          .set('Authorization', 'Bearer ' + token)
          .send(data)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('success').eq(true);
            res.body.should.have.property('code').eq(100);
            res.body.should.have.property('message');
            done();
          });
      });

    });

  });
}
