const API_URL = 'https://cfw-takehome.developers.workers.dev/api/'

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

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
      const url = variants[variant - 1]
      return fetch(url)
    })
    .then(function (content) {
      const rewriter = variant - 1 ? rewriteVariation1() : rewriteVariation2()
      return rewriter.transform(content).text()
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

class ElementHandler {
  constructor(string) {
    this.string = string
  }
  element(element) {
    element.setInnerContent(this.string);
  }
}

function rewriteVariation1() {
  class UrlHandler {
    element(element) {
      element.setInnerContent('Check out his website');
      element.setAttribute('href', 'https://ianmah.com/');
    }
  }
  return new HTMLRewriter()
    .on('title', new ElementHandler('Please Hire'))
    .on('h1#title', new ElementHandler('To Whom It May Concern'))
    .on('p#description', new ElementHandler('Please hire Ian Mah.'))
    .on('a#url', new UrlHandler())
}

function rewriteVariation2() {
  class UrlHandler {
    element(element) {
      element.setInnerContent('Click this CTA');
      element.setAttribute('href', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
  }
  return new HTMLRewriter()
    .on('title', new ElementHandler('Please Hire'))
    .on('h1#title', new ElementHandler('Yo yo yo'))
    .on('p#description', new ElementHandler('Please hire Ian Mah!'))
    .on('a#url', new UrlHandler())
}

function getVariantIndex() {
  return (Math.random() < 0.5) ? 1 : 2
}

function getCookie(cookieString, name) {
  var match = cookieString.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
}