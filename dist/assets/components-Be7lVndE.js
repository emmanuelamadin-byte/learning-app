var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,a)=>(a=n==null?{}:e(i(n)),s(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n)),l=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var S=Array.isArray;function C(){}var w={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function D(e,t){return E(e.type,t,e.props)}function O(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function k(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var A=/\/+/g;function j(e,t){return typeof e==`object`&&e&&e.key!=null?k(``+e.key):t.toString(36)}function M(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(C,C):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function N(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,N(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+j(e,0):a,S(o)?(i=``,c!=null&&(i=c.replace(A,`$&/`)+`/`),N(o,r,i,``,function(e){return e})):o!=null&&(O(o)&&(o=D(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(A,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(S(e))for(var u=0;u<e.length;u++)a=e[u],s=l+j(a,u),c+=N(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+j(a,u++),c+=N(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return N(M(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function P(e,t,n){if(e==null)return e;var r=[],i=0;return N(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function F(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var I=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},L={map:P,forEach:function(e,t,n){P(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return P(e,function(){t++}),t},toArray:function(e){return P(e,function(e){return e})||[]},only:function(e){if(!O(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=L,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!T.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)T.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=O,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:F}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=w.T,n={};w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(C,I)}catch(e){I(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}},e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.2.5`})),u=o(((e,t)=>{t.exports=l()})),d=c(u()),f=function(e,t,n,r){var i;t[0]=0;for(var a=1;a<t.length;a++){var o=t[a++],s=t[a]?(t[0]|=o?1:2,n[t[a++]]):t[++a];o===3?r[0]=s:o===4?r[1]=Object.assign(r[1]||{},s):o===5?(r[1]=r[1]||{})[t[++a]]=s:o===6?r[1][t[++a]]+=s+``:o?(i=e.apply(s,f(e,s,n,[``,null])),r.push(i),s[0]?t[0]|=2:(t[a-2]=0,t[a]=i)):r.push(s)}return r},p=new Map;function m(e){var t=p.get(this);return t||(t=new Map,p.set(this,t)),(t=f(this,t.get(e)||(t.set(e,t=function(e){for(var t,n,r=1,i=``,a=``,o=[0],s=function(e){r===1&&(e||(i=i.replace(/^\s*\n\s*|\s*\n\s*$/g,``)))?o.push(0,e,i):r===3&&(e||i)?(o.push(3,e,i),r=2):r===2&&i===`...`&&e?o.push(4,e,0):r===2&&i&&!e?o.push(5,0,!0,i):r>=5&&((i||!e&&r===5)&&(o.push(r,0,i,n),r=6),e&&(o.push(r,e,0,n),r=6)),i=``},c=0;c<e.length;c++){c&&(r===1&&s(),s(c));for(var l=0;l<e[c].length;l++)t=e[c][l],r===1?t===`<`?(s(),o=[o],r=3):i+=t:r===4?i===`--`&&t===`>`?(r=1,i=``):i=t+i[0]:a?t===a?a=``:i+=t:t===`"`||t===`'`?a=t:t===`>`?(s(),r=1):r&&(t===`=`?(r=5,n=i,i=``):t===`/`&&(r<5||e[c][l+1]===`>`)?(s(),r===3&&(o=o[0]),r=o,(o=o[0]).push(2,0,r),r=0):t===` `||t===`	`||t===`
`||t===`\r`?(s(),r=2):i+=t),r===3&&i===`!--`&&(r=4,o=o[0])}return s(),o}(e)),t),arguments,[])).length>1?t:t[0]}var h=m.bind(d.createElement);function g(...e){return e.filter(Boolean).join(` `)}function _(){return globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random()}`}function v(e){return e.reduce((e,t)=>e+Number(t||0),0)}function y(e){return Math.round(Number(e||0)*10)/10}function b(e){return String(e).padStart(2,`0`)}function x(e=new Date){if(e instanceof Date)return new Date(e);if(typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e)){let[t,n,r]=e.split(`-`).map(Number);return new Date(t,n-1,r)}return new Date(e)}function S(e){let t=y(e);return`${t.toFixed(t%1==0?0:1)}h`}function C(e){return new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`}).format(x(e))}function w(e){return new Intl.DateTimeFormat(void 0,{weekday:`short`,month:`short`,day:`numeric`}).format(x(e))}function T(e){return new Intl.DateTimeFormat(void 0,{month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`}).format(x(e))}function E(e){let t=x(e).getTime()-Date.now(),n=Math.round(t/6e4),r=new Intl.RelativeTimeFormat(void 0,{numeric:`auto`});if(Math.abs(n)<60)return r.format(n,`minute`);let i=Math.round(n/60);if(Math.abs(i)<24)return r.format(i,`hour`);let a=Math.round(i/24);return r.format(a,`day`)}function D(e=``){return e.split(` `).filter(Boolean).slice(0,2).map(e=>e[0]?.toUpperCase()||``).join(``)}function O(e=new Date){let t=x(e);return t.setHours(0,0,0,0),t}function k(e,t){let n=x(e);return n.setDate(n.getDate()+t),n}function A(e=new Date){if(typeof e==`string`&&/^\d{4}-\d{2}-\d{2}$/.test(e))return e;let t=O(e);return`${t.getFullYear()}-${b(t.getMonth()+1)}-${b(t.getDate())}`}function j(e,t){return[...e].sort((e,n)=>new Date(n[t]).getTime()-new Date(e[t]).getTime())}function M(e,t){return e.reduce((e,n)=>{let r=t(n);return e[r]??=[],e[r].push(n),e},{})}function N(e){return new Promise(t=>window.setTimeout(t,e))}function P(e){return new Promise((t,n)=>{let r=new FileReader;r.onload=()=>t(String(r.result)),r.onerror=n,r.readAsDataURL(e)})}function F(e){return Object.fromEntries(Object.entries(e).filter(([,e])=>e!==void 0))}function I(e=``){return e.split(``).reduce((e,t)=>e+t.charCodeAt(0),0)%360}function L({profile:e,size:t=`md`,onClick:n}){let r=t===`lg`?`h-14 w-14 text-lg`:t===`sm`?`h-10 w-10 text-sm`:`h-12 w-12 text-base`,i=I(e?.name||e?.email||`LT`);return e?.photoUrl?h`
      <button
        type="button"
        onClick=${n}
        className=${g(`overflow-hidden rounded-2xl border border-white/10 bg-white/5`,r,n&&`cursor-pointer`)}
      >
        <img
          src=${e.photoUrl}
          alt=${e.name}
          className="h-full w-full object-cover"
        />
      </button>
    `:h`
    <button
      type="button"
      onClick=${n}
      className=${g(`rounded-2xl border border-white/10 font-semibold text-white`,r,n&&`cursor-pointer`)}
      style=${{background:`linear-gradient(135deg, hsla(${i}, 80%, 58%, 0.25), hsla(${(i+46)%360}, 78%, 54%, 0.18))`}}
    >
      ${D(e?.name)}
    </button>
  `}function R({value:e,goal:t,label:n=`This week`,sublabel:r=`hours logged`,compact:i=!1}){let a=Math.min(e/Math.max(t,.1),1),o=i?44:64,s=2*Math.PI*o,c=s*(1-a),l=i?120:164;return h`
    <div className=${g(`relative grid place-items-center`,i?`h-28 w-28`:`h-44 w-44`)}>
      <svg
        viewBox=${`0 0 ${l} ${l}`}
        className="metric-ring h-full w-full -rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="metricRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8ce99a" />
            <stop offset="100%" stopColor="#6ad8ff" />
          </linearGradient>
        </defs>
        <circle
          className="metric-ring__trail"
          cx=${l/2}
          cy=${l/2}
          r=${o}
          fill="none"
          strokeWidth=${i?10:12}
        />
        <circle
          className="metric-ring__value"
          cx=${l/2}
          cy=${l/2}
          r=${o}
          fill="none"
          strokeWidth=${i?10:12}
          strokeDasharray=${s}
          strokeDashoffset=${c}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className=${g(`font-display font-bold text-white`,i?`text-2xl`:`text-4xl`)}>
            ${S(e)}
          </div>
          <div className="mt-1 text-xs uppercase tracking-[0.24em] text-white/45">${n}</div>
          <div className="mt-1 text-xs text-white/60">${t}h goal • ${r}</div>
        </div>
      </div>
    </div>
  `}function z({eyebrow:e,value:t,detail:n}){return h`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-xs uppercase tracking-[0.28em] text-white/45">${e}</div>
      <div className="brand-gradient-text mt-3 font-display text-3xl font-bold">
        ${t}
      </div>
      <div className="mt-2 text-sm text-white/65">${n}</div>
    </div>
  `}function B({bars:e}){let t=Math.max(1,...e.map(e=>e.value));return h`
    <div className="glass-panel rounded-3xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white">Weekly bar chart</div>
          <div className="text-sm text-white/50">Daily hours across the current Sunday-Saturday cycle.</div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-7 gap-3">
        ${e.map(e=>h`
            <div key=${e.day} className="flex flex-col items-center gap-3">
              <div className="flex h-40 w-full items-end justify-center rounded-2xl border border-white/6 bg-white/[0.03] p-2">
                <div
                  className=${g(`brand-bar w-full rounded-2xl transition-all duration-500`,e.isToday&&`shadow-[0_0_30px_rgba(140,233,154,0.25)]`)}
                  style=${{height:`${Math.max(10,e.value/t*100)}%`,opacity:e.value>0?1:.22}}
                  title=${`${e.label}: ${S(e.value)}`}
                ></div>
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">${e.label}</div>
                <div className="mt-1 text-sm text-white/75">${e.value?S(e.value):`0h`}</div>
              </div>
            </div>
          `)}
      </div>
    </div>
  `}function V({tracker:e}){return h`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-sm font-semibold text-white">7-day streak tracker</div>
      <div className="mt-1 text-sm text-white/50">A day counts after at least 30 minutes of learning.</div>
      <div className="mt-5 grid grid-cols-7 gap-2">
        ${e.map(e=>h`
            <div
              key=${e.day}
              className=${g(`rounded-2xl border px-2 py-4 text-center`,e.hit?`border-accent/35 bg-accent/12 text-white`:`border-white/8 bg-white/[0.03] text-white/45`)}
              title=${`${w(e.day)} • ${S(e.hours)}`}
            >
              <div className="text-xs uppercase tracking-[0.25em]">${e.label}</div>
              <div className="mt-2 text-xl">${e.hit?`•`:`○`}</div>
            </div>
          `)}
      </div>
    </div>
  `}function H({badges:e}){return h`
    <div className="glass-panel rounded-3xl p-5">
      <div className="text-sm font-semibold text-white">Badges and milestones</div>
      <div className="mt-1 text-sm text-white/50">Momentum markers for consistency, depth, and follow-through.</div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        ${e.map(e=>h`
            <div
              key=${e.id}
              className=${g(`rounded-2xl border p-4`,e.earned?`brand-soft-panel`:`border-white/8 bg-white/[0.03]`)}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/8 text-xl">
                  ${e.emoji}
                </div>
                <div>
                  <div className="font-semibold text-white">${e.label}</div>
                  <div className="text-sm text-white/55">
                    ${e.earned?`Unlocked`:`Keep going`}
                  </div>
                </div>
              </div>
            </div>
          `)}
      </div>
    </div>
  `}function U({title:e,detail:t,action:n}){return h`
    <div className="glass-panel rounded-3xl border-dashed p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/6 text-2xl">+</div>
      <h3 className="mt-5 font-display text-2xl font-semibold text-white">${e}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/58">${t}</p>
      ${n?h`<div className="mt-6 flex justify-center">${n}</div>`:null}
    </div>
  `}function W({className:e=`h-40`}){return h`<div className=${g(`skeleton rounded-3xl`,e)}></div>`}function G({toasts:e,onDismiss:t}){return h`
    <div className="fixed right-4 top-4 z-50 grid w-[min(360px,calc(100vw-32px))] gap-3">
      ${e.map(e=>h`
          <button
            key=${e.id}
            type="button"
            onClick=${()=>t(e.id)}
            className=${g(`toast-enter glass-panel rounded-2xl px-4 py-3 text-left`,e.type===`error`?`border-rose-400/25`:`border-accent/25`)}
          >
            <div className="font-semibold text-white">${e.title}</div>
            <div className="mt-1 text-sm text-white/65">${e.message}</div>
          </button>
        `)}
    </div>
  `}function K({active:e}){if(!e)return null;let t=[`#8ce99a`,`#6ad8ff`,`#ffb86c`,`#ffffff`];return h`
    <div className="confetti-layer" aria-hidden="true">
      ${Array.from({length:42},(e,n)=>{let r=Math.round(n/42*100),i=t[n%t.length];return h`
          <span
            key=${n}
            className="confetti-piece"
            style=${{left:`${r}%`,background:i,"--x-shift":`${(n%2==0?1:-1)*(40+n%5*12)}px`,"--spin":`${n%2==0?420:-420}deg`,animationDelay:`${n%10*40}ms`}}
          ></span>
        `})}
    </div>
  `}function q({announcement:e,author:t}){return e?h`
    <div className="glass-panel rounded-3xl border-accent2/20 bg-gradient-to-r from-accent2/10 to-accent/10 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-white/55">
          Announcement
        </span>
        <span className="text-sm text-white/70">
          ${e.body}
        </span>
        <span className="ml-auto text-xs text-white/45">
          ${t?.name||`Admin`} • ${E(e.createdAt)}
        </span>
      </div>
    </div>
  `:null}function J({open:e,title:t,description:n,children:r,footer:i,onClose:a}){return e?h`
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/55 p-4 backdrop-blur md:place-items-center">
      <div className="glass-panel w-full max-w-xl rounded-[2rem] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">${t}</h3>
            ${n?h`<p className="mt-2 text-sm text-white/60">${n}</p>`:null}
          </div>
          <button
            type="button"
            onClick=${a}
            className="h-12 min-w-12 rounded-2xl border border-white/10 bg-white/5 text-white/70"
          >
            ×
          </button>
        </div>
        <div className="mt-6">${r}</div>
        ${i?h`<div className="mt-6 flex justify-end gap-3">${i}</div>`:null}
      </div>
    </div>
  `:null}function Y({session:e,profile:t,reactions:n,currentUserId:r,onProfileOpen:i,onReactionToggle:a,canModerate:o,onDelete:s}){let c=[`🔥`,`👏`,`💡`].map(e=>({emoji:e,count:n.filter(t=>t.emoji===e).length,active:n.some(t=>t.emoji===e&&t.userId===r)}));return h`
    <article className="glass-panel rounded-[2rem] p-5">
      <div className="flex items-start gap-4">
        <${L} profile=${t} size="sm" onClick=${()=>i(t.id)} />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick=${()=>i(t.id)}
            className="font-semibold text-white"
          >
            ${t.name}
          </button>
          <div className="mt-1 text-sm text-white/45">
            ${E(e.loggedAt)} • ${S(e.hours)}
          </div>
        </div>
        ${e.syncStatus===`queued`?h`
              <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-100">
                Offline queued
              </span>
            `:null}
      </div>

      <div className="mt-5 rounded-3xl border border-white/8 bg-white/[0.03] p-5">
        <div className="text-lg font-semibold text-white">${e.learned}</div>
        ${e.challenges?h`<p className="mt-3 text-sm leading-6 text-white/62">${e.challenges}</p>`:null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        ${c.map(t=>h`
            <button
              key=${t.emoji}
              type="button"
              onClick=${()=>a(e.id,t.emoji)}
              className=${g(`min-h-12 rounded-2xl border px-4 text-sm transition`,t.active?`brand-soft-panel text-white`:`border-white/8 bg-white/[0.03] text-white/65 hover:bg-white/[0.05]`)}
            >
              ${t.emoji} ${t.count||``}
            </button>
          `)}
        ${o?h`
              <button
                type="button"
                onClick=${()=>s(e.id)}
                className="ml-auto min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm text-rose-100"
              >
                Delete post
              </button>
            `:null}
      </div>
    </article>
  `}function X({leaders:e,onProfileOpen:t}){let n=[e[1],e[0],e[2]].filter(Boolean),r=[`h-40`,`h-52`,`h-32`];return h`
    <div className="grid gap-4 md:grid-cols-3 md:items-end">
      ${n.map((e,n)=>h`
          <button
            key=${e.id}
            type="button"
            onClick=${()=>t(e.id)}
            className=${g(`glass-panel rounded-[2rem] p-5 text-left transition hover:-translate-y-1`,r[n])}
          >
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/50">
                #${e.rank}
              </span>
              <span className="text-xl">${e.rank===1?`🏆`:e.rank===2?`🥈`:`🥉`}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <${L} profile=${e} size="sm" />
              <div>
                <div className="font-semibold text-white">${e.name}</div>
                <div className="text-sm text-white/50">${e.metrics.level}</div>
              </div>
            </div>
            <div className="mt-5 font-display text-3xl font-bold text-white">${e.displayValue}</div>
            <div className="mt-2 text-sm text-white/55">${e.detail}</div>
          </button>
        `)}
    </div>
  `}function Z({sessions:e,profileLookup:t,editable:n,onEdit:r,onDelete:i,emptyState:a}){return e.length?h`
    <div className="grid gap-3">
      ${e.map(e=>{let a=t[e.userId];return h`
          <article key=${e.id} className="glass-panel rounded-3xl p-5">
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3">
                ${a?h`<${L} profile=${a} size="sm" />`:null}
                <div>
                  <div className="font-semibold text-white">${a?.name||`You`}</div>
                  <div className="text-sm text-white/45">
                    ${T(e.loggedAt)} • Counts toward ${w(e.sessionDay)}
                  </div>
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="font-display text-2xl font-bold text-white">${S(e.hours)}</div>
                ${e.syncStatus===`queued`?h`<div className="text-xs text-amber-100/85">Queued for sync</div>`:null}
              </div>
            </div>
            <div className="mt-4 text-base font-semibold text-white">${e.learned}</div>
            ${e.challenges?h`<p className="mt-2 text-sm leading-6 text-white/60">${e.challenges}</p>`:null}
            ${n?h`
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick=${()=>r(e)}
                      className="min-h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70"
                    >
                      Edit session
                    </button>
                    <button
                      type="button"
                      onClick=${()=>i(e)}
                      className="min-h-12 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 text-sm text-rose-100"
                    >
                      Delete session
                    </button>
                  </div>
                `:null}
          </article>
        `})}
    </div>
  `:a}export{_ as A,A as C,O as D,y as E,u as M,o as N,F as O,c as P,M as S,P as T,j as _,U as a,S as b,z as c,Z as d,W as f,k as g,B as h,K as i,h as j,v as k,J as l,G as m,L as n,Y as o,V as p,H as r,X as s,q as t,R as u,g as v,x as w,C as x,N as y};