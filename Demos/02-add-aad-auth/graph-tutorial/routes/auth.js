var express = require('express');
var passport = require('passport');
var router = express.Router();
var util = require('util')

/* GET auth callback. */
router.get('/signin',
  function  (req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        prompt: 'login',
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {
    res.redirect('/');
  }
);

router.post('/callback',
  function(req, res, next) {
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/',
        failureFlash: true
      }
    )(req,res,next);
  },
  function(req, res) {

	if(req.user){
		// TEMPORARY!
		// Flash the access token for testing purposes
		console.log(util.inspect(req.user))

		// Open ID Connect 2.0 token that can be inspected and used for authorization
		if(req.user.oauthToken.token.id_token)
			req.flash('error_msg', {message: `ID token:`, debug: req.user.oauthToken.token.id_token});

		// Opaque and only useful for the Microsoft Graph
		// if(req.user.oauthToken.token.access_token)
		// 	req.flash('error_msg', {message: `Access token:`, debug: req.user.oauthToken.token.access_token});



	}

    res.redirect('/');
  }
);

router.get('/signout',
  function(req, res) {
    req.session.destroy(function(err) {
      req.logout();
      res.redirect('/');
    });
  }
);

module.exports = router;
