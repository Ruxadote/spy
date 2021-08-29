importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

if (workbox) {
    workbox.core.skipWaiting();
    workbox.core.clientsClaim();
    workbox.routing.registerRoute(({
        event
        }) => event.request.destination === 'document',
        async (args) => {
            try {
                const response = await new workbox.strategies.StaleWhileRevalidate({
                    cacheName: 'html',
                    plugins: [
                        new workbox.expiration.ExpirationPlugin({
                            maxEntries: 50,
                        }),
                        new workbox.cacheableResponse.CacheableResponsePlugin({
                            statuses: [0, 200]
                        }),
                    ],
                }).handle(args);
                return response || await caches.match('https://daftplug.com/spy/');
            } catch (error) {
                console.log('catch:', error);
                return await caches.match('https://daftplug.com/spy/');
            }
        }
    );

    workbox.routing.registerRoute(({
            event
        }) => event.request.destination === 'script',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'javascript',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
        })
    );
    workbox.routing.registerRoute(({
            event
        }) => event.request.destination === 'style',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'stylesheets',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
        })
    );
    workbox.routing.registerRoute(({
            event
        }) => event.request.destination === 'image',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
        })
    );
    workbox.routing.registerRoute(({
            event
        }) => event.request.destination === 'font',
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'fonts',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 30,
                }),
                new workbox.cacheableResponse.CacheableResponsePlugin({
                    statuses: [0, 200]
                }),
            ],
        })
    );
}