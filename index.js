const API_URL = 'https://cfw-takehome.developers.workers.dev/api/'

addEventListener('fetch', event => {
  event.respondWith(handleRequest())
})

class TitleHandler {
  element(element) {
    element.setInnerContent('Please Hire Ian Mah');
  }
}

class HeaderHandler {
  element(element) {
    element.setInnerContent('To Whom It May Concern');
  }
}

class DescriptionHandler {
  element(element) {
    element.setInnerContent('Please hire Ian Mah.');
  }
}

class UrlHandler {
  element(element) {
    element.setInnerContent('Check out his website');
    element.setAttribute('href', 'https://ianmah.com/');
  }
}

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
    .then(function (data) {
      return new HTMLRewriter()
        .on('title', new TitleHandler())
        .on('h1#title', new HeaderHandler())
        .on('p#description', new DescriptionHandler())
        .on('a#url', new UrlHandler())
        .transform(data)
    })

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

}
