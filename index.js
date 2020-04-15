const API_URL = 'https://cfw-takehome.developers.workers.dev/api/'

addEventListener('fetch', event => {
  event.respondWith(handleRequest())
})
/**
 * Respond with random variant
 */
async function handleRequest() {

  return await fetch(API_URL + 'variants')
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      const { variants } = response
      const randomIndex = getRandomInt(2)
      const url = variants[randomIndex]
      return fetch(url)
    })

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

}
