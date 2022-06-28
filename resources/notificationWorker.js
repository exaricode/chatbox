self.addEventListener('install', e => {
    console.log('installing');
    
});

self.addEventListener('activate', e => {
    console.log('sw active');
    // console.log(ServiceWorkerGlobalScope.clients);
});

const options = {
    includeUncontrolled: true,
    type: 'window'
}

self.addEventListener('notificationclick', e => {
    
    console.log('notification click');
    // console.log(self);
    e.notification.close();
    // console.log(ServiceWorkerGlobalScope.clients);
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
})