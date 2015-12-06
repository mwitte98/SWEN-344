describe('UI Tests', function() {


  /**
   * Ignore synchronization for every test.
   * Tests might run slower with this, but it fixes a weird bug.
   */
  beforeEach(function() {
    browser.ignoreSynchronization = true;
  });


  /**
   * Test to ensure we can log in to website with valid Twitter account.
   * Uses Team Freebird's dedicated Twitter testing account @jad5366.
   */
  it('Should be able to log in', function() {
    browser.get('http://localhost:8080');
    element(by.id('loginBtn')).click();
    var username = element(by.id('username_or_email'));
    var password = element(by.id('password'));
    username.sendKeys("jad5366");
    password.sendKeys("JohnStamos");
    element(by.id('allow')).click();
    var username = element(by.model('welcomeTagline'));
    expect(username.getText()).toEqual('Hey, jad5366');
  });


  /**
   * Test to ensure we can post a tweet and have it show up on the home page.
   * This test is incomplete due to difficulties checking within iframes using
   * protractor.
   */
  it('Should be able to post tweet and see it on home page', function() {
    var tweetToPost = "Automated Tweet " + getRandomInt(0,100000);
    var tweetBox = element(by.id('tweetField'));
    tweetBox.sendKeys(tweetToPost);
    element(by.buttonText("Tweet")).click();
  });


  /**
   * Test to ensure we can search for a stock and have it show up in the
   * search results. In this case, we search for 'GOOG' and look for
   * 'Alphabet Inc.' in the search results.
   */
  it('Should be able to search for a stock', function() {
    browser.get("http://localhost:8080/stocks");
    var searchBox = element(by.id('searchField'));
    searchBox.sendKeys('GOOG');
    element.all(by.buttonText("Search")).first().click();
    element.all(by.buttonText("Search")).first().click();
    var EC = protractor.ExpectedConditions;
    var stockName = element(by.binding("stockQuote.Name"));
    browser.wait(EC.presenceOf(stockName), 10000);
    expect(stockName.getText()).toEqual('Name: Alphabet Inc');
  });


  /**
   * Test to ensure the stock purchasing box is unclickable until
   * a valid stock is being displayed.
   */
   it('Should not be able to purchase stocks until valid stock is selected', function() {
     browser.get("http://localhost:8080/stocks");
     var buyButton = element(by.buttonText('Buy Stock(s)'));
     var sellButton = element(by.buttonText('Sell Stock(s)'));
     expect(buyButton.isEnabled()).toBe(false);
     expect(sellButton.isEnabled()).toBe(false);
   });


   /**
    * Test to ensure a calendar event can be added. Adds an event
    * taking place tomorrow and checks to see if it stays there.
    */
   it('Should be able to add a calendar event for tomorrow', function() {
     var randomEventTitle = "Test Event " + getRandomInt(0,100000);
     browser.get("http://localhost:8080/calendar");
     element.all(by.css('.fc-future')).get(0).click();
     var eventTitle = element(by.id('addEventTitle'));
     var EC = protractor.ExpectedConditions;
     browser.wait(EC.visibilityOf(eventTitle), 5000);
     eventTitle.sendKeys('Test Event');
     var eventLocation = element(by.id('addEventLocation'));
     eventLocation.sendKeys('Test Location');
     var eventDesc = element(by.id('addEventDesc'));
     eventDesc.sendKeys('Test Description');
     var ampm = element.all(by.css('.ampm')).get(1);
     ampm.$('[value="pm"]').click();
     element(by.id('addEventSubmit')).click();
     browser.get("http://localhost:8080/calendar");
     element(by.css('.fc-event')).click();
     var eventTitle = element(by.id('eventDetailsTitle'));
     browser.wait(EC.visibilityOf(eventTitle), 5000);
     expect(eventTitle.getText()).toEqual(randomEventTitle);
   });


  /**
   * Test to ensure we can log out of the website.
   */
  it('Should be able to log out of the website', function() {
    browser.get("http://localhost:8080");
    var logoutButton = element(by.css('a[href*="/logout"]'));
    logoutButton.click();
    browser.waitForAngular();
    var welcomeMessage = element.all(by.tagName('h3')).first();
    expect(welcomeMessage.getText()).toEqual('Hey there, login below with Twitter!');
  });


  /**
   * Returns a random integer between min (inclusive) and max (inclusive).
   * Used for posting random tweets (so Twitter doesn't block us for spam).
   */
  function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  /**
   * Returns true when an element on the UI contains text.
   */
  function anyTextToBePresentInElement(elementFinder) {
    var EC = protractor.ExpectedConditions;
    var hasText = function() {
      return elementFinder.getText().then(function(actualText) {
        return actualText;
      });
    };
    return EC.and(EC.presenceOf(elementFinder), hasText);
  };


  /**
   * Selects an option number of a dropdown menu.
   */
   function selectDropdownbyNum(element, optionNum) {
       if (optionNum){
         var options = element.findElements(by.tagName('option'))
           .then(function(options){
             options[optionNum].click();
           });
       }
     };


});
