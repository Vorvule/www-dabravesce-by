// change static cache name after the app changed
const staticCacheName = 'dabravesce-sw-v2'
const dynamicCacheName = 'dabravesce-sw-d-v2'

const assetsToCache = [
    '.', // or 'index.html' | ?i=0-0-0-0
    'scripts/app.js',
    'styles/main.css',
    'tomes/contact-data.js',
    'tomes/new-testament-searchable.js',
    'tomes/new-testament.js',
    'tomes/prayer-book.js',
    'tomes/songs.js'
]

self.addEventListener('install', async () => {
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetsToCache)
})

// uncomment when app changed
// self.addEventListener('activate', async event => {
    // const cacheNames = await caches.keys()
    // // delete all SW cached versions except for the current one
    // await Promise.all(
        // cacheNames
            // .filter(name => name !== staticCacheName)
            // .filter(name => name !== dynamicCacheName)
            // .map(name => caches.delete(name))
    // )
// })

self.addEventListener('fetch', event => {
    const { request } = event
    event.respondWith(cacheFirst(request))
    
    // console.log(event.request.url)
    // const { request } = event
    // const url = new URL(request.url)

    // if (url.origin === location.origin) {
    //     event.respondWith(cacheFirst(request))
    // } else {
    //     event.respondWith(networkFirst(request))
    // }
})

async function cacheFirst(request) {
    const cachedResponse = await caches.match(request).response // .response
    return cachedResponse ?? await fetch(request) // fetch if chached nothing
}

// async function networkFirst(request) {
    // const cache = await caches.open(dynamicCacheName)
    // try {
        // const response = await fetch(request)
        // await cache.put(request, response.clone())
        // return response
    // } catch (e) {
        // const cached = await cache.match(request)
        // return cached ?? caches.match('offline.html')
        // // ?? when there is no network and cache is empty
        // // offline.html is a file to create
    // }
// }