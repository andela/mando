  'use strict';

  var mongoose = require('mongoose'),
  sinon = require('sinon'),
  should = require('should'),
  Campaign = mongoose.model('Campaign'),
  User = mongoose.model('User'),
  controller = require('../controllers/campaign.server.controller');
  var user1,
  user2,
  campaign1,
  res,
  statusSpy,
  sendSpy;

  describe('Campaign Server Controller', function (){
    beforeEach( function(done){

     res = {status: function(){return this;},
     send: function(){return this;},
     json: function(){return this;}
   };
   statusSpy = sinon.spy(res, 'status');
   sendSpy = sinon.spy(res, 'send');
    //valid user
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

      //MOCK CAMPAIGNS
      campaign1 = new Campaign({
      title: 'A mock Campaign',
      description: 'This is a description campaign',
      youtubeUrl: 'https://www.youtube.com/watch?v=kC0JYp79tdo',
      amount: '1223232',
      dueDate: new Date()
    });
      
      campaign1.save(function(err, campaign){
        if(err){
          done(err);
        } 
        else {    
          user1.save(function(err, user){
            if(err){
              done(err);
            }
            else{
              done();
            }
          });
        }
      });
    });

 it('should edit A campaign with A valid credential', function(done){
    var req,
    param ={
      campaignId: campaign1._id
    };
    campaign1.title = 'A new Campaign Title';
    req = {user:user1, body:campaign1, params:param};
    controller.updateCampaign(req, res);
    Campaign.findById(campaign1._id).exec(function(err, campaign){
      campaign.title.should.equal('A new Campaign Title');
      done();
    });
 });
  afterEach(function(done){
    User.remove().exec();
    done();
  });
});


