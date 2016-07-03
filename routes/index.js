var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

// Server routes:

router.get('/', function (req, templRes) {
  var DigitalOcean = require('do-wrapper'),
      api = new DigitalOcean('0a7866a830b17fc3c17dad0e23d57e9cb5755410376bf530923ec8182e173cdf');
  api.dropletsGetAll({ "page": 1, "per_page": 10, "tag_name": [] }, function (err, res, body) {
    function Droplet(name, ip) {
      this.name = name;
      this.ip = ip;
    }
    var keyDropletsInfoArr = [],
        dropletsJSON = body.droplets;
    for (var i=0; i < dropletsJSON.length; i++) {
      var thisDroplet = dropletsJSON[i];
      var thisDropletName = thisDroplet.name;
      var publicAndPrivateIpv4Arr = thisDroplet.networks.v4;
      var lengthOfAbove = publicAndPrivateIpv4Arr.length,
          publicIpVal = "";
      publicIpVal = lengthOfAbove > 1 ? publicAndPrivateIpv4Arr[1].ip_address : publicAndPrivateIpv4Arr[0].ip_address;
      // adjustment to add http protocol part of string, which DigitalOcean API doesn't provide:
      publicIpVal = "http://" + publicIpVal;
      var thisDropletKeyInfoObj = new Droplet(thisDropletName, publicIpVal);
      // append to keyDropletsInfoArr:
      keyDropletsInfoArr.push(thisDropletKeyInfoObj);
    }
    templRes.render('index', { user : req.user, dropletsInfo: keyDropletsInfoArr });

  });





});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});
router.post('/login', passport.authenticate('local'), function(req, res) {

    res.redirect('/');

});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
