var Helper = require("../helpers/casper-helper");

casper.options.viewportSize = {width: 1600, height: 950};
casper.test.begin("Verify login via save now", function(test) {
  var url = Helper.getLocaleBaseUrl("en_US") + "/bookify-react";
  casper.echo("Navigating to bookify url " + url);

  casper.start(url, function() {
    this.echo("Navigated to bookify");
  });

  //Wait until the loading bar shows up
  casper.waitForSelector(".loader-zone-progress-percent", function() {
    this.echo("Loading bar shown");
    test.assertExists('.loader-zone-progress-percent');
  });

  //Wait until the loading bar is done
  casper.waitWhileSelector(".loader-zone-progress-percent", 
    function() {}, 
    function() {}, 
    20000)

  casper.then(function() {
    //Test that the app is loaded for editing
    test.assertExists(".book-design-zone")  
  });
  
  //Click the 'Save as button'
  casper.thenClick(".header-zone .header-save p");

  //Wait for the dialog to show that has the 'Sign in to save' button
  casper.waitForSelector('.title-popup-item', function() {
    //Simple test that the dialog is showing as expected
    test.assertSelectorHasText('.title-popup-item', 'Save My Book')
  })

  //Click right side 'side in to save' button
  casper.thenClick('.register-popup-zone-right .button-login .button-blurb-content', 5000, function() {
    casper.echo("Clicked Sign in to save");
  }); 

  casper.waitForSelector('.login-popup-input input', function() {
    //Simple test that the dialog is showing as expected and the login button is disabled
    test.assertSelectorHasText('.login-popup-input p', 'Email or Username');
    test.assertExists(".button-sign-in.login-popup-input .button-blurb-blue.unable")
  });

  casper.thenEvaluate(function(user, password) {
    //Fill in the username and password. Trigger change events for React to pick up the values.
    document.querySelector('.login-popup-input input').value = user;
    document.querySelector('.login-popup-input input[type="password"]').value = password;

    document.querySelector('.login-popup-input input').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.login-popup-input input[type="password"]').dispatchEvent(new Event('input', { bubbles: true }));
  }, {
    user: Helper.user,
    password: Helper.password
  });

  casper.then(function() {
    casper.capture("foo.png")
    //Make sure the login button is enabled now and click it
    test.assertExists(".button-sign-in.login-popup-input .button-blurb-blue.enable")
    casper.click('.button-sign-in.login-popup-input .button-blurb-blue.enable');  
  });

  //Wait until the login dialog disappears
  casper.waitWhileSelector(".login-popup-input input");

  //Wait until the message that the save completed shows up
  casper.waitForText("Saved at").then(function() {
    test.assertSelectorHasText('.header-save', 'Saved at');
  })

  casper.run(function() {
    test.done();
  });
});
