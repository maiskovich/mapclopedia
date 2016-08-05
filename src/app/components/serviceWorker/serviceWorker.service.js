export class ServiceWorkerService {
  constructor ($log,$mdToast) {
    'ngInject';
    this.$log = $log;
    this.$mdToast=$mdToast;
  }
  //Register the service worker to the browser
  register() {
    let self=this;
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then(reg => {
        this.$log.log('ServiceWorker registration successful with: ', reg);
        if (reg.waiting) {
          this.updateReady(reg.waiting);
          return;
        }
        if (reg.installing) {
          this.trackInstalling(reg.installing);
          return;
        }
        reg.addEventListener('updatefound', function() {
         self.trackInstalling(reg.installing);
        });
      }).catch(err=> {
        this.$log.log('ServiceWorker registration failed: ', err);
      });
    }

  };
  //Track the installation process of the service worker
  trackInstalling(worker) {
    let self=this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      self.updateReady(worker);
    }
  });
};
//Show a toast message when an update of the sw file is available
  updateReady(worker) {
    var toast = this.$mdToast.simple({hideDelay: 5000})
      .textContent('New update available')
      .action('UPDATE')
      .highlightAction(true);
    this.$mdToast.show(toast).then(response=> {
      if ( response == 'ok' ) {
        worker.postMessage({action: 'skipWaiting'});
      }
    });

};

}

