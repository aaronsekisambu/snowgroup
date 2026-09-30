// A lightweight sanitiser using DOMPurify.
// DOMPurify works in the browser and in Node via jsdom. We initialise
// a singleton instance depending on the environment.

import createDOMPurify from 'dompurify'
import type { Config } from 'dompurify'

// DOMPurify may run both in browser and on the server.  The server
// version requires a fake `window` provided by `jsdom`, but we must
// avoid importing `jsdom` at the top level because it drags in Node
// builtins (net/http/etc.) that cannot be resolved in the client
// bundle.  Instead we lazily require it only when executing in a
// Node environment.

// use the return type of createDOMPurify to keep types in sync with
// the library; the DOMPurify exported namespace sometimes conflicts
// with the actual constructor type.
let purify: ReturnType<typeof createDOMPurify>

if (typeof window !== 'undefined') {
  // client side – use the real browser window
  purify = createDOMPurify(window)
} else {
  // server side – require jsdom dynamically so the bundler ignores it
  // when building for the browser.  This code will only run during
  // SSR/Node execution.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { JSDOM } = require('jsdom')
  const { window } = new JSDOM('')
  purify = createDOMPurify(window as unknown as Parameters<typeof createDOMPurify>[0])
}

const PURIFY_CONFIG: Config = {
  ALLOWED_TAGS: [
    'span', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'u', 'i', 'a',
    'cite', 'p', 'b', 'small', 'mark',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'img', 'pre', 'code', 'hr',
  ],
  ALLOWED_ATTR: ['href', 'class', 'target', 'rel', 'src', 'alt', 'width', 'height'],
  RETURN_TRUSTED_TYPE: false,
}

export const sanitizeHTML = (input: unknown): string => {
  if (input == null || input === '') return ''
  // the typings in DOMPurify allow TrustedHTML when RETURN_TRUSTED_TYPE
  // is enabled; we always disable that flag above so this is safe.  Cast
  // via unknown to convince the checker.
  return purify.sanitize(String(input), PURIFY_CONFIG) as unknown as string
}

export default sanitizeHTML;
