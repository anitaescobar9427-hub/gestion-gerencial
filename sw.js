const CACHE='gm-v9';
const URLS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('supabase.co')||e.request.url.includes('cdn.jsdelivr.net')){
    // Llamadas a Supabase / CDN: no interceptar. Se dejan pasar directo a la red
    // tal cual, sin caché de respaldo (nunca hay una copia en caché de estas
    // respuestas, así que intentar usarla causaba el error "Returned response is null").
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(cached=>cached||new Response('',{status:503,statusText:'Sin conexión'}))))
});
