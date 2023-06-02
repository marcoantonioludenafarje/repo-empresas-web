// imports
// importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

// importScripts('js/sw-db.js');
// importScripts('js/sw-utils.js');


const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';
// importScripts('/swivel/swivel.js');
// const swivel = new Swivel();


//import swivel from 'swivel'

const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.js',
    'js/libs/plugins/mdtoast.min.css'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css',
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js'
];



self.addEventListener('install', e => {

    console.log("Hello world from the Service Worker 🤙");

    // const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
    //     cache.addAll( APP_SHELL ));

    // const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
    //     cache.addAll( APP_SHELL_INMUTABLE ));



    // e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );

});


self.addEventListener('activate', e => {
    console.log("Se ha activado el service worker")
    // const respuesta = caches.keys().then( keys => {

    //     keys.forEach( key => {

    //         if (  key !== STATIC_CACHE && key.includes('static') ) {
    //             return caches.delete(key);
    //         }

    //         if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
    //             return caches.delete(key);
    //         }

    //     });

    // });

    // e.waitUntil( respuesta );

});


self.addEventListener('message', event => {
    if (event.data && event.data.action === 'subscribe') {
      const subscription = {"request": {
                                "payload": event.data.subscription
                            }};
      
    //   request('post', '/utility/webpushnotifications/getKey', subscription)
    //   .then((data) => {
    //     console.log('getKey resultado', data);
        
    //   })
    //   .catch((error) => {
    //     console.log('getKey error', error);
    //   });
  
      console.log('Suscripción guardada:', subscription);
    }
  });



// self.addEventListener( 'fetch', e => {

//     let respuesta;

//     if ( e.request.url.includes('/api') ) {

//         // return respuesta????
//         respuesta = manejoApiMensajes( DYNAMIC_CACHE, e.request );

//     } else {

//         respuesta = caches.match( e.request ).then( res => {

//             if ( res ) {
                
//                 actualizaCacheStatico( STATIC_CACHE, e.request, APP_SHELL_INMUTABLE );
//                 return res;
                
//             } else {
    
//                 return fetch( e.request ).then( newRes => {
    
//                     return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
    
//                 });
    
//             }
    
//         });

//     }

//     e.respondWith( respuesta );

// });


// // tareas asíncronas
// self.addEventListener('sync', e => {

//     console.log('SW: Sync');

//     // if ( e.tag === 'nuevo-post' ) {

//     //     // postear a BD cuando hay conexión
//     //     const respuesta = postearMensajes();
        
//     //     e.waitUntil( respuesta );
//     // }

// });

// Escuchar PUSH
self.addEventListener('push', e => {

    // console.log(e);

    console.log("El push ha llegado", e);
    const data = JSON.parse( e.data.text() );

    console.log("El push se ha parseado", data);


    const title = data.title;
    const url = data.url;
    const urlObject = new URL(url);
    const relativeURL = urlObject.pathname + urlObject.search;
    const options = {
        body: data.message,
        // icon: 'img/icons/icon-72x72.png',
        tag: 'notification-tag',
        icon: `favicon.ico`,
        badge: 'favicon.ico',
        image: relativeURL || 'https://d2moc5ro519bc0.cloudfront.net/merchant/ae1a9ea0036542d889ebd0d062474400/logo/logo_png.png',
        vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
        openUrl: data.url,
        data: {
            //url: data.url,
            url: `${relativeURL}` || `/sample/outputs/table?movementHeaderId=${data.saleId}`,
            //url: "https://www.google.com/",
            id: data.userCreatedAt
        },
        actions: [
            {
                action: 'output-action',
                title: 'Ir a Salida',
                //icon: 'favicon.ico',
            }
        ]
    };

    console.log("options push notification", options)



    //const notificationPromise = self.registration.showNotification( title, options);
    // Enviar un mensaje al cliente para indicar que se ha recibido una notificación
    // const clientsPromise = self.clients.matchAll().then(clients => {
    //     console.log("clients sw", clients ? clients : "no hay clients")
    //     clients.forEach(client => {
    //     //client.postMessage({ type: 'notificationUpdate' });
    //     client.navigate('http://localhost:3000/sample/outputs/table')
    //     client.focus();
    //     });
    // });


    // const clientsPromise = self.clients.matchAll().then(clients => {
    //     console.log("encuentra clientes")
    //     return Promise.all(
    //       clients.map(client => {
    //         console.log("va a enviar mensaje")
    //         return client.postMessage({ type: 'notificationUpdate' });
    //       })
    //     );
    //   });
    // e.waitUntil(Promise.all([clientsPromise]));
    // e.waitUntil(self.registration.showNotification( title, options));
    

    e.waitUntil(self.registration.showNotification(title, options));

    // const clientsPromise = self.clients.matchAll().then(clients => {
    //     console.log("Encuentra clientes");
    //     const messagePromises = clients.map(client => {
    //     console.log("Va a enviar mensaje");
    //     const randomNumber =  Math.floor(Math.random() * (10000 - 1)) + 1;
    //     //localStorage.setItem('updateNotification', randomNumber)
    //     return client.postMessage({ type: 'notificationUpdate' });
    //     });
    //     return Promise.all(messagePromises);
    // });

    // e.waitUntil(clientsPromise);

    // Envía el mensaje a todas las instancias abiertas de la aplicación
    // swivel.broadcast({ type: 'updateNotification', data: { title, options } });

    // e.waitUntil(
    //     self.registration.showNotification(title, options)
    // );
});


// Cierra la notificacion
self.addEventListener('notificationclose', e => {
    console.log('Notificación cerrada', e);
});


// self.addEventListener('notificationclick', e => {


//     const notificacion = e.notification;
//     const accion = e.action;


//     console.log('notificationclick', { notificacion, accion });
//     // console.log(notificacion);
//     // console.log(accion);
    

//     const respuesta = clients.matchAll()
//     .then( clientes => {

//         let cliente = clientes.find( c => {
//             return c.visibilityState === 'visible';
//         });

//         if ( cliente !== undefined ) {
//             cliente.navigate( notificacion.data.url );
//             cliente.focus();
//         } else {
//             clients.openWindow( notificacion.data.url );
//         }

//         return notificacion.close();

//     });

//     e.waitUntil( respuesta );


// });

self.addEventListener('notificationclick', function(event) {
    console.log("notificationclick", event)

    const action = event.action;
    // Aquí también puedes redireccionar a una URL específica si es necesario
    let url = event.notification.data.url;
    if (action === 'output-action') {
        // Acción específica para Thor seleccionada
        // Agrega la lógica que deseas ejecutar para esa acción
        event.waitUntil(
            self.clients.openWindow(url)
            );
        event.notification.close();
    }


});
  

//precacheAndRoute(self.__WB_MANIFEST);