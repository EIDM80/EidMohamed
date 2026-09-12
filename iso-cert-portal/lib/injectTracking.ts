import { SiteSettings } from './db';

let applied = false;

const injectScript = (attrs: Record<string, string>, textContent?: string): void => {
  const script = document.createElement('script');
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  if (textContent) script.textContent = textContent;
  document.head.appendChild(script);
};

// innerHTML never executes embedded <script> tags, so admin-pasted snippets
// are re-created as real DOM script elements so they actually run.
const injectHtmlSnippet = (html: string, target: HTMLElement, prepend = false): void => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const nodes = Array.from(wrapper.childNodes);
  if (prepend) nodes.reverse();
  nodes.forEach((node) => {
    let toInsert: Node = node;
    if (node.nodeName === 'SCRIPT') {
      const original = node as HTMLScriptElement;
      const clone = document.createElement('script');
      Array.from(original.attributes).forEach((attr) => clone.setAttribute(attr.name, attr.value));
      clone.textContent = original.textContent;
      toInsert = clone;
    }
    if (prepend) target.insertBefore(toInsert, target.firstChild);
    else target.appendChild(toInsert);
  });
};

// Applies admin-configured tracking/verification codes to the current page.
// Runs once per page load, for every visitor (public or signed in) — these
// codes come from the shared site_settings table, not local admin state.
export const applyTrackingSettings = (settings: SiteSettings): void => {
  if (applied) return;
  applied = true;

  if (settings.metaPixelId) {
    injectScript(
      {},
      `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${settings.metaPixelId}');
fbq('track', 'PageView');`
    );
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${settings.metaPixelId}&ev=PageView&noscript=1" />`;
    document.body.appendChild(noscript);
  }

  if (settings.gaMeasurementId) {
    injectScript({ src: `https://www.googletagmanager.com/gtag/js?id=${settings.gaMeasurementId}`, async: 'true' });
    injectScript(
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${settings.gaMeasurementId}');`
    );
  }

  if (settings.gtmContainerId) {
    injectScript(
      {},
      `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${settings.gtmContainerId}');`
    );
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.gtmContainerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  }

  if (settings.googleSiteVerification) {
    const meta = document.createElement('meta');
    meta.name = 'google-site-verification';
    meta.content = settings.googleSiteVerification;
    document.head.appendChild(meta);
  }

  if (settings.customHeadCode) injectHtmlSnippet(settings.customHeadCode, document.head);
  if (settings.customBodyCode) injectHtmlSnippet(settings.customBodyCode, document.body);
};
