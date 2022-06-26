/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./resources/notificationWorker.js ***!
  \*****************************************/
self.addEventListener('install', function (e) {
  console.log('installing');
});
self.addEventListener('active', function (e) {
  console.log('sw active');
  console.log(ServiceWorkerGlobalScope.clients);
});
var options = {
  includeUncontrolled: true,
  type: 'window'
};
self.addEventListener('notificationclick', function (e) {
  console.log('notification click');
  e.notification.close();
  /* 
  e.waitUntil(ServiceWorkerGlobalScope.clients.matchAll(options)
      .then(clientList => {
          console.log(`client length: ${clientList.length}`);
          let len = clientList.length;
          for (let i = 0; i < len; ++i){
              let client = clientList[i];
              if (client.url === '/' && 'focus' in client) {
                  return client.focus();
              }
          }
      })
  ) */
});
/******/ })()
;