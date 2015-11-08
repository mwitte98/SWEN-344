describe('Project Freebird', function() {


  /**
   * Ignore synchronization for every test.
   * Tests might run slower but this fixes a strange bug.
   */
  beforeEach(function() {
    browser.ignoreSynchronization = true;
  });


  /**
   * Test to ensure we can log in to website with valid Twitter account.
   */
  it('Should be able to log in', function() {
    browser.get('http://localhost:8080');
    element(by.id('loginBtn')).click();
    var username = element(by.id('username_or_email'));
    var password = element(by.id('password'));
    username.sendKeys("jad5366");
    password.sendKeys("JohnStamos");
    element(by.id('allow')).click();
    browser.waitForAngular();
    var username = element(by.model('welcomeTagline'));
    expect(username.getText()).toEqual('Hey, jad5366');
  });


  /**
   * Test to ensure we can post a tweet and have it show up on the home page.
   * This test is incomplete due to difficulties checking within iframes using
   * protractor.
   */
  it('Should be able to post tweet and see it on home page', function() {
    // first, post new tweet via twitter.com
    var tweetToPost = "Automated Tweet " + getRandomInt(0,100000);
    browser.get('http://twitter.com');
    element(by.id('global-new-tweet-button')).click();
    var tweetBox = element(by.id("tweet-box-global"));
    tweetBox.sendKeys(tweetToPost);
    browser.waitForAngular();
    element(by.xpath("//div[@class='modal-tweet-form-container']//div[@class='tweet-button']/button")).click();
    // dismiss "are you sure you want to leave?" alert displayed by Twitter
    browser.switchTo().alert().then(
      function (alert) {
        alert.accept();
      },
      function (error) {
      }
    );
    // CODE ABOVE THIS IS WORKING. CODE BELOW THIS IS NOT.
    // Need to figure out how to test that tweet was posted within iframe
    // browser.get('http://localhost:8080');
    // browser.driver.wait(function() {
    //   return browser.isElementPresent(by.css("Tweet-text.e-entry-title"));
    // });
    // browser.switchTo().frame("twitter-widget-0");
    // var latestTweet = element(by.css("Tweet-text.e-entry-title")).getText();
    // console.log(latestTweet);
  });


  /**
   * Test to ensure we can search for a stock and have it show up in the
   * search results.
   */
  it('Should be able to search for a stock', function() {
    browser.get("http://localhost:8080/stocks");
    browser.waitForAngular();
    var searchBox = element(by.id('searchField'));
    searchBox.sendKeys('Google');
    element.all(by.buttonText("Search")).first().click();
    // TODO: check search results (once stocks page is working again)
  });


  /**
   * Test to ensure we can get a stock quote.
   */
  it('Should be able to get a stock quote', function() {
    browser.get("http://localhost:8080/stocks");
    browser.waitForAngular();
    var searchBox = element(by.id('queryField'));
    searchBox.sendKeys('GOOG');
    element.all(by.buttonText("Search")).get(1).click();
    // TODO: check quote results (once stocks page is working again)
  });


  /**
   * Test to ensure we can log out of the website.
   */
  it('Should be able to log out of the website', function() {
    browser.get("http://localhost:8080");
    browser.waitForAngular();
    var logoutButton = element(by.css('a[href*="/logout"]'));
    logoutButton.click();
    browser.waitForAngular();
    var welcomeMessage = element.all(by.tagName('h3')).first();
    expect(welcomeMessage.getText()).toEqual('Hey there, login below with Twitter!');
  });


  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   */
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }


});
