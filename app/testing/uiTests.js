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

  it('Should get stock quote of AAPL', function() {
    // TODO
  });

  it('Should get stock quote of GOOG', function() {
    // TODO
  });

});
