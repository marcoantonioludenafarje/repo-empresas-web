import { precacheAndRoute } from 'workbox-precaching';
//import {request} from '../src/@crema/utility/Utils';
self.addEventListener('install', (event) => {
  const urlsToCache = [
    // Agrega aquí los archivos que deseas precachear
    '/path/to/file1',
    '/path/to/file2',
    // ...
  ];
  console.log("Hola mundo del instalador de Service Worker 🤙");
  
//   event.waitUntil(
//     caches.open('my-cache').then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
});
// self.addEventListener('activate', e => {
//     console.log("Se ha activado el service worker")

// });
// self.addEventListener('message', event => {
//     if (event.data && event.data.action === 'subscribe') {
//       const subscription = {"request": {
//                                 "payload": event.data.subscription
//                             }};
      
//       request('post', '/utility/webpushnotifications/getKey', subscription)
//       .then((data) => {
//         console.log('getKey resultado', data);
        
//       })
//       .catch((error) => {
//         console.log('getKey error', error);
//       });
  
//       console.log('Suscripción guardada:', subscription);
//     }
//   });

// // Escuchar PUSH
// self.addEventListener('push', e => {

//     // console.log(e);

//     console.log("El push ha llegado", e);
//     const data = JSON.parse( e.data.text() );

//     console.log("El push se ha parseado", data);


//     const title = data.titulo;
//     const options = {
//         body: data.cuerpo,
//         // icon: 'img/icons/icon-72x72.png',
//         icon: `img/avatars/${ data.usuario }.jpg`,
//         badge: 'img/favicon.ico',
//         image: 'https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/5/5b/Torre_de_los_Avengers.png/revision/latest?cb=20150626220613&path-prefix=es',
//         vibrate: [125,75,125,275,200,275,125,75,125,275,200,600,200,600],
//         openUrl: '/',
//         data: {
//             // url: 'https://google.com',
//             url: '/',
//             id: data.usuario
//         },
//         actions: [
//             {
//                 action: 'thor-action',
//                 title: 'Thor',
//                 icon: 'img/avatar/thor.jpg'
//             },
//             {
//                 action: 'ironman-action',
//                 title: 'Ironman',
//                 icon: 'img/avatar/ironman.jpg'
//             }
//         ]
//     };

//     console.log("options push notification", options)
//     e.waitUntil( self.registration.showNotification( title, options) );


// });

//precacheAndRoute(self.__WB_MANIFEST);
