const API_URL = 'https://cfw-takehome.developers.workers.dev/api/'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

class ElementHandler {
  constructor(string) {
    this.string = string
  }
  element(element) {
    element.setInnerContent(this.string);
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
async function handleRequest(event) {

  let variant, cookieValue

  const cookieString = event.request.headers.get('Cookie')
  if (cookieString) {
    cookieValue = getCookie(cookieString, 'variant')
  }

  return await fetch(API_URL + 'variants')
    .then(function (response) {
      return response.json()
    })
    .then(function (response) {
      const { variants } = response
      variant = cookieValue ? cookieValue : getVariantIndex()
      const url = variants[variant]
      return fetch(url)
    })
    .then(function (content) {
      const variation = variant
        ? new HTMLRewriter()
          .on('title', new ElementHandler('Please Hire'))
          .on('h1#title', new ElementHandler('To Whom It May Concern'))
          .on('p#description', new ElementHandler('Please hire Ian Mah.'))
          .on('a#url', new UrlHandler())
        : new HTMLRewriter()
          .on('title', new ElementHandler('Please Hire'))
          .on('h1#title', new ElementHandler('Dear Hiring Staff'))
          .on('p#description', new ElementHandler('Please hire Ian Mah.'))
          .on('a#url', new UrlHandler())
      return variation.transform(content).text()
    })
    .then(function (html) {
      return new Response(html, {
        headers: {
          'content-type': 'text/html',
          'Set-Cookie': `variant=${variant}`
        }
      });
    })

}

function getVariantIndex() {
  return (Math.random() < 0.5) ? 0 : 1
}

function getCookie(cookieString, name) {
  var match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}