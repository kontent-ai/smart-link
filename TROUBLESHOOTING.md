# Troubleshooting

- [Preview website doesn't load inside Web Spotlight preview iframe](#preview-website-doesnt-load-inside-web-spotlight-preview-iframe)
- [SDK doesn't work as expected inside embedded iframe on the preview website](#sdk-doesnt-work-as-expected-inside-embedded-iframe-on-the-preview-website)

## Preview website doesn't load inside Web Spotlight preview iframe

Depending on the server's settings, it might be necessary to use the appropriate `Content-Security-Policy` header
to make Web Spotlight work flawlessly, in this particular case, `Content-Security-Policy: frame-ancestors https://app.kontent.ai`.

:warning: We used to recommend using the `X-Frame-Options` header, but the `Content-Security-Policy` HTTP header has
a `frame-ancestors` directive which obsoletes this header for supporting browsers.

For more details, see the [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/frame-ancestors).

## SDK doesn't work as expected inside embedded iframe on the preview website

You may want to initialize Smart Link SDK inside an embedded iframe on your preview page, for example, to simulate
different screen resolutions or to be able to switch preview domains. However, many of the SDK features work only when 
the SDK is initialized directly inside the Web Spotlight preview iframe because it has to receive an iframe message 
from Web Spotlight to enable those features. That is why the SDK initialized inside embedded iframe won't support several
features:

- add buttons won't be available;
- edit buttons for content items and content components won't be available;
- custom refresh handler won't work;
- Kontent item editor will be opened instead of the in-context editor.

A possible workaround to this approach would be for your preview website to act as a middleware for exchanging messages
between Kontent and the SDK iframe.

Because the SDK validates the origin of iframe messages, the SDK's direct parent in this setup is the middleware page
rather than Web Spotlight. Set the [`webSpotlightOrigin`](README.md#configuration) option on the SDK (inside the inner
iframe) to the origin of the middleware page:

```js
KontentSmartLink.initialize({ webSpotlightOrigin: 'https://your-middleware-origin.example.com' });
```

The middleware then relays messages between Web Spotlight and the inner iframe. Validate the origin and source of every
message and pin the target origin when forwarding, never `'*'` — otherwise a malicious page framing your middleware
could read Web Spotlight data or inject messages into the SDK.

```js
const WEB_SPOTLIGHT_ORIGIN = 'https://app.kontent.ai';
const INNER_IFRAME_ORIGIN = 'https://your-inner-iframe-origin.example.com';

window.addEventListener('message', onMessage);

function onMessage(event) {
  const eventTypeRegex = /^kontent-smart-link:/;

  // ignore message if it is not related to the SDK
  if (!event.data || !event.data.type || !eventTypeRegex.test(event.data.type)) {
    return;
  }

  const message = event.data;

  // The iframe variable has a reference to the iframe element.
  // You don't have to use document.querySelector here, for example,
  // in React you can use `useRef` hook to save the reference and then
  // use it here, in Vue you can use `$refs`, etc.
  const iframe = document.querySelector('#your-inner-iframe-id');

  const isFromInnerIframe =
    event.source === iframe.contentWindow && event.origin === INNER_IFRAME_ORIGIN;
  const isFromWebSpotlight =
    event.source === window.parent && event.origin === WEB_SPOTLIGHT_ORIGIN;

  if (isFromInnerIframe) {
    // inner iframe -> Web Spotlight
    window.parent.postMessage(message, WEB_SPOTLIGHT_ORIGIN);
  } else if (isFromWebSpotlight) {
    // Web Spotlight -> inner iframe
    iframe.contentWindow.postMessage(message, INNER_IFRAME_ORIGIN);
  }
}
```
