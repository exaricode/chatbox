/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*****************************************!*\
  !*** ./resources/notificationWorker.js ***!
  \*****************************************/
self.addEventListener('install', function (e) {
  console.log('installing');
});
self.addEventListener('activate', function (e) {
  console.log('sw active'); // console.log(ServiceWorkerGlobalScope.clients);
});
var options = {
  includeUncontrolled: true,
  type: 'window'
};
self.addEventListener('notificationclick', function (e) {
  console.log('notification click'); // console.log(self);

  e.notification.close(); // console.log(ServiceWorkerGlobalScope.clients);

  /* e.waitUntil(clients.matchAll({
      type: 'window'
  })
      .then(function(clientList) {
          console.log(`client length: ${clientList.length}`);
          let len = clientList.length;
          for (let i = 0; i < len; i++){
              let client = clientList[i];
              if (client.url === '/' && 'focus' in client) {
                  return client.focus();
              }
          }
      })
  ); */
});
/******/ })()
;