describe('Project Freebird', function() {

  it('Should be able to log in', function() {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:8080/login');
    element(by.id('loginBtn')).click();
    var username = element(by.id('username_or_email'));
    var password = element(by.id('password'));
    username.sendKeys("jad5366");
    password.sendKeys("JohnStamos");
    element(by.id('allow')).click();
    expect(browser.getTitle()).toEqual('Main Page');
  });

  it('Should be able to post tweet and see it on home page', function() {
    browser.ignoreSynchronization = true;
    // post tweet using twitter.com
    browser.get('http://twitter.com');
    element(by.id('global-new-tweet-button')).click();
    var tweetBox = element(by.id("tweet-box-global"));
    tweetBox.sendKeys("asdfghijklmno");
    element(by.xpath("//div[@class='modal-tweet-form-container']//div[@class='tweet-button']/button")).click();
    // dismiss "are you sure you want to leave?" alert displayed by Twitter
    browser.switchTo().alert().then(
      function (alert) {
        alert.accept();
      },
      function (error) {
      }
    );
    // go back to project freebird and check if tweet is there
    browser.get('http://localhost:8080');
    // ensure that the page is loaded before trying to switch frames.
    browser.waitForAngular();
    browser.ignoreSynchronization = false;
    browser.switchTo().frame(element(by.tagName('iframe')));
    var latestTweet = element(by.css('Tweet-body.e-entry-content'));
    browser.ignoreSynchronization = true;
    expect(latestTweet.getText()).to.contain("asdfghijklmno");
  });

});
