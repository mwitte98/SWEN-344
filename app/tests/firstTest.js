describe('Project Freebird', function() {
  it('Home Page Test', function() {
    browser.ignoreSynchronization = true;
    browser.get('http://localhost:8080/login');

    expect(browser.getTitle()).toEqual('Index!');
  });
});
