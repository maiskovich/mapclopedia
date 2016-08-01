describe('service serviceWorker', () => {
  beforeEach(angular.mock.module('transportationApp'));

  it('should be registered', inject(serviceWorker => {
    expect(serviceWorker).not.toEqual(null);
  }));

});


