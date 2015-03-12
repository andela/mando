'use strict';

/**
 * Module dependencies
 */
var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest')('http://localhost:3000'),
  passport = require('passport'),
  Campaign = mongoose.model('Campaign'),
  User = mongoose.model('User');

var agent = require('supertest').agent('http://localhost:3000');

var campaign,
  user1,
  user2;

/**
 * Unit tests
 */
describe('Campaign route unit tests:', function() {
  before(function(done) {
    user1 = new User({ 
      firstName: 'Bayo',
      lastname: 'Mando',
      displayName: 'BayoMando',
      email: 'test@andela.co',
      username:'username',
      provider:'google'
    });

    //invalid user
    user2 = new User({
      firstName: 'User2',
      lastname: 'Mando2',
      displayName:'Manod2User2',
      email: 'adebayo@andela.co',
      username:'username2',
      provider: 'google'
    });

    campaign = new Campaign({
      title: 'A mock Campaign',
      description: 'This is a description campaign',
      youtubeUrl: 'https://www.youtube.com/watch?v=kC0JYp79tdo',
      amount: '1223232',
      dueDate: new Date()
    });
      
    campaign.save(function(err, campaign) {
      if(err){
        done(err);
      } else {    
        user1.save(done);
      }
    });
  });

  describe('When the user is not logged in', function() {
    it('fails to update a campaign', function(done) {
      campaign.title = 'Edited campaign';

      agent
        .put('/campaign/' + campaign._id + '/edit')
        .send(campaign)
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.have.property('message', 'User is not logged in');

          done();
        });
    });
  });

  describe('When the user is logged in', function() {
    before(function(done) {
      this.timeout(3000);

      agent
      .post('/auth/mock')
      .send({
        firstName: 'A new test',
        lastName: 'User',
        username: 'tuser',
        email: 'testuser@gmail.com',
        provider: 'google'

      })
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }

        res.body.should.have.property('success', true);

        var user = res.body.user;

        done();
      });
    });

    it('should update a campaign', function(done){
      campaign.title = 'After Editing';
      agent
        .put('/campaign/' + campaign._id + '/edit')
        .send(campaign)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res){
          if(err){
            return done(err);
          }

          res.body.title.should.equal(campaign.title);

          done();
        });
    });

    after(function(done) {
      agent
        .get('/auth/mock/logout')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.have.property('success', true);

          done();
        });
    });
  });

  after(function(done) {
    User.remove().exec();
    Campaign.remove().exec();
    done();
  });
});