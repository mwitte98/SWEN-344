describe('Unit tests', function() {

  describe('Stocks tests', function(){

    beforeEach(function() {
      module('swenApp'); // <= initialize module that should be tested
    });

    /**
     * Ensure that we can get the stock quote of any stock.
     */
    it('Get stock quote', inject(function($controller) {
      var scope = {},
          ctrl = $controller('mainCtrl', { $scope: scope });
      scope.searchField = 'GOOGL';
      scope.getStockQuote();
      expect(scope.stockQuote.Name).toBe('GOOGL'); // would be '' if stock quote failed
    }));

    /**
     * Ensure that we can sell 100 shares of any stock.
     */
    it('Buy stock shares', inject(function($controller) {
      var scope = {},
          ctrl = $controller('mainCtrl', { $scope: scope });
      scope.searchField = 'GOOGL';
      scope.getStockQuote();
      var oldAmountOwned = scope.amountOwned;
      scope.purchaseAmount = '100';
      scope.stockBuy();
      expect(scope.amountOwned).toBe(oldAmountOwned + 100);
    }));

    /**
     * Ensure that we can sell 100 shares of any stock.
     */
    it('Sell stock shares', inject(function($controller) {
      var scope = {},
          ctrl = $controller('mainCtrl', { $scope: scope });
      scope.searchField = 'GOOGL';
      scope.getStockQuote();
      var oldAmountOwned = scope.amountOwned;
      scope.sellAmount = '100';
      scope.stockSell();
      expect(scope.amountOwned).toBe(oldAmountOwned - 100);
    }));

    /**
     * Ensure that we can add a note to any stock.
     */
    it('Add stock note', inject(function($controller) {
      var scope = {},
          ctrl = $controller('mainCtrl', { $scope: scope });
      scope.searchField = 'GOOGL';
      scope.getStockQuote();
      scope.noteDesc = 'This is a test note! Wahoo!';
      scope.addNote();
      expect(scope.displayNote).toBe('This is a test note! Wahoo!');
    }));

    /**
     * Ensure that the stock transaction history is working
     */
    it('Stock transaction history working', inject(function($controller) {
      var scope = {},
          ctrl = $controller('mainCtrl', { $scope: scope });
      scope.searchField = 'GOOGL';
      scope.getStockQuote();
      scope.purchaseAmount = '100';
      scope.stockBuy();
      expect(scope.transaction.stock).toBe('GOOGL');
      expect(scope.transaction.amount).toBe('100');
    }));

  });
});
