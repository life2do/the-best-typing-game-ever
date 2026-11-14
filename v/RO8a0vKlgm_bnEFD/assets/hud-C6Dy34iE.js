(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=e=>e/2**32|0,t=e=>e>>>0;function n(n,r,i,a){let o=e(i),s=t(i);n.setUint32(r,a?s:o,a),n.setUint32(r+4,a?o:s,a)}function r(e){return e instanceof Uint8Array||ArrayBuffer.isView(e)&&e.constructor.name===`Uint8Array`&&`BYTES_PER_ELEMENT`in e&&e.BYTES_PER_ELEMENT===1}var i=e=>e?`"${e}" `:``;function a(e,t=``){if(typeof e!=`number`)throw TypeError(i(t)+`expected number, got `+typeof e);if(!Number.isSafeInteger(e)||e<0)throw RangeError(i(t)+`expected integer >= 0, got `+e);return e}function o(e,t,n=``){if(r(e)&&(t===void 0||e.length===t))return e;t!==void 0&&a(t,`length`);let o=r(e),s=t===void 0?``:` of length ${t}`,c=o?`length=${e.length}`:`type=${typeof e}`,l=i(n)+`expected Uint8Array`+s+`, got `+c;throw o?RangeError(l):TypeError(l)}var s=(e,t)=>{if(typeof e!=`object`||!e||Array.isArray(e))throw TypeError((t===`object`?``:`"${t}" `)+`expected object, got type=`+typeof e)},c=(e,t)=>{s(e,t);let n=Object.getPrototypeOf(e);if(n!==Object.prototype&&n!==null)throw TypeError(`"${t}" expected plain object`);if(Object.hasOwn(e,`__proto__`))throw TypeError(`"${t}.__proto__" is not allowed`)};function l(e,t=!0){if(e.destroyed)throw Error(`hash was destroyed`);if(t&&e.finished)throw Error(`digest() was already called`)}function u(e,t){o(e,void 0,`output`);let n=t.outputLen;if(!(e.length>=n))throw RangeError(`"output" expected length >= `+n)}function d(...e){for(let t=0;t<e.length;t++)e[t].fill(0)}function f(e){return new DataView(e.buffer,e.byteOffset,e.byteLength)}function p(e,t){return e<<32-t|e>>>t}function m(e,t,n=`opts`){return c(e,`defaults`),t!==void 0&&c(t,n),Object.assign(Object.create(null),e,t)}function h(e,t={}){if(typeof e!=`function`)throw TypeError(`"hashCons" expected function, got type=`+typeof e);t=m({},t,`info`);let n=(t,n)=>e(n).update(t).digest(),r=e(void 0);return n.outputLen=r.outputLen,n.blockLen=r.blockLen,n.canXOF=r.canXOF,n.create=t=>e(t),Object.assign(n,t),Object.freeze(n)}var g=e=>({oid:Uint8Array.from([6,9,96,134,72,1,101,3,4,2,e])});function _(e,t,n){return e&t^~e&n}function v(e,t,n){return e&t^e&n^t&n}var y=class{blockLen;outputLen;canXOF=!1;padOffset;isLE;buffer;view;finished=!1;length=0;pos=0;destroyed=!1;constructor(e,t,n,r){this.blockLen=e,this.outputLen=t,this.padOffset=n,this.isLE=r,this.buffer=new Uint8Array(e),this.view=f(this.buffer)}update(e){l(this),o(e);let{view:t,buffer:n,blockLen:r}=this,i=e.length,a=!1;for(let o=0;o<i;){let s=Math.min(r-this.pos,i-o);if(s===r){let t=f(e);for(;r<=i-o;o+=r)this.process(t,o);a=!0}else n.set(o===0&&s===i?e:e.subarray(o,o+s),this.pos),this.pos+=s,o+=s,this.pos===r&&(this.process(t,0),this.pos=0,a=!0)}return this.length+=e.length,a&&this.roundClean(),this}digestInto(e){l(this),u(e,this),this.finished=!0;let{buffer:t,view:r,blockLen:i,isLE:a}=this,{pos:o}=this;t[o++]=128,t.fill(0,o),this.padOffset>i-o&&(this.process(r,0),t.fill(0)),n(r,i-8,this.length*8,a),this.process(r,0),this.roundClean();let s=e===t?r:f(e),c=this.outputLen,d=c/4,p=this.get();if(c%4||d>p.length)throw Error(`invalid outputLen`);for(let e=0;e<d;e++)s.setUint32(4*e,p[e],a)}digest(){let{buffer:e,outputLen:t}=this;this.digestInto(e);let n=e.slice(0,t);return this.destroy(),n}_cloneIntoMeta(e){let{buffer:t,length:n,finished:r,destroyed:i,pos:a}=this;return e.destroyed=i,e.finished=r,e.length=n,e.pos=a,a&&e.buffer.set(t),e}clone(){return this._cloneInto()}},b=Uint32Array.from([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),x=Uint32Array.from([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),S=new Uint32Array(64),C=class extends y{A=0;B=0;C=0;D=0;E=0;F=0;G=0;H=0;constructor(e,t){super(64,e,8,!1),this.A=t[0]|0,this.B=t[1]|0,this.C=t[2]|0,this.D=t[3]|0,this.E=t[4]|0,this.F=t[5]|0,this.G=t[6]|0,this.H=t[7]|0}get(){let{A:e,B:t,C:n,D:r,E:i,F:a,G:o,H:s}=this;return[e,t,n,r,i,a,o,s]}set(e,t,n,r,i,a,o,s){this.A=e|0,this.B=t|0,this.C=n|0,this.D=r|0,this.E=i|0,this.F=a|0,this.G=o|0,this.H=s|0}_cloneInto(e){return(e||=new this.constructor).set(...this.get()),this._cloneIntoMeta(e)}process(e,t){for(let n=0;n<16;n++,t+=4)S[n]=e.getUint32(t,!1);for(let e=16;e<64;e++){let t=S[e-15],n=S[e-2],r=p(t,7)^p(t,18)^t>>>3,i=p(n,17)^p(n,19)^n>>>10;S[e]=i+S[e-7]+r+S[e-16]|0}let{A:n,B:r,C:i,D:a,E:o,F:s,G:c,H:l}=this;for(let e=0;e<64;e++){let t=p(o,6)^p(o,11)^p(o,25),u=l+t+_(o,s,c)+x[e]+S[e]|0,d=(p(n,2)^p(n,13)^p(n,22))+v(n,r,i)|0;l=c,c=s,s=o,o=a+u|0,a=i,i=r,r=n,n=u+d|0}n=n+this.A|0,r=r+this.B|0,i=i+this.C|0,a=a+this.D|0,o=o+this.E|0,s=s+this.F|0,c=c+this.G|0,l=l+this.H|0,this.set(n,r,i,a,o,s,c,l)}roundClean(){d(S)}destroy(){this.destroyed=!0,this.set(0,0,0,0,0,0,0,0),d(this.buffer)}},w=class extends C{constructor(){super(32,b)}},T=h(()=>new w,g(1)),E=class extends Error{};function D(e,t={}){let n=[];return O(e,t,n,`$`),n.join(``)}function O(e,t,n,r){if(e===null)n.push(`null`);else switch(typeof e){case`boolean`:n.push(e?`true`:`false`);return;case`number`:if(!Number.isFinite(e))throw new E(`${r}: non-finite number`);if(Object.is(e,-0))throw new E(`${r}: -0 is not allowed`);if(t.integersOnly&&!Number.isSafeInteger(e))throw new E(`${r}: non-integer ${e} in integer-only data`);n.push(JSON.stringify(e));return;case`string`:if(e!==e.normalize(`NFC`))throw new E(`${r}: string is not Unicode NFC`);n.push(JSON.stringify(e));return;case`object`:{if(Array.isArray(e)){n.push(`[`);for(let i=0;i<e.length;i++){if(!(i in e))throw new E(`${r}[${i}]: sparse array`);i&&n.push(`,`),O(e[i],t,n,`${r}[${i}]`)}n.push(`]`);return}let i=Object.getPrototypeOf(e);if(i!==Object.prototype&&i!==null)throw new E(`${r}: not a plain object`);let a=Object.keys(e).sort();n.push(`{`);let o=!0;for(let i of a){let a=e[i];if(a===void 0)throw new E(`${r}.${i}: undefined`);if(i!==i.normalize(`NFC`))throw new E(`${r}: key ${i} is not NFC`);o||n.push(`,`),o=!1,n.push(JSON.stringify(i),`:`),O(a,t,n,`${r}.${i}`)}n.push(`}`);return}default:throw new E(`${r}: unsupported type ${typeof e}`)}}var k=new TextEncoder,A=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`;function j(e){let t=``,n=0;for(;n+2<e.length;n+=3){let r=e[n]<<16|e[n+1]<<8|e[n+2];t+=A[r>>18&63]+A[r>>12&63]+A[r>>6&63]+A[r&63]}let r=e.length-n;if(r===1){let r=e[n]<<16;t+=A[r>>18&63]+A[r>>12&63]}else if(r===2){let r=e[n]<<16|e[n+1]<<8;t+=A[r>>18&63]+A[r>>12&63]+A[r>>6&63]}return t}function ee(e){let t=[],n=0,r=0;for(let i of e){let e=A.indexOf(i);if(e<0)throw Error(`Not base64url: ${JSON.stringify(i)}`);n=n<<6|e,r+=6,r>=8&&(r-=8,t.push(n>>r&255))}return Uint8Array.from(t)}function M(e){return T(typeof e==`string`?k.encode(e):e)}function te(e){return`sha256-${j(M(e))}`}function ne(e,t){return te(D(e,t))}function re(e){return ne(e,{integersOnly:!0})}function ie(e,t){return ne({prev:e,snap:t})}function ae(e){let t=M(e),n=[0,0,0,0];for(let e=0;e<4;e++)n[e]=(t[e*4]<<24|t[e*4+1]<<16|t[e*4+2]<<8|t[e*4+3])>>>0;(n[0]|n[1]|n[2]|n[3])===0&&(n[3]=1);let r=new oe(n);for(let e=0;e<12;e++)r.u32();return n}var oe=class e{s;constructor(e){this.s=e}static fromSeed(t){return new e(ae(t))}u32(){let e=this.s,t=(e[0]+e[1]>>>0)+e[3]>>>0;return e[3]=e[3]+1>>>0,e[0]=(e[1]^e[1]>>>9)>>>0,e[1]=e[2]+(e[2]<<3)>>>0,e[2]=(e[2]<<21|e[2]>>>11)>>>0,e[2]=e[2]+t>>>0,t}int(e){if(!Number.isSafeInteger(e)||e<=0||e>4294967296)throw Error(`rng.int: bad bound ${e}`);let t=4294967296-4294967296%e,n;do n=this.u32();while(n>=t);return n%e}range(e,t){return e+this.int(t-e+1)}chance(e){return this.int(1e3)<e}pick(e){return e[this.int(e.length)]}weighted(e,t){let n=0;for(let e of t)n+=e;let r=this.int(n);for(let n=0;n<e.length;n++)if(r-=t[n],r<0)return e[n];return e[e.length-1]}shuffle(e){for(let t=e.length-1;t>0;t--){let n=this.int(t+1);[e[t],e[n]]=[e[n],e[t]]}return e}},se=65536;function N(e,t){if(t===0)throw Error(`floorDiv by zero`);let n=(e-ce(e,t))/t;return n===0?0:n}function ce(e,t){let n=e%t,r=n!==0&&n<0!=t<0?n+t:n;return r===0?0:r}function P(e,t,n){return e<t?t:e>n?n:e}function le(e){return e<0?-e:e}function ue(e){if(e.length===0)return 0;let t=e.slice().sort((e,t)=>e-t);return t[N(t.length-1,2)]}var de=2e3;function fe(e){return Math.max(de,3*N(12e6,Math.max(1,e)))}function pe(){return{recent:[],rhythm:[],lastKeyT:-1,lastCorrectT:-1}}function me(){return{correct:0,errors:0,activeMs:0,lastKeyT:-1,steadySamples:[],missed:0,posHadError:0}}function he(e){if(e.length<4)return 500;let t=ue(e);if(t<=0)return 0;let n=0;for(let r of e)n+=le(r-t);return P(1e3-N(1e3*N(n,e.length),t),0,1e3)}function ge(e,t,n,r,i){e.recent.push(+!!r),e.recent.length>30&&e.recent.shift(),t.lastKeyT>=0&&(t.activeMs+=Math.min(n-t.lastKeyT,i)),t.lastKeyT=n,e.lastKeyT=n,r?(t.correct++,e.lastCorrectT>=0&&(e.rhythm.push(Math.min(n-e.lastCorrectT,i)),e.rhythm.length>12&&e.rhythm.shift()),e.lastCorrectT=n,t.steadySamples.push(he(e.rhythm)),t.posHadError&&t.missed++,t.posHadError=0):(t.errors++,t.posHadError=1)}function _e(e,t){return t<=0?0:N(e*12e3*1e3,t)}function ve(e,t){let n=e+t;return n===0?1e3:N(e*1e3,n)}function ye(e){if(e.recent.length===0)return 1e3;let t=0;for(let n of e.recent)t+=n;return N(t*1e3,e.recent.length)}function be(e,t){for(let n of e)if(!t.includes(n))return!1;return!0}function xe(e,t,n){let r=e.toLowerCase();if(t.includes(r))return!0;for(let e of n)if(r.includes(e))return!0;return!1}function Se(e,t){let n=t.letters.filter(e=>e!==` `),r=(t.groupChars??[]).filter(e=>n.includes(e)),i=r.length?n.filter(e=>!r.includes(e)):n,a=t.newKeys.filter(e=>r.includes(e)),o=r.filter(e=>!a.includes(e)),s=Math.max(1,t.stageCount-1),c=400-N(250*Math.min(t.stageIndex,s),s),l=t.words.filter(e=>!xe(e,t.blockWords,t.blockSubstrings)),u=l.length>=3?Math.min(700,200+l.length*20):0,d=i.map(e=>t.weakKeys.includes(e)?2:1),f=t.newKeys.filter(e=>e!==` `&&i.includes(e)),p=[],m=[],h=0,g=t.specials.length===0||!e.chance(700),_=0;for(;h<t.length&&_++<1e4;){let n,s=``;if(!g&&h>=N(t.length,3)){let r=e.pick(t.specials);n=r.word,s=r.ability,g=!0}else if(u&&e.chance(u))n=e.pick(l);else{let r=e.range(2,i.length>=4?5:4);n=``;for(let t=0;t<r;t++)n+=f.length&&e.chance(c)?e.pick(f):e.weighted(i,d);if(xe(n,t.blockWords,t.blockSubstrings))continue}let _=r.length&&!s?Te(e,n,a,o,r,c):[n];for(let e of _){let t=h+ +!!p.length;p.push(e),h=t+e.length,s&&m.push({start:t,end:h,word:e,ability:s})}}return{text:p.join(` `),spans:m}}var Ce=[`.`,`,`,`?`,`!`,`:`,`;`,`…`],F=[`'`,`"`,`«`,`»`],we=[`-`,`/`,`=`,`+`,`_`,`*`,`&`,`%`,`@`,`#`];function Te(e,t,n,r,i,a){let o=``;if(n.length&&e.chance(a)?o=e.pick(n):r.length&&e.chance(150)&&(o=e.pick(r)),!o)return[t];if(/\p{Lu}/u.test(o)){let e=t[0].toUpperCase();return[i.includes(e)&&e!==t[0]?e+t.slice(1):o+t.slice(1)]}if(/\p{Nd}/u.test(o)){let t=i.filter(e=>/\p{Nd}/u.test(e)),n=o;for(let r=e.int(3);r>0;r--)n+=e.pick(t);return[n]}if(Ce.includes(o))return[t+o];if(F.includes(o))return[o+t+o];if(o===`(`||o===`)`)return[i.includes(`(`)&&i.includes(`)`)?`(${t})`:o===`(`?o+t:t+o];if(we.includes(o)){let e=N(t.length,2);return[e>0?t.slice(0,e)+o+t.slice(e):t+o]}return[t,o]}var Ee=[5,10,18,28,40,60,75],I=[850,880,900,920,950,960,970],De=7e4;function L(e){return Ee[P(e,1,7)-1]*1e3}function R(e){return I[P(e,1,7)-1]}function Oe(e,t,n){let r=P(500+N(500*t,12),500,1e3),i=n?900:1e3;return N(L(e)*r*i,1e6)}function ke(e,t,n){return e.accP<R(n)||e.wpmP<t?0:e.wpmP>=N(t*14,10)&&e.steadyP>=700?3:e.wpmP>=N(t*12,10)?2:1}var Ae=e=>N(e*3,50),je=e=>N(e*3,50),Me=/^(Shift|Control|Alt|Meta|CapsLock|Fn|F\d+|Escape|OS|ContextMenu)/,Ne=class{setup;template;state;snapshots=[];events=[];listeners=[];fastForward;keepStates;targetWpmP;capMs;constructor(e,t,n={},r){this.setup=e,this.template=t,this.fastForward=n.fastForward??!0,this.keepStates=n.keepStates??!1;let i=e.newKeys.some(t=>{let n=e.language.codeOf[t];return n?e.language.layout[n].row!==`home`&&e.language.layout[n].row!==`space`:!1});if(this.targetWpmP=Oe(e.tier,e.letters.length,i),this.capMs=fe(this.targetWpmP),r){this.state=r;return}let a=`${e.seed}:level:${e.levelIndex}`;this.state={frame:0,simT:0,pausedMs:0,pauseAt:-1,phase:`intro`,introF:-1,introJ:-1,rng:{text:ae(`${a}:text`),drops:ae(`${a}:drops`),tpl:ae(`${a}:tpl`)},stage:0,attempt:0,prompt:{text:``,pos:0,spans:[],chunks:[],chunkAbilities:[],nextChunk:0},targets:[],lockedTarget:-1,nextTargetId:1,win:pe(),sm:me(),levelStartFrame:0,stageStartFrame:0,results:[],bestStars:0,motion:{v:0,speedMul:1e3},correctTotal:0,errorTotal:0,accStreak:0,rhythmStreak:0,ticksSinceDrop:0,fogUntil:0,stumbleUntil:0,slowUntil:0,revealUntil:0,shieldCharges:0,shieldUntil:0,spanStartT:-1,collected:[...e.collected],perKey:{},lastKeyFrame:0,tpl:null},this.state.tpl=t.init(this.ctx()),this.newStageText(),this.snapshot(`start`)}on(e){this.listeners.push(e)}feed(e){let t=this.state;t.phase!==`done`&&(e.k===`pause`?t.pauseAt<0&&(this.advanceTo(e.t),t.pauseAt=e.t):e.k===`resume`?t.pauseAt>=0&&(t.pausedMs+=e.t-t.pauseAt,t.pauseAt=-1):t.pauseAt>=0||(this.advanceTo(e.t),t.simT=e.t-t.pausedMs,e.k!==`end`&&this.handleKey(e)))}advanceTo(e){let t=this.state;if(t.pauseAt>=0||t.phase===`done`)return;let n=e-t.pausedMs;if(n<t.simT)throw Error(`time went backwards: ${n} < ${t.simT}`);let r=Ae(n);if(!(r<t.frame))for(;t.frame<r;)if(this.fastForward&&this.atRest()){let e=(N(t.frame,600)+1)*600;e>r&&(e=r),t.frame=e,t.frame%600==0&&this.snapshot(`periodic`)}else this.closeFrame(),t.frame++,t.frame%600==0&&this.snapshot(`periodic`)}closeFrame(){let e=this.state,t=e.motion;t.v-=N(t.v*15,128),t.v<64&&(t.v=0),(e.phase===`play`||e.phase===`crossroads`)&&this.template.step(e.tpl,this.ctx())}atRest(){let e=this.state;return e.motion.v===0&&this.template.isAtRest(e.tpl)}handleKey(e){let t=this.state;if(Me.test(e.code))return;if(t.phase===`intro`)return this.handleIntro(e);if(t.phase===`crossroads`){e.code===`KeyF`?this.chooseMore():e.code===`KeyJ`&&this.chooseAdvance();return}let n=this.setup.language.layout[e.code],r=n?e.shift?n.shift??n.char:n.char:`[${e.code}]`,i=this.expectedChars(),a=i.includes(r);this.judged(e.t,r,a,i[0]??``)}handleIntro(e){let t=this.state;if(e.code===`KeyF`)t.introF=e.t;else if(e.code===`KeyJ`)t.introJ=e.t;else return;t.introF>=0&&t.introJ>=0&&Math.abs(t.introF-t.introJ)<=500&&(t.phase=`play`,t.levelStartFrame=t.frame,t.stageStartFrame=t.frame,this.emit({type:`start`,frame:t.frame}))}suggestedTargetId(){let e=this.state;if(e.lockedTarget>=0)return e.lockedTarget;let t=this.expectedChars()[0];return e.targets.find(e=>e.text[0]===t)?.id??-1}expectedChars(){let e=this.state;if(this.setup.inputMode===`dictated`){let t=e.prompt.text[e.prompt.pos];return t===void 0?[]:[t]}if(e.lockedTarget>=0){let t=e.targets.find(t=>t.id===e.lockedTarget);if(t)return[t.text[t.progress]]}let t=[];for(let n of e.targets)t.includes(n.text[0])||t.push(n.text[0]);return t}judged(e,t,n,r){let i=this.state,a=i.frame,o=i.win.lastKeyT>=0?Math.min(e-i.win.lastKeyT,this.capMs):0;ge(i.win,i.sm,e,n,this.capMs);let s=i.perKey[r]??=[0,0,0];if(i.lastKeyFrame=a,n){s[0]++,s[2]+=o,i.correctTotal++,i.accStreak++;let n=he(i.win.rhythm);i.rhythmStreak=n>=800?i.rhythmStreak+1:0,i.motion.speedMul=600+N(1400*n,1e3);let r=a<i.slowUntil?500:1e3,c=N(N(this.template.vBase*i.motion.speedMul,1e3)*r,1e3);c>i.motion.v&&(i.motion.v=c),this.emit({type:`correct`,char:t,frame:a}),this.advancePrompt(e,t),this.template.onTick(i.tpl,this.ctx(),t),this.earnPowerups(),this.checkStageEnd()}else{s[1]++,i.errorTotal++,i.accStreak=0,i.rhythmStreak=0;let e=i.shieldCharges>0&&a<i.shieldUntil;e?i.shieldCharges--:(i.fogUntil=a+45,i.stumbleUntil=a+18,i.motion.v=N(i.motion.v,2)),this.emit({type:`error`,char:t,expected:r,frame:a,shielded:e}),this.template.onError?.(i.tpl,this.ctx(),t)}}advancePrompt(e,t){let n=this.state;if(this.setup.inputMode===`dictated`){let t=n.prompt,r=t.spans.find(e=>t.pos>=e.start&&t.pos<e.end);r&&t.pos===r.start&&(n.spanStartT=e),t.pos++,r&&t.pos===r.end&&this.wordDone(r.word,r.ability,e-n.spanStartT);return}let r=n.targets.find(e=>e.id===n.lockedTarget);if(!r){if(r=n.targets.find(e=>e.text[0]===t),!r)return;n.lockedTarget=r.id,n.spanStartT=e}r.progress++,r.progress>=r.text.length&&(n.targets=n.targets.filter(e=>e.id!==r.id),n.lockedTarget=-1,r.ability&&this.wordDone(r.text.trimEnd(),r.ability,e-n.spanStartT),this.template.onTargetComplete?.(n.tpl,this.ctx(),r))}wordDone(e,t,n){let r=this.state,i=this.setup.abilities.find(e=>e.id===t);if(!i)return;let a=n<=(i.quickTypeBudgetMs?.[String(this.setup.tier)]??N(e.length*12e3*1500,L(this.setup.tier)));a&&!r.collected.includes(i.id)&&r.collected.push(i.id),this.emit({type:`ability`,id:i.id,word:e,quick:a,frame:r.frame}),a&&i.powerup&&this.grantPowerup(i.powerup.split(`@`)[0],`word`)}earnPowerups(){let e=this.state;for(let t of this.setup.powerups)for(let n of t.earnedBy)n.source===`accuracy-streak`&&e.accStreak>=(n.threshold??25)?(e.accStreak=0,this.grantPowerup(t.id,n.source)):n.source===`rhythm-streak`&&e.rhythmStreak>=(n.threshold??20)&&(e.rhythmStreak=0,this.grantPowerup(t.id,n.source));e.ticksSinceDrop++;let t=this.setup.powerups.filter(e=>e.earnedBy.some(e=>e.source===`random-drop`));if(!t.length)return;let n=new oe(e.rng.drops);if(n.chance(4)||e.ticksSinceDrop>=300){e.ticksSinceDrop=0;let r=t.map(e=>e.earnedBy.find(e=>e.source===`random-drop`).weight??1);this.grantPowerup(n.weighted(t,r).id,`random-drop`)}}grantPowerup(e,t){let n=this.state,r=this.setup.powerups.find(t=>t.id===e);if(!r)return;let i=n.frame+je(r.durationMs??15e3);r.effect===`slow-mo`?n.slowUntil=i:r.effect===`reveal`?n.revealUntil=i:r.effect===`shield`&&(n.shieldCharges=r.charges??3,n.shieldUntil=i),this.emit({type:`powerup`,id:e,frame:n.frame,source:t})}newStageText(){let e=this.state,t=this.setup.stageLengths,n=this.setup.language,r=this.setup.letters,i=(n.wordLists.common??[]).filter(e=>be(e,r)),a=[];for(let t of this.setup.abilities)if(!(e.collected.includes(t.id)&&t.type!==`boost`))for(let e of t.triggerWords[n.id.replace(/^lang\./,``)]??[])be(e,r)&&a.push({word:e,ability:t.id});let o=Se(new oe(e.rng.text),{letters:r,newKeys:this.setup.newKeys,weakKeys:this.setup.weakKeys,groupChars:this.setup.groupChars??[],stageIndex:e.stage,stageCount:t.length,length:t[Math.min(e.stage,t.length-1)],words:i,specials:a,blockWords:n.blockWords,blockSubstrings:n.blockSubstrings}),s=o.text.split(` `),c=[],l=0;for(let e of s)c.push(o.spans.find(e=>e.start===l)?.ability??``),l+=e.length+1;e.prompt={text:o.text,pos:0,spans:o.spans,chunks:s,chunkAbilities:c,nextChunk:0},e.targets=[],e.lockedTarget=-1,e.sm=me(),e.stageStartFrame=e.frame,this.template.onStageStart?.(e.tpl,this.ctx(),e.stage)}checkStageEnd(){let e=this.state;if(!(this.setup.inputMode===`dictated`?e.prompt.pos>=e.prompt.text.length:e.prompt.nextChunk>=e.prompt.chunks.length&&e.targets.length===0))return;let t=e.sm,n={wpmP:_e(t.correct,t.activeMs),accP:ve(t.correct,t.errors),steadyP:ue(t.steadySamples)},r=ke(n,this.targetWpmP,this.setup.tier),i={stage:e.stage,attempt:e.attempt,correct:t.correct,errors:t.errors,activeMs:t.activeMs,...n,stars:r};e.results.push(i),this.emit({type:`stage`,result:i,frame:e.frame});let a=this.setup.stageLengths.length-1;e.stage<a?(e.stage++,this.newStageText(),this.snapshot(`stage`)):(r>e.bestStars&&(e.bestStars=r),e.bestStars>=this.setup.targetStars?(e.phase=`crossroads`,this.snapshot(`stage`),this.emit({type:`crossroads`,frame:e.frame})):(e.attempt++,this.newStageText(),this.snapshot(`stage`)))}chooseMore(){let e=this.state;e.phase=`play`,e.attempt++,this.emit({type:`more`,frame:e.frame}),this.newStageText()}chooseAdvance(){let e=this.state;e.phase=`done`,this.snapshot(`level`),this.emit({type:`done`,frame:e.frame,choice:`advance`})}visibility(){let e=this.state;if(e.frame<e.revealUntil)return 1e3;let t=350+N(650*N(P((ye(e.win)-500)*2,0,1e3)*Math.min(1e3,e.correctTotal*20),1e3),1e3);return e.frame<e.fogUntil&&(t-=150),P(t,350,1e3)}keyboardOpacity(){return this.state.win.recent.length===0||this.idleHint()||this.stuck()?1e3:P(N((800-ye(this.state.win))*5,3),0,1e3)}steadinessP(){return he(this.state.win.rhythm)}idleHint(){let e=this.state;return e.phase===`play`&&this.atRest()&&e.frame-e.lastKeyFrame>=300}stuck(){let e=this.state;if(e.phase!==`play`||e.bestStars>=this.setup.targetStars||e.frame-e.levelStartFrame<10800)return!1;let t=e.sm;if(t.correct+t.errors>=20)return ke({wpmP:_e(t.correct,t.activeMs),accP:ve(t.correct,t.errors),steadyP:ue(t.steadySamples)},this.targetWpmP,this.setup.tier)===0;let n=e.results[e.results.length-1];return!n||n.stars===0}liveWpmP(){return _e(this.state.sm.correct,this.state.sm.activeMs)}ctx(){let e=this.state;return{rng:new oe(e.rng.tpl),frame:e.frame,setup:this.setup,state:e,v:e.motion.v,hazardP:e.frame<e.slowUntil?500:1e3,spawnTarget:()=>this.spawnTarget()}}spawnTarget(){let e=this.state,t=e.prompt;if(t.nextChunk>=t.chunks.length)return null;let n=e.targets.map(e=>e.text[0]),r=t.nextChunk;for(;r<t.chunks.length&&n.includes(t.chunks[r][0]);)r++;if(r>=t.chunks.length)return null;if(r!==t.nextChunk){let[e]=t.chunks.splice(r,1),[n]=t.chunkAbilities.splice(r,1);t.chunks.splice(t.nextChunk,0,e),t.chunkAbilities.splice(t.nextChunk,0,n)}let i=t.chunkAbilities[t.nextChunk],a={id:e.nextTargetId++,text:t.chunks[t.nextChunk++]+` `,progress:0,ability:i};return e.targets.push(a),a}emit(e){this.events.push(e);for(let t of this.listeners)t(e)}snapshot(e){let t=this.keepStates?JSON.stringify(this.state):void 0,n={frame:this.state.frame,kind:e,hash:re(this.state),state:t};return this.snapshots.push(n),n}},Pe={id:`lang.en`,kind:`language-pack`,version:1,description:`English, US QWERTY. Classic home-row-first order adjusted so useful words appear early (E and Space early).`,prompt:`PROMPT.md`,license:`CC0-1.0`,authors:[`agent:claude`],name:{en:`English`,ru:`Английский`},script:`latin`,alphabet:`abcdefghijklmnopqrstuvwxyz`.split(``),layout:{Backquote:{char:"`",shift:`~`,finger:`lp`,row:`number`,col:0},Digit1:{char:`1`,shift:`!`,finger:`lp`,row:`number`,col:1},Digit2:{char:`2`,shift:`@`,finger:`lr`,row:`number`,col:2},Digit3:{char:`3`,shift:`#`,finger:`lm`,row:`number`,col:3},Digit4:{char:`4`,shift:`$`,finger:`li`,row:`number`,col:4},Digit5:{char:`5`,shift:`%`,finger:`li`,row:`number`,col:5},Digit6:{char:`6`,shift:`^`,finger:`ri`,row:`number`,col:6},Digit7:{char:`7`,shift:`&`,finger:`ri`,row:`number`,col:7},Digit8:{char:`8`,shift:`*`,finger:`rm`,row:`number`,col:8},Digit9:{char:`9`,shift:`(`,finger:`rr`,row:`number`,col:9},Digit0:{char:`0`,shift:`)`,finger:`rp`,row:`number`,col:10},Minus:{char:`-`,shift:`_`,finger:`rp`,row:`number`,col:11},Equal:{char:`=`,shift:`+`,finger:`rp`,row:`number`,col:12},KeyQ:{char:`q`,shift:`Q`,finger:`lp`,row:`top`,col:0},KeyW:{char:`w`,shift:`W`,finger:`lr`,row:`top`,col:1},KeyE:{char:`e`,shift:`E`,finger:`lm`,row:`top`,col:2},KeyR:{char:`r`,shift:`R`,finger:`li`,row:`top`,col:3},KeyT:{char:`t`,shift:`T`,finger:`li`,row:`top`,col:4},KeyY:{char:`y`,shift:`Y`,finger:`ri`,row:`top`,col:5},KeyU:{char:`u`,shift:`U`,finger:`ri`,row:`top`,col:6},KeyI:{char:`i`,shift:`I`,finger:`rm`,row:`top`,col:7},KeyO:{char:`o`,shift:`O`,finger:`rr`,row:`top`,col:8},KeyP:{char:`p`,shift:`P`,finger:`rp`,row:`top`,col:9},BracketLeft:{char:`[`,shift:`{`,finger:`rp`,row:`top`,col:10},BracketRight:{char:`]`,shift:`}`,finger:`rp`,row:`top`,col:11},Backslash:{char:`\\`,shift:`|`,finger:`rp`,row:`top`,col:12},KeyA:{char:`a`,shift:`A`,finger:`lp`,row:`home`,col:0},KeyS:{char:`s`,shift:`S`,finger:`lr`,row:`home`,col:1},KeyD:{char:`d`,shift:`D`,finger:`lm`,row:`home`,col:2},KeyF:{char:`f`,shift:`F`,finger:`li`,row:`home`,col:3,homeBump:!0},KeyG:{char:`g`,shift:`G`,finger:`li`,row:`home`,col:4},KeyH:{char:`h`,shift:`H`,finger:`ri`,row:`home`,col:5},KeyJ:{char:`j`,shift:`J`,finger:`ri`,row:`home`,col:6,homeBump:!0},KeyK:{char:`k`,shift:`K`,finger:`rm`,row:`home`,col:7},KeyL:{char:`l`,shift:`L`,finger:`rr`,row:`home`,col:8},Semicolon:{char:`;`,shift:`:`,finger:`rp`,row:`home`,col:9},Quote:{char:`'`,shift:`"`,finger:`rp`,row:`home`,col:10},KeyZ:{char:`z`,shift:`Z`,finger:`lp`,row:`bottom`,col:0},KeyX:{char:`x`,shift:`X`,finger:`lr`,row:`bottom`,col:1},KeyC:{char:`c`,shift:`C`,finger:`lm`,row:`bottom`,col:2},KeyV:{char:`v`,shift:`V`,finger:`li`,row:`bottom`,col:3},KeyB:{char:`b`,shift:`B`,finger:`li`,row:`bottom`,col:4},KeyN:{char:`n`,shift:`N`,finger:`ri`,row:`bottom`,col:5},KeyM:{char:`m`,shift:`M`,finger:`ri`,row:`bottom`,col:6},Comma:{char:`,`,shift:`<`,finger:`rm`,row:`bottom`,col:7},Period:{char:`.`,shift:`>`,finger:`rr`,row:`bottom`,col:8},Slash:{char:`/`,shift:`?`,finger:`rp`,row:`bottom`,col:9},Space:{char:` `,finger:`rt`,row:`space`,col:0},Backspace:{char:`\b`,finger:`rp`,row:`number`,col:99},Enter:{char:`
`,finger:`rp`,row:`home`,col:99},Tab:{char:`	`,finger:`lp`,row:`top`,col:-1}},order:[[`f`,`j`,` `],[`d`],[`k`],[`s`],[`l`],[`a`],[`;`],[`e`],[`i`],[`r`],[`u`],[`g`],[`h`],[`t`],[`o`],[`n`],[`w`],[`y`],[`p`],[`m`],[`c`],[`v`],[`b`],[`x`],[`q`],[`z`]],orderVariants:[],keyGroups:[{id:`shift`,keys:[`Shift`],name:{en:`Capitals`}},{id:`punct-1`,keys:[`.`,`,`],name:{en:`Dot and comma`}},{id:`punct-2`,keys:[`'`,`/`,`?`,`!`],name:{en:`Quote, slash, question, exclamation`}},{id:`digits-1`,keys:[`1`,`2`,`3`,`4`,`5`],name:{en:`Digits 1–5`}},{id:`digits-2`,keys:[`6`,`7`,`8`,`9`,`0`],name:{en:`Digits 6–0`}},{id:`symbols`,keys:[`-`,`=`,`(`,`)`,`:`,`"`],name:{en:`Symbols`}},{id:`editing`,keys:[`Backspace`,`Enter`,`Tab`],name:{en:`Editing keys`}}],words:{common:`words/common.txt`,"easter-egg":`words/easter-egg.txt`},blocklist:`words/blocklist.txt`,ui:{pressFJ:`Put your fingers on F and J, then press them together`,yourTurn:`Your turn`,breakTitle:`Stretch break!`,breakReady:`I'm ready! ▶`,breakWait:`Ready in`,breakDone:`Great stretching! Let's go!`},tts:{lang:`en-US`,preferredVoices:[`Google US English`,`Samantha`,`Microsoft Aria`]},wordEmoji:{see:`👀`,feel:`🤗`,sale:`🏷️`,safe:`🔒`,fake:`🎭`,ideal:`💡`,idea:`💡`,ideas:`💡`,fill:`🫗`,silk:`🧵`,slide:`🛝`,field:`🌾`,fields:`🌾`,silly:`🤪`,daisies:`🌼`,red:`🔴`,ride:`🎢`,read:`📚`,fair:`🎡`,rail:`🛤️`,rider:`🏇`,fresh:`🌱`,dark:`🌑`,drill:`🛠️`,free:`🕊️`,radar:`📡`,sure:`👍`,fur:`🧸`,ruler:`📏`,fuel:`⛽`,glad:`😊`,glue:`🧴`,gear:`⚙️`,large:`🐘`,girl:`👧`,grade:`🅰️`,sugar:`🍬`,guide:`🧭`,high:`🪁`,hug:`🤗`,huge:`🐋`,hard:`🧗`,head:`🙂`,hear:`👂`,hike:`🥾`,dish:`🍽️`,shelf:`📚`,shade:`⛱️`,share:`🤝`,shake:`🥤`,hide:`🙈`,light:`💡`,treat:`🍭`,teeth:`🦷`,stick:`🪵`,track:`🛤️`,little:`🐣`,tail:`🐾`,tale:`📜`,test:`📝`,start:`🏁`,go:`🟢`,hello:`👋`,door:`🚪`,good:`👍`,food:`🍲`,foot:`🦶`,look:`👀`,cook:`🧑‍🍳`,hot:`🌶️`,float:`🛟`,toast:`🍞`,tooth:`🦷`,hood:`🧥`,rose:`🌹`,gold:`🥇`,storm:`⛈️`,no:`🙅`,run:`🏃`,need:`🙏`,shield:`🛡️`,nice:`😊`,nine:`9️⃣`,ten:`🔟`,tent:`⛺`,fun:`🎉`,funny:`😂`,ant:`🐜`,end:`🏁`,night:`🌃`,noon:`🕛`,note:`🎵`,nose:`👃`,snack:`🍿`,dinner:`🍽️`,green:`🟢`,garden:`🏡`,learn:`🎓`,north:`🧭`,sound:`🔊`,round:`⭕`,wind:`🌬️`,slow:`🐌`,water:`💧`,wise:`🦉`,wish:`🌠`,wing:`🪽`,wings:`🪽`,white:`⚪`,world:`🌍`,wonder:`✨`,window:`🪟`,two:`2️⃣`,town:`🏘️`,tower:`🗼`,sweet:`🍬`,swing:`🛝`,wolf:`🐺`,yes:`✅`,you:`🫵`,fly:`🪰`,yellow:`🟡`,year:`📅`,young:`🐣`,happy:`😄`,sky:`🌤️`,toy:`🧸`,yard:`🏡`,day:`🌞`,play:`🎮`,up:`⬆️`,jump:`🦘`,open:`🔓`,power:`⚡`,speed:`💨`,pink:`🩷`,pie:`🥧`,pen:`🖊️`,pet:`🐕`,paint:`🎨`,party:`🥳`,puppy:`🐶`,spin:`🌀`,spark:`✨`,space:`🌌`,step:`👣`,pool:`🏊`,me:`🙋`,more:`➕`,magic:`🪄`,move:`🕺`,milk:`🥛`,map:`🗺️`,mouse:`🐭`,music:`🎵`,smile:`😃`,summer:`🏖️`,hammer:`🔨`,monster:`👾`,mountain:`🏔️`,call:`📞`,cool:`😎`,color:`🌈`,dance:`💃`,circle:`⭕`,city:`🏙️`,cup:`☕`,voice:`🗣️`,love:`💗`,five:`5️⃣`,seven:`7️⃣`,river:`🏞️`,visit:`🧳`,van:`🚐`,vote:`🗳️`,big:`🐘`,bubble:`🫧`,boost:`🚀`,bear:`🐻`,blue:`🔵`,bell:`🔔`,bounce:`🏀`,brave:`🦁`,six:`6️⃣`,mix:`🥣`,taxi:`🚕`,relax:`😌`,quick:`⚡`,quest:`🗺️`,quiet:`🤫`,quiz:`❓`,squid:`🦑`,zoom:`🔍`,zap:`⚡`,freeze:`🥶`,zero:`0️⃣`,zoo:`🦁`,puzzle:`🧩`,lazy:`🦥`,eggs:`🥚`,drag:`🐉`},breakNudges:[`Not yet! Breaks help your fingers get faster.`,`Almost there! Rested hands type quicker.`,`Hold on — your brain is saving everything you just learned.`,`Stretch a little more. Champions rest too!`,`Not yet! Even rockets refuel before the next launch.`,`Patience is a superpower, and you have it!`,`Your fingers are recharging… just a bit more! ⚡`,`Great typists take breaks — and you're one of them.`,`Wait for the ring to fill — you'll come back even stronger.`,`Relax your shoulders… the keyboard will wait for you.`],stretchSteps:[{move:`shake`,icon:`👐`,text:`Shake out your hands`},{move:`roll`,icon:`🔄`,text:`Roll your shoulders`},{move:`reach`,icon:`🙆`,text:`Reach up high to the sky`},{move:`look`,icon:`👀`,text:`Look far away and blink slowly`},{move:`wiggle`,icon:`🖐️`,text:`Wiggle your fingers`},{move:`breathe`,icon:`🌬️`,text:`Deep breath in… and slowly out`}]},Fe={id:`lang.ru`,kind:`language-pack`,version:1,description:`Russian ЙЦУКЕН language pack: physical key map with fingers, home-row-first key order, curated kid-friendly words and a blocklist.`,prompt:`PROMPT.md`,license:`CC0-1.0`,authors:[`agent:claude`],name:{en:`Russian`,ru:`Русский`},script:`cyrillic`,alphabet:`а.б.в.г.д.е.ё.ж.з.и.й.к.л.м.н.о.п.р.с.т.у.ф.х.ц.ч.ш.щ.ъ.ы.ь.э.ю.я`.split(`.`),layout:{Backquote:{char:`ё`,shift:`Ё`,finger:`lp`,row:`number`,col:0},Digit1:{char:`1`,shift:`!`,finger:`lp`,row:`number`,col:1},Digit2:{char:`2`,shift:`"`,finger:`lr`,row:`number`,col:2},Digit3:{char:`3`,shift:`№`,finger:`lm`,row:`number`,col:3},Digit4:{char:`4`,shift:`;`,finger:`li`,row:`number`,col:4},Digit5:{char:`5`,shift:`%`,finger:`li`,row:`number`,col:5},Digit6:{char:`6`,shift:`:`,finger:`ri`,row:`number`,col:6},Digit7:{char:`7`,shift:`?`,finger:`ri`,row:`number`,col:7},Digit8:{char:`8`,shift:`*`,finger:`rm`,row:`number`,col:8},Digit9:{char:`9`,shift:`(`,finger:`rr`,row:`number`,col:9},Digit0:{char:`0`,shift:`)`,finger:`rp`,row:`number`,col:10},Minus:{char:`-`,shift:`_`,finger:`rp`,row:`number`,col:11},Equal:{char:`=`,shift:`+`,finger:`rp`,row:`number`,col:12},KeyQ:{char:`й`,shift:`Й`,finger:`lp`,row:`top`,col:0},KeyW:{char:`ц`,shift:`Ц`,finger:`lr`,row:`top`,col:1},KeyE:{char:`у`,shift:`У`,finger:`lm`,row:`top`,col:2},KeyR:{char:`к`,shift:`К`,finger:`li`,row:`top`,col:3},KeyT:{char:`е`,shift:`Е`,finger:`li`,row:`top`,col:4},KeyY:{char:`н`,shift:`Н`,finger:`ri`,row:`top`,col:5},KeyU:{char:`г`,shift:`Г`,finger:`ri`,row:`top`,col:6},KeyI:{char:`ш`,shift:`Ш`,finger:`rm`,row:`top`,col:7},KeyO:{char:`щ`,shift:`Щ`,finger:`rr`,row:`top`,col:8},KeyP:{char:`з`,shift:`З`,finger:`rp`,row:`top`,col:9},BracketLeft:{char:`х`,shift:`Х`,finger:`rp`,row:`top`,col:10},BracketRight:{char:`ъ`,shift:`Ъ`,finger:`rp`,row:`top`,col:11},Backslash:{char:`\\`,shift:`/`,finger:`rp`,row:`top`,col:12},KeyA:{char:`ф`,shift:`Ф`,finger:`lp`,row:`home`,col:0},KeyS:{char:`ы`,shift:`Ы`,finger:`lr`,row:`home`,col:1},KeyD:{char:`в`,shift:`В`,finger:`lm`,row:`home`,col:2},KeyF:{char:`а`,shift:`А`,finger:`li`,row:`home`,col:3,homeBump:!0},KeyG:{char:`п`,shift:`П`,finger:`li`,row:`home`,col:4},KeyH:{char:`р`,shift:`Р`,finger:`ri`,row:`home`,col:5},KeyJ:{char:`о`,shift:`О`,finger:`ri`,row:`home`,col:6,homeBump:!0},KeyK:{char:`л`,shift:`Л`,finger:`rm`,row:`home`,col:7},KeyL:{char:`д`,shift:`Д`,finger:`rr`,row:`home`,col:8},Semicolon:{char:`ж`,shift:`Ж`,finger:`rp`,row:`home`,col:9},Quote:{char:`э`,shift:`Э`,finger:`rp`,row:`home`,col:10},KeyZ:{char:`я`,shift:`Я`,finger:`lp`,row:`bottom`,col:0},KeyX:{char:`ч`,shift:`Ч`,finger:`lr`,row:`bottom`,col:1},KeyC:{char:`с`,shift:`С`,finger:`lm`,row:`bottom`,col:2},KeyV:{char:`м`,shift:`М`,finger:`li`,row:`bottom`,col:3},KeyB:{char:`и`,shift:`И`,finger:`li`,row:`bottom`,col:4},KeyN:{char:`т`,shift:`Т`,finger:`ri`,row:`bottom`,col:5},KeyM:{char:`ь`,shift:`Ь`,finger:`ri`,row:`bottom`,col:6},Comma:{char:`б`,shift:`Б`,finger:`rm`,row:`bottom`,col:7},Period:{char:`ю`,shift:`Ю`,finger:`rr`,row:`bottom`,col:8},Slash:{char:`.`,shift:`,`,finger:`rp`,row:`bottom`,col:9},Space:{char:` `,finger:`rt`,row:`space`,col:0},Backspace:{char:`\b`,finger:`rp`,row:`number`,col:99},Enter:{char:`
`,finger:`rp`,row:`home`,col:99},Tab:{char:`	`,finger:`lp`,row:`top`,col:-1}},order:[[`а`,`о`,` `],[`в`],[`л`],[`ы`],[`д`],[`ф`],[`ж`],[`э`],[`п`],[`р`],[`е`],[`н`],[`к`],[`г`],[`м`],[`ь`],[`и`],[`т`],[`с`],[`б`],[`у`],[`ш`],[`ц`],[`щ`],[`ч`],[`ю`],[`я`],[`х`],[`й`],[`з`],[`ъ`],[`ё`]],orderVariants:[],keyGroups:[{id:`shift`,keys:[`Shift`],name:{ru:`Заглавные буквы`,en:`Capitals`}},{id:`punct-1`,keys:[`.`,`,`],name:{ru:`Точка и запятая`,en:`Dot and comma`}},{id:`punct-2`,keys:[`!`,`?`,`"`,`:`],name:{ru:`Восклицательный, вопросительный, кавычки, двоеточие`,en:`Exclamation, question, quotes, colon`}},{id:`digits-1`,keys:[`1`,`2`,`3`,`4`,`5`],name:{ru:`Цифры 1–5`,en:`Digits 1–5`}},{id:`digits-2`,keys:[`6`,`7`,`8`,`9`,`0`],name:{ru:`Цифры 6–0`,en:`Digits 6–0`}},{id:`symbols`,keys:[`-`,`=`,`(`,`)`,`;`,`%`],name:{ru:`Символы`,en:`Symbols`}},{id:`editing`,keys:[`Backspace`,`Enter`,`Tab`],name:{ru:`Клавиши правки`,en:`Editing keys`}}],words:{common:`words/common.txt`,"easter-egg":`words/easter-egg.txt`},blocklist:`words/blocklist.txt`,ui:{pressFJ:`Поставь пальцы на А и О и нажми их вместе`,yourTurn:`Твой ход`,breakTitle:`Разминка!`,breakReady:`Я готов! ▶`,breakWait:`Готово через`,breakDone:`Отличная разминка! Поехали!`,introNewKey:`Уровень {n}: новая клавиша`,introNewKeys:`Уровень {n}: новые клавиши`,introGroup:`Уровень {n}: {group}`,introRest:`Положи пальцы на основной ряд. Нащупай бугорки на А и О. Смотри на экран.`,introGoal:`Цель: {tier}. Esc — пауза.`,introSpace:`Пробел — большие пальцы`,introShift:`Shift — мизинец другой руки, пока буквенный палец печатает (Ф → правый Shift, О → левый Shift)`,sayIntro:`Уровень {n}. Новая клавиша: {keys}.`,sayGroup:`Уровень {n}: {group}. {keys}.`,sayKey:`{key}, {finger}`,sayPress:`Поставь пальцы на А и О и нажми их вместе.`,sayShift:`Заглавные: держи Shift мизинцем другой руки`,sayGo:`Вперёд!`,sayVoice:`Привет! Это мой голос: {name}.`,sayNewVoice:`Новый голос: {name}!`,sayFind:`Найди {key}. Это {finger}.`,sayHi:`Привет, {name}! Давай печатать.`,crossTitle:`Получилось! Куда дальше?`,crossMore:`⬅ Остаться и собрать ещё звёзды`,crossNext:`В следующий мир ➡`,sayCross:`Получилось! Нажми А, чтобы остаться за звёздами, или О — чтобы идти дальше.`,space:`пробел`,"key.\b":`Backspace`,"key.\n":`Enter`,"key.	":`Tab`,"finger.lp":`левый мизинец`,"finger.lr":`левый безымянный`,"finger.lm":`левый средний`,"finger.li":`левый указательный`,"finger.lt":`левый большой`,"finger.rt":`правый большой`,"finger.ri":`правый указательный`,"finger.rm":`правый средний`,"finger.rr":`правый безымянный`,"finger.rp":`правый мизинец`},tts:{lang:`ru-RU`,preferredVoices:[`Google русский`,`Milena`,`Microsoft Irina`,`Microsoft Svetlana`]},wordEmoji:{кот:`🐱`,собака:`🐶`,рыба:`🐟`,дом:`🏠`,солнце:`☀️`,луна:`🌙`,звезда:`⭐`,цветок:`🌸`,дерево:`🌳`,яблоко:`🍎`,мяч:`⚽`,машина:`🚗`,поезд:`🚂`,лодка:`⛵`,ракета:`🚀`,торт:`🎂`,книга:`📖`,море:`🌊`,гора:`⛰️`,снег:`❄️`,дождь:`🌧️`,облако:`☁️`,радуга:`🌈`,сердце:`❤️`,музыка:`🎵`,птица:`🐦`,заяц:`🐰`,лиса:`🦊`,медведь:`🐻`,сова:`🦉`,пчела:`🐝`,бабочка:`🦋`,слон:`🐘`,жираф:`🦒`,лев:`🦁`,тигр:`🐯`,кит:`🐋`,дельфин:`🐬`,черепаха:`🐢`,лягушка:`🐸`,гриб:`🍄`,вода:`💧`,огонь:`🔥`,ключ:`🔑`,подарок:`🎁`,шар:`🎈`,флаг:`🚩`,часы:`⌚`,очки:`👓`,шапка:`🧢`,сыр:`🧀`,хлеб:`🍞`,молоко:`🥛`,арбуз:`🍉`,груша:`🍐`,банан:`🍌`,лимон:`🍋`,морковь:`🥕`,водопад:`🏞️`,лава:`🌋`,дракон:`🐉`,робот:`🤖`,клоун:`🤡`,корона:`👑`,мост:`🌉`,замок:`🏰`},breakNudges:[`Ещё чуть-чуть! Перерыв помогает пальцам стать быстрее.`,`Почти! Отдохнувшие руки печатают быстрее.`,`Подожди — мозг сохраняет всё, чему ты научился.`,`Потянись ещё немного. Чемпионы тоже отдыхают!`,`Ещё рано! Даже ракеты заправляются перед стартом.`,`Терпение — это суперсила, и она у тебя есть!`,`Пальцы заряжаются… ещё капельку! ⚡`,`Хорошие печатники делают перерывы — и ты тоже!`,`Сделай вдох и выдох. Скоро продолжим!`,`Ты отлично справляешься. Ещё немного отдыха!`],stretchSteps:[{move:`shake`,icon:`👐`,text:`Потряси кистями`},{move:`roll`,icon:`🔄`,text:`Покрути плечами`},{move:`reach`,icon:`🙆`,text:`Потянись высоко к небу`},{move:`look`,icon:`👀`,text:`Посмотри вдаль и поморгай`},{move:`wiggle`,icon:`🖐️`,text:`Пошевели пальцами`},{move:`breathe`,icon:`🌬️`,text:`Глубоко вдохни и выдохни`}]},Ie=`# Words and substrings that must never appear in generated text (CC0-1.0).
# Checked at build time against every word list and at runtime against generated pseudo-words.
# Matching is case-insensitive substring matching for entries prefixed with "~", whole-word otherwise.
~fuck
~shit
~cunt
~dick
~cock
~piss
~slut
~whore
~fag
~nigg
~rape
~kkk
~nazi
ass
asses
damn
hell
sex
kill
kills
dead
die
dies
gun
guns
`,Le=`# Curated kid-friendly English words (CC0-1.0). One per line, lowercase. The generator only uses
# words whose letters are all unlocked. Lines starting with # are comments.
# home row (a s d f j k l)
ask
sad
dad
add
all
fall
lad
lass
flask
salad
alas
dads
falls
asks
# + e
see
sea
seed
feed
feel
fee
lake
sale
desk
else
leaf
fade
safe
seal
deal
lead
less
self
sled
fled
jade
ease
keel
eel
elf
fake
fakes
deed
seek
leak
easel
salsa
# + i
like
side
file
kid
kids
skill
ideal
did
aid
lid
fish
sail
said
ski
skis
silk
fill
idea
ideas
life
slide
slid
field
fields
silly
dial
daisies
# + r
red
ride
read
fire
fair
far
are
area
dear
deer
real
rail
rake
risk
rise
rider
fresh
sir
star
dark
dress
drill
ferris
free
freed
radar
raid
# + u
use
sure
fur
rude
rule
ruler
duke
due
ruffle
sulk
usual
fuel
lure
reuse
# + g
egg
eggs
gas
glad
glue
gear
large
dragging
drag
flag
frog
gull
gift
sugar
guide
giraffe
girl
grade
grass
# + h
he
she
her
his
high
hug
huge
hug
hard
head
hear
hike
hill
fresh
fish
dish
shark
shell
shade
shelf
share
shake
hide
# + t
the
it
at
tree
light
right
tight
treat
tiger
take
tea
test
teeth
that
this
stars
start
tail
tale
stick
track
truck
turtle
little
title
heart
# + o
go
too
hello
door
good
food
foot
look
book
cook
hot
rocket
robot
float
goat
dog
toast
tooth
hood
role
rose
fold
gold
house
ghost
storm
# + n
no
in
on
run
need
shield
nest
nice
nine
ten
tent
sun
fun
funny
ant
and
end
night
noon
note
nose
snack
snake
dinner
green
garden
learn
north
under
sound
round
# + w
we
wow
wind
slow
snow
water
wise
wish
wing
wings
white
world
wonder
window
two
own
town
tower
flower
sweet
swing
wolf
# + y
yes
you
fly
key
yellow
year
young
happy
funny
sky
toy
yard
day
way
stay
play
# + p
up
jump
open
power
speed
pink
pie
pen
pet
paint
party
pizza
puppy
spin
spark
space
step
pool
apple
# + m
me
more
magic
move
moon
milk
map
mouse
music
smile
summer
hammer
monster
mountain
# + c
cat
ice
rocket
cake
call
cool
cloud
clock
color
music
dance
circle
city
cup
# + v
voice
wave
love
five
seven
river
over
very
visit
van
vote
# + b
big
bubble
boost
ball
bird
bear
blue
boat
bike
bell
bounce
brave
# + x
box
fox
six
mix
taxi
max
relax
# + q
quick
quest
queen
quiet
quiz
squid
# + z
zoom
zap
freeze
zero
zebra
zoo
pizza
puzzle
lazy
`,Re=`# Easter-egg words (CC0-1.0): typing one reveals a hidden surprise in the level.
flask
salad
alfalfa
ladle
`,ze=`# Words and substrings that must never appear in generated text (CC0-1.0).
# Checked at build time against every word list and at runtime against generated pseudo-words.
# Matching is case-insensitive substring matching for entries prefixed with "~", whole-word otherwise.
~хуй
~хуе
~хуё
~хуя
~пизд
~ебат
~ебан
~ебал
~ебу
~ёба
~ёбн
~бляд
~блят
~сука
~суки
~мудак
~мудил
~гандон
~пидор
~пидар
~шлюх
~залуп
~дроч
~жопа
~жопу
~говн
~дерьм
~срал
~сран
~ссан
~херн
~манда
~гонд
убить
убей
смерть
труп
`,Be=`# Curated kid-friendly Russian words (CC0-1.0). One per line, lowercase. The generator only uses words
# whose letters are all unlocked. Lines starting with # are comments.
# home row (а о в л ы д ф ж э)
вол
вода
дала
лад
лава
дыра
дол
ода
жало
# + п р
пол
пар
папа
пора
пода
вдова
провал
лапа
лодка
двор
дрова
порода
# + е н к г
нога
нос
кот
кит
гора
река
рыба
лес
лена
дерево
небо
окно
коза
кенгуру
книга
пена
венок
гнездо
перо
капля
# + м ь и т с б у
мама
мир
мост
море
мед
мяч
сок
сон
сыр
суп
сова
слон
сад
сани
сила
сито
тигр
торт
театр
трава
тропа
утка
ухо
урок
улитка
бант
банан
белка
берег
бобр
буква
бумага
весна
ветер
вишня
город
гусь
дети
дом
друг
дуб
дубок
игра
игрушка
изба
кино
клумба
кубик
кукла
лимон
лиса
лось
лук
луна
малина
машина
мел
метро
молоко
морковь
музыка
мука
муравей
мыло
нитки
носки
облако
обед
овощи
огород
остров
отдых
парк
песок
песня
пирог
плот
поле
полет
радуга
ракета
робот
роза
руки
рукав
самолет
свет
семья
снег
собака
солнце
стол
стул
сумка
танец
тепло
тыква
улыбка
утро
# + ш ц щ ч ю я х й з ъ
шар
шапка
шарф
школа
шоколад
цветок
цирк
цапля
щенок
щука
чай
часы
черепаха
чудо
юла
юбка
юность
яблоко
ягода
якорь
ящик
хлеб
хвост
холм
хомяк
зайка
заяц
замок
зебра
звезда
зима
зонт
змей
подъезд
объятие
ёжик
ёлка

`,Ve=`# Easter-egg words (CC0-1.0): typing one reveals a hidden surprise in the level. All home-row letters.
водопад
лава
вода
лапа
`,He={id:`template.brick-breaker`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`2D brick-breaker: every correct key sends the ball to the next letter brick, which pops into confetti; the paddle glides under it.`,tags:[`2d`,`dictated`,`arcade`],genre:`brick-breaker`,minLetters:3,inputMode:`dictated`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},Ue={id:`template.bubble-popper`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Vertical bubble-popper (targeting): bubbles carrying words float up from the sea floor; type a bubble's word and Space to pop it into sparkles.`,tags:[`2d`,`targeting`,`calm`],genre:`bubble-popper`,minLetters:5,inputMode:`targeting`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},We={id:`template.climbing-tower`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`3D climbing tower: the climber spirals up a tall tower; each correct key is the next handhold, and every finished word reaches a flag.`,tags:[`3d`,`dictated`,`climbing`],genre:`climbing`,minLetters:18,inputMode:`dictated`,views:[`3d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},Ge={id:`template.crystal-gallery`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`First-person crystal gallery (targeting): singing crystals drift toward you through a glowing cave; type a crystal's word and Space to make it chime and sparkle.`,tags:[`fpv`,`targeting`,`music`],genre:`gallery`,minLetters:13,inputMode:`targeting`,views:[`fpv`],stages:{min:3,max:3},supportsHavocs:[],multiplayer:[],entry:`sim.ts`},Ke={id:`template.dungeon-crawler`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Isometric step-based dungeon crawl: each correct key is one step through a chain of torch-lit rooms; collect a gem in every room. No monsters, just treasure.`,tags:[`iso`,`dictated`,`adventure`],genre:`dungeon-crawler`,minLetters:10,inputMode:`dictated`,views:[`iso`],stages:{min:3,max:3},supportsHavocs:[`havoc.map-rotate`],multiplayer:[],entry:`sim.ts`},qe={id:`template.garden-grower`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`2D garden grower: every correct key waters the next seed in the row; plants sprout and bloom as you type, words grow sunflowers.`,tags:[`2d`,`dictated`,`calm`],genre:`garden`,minLetters:6,inputMode:`dictated`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},Je={id:`template.marble-run`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Isometric marble run: each correct key lays the next track tile and the marble rolls onto it; words add a bell that rings as the marble passes.`,tags:[`iso`,`dictated`,`calm`],genre:`marble-run`,minLetters:9,inputMode:`dictated`,views:[`iso`],stages:{min:3,max:3},supportsHavocs:[`havoc.map-rotate`],multiplayer:[],entry:`sim.ts`},Ye={id:`template.maze-snake`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Top-down maze snake: each correct key moves the snake one cell along the hedge maze path; it grows longer as you type and eats glowing berries.`,tags:[`2d`,`dictated`,`calm`],genre:`snake`,minLetters:4,inputMode:`dictated`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.map-rotate`],multiplayer:[],entry:`sim.ts`},Xe={id:`template.platformer`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Side platformer: typing runs forward, every Space is a jump over a gap that opens just ahead; notes to collect float above the path.`,tags:[`2d`,`dictated`],genre:`platformer`,minLetters:3,inputMode:`dictated`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},Ze={id:`template.pulse-runner`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Side-scrolling runner in darkness: every correct key is a heartbeat that pushes the runner forward and lights lanterns along the path.`,tags:[`2d`,`dictated`,`calm`],genre:`runner`,minLetters:2,inputMode:`dictated`,views:[`2d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},Qe={id:`template.racer`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Third-person 3D racer: typing drives the car, Space switches lanes past cones, steady rhythm raises speed; super-speed streaks at high WPM.`,tags:[`3d`,`dictated`,`speed`],genre:`racer`,minLetters:4,inputMode:`dictated`,views:[`3d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},$e={id:`template.space-tunnel`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`First-person space-tunnel flight: glide through a tunnel of glowing rings; the next letters float ahead and every correct key carries you forward through them.`,tags:[`fpv`,`dictated`,`flight`],genre:`flight`,minLetters:14,inputMode:`dictated`,views:[`fpv`],stages:{min:3,max:3},supportsHavocs:[],multiplayer:[],entry:`sim.ts`},et={id:`template.tower-defence`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Isometric tower defence (non-violent): friendly blobs carrying letters wander toward a crystal tower; typing their letters freezes them into ice cubes.`,tags:[`iso`,`targeting`],genre:`tower-defence`,minLetters:4,inputMode:`targeting`,views:[`iso`],stages:{min:3,max:3},supportsHavocs:[`havoc.map-rotate`],multiplayer:[],entry:`sim.ts`},tt={id:`template.wave-surfing`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`3D beat-wave surfing: every correct key paddles the surfer forward and builds the wave; a steady rhythm makes a big rolling wave to ride.`,tags:[`3d`,`dictated`,`rhythm`],genre:`surfing`,minLetters:12,inputMode:`dictated`,views:[`3d`],stages:{min:3,max:3},supportsHavocs:[`havoc.gravity-tilt`],multiplayer:[],entry:`sim.ts`},nt={id:`template.word-city`,kind:`level-template`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Isometric word city (targeting): building plots float over the city with words; type a word and Space to raise that building, block by block.`,tags:[`iso`,`targeting`,`builder`],genre:`city-builder`,minLetters:8,inputMode:`targeting`,views:[`iso`],stages:{min:3,max:3},supportsHavocs:[`havoc.map-rotate`],multiplayer:[],entry:`sim.ts`},rt={id:`style.flat`,kind:`render-style`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Flat unlit shapes with soft vignette; cheapest style and the lite fallback for others.`,family:`flat`,views:[`2d`,`2.5d`,`iso`,`3d`],entry:`style.ts`,costTier:1},it={id:`style.neon`,kind:`render-style`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Neon glow: emissive materials with bloom post-processing on dark backgrounds.`,family:`neon`,views:[`2d`,`2.5d`,`iso`,`3d`],entry:`style.ts`,costTier:3,lite:`style.flat@1`},at={id:`palette.dusk`,kind:`palette`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Create a palette named dusk: Dusk: deep blue night with warm lantern accents. Provide bg, fg, accent, positive, negative, ground, sky as hex colours with readable contrast between fg and bg.`,description:`Dusk: deep blue night with warm lantern accents.`,colors:{bg:`#0d1b2a`,fg:`#e0e1dd`,accent:`#ffb703`,positive:`#8ecae6`,negative:`#e76f51`,ground:`#1b263b`,sky:`#415a77`},colorBlindSafe:!0,mood:`calm`},ot={id:`palette.meadow`,kind:`palette`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Create a palette named meadow: Meadow: bright greens and sky blue for daytime levels. Provide bg, fg, accent, positive, negative, ground, sky as hex colours with readable contrast between fg and bg.`,description:`Meadow: bright greens and sky blue for daytime levels.`,colors:{bg:`#bde0fe`,fg:`#1d3557`,accent:`#ffafcc`,positive:`#06d6a0`,negative:`#ef476f`,ground:`#80b918`,sky:`#a2d2ff`},colorBlindSafe:!0,mood:`cheerful`},st={id:`palette.synth`,kind:`palette`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Create a palette named synth: Synth: purple and cyan neon on near-black. Provide bg, fg, accent, positive, negative, ground, sky as hex colours with readable contrast between fg and bg.`,description:`Synth: purple and cyan neon on near-black.`,colors:{bg:`#10002b`,fg:`#e0aaff`,accent:`#00f5d4`,positive:`#9bf6ff`,negative:`#ff4d6d`,ground:`#240046`,sky:`#3c096c`},colorBlindSafe:!0,mood:`energetic`},ct={id:`havoc.gravity-tilt`,kind:`havoc`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Gravity tilt: the whole world slowly tilts and sways (camera roll); intensity sets the max angle.`,entry:`havoc.ts`,intensity:[0,1],compatibleViews:[`2d`,`iso`,`3d`],reducedMotion:`calm-builtin`,affectsInput:!1},lt={id:`havoc.map-rotate`,kind:`havoc`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Map rotation: the board turns around its centre in quarter turns as stages advance.`,entry:`havoc.ts`,intensity:[0,1],compatibleViews:[`2d`,`iso`,`3d`],reducedMotion:`calm-builtin`,affectsInput:!1},ut={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.home-row-secret`,description:`Easter egg: the first real words made only from home-row letters reveal a hidden garden scene.`,prompt:`An easter egg unlocked by typing a home-row word quickly; reveals a hidden scene in the current level.`,type:`easter-egg`,triggerWords:{en:[`flask`,`salad`,`alfalfa`,`ladle`],ru:[`водопад`,`вода`,`лава`,`лапа`]},rigHook:`celebrate`},dt={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.jump`,description:`Permanent ability: the avatar can jump in every template that supports the jump rig hook.`,prompt:`Design a language-independent 'jump' ability with trigger words per language and a quick-type budget per tier.`,type:`permanent`,triggerWords:{en:[`jump`,`hop`,`leap`],ru:[`прыжок`,`скок`]},quickTypeBudgetMs:{1:6e3,2:5e3,3:4e3,4:3e3,5:2200,6:1600,7:1200},rigHook:`jump`},ft={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.shield-word`,description:`Boost: typing the word 'shield' quickly activates the shield power-up.`,prompt:`A boost word that triggers the shield power-up.`,type:`boost`,triggerWords:{en:[`shield`],ru:[`щит`]},rigHook:`powerup`,powerup:`powerup.shield@1`},pt={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.slow-word`,description:`Boost: typing the word 'slow' quickly activates slow motion.`,prompt:`A boost word that triggers the slow-mo power-up.`,type:`boost`,triggerWords:{en:[`slow`],ru:[`тихо`]},rigHook:`powerup`,powerup:`powerup.slow-mo@1`},mt={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.voice-chipmunk`,description:`Collectible: typing 'voice' or 'squeak' quickly collects the Chipmunk voice effect for the speech voice.`,prompt:`A collectible word that unlocks the 'Chipmunk' voice effect (A tiny, quick, very high voice.). Trigger words per language must be kid-safe, from the curated vocabulary, and typeable once their letters are learned.`,type:`collectible`,triggerWords:{en:[`voice`,`squeak`],ru:[`голос`,`писк`]},rigHook:`celebrate`,voiceEffect:`voice.chipmunk@1`},ht={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.voice-giant`,description:`Collectible: typing 'giant' quickly collects the Giant voice effect for the speech voice.`,prompt:`A collectible word that unlocks the 'Giant' voice effect (A deep, slow, booming voice.). Trigger words per language must be kid-safe, from the curated vocabulary, and typeable once their letters are learned.`,type:`collectible`,triggerWords:{en:[`giant`],ru:[`великан`]},rigHook:`celebrate`,voiceEffect:`voice.giant@1`},gt={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.voice-robot`,description:`Collectible: typing 'robot' quickly collects the Robot voice effect for the speech voice.`,prompt:`A collectible word that unlocks the 'Robot' voice effect (A flat, steady, low robot voice.). Trigger words per language must be kid-safe, from the curated vocabulary, and typeable once their letters are learned.`,type:`collectible`,triggerWords:{en:[`robot`],ru:[`робот`]},rigHook:`celebrate`,voiceEffect:`voice.robot@1`},_t={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.voice-sleepy`,description:`Collectible: typing 'yawn' or 'sleepy' quickly collects the Sleepy voice effect for the speech voice.`,prompt:`A collectible word that unlocks the 'Sleepy' voice effect (A slow, relaxed voice, like someone about to nap.). Trigger words per language must be kid-safe, from the curated vocabulary, and typeable once their letters are learned.`,type:`collectible`,triggerWords:{en:[`yawn`,`sleepy`],ru:[`зевок`]},rigHook:`celebrate`,voiceEffect:`voice.sleepy@1`},vt={kind:`ability`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`ability.voice-speedy`,description:`Collectible: typing 'zoom' or 'speedy' quickly collects the Speedy voice effect for the speech voice.`,prompt:`A collectible word that unlocks the 'Speedy' voice effect (A fast, bright voice that zips through every sentence.). Trigger words per language must be kid-safe, from the curated vocabulary, and typeable once their letters are learned.`,type:`collectible`,triggerWords:{en:[`zoom`,`speedy`],ru:[`шустрый`]},rigHook:`celebrate`,voiceEffect:`voice.speedy@1`},yt={kind:`voice-effect`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`voice.chipmunk`,description:`Collectible voice effect: A tiny, quick, very high voice. Applied to the speech voice (pitch 2, speed 1.3).`,prompt:`A kid-friendly 'Chipmunk' voice preset for the built-in speech voice: A tiny, quick, very high voice. Choose a pitch (0–2) and a speed (0.1–10) that sound clearly different from the normal voice but stay easy to understand, plus one emoji icon shown when no voice is available.`,name:{en:`Chipmunk`,ru:`Бурундук`},icon:`🐿️`,pitch:2,rate:1.3},bt={kind:`voice-effect`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`voice.giant`,description:`Collectible voice effect: A deep, slow, booming voice. Applied to the speech voice (pitch 0.3, speed 0.8).`,prompt:`A kid-friendly 'Giant' voice preset for the built-in speech voice: A deep, slow, booming voice. Choose a pitch (0–2) and a speed (0.1–10) that sound clearly different from the normal voice but stay easy to understand, plus one emoji icon shown when no voice is available.`,name:{en:`Giant`,ru:`Великан`},icon:`🦣`,pitch:.3,rate:.8},xt={kind:`voice-effect`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`voice.robot`,description:`Collectible voice effect: A flat, steady, low robot voice. Applied to the speech voice (pitch 0.6, speed 0.9).`,prompt:`A kid-friendly 'Robot' voice preset for the built-in speech voice: A flat, steady, low robot voice. Choose a pitch (0–2) and a speed (0.1–10) that sound clearly different from the normal voice but stay easy to understand, plus one emoji icon shown when no voice is available.`,name:{en:`Robot`,ru:`Робот`},icon:`🤖`,pitch:.6,rate:.9},St={kind:`voice-effect`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`voice.sleepy`,description:`Collectible voice effect: A slow, relaxed voice, like someone about to nap. Applied to the speech voice (pitch 0.8, speed 0.6).`,prompt:`A kid-friendly 'Sleepy' voice preset for the built-in speech voice: A slow, relaxed voice, like someone about to nap. Choose a pitch (0–2) and a speed (0.1–10) that sound clearly different from the normal voice but stay easy to understand, plus one emoji icon shown when no voice is available.`,name:{en:`Sleepy`,ru:`Соня`},icon:`😴`,pitch:.8,rate:.6},Ct={kind:`voice-effect`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],id:`voice.speedy`,description:`Collectible voice effect: A fast, bright voice that zips through every sentence. Applied to the speech voice (pitch 1.2, speed 1.8).`,prompt:`A kid-friendly 'Speedy' voice preset for the built-in speech voice: A fast, bright voice that zips through every sentence. Choose a pitch (0–2) and a speed (0.1–10) that sound clearly different from the normal voice but stay easy to understand, plus one emoji icon shown when no voice is available.`,name:{en:`Speedy`,ru:`Шустрик`},icon:`⚡`,pitch:1.2,rate:1.8},wt={id:`powerup.reveal`,kind:`powerup`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Reveal: full visibility for 20 s. A rare random drop.`,description:`Reveal: full visibility for 20 s.`,effect:`reveal`,durationMs:2e4,earnedBy:[{source:`random-drop`,weight:2}]},Tt={id:`powerup.shield`,kind:`powerup`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`A bubble shield: the next 3 mistakes cause no fog or stumble. Earned by 25 correct keys in a row or by the word 'shield'.`,description:`Shield: the next 3 mistakes cause no fog and no stumble (30 s).`,effect:`shield`,durationMs:3e4,charges:3,earnedBy:[{source:`accuracy-streak`,threshold:25},{source:`word`},{source:`random-drop`,weight:2}]},Et={id:`powerup.slow-mo`,kind:`powerup`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Slow motion: world and hazards at half speed for 15 s, music pitched down. Earned by a steady rhythm streak or by the word 'slow'.`,description:`Slow-mo: world and hazards move at half speed for 15 s.`,effect:`slow-mo`,durationMs:15e3,earnedBy:[{source:`rhythm-streak`,threshold:20},{source:`word`},{source:`random-drop`,weight:1}]},Dt={id:`scale.buildings`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Buildings scale: from a tent to a floating city.`,icon:`🏠`,name:{en:`Buildings`,ru:`Здания`},steps:[{tier:1,name:{en:`tent`,ru:`палатка`},tts:{en:`You are a tent!`,ru:`Ты — палатка!`},model:`procedural:buildings-1`,icon:`⛺`},{tier:2,name:{en:`hut`,ru:`хижина`},tts:{en:`You are a hut!`,ru:`Ты — хижина!`},model:`procedural:buildings-2`,icon:`🛖`},{tier:3,name:{en:`house`,ru:`дом`},tts:{en:`You are a house!`,ru:`Ты — дом!`},model:`procedural:buildings-3`,icon:`🏠`},{tier:4,name:{en:`castle`,ru:`замок`},tts:{en:`You are a castle!`,ru:`Ты — замок!`},model:`procedural:buildings-4`,icon:`🏰`},{tier:5,name:{en:`skyscraper`,ru:`небоскрёб`},tts:{en:`You are a skyscraper!`,ru:`Ты — небоскрёб!`},model:`procedural:buildings-5`,icon:`🏙️`},{tier:6,name:{en:`space station`,ru:`космическая станция`},tts:{en:`You are a space station!`,ru:`Ты — космическая станция!`},model:`procedural:buildings-6`,icon:`🛰️`},{tier:7,name:{en:`floating city`,ru:`летающий город`},tts:{en:`You are a floating city!`,ru:`Ты — летающий город!`},model:`procedural:buildings-7`,icon:`🌆`}],rigHooks:{idle:`procedural:idle-buildings`,move:`procedural:move-buildings`,jump:`procedural:jump-buildings`,land:`procedural:land-buildings`,stumble:`procedural:stumble-buildings`,celebrate:`procedural:celebrate-buildings`,powerup:`procedural:powerup-buildings`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Ot={id:`scale.cats`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Cats scale: from a kitten to a sphinx.`,icon:`🐱`,name:{en:`Cats`,ru:`Кошки`},steps:[{tier:1,name:{en:`kitten`,ru:`котёнок`},tts:{en:`You are a kitten!`,ru:`Ты — котёнок!`},model:`procedural:cats-1`,icon:`🐱`},{tier:2,name:{en:`house cat`,ru:`домашний кот`},tts:{en:`You are a house cat!`,ru:`Ты — домашний кот!`},model:`procedural:cats-2`,icon:`🐈`},{tier:3,name:{en:`lynx`,ru:`рысь`},tts:{en:`You are a lynx!`,ru:`Ты — рысь!`},model:`procedural:cats-3`,icon:`🐈‍⬛`},{tier:4,name:{en:`leopard`,ru:`леопард`},tts:{en:`You are a leopard!`,ru:`Ты — леопард!`},model:`procedural:cats-4`,icon:`🐆`},{tier:5,name:{en:`lion`,ru:`лев`},tts:{en:`You are a lion!`,ru:`Ты — лев!`},model:`procedural:cats-5`,icon:`🦁`},{tier:6,name:{en:`tiger`,ru:`тигр`},tts:{en:`You are a tiger!`,ru:`Ты — тигр!`},model:`procedural:cats-6`,icon:`🐯`},{tier:7,name:{en:`sphinx`,ru:`сфинкс`},tts:{en:`You are a sphinx!`,ru:`Ты — сфинкс!`},model:`procedural:cats-7`,icon:`🗿`}],rigHooks:{idle:`procedural:idle-cats`,move:`procedural:move-cats`,jump:`procedural:jump-cats`,land:`procedural:land-cats`,stumble:`procedural:stumble-cats`,celebrate:`procedural:celebrate-cats`,powerup:`procedural:powerup-cats`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},kt={id:`scale.cosmos`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Cosmos scale: from a pebble to a galaxy.`,icon:`🪐`,name:{en:`Cosmos`,ru:`Космос`},steps:[{tier:1,name:{en:`pebble`,ru:`камешек`},tts:{en:`You are a pebble!`,ru:`Ты — камешек!`},model:`procedural:cosmos-1`,icon:`🪨`},{tier:2,name:{en:`asteroid`,ru:`астероид`},tts:{en:`You are a asteroid!`,ru:`Ты — астероид!`},model:`procedural:cosmos-2`,icon:`☄️`},{tier:3,name:{en:`moon`,ru:`луна`},tts:{en:`You are a moon!`,ru:`Ты — луна!`},model:`procedural:cosmos-3`,icon:`🌙`},{tier:4,name:{en:`planet`,ru:`планета`},tts:{en:`You are a planet!`,ru:`Ты — планета!`},model:`procedural:cosmos-4`,icon:`🪐`},{tier:5,name:{en:`star`,ru:`звезда`},tts:{en:`You are a star!`,ru:`Ты — звезда!`},model:`procedural:cosmos-5`,icon:`⭐`},{tier:6,name:{en:`nebula`,ru:`туманность`},tts:{en:`You are a nebula!`,ru:`Ты — туманность!`},model:`procedural:cosmos-6`,icon:`🌌`},{tier:7,name:{en:`galaxy`,ru:`галактика`},tts:{en:`You are a galaxy!`,ru:`Ты — галактика!`},model:`procedural:cosmos-7`,icon:`🌀`}],rigHooks:{idle:`procedural:idle-orbit`,move:`procedural:move-orbit`,jump:`procedural:jump-orbit`,land:`procedural:land-orbit`,stumble:`procedural:stumble-orbit`,celebrate:`procedural:celebrate-orbit`,powerup:`procedural:powerup-orbit`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},At={id:`scale.dragon`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Dragon scale: from an egg to a cosmic dragon.`,icon:`🐉`,name:{en:`Dragons`,ru:`Драконы`},steps:[{tier:1,name:{en:`egg`,ru:`яйцо`},tts:{en:`You are a egg!`,ru:`Ты — яйцо!`},model:`procedural:dragon-1`,icon:`🥚`},{tier:2,name:{en:`hatchling`,ru:`дракончик`},tts:{en:`You are a hatchling!`,ru:`Ты — дракончик!`},model:`procedural:dragon-2`,icon:`🐣`},{tier:3,name:{en:`whelp`,ru:`малыш-дракон`},tts:{en:`You are a whelp!`,ru:`Ты — малыш-дракон!`},model:`procedural:dragon-3`,icon:`🦎`},{tier:4,name:{en:`drake`,ru:`дракон`},tts:{en:`You are a drake!`,ru:`Ты — дракон!`},model:`procedural:dragon-4`,icon:`🐊`},{tier:5,name:{en:`wyvern`,ru:`виверна`},tts:{en:`You are a wyvern!`,ru:`Ты — виверна!`},model:`procedural:dragon-5`,icon:`🐲`},{tier:6,name:{en:`elder dragon`,ru:`старший дракон`},tts:{en:`You are a elder dragon!`,ru:`Ты — старший дракон!`},model:`procedural:dragon-6`,icon:`🐉`},{tier:7,name:{en:`cosmic dragon`,ru:`космический дракон`},tts:{en:`You are a cosmic dragon!`,ru:`Ты — космический дракон!`},model:`procedural:dragon-7`,icon:`🌠`}],rigHooks:{idle:`procedural:idle-wing`,move:`procedural:move-wing`,jump:`procedural:jump-wing`,land:`procedural:land-wing`,stumble:`procedural:stumble-wing`,celebrate:`procedural:celebrate-wing`,powerup:`procedural:powerup-wing`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},jt={id:`scale.flowers`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Flowers scale: from a seed to a complex bouquet.`,icon:`🌸`,name:{en:`Flowers`,ru:`Цветы`},steps:[{tier:1,name:{en:`seed`,ru:`семечко`},tts:{en:`You are a seed!`,ru:`Ты — семечко!`},model:`procedural:flowers-1`,icon:`🌰`},{tier:2,name:{en:`sprout`,ru:`росток`},tts:{en:`You are a sprout!`,ru:`Ты — росток!`},model:`procedural:flowers-2`,icon:`🌱`},{tier:3,name:{en:`bud`,ru:`бутон`},tts:{en:`You are a bud!`,ru:`Ты — бутон!`},model:`procedural:flowers-3`,icon:`🌷`},{tier:4,name:{en:`flower`,ru:`цветок`},tts:{en:`You are a flower!`,ru:`Ты — цветок!`},model:`procedural:flowers-4`,icon:`🌸`},{tier:5,name:{en:`bush`,ru:`куст`},tts:{en:`You are a bush!`,ru:`Ты — куст!`},model:`procedural:flowers-5`,icon:`🌿`},{tier:6,name:{en:`garden`,ru:`сад`},tts:{en:`You are a garden!`,ru:`Ты — сад!`},model:`procedural:flowers-6`,icon:`🏡`},{tier:7,name:{en:`bouquet`,ru:`букет`},tts:{en:`You are a bouquet!`,ru:`Ты — букет!`},model:`procedural:flowers-7`,icon:`💐`}],rigHooks:{idle:`procedural:idle-sway`,move:`procedural:move-sway`,jump:`procedural:jump-sway`,land:`procedural:land-sway`,stumble:`procedural:stumble-sway`,celebrate:`procedural:celebrate-sway`,powerup:`procedural:powerup-sway`,"ability:ability.jump":`procedural:petal-spring-jump`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Mt={id:`scale.human`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Human scale: from a toddler to an old wise kung-fu master.`,icon:`🧒`,name:{en:`People`,ru:`Люди`},steps:[{tier:1,name:{en:`toddler`,ru:`малыш`},tts:{en:`You are a toddler!`,ru:`Ты — малыш!`},model:`procedural:human-1`,icon:`👶`},{tier:2,name:{en:`kid`,ru:`ребёнок`},tts:{en:`You are a kid!`,ru:`Ты — ребёнок!`},model:`procedural:human-2`,icon:`🧒`},{tier:3,name:{en:`teen`,ru:`подросток`},tts:{en:`You are a teen!`,ru:`Ты — подросток!`},model:`procedural:human-3`,icon:`🧑`},{tier:4,name:{en:`athlete`,ru:`спортсмен`},tts:{en:`You are a athlete!`,ru:`Ты — спортсмен!`},model:`procedural:human-4`,icon:`🏃`},{tier:5,name:{en:`ninja`,ru:`ниндзя`},tts:{en:`You are a ninja!`,ru:`Ты — ниндзя!`},model:`procedural:human-5`,icon:`🥷`},{tier:6,name:{en:`master`,ru:`мастер`},tts:{en:`You are a master!`,ru:`Ты — мастер!`},model:`procedural:human-6`,icon:`🧘`},{tier:7,name:{en:`wise kung-fu master`,ru:`мудрый мастер кунг-фу`},tts:{en:`You are a wise kung-fu master!`,ru:`Ты — мудрый мастер кунг-фу!`},model:`procedural:human-7`,icon:`🧙`}],rigHooks:{idle:`procedural:idle-capsule`,move:`procedural:move-capsule`,jump:`procedural:jump-capsule`,land:`procedural:land-capsule`,stumble:`procedural:stumble-capsule`,celebrate:`procedural:celebrate-capsule`,powerup:`procedural:powerup-capsule`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Nt={id:`scale.light`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Light scale: from a spark to a supernova.`,icon:`🔥`,name:{en:`Light`,ru:`Свет`},steps:[{tier:1,name:{en:`spark`,ru:`искорка`},tts:{en:`You are a spark!`,ru:`Ты — искорка!`},model:`procedural:light-1`,icon:`✨`},{tier:2,name:{en:`candle`,ru:`свеча`},tts:{en:`You are a candle!`,ru:`Ты — свеча!`},model:`procedural:light-2`,icon:`🕯️`},{tier:3,name:{en:`lantern`,ru:`фонарик`},tts:{en:`You are a lantern!`,ru:`Ты — фонарик!`},model:`procedural:light-3`,icon:`🏮`},{tier:4,name:{en:`bonfire`,ru:`костёр`},tts:{en:`You are a bonfire!`,ru:`Ты — костёр!`},model:`procedural:light-4`,icon:`🔥`},{tier:5,name:{en:`lightning`,ru:`молния`},tts:{en:`You are a lightning!`,ru:`Ты — молния!`},model:`procedural:light-5`,icon:`⚡`},{tier:6,name:{en:`sun`,ru:`солнце`},tts:{en:`You are a sun!`,ru:`Ты — солнце!`},model:`procedural:light-6`,icon:`☀️`},{tier:7,name:{en:`supernova`,ru:`сверхновая`},tts:{en:`You are a supernova!`,ru:`Ты — сверхновая!`},model:`procedural:light-7`,icon:`💥`}],rigHooks:{idle:`procedural:idle-light`,move:`procedural:move-light`,jump:`procedural:jump-light`,land:`procedural:land-light`,stumble:`procedural:stumble-light`,celebrate:`procedural:celebrate-light`,powerup:`procedural:powerup-light`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Pt={id:`scale.music`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Music scale: from a note to a cosmic choir.`,icon:`🎵`,name:{en:`Music`,ru:`Музыка`},steps:[{tier:1,name:{en:`note`,ru:`нотка`},tts:{en:`You are a note!`,ru:`Ты — нотка!`},model:`procedural:music-1`,icon:`🎵`},{tier:2,name:{en:`drum`,ru:`барабан`},tts:{en:`You are a drum!`,ru:`Ты — барабан!`},model:`procedural:music-2`,icon:`🥁`},{tier:3,name:{en:`guitar`,ru:`гитара`},tts:{en:`You are a guitar!`,ru:`Ты — гитара!`},model:`procedural:music-3`,icon:`🎸`},{tier:4,name:{en:`band`,ru:`группа`},tts:{en:`You are a band!`,ru:`Ты — группа!`},model:`procedural:music-4`,icon:`🎤`},{tier:5,name:{en:`orchestra`,ru:`оркестр`},tts:{en:`You are a orchestra!`,ru:`Ты — оркестр!`},model:`procedural:music-5`,icon:`🎻`},{tier:6,name:{en:`stadium`,ru:`стадион`},tts:{en:`You are a stadium!`,ru:`Ты — стадион!`},model:`procedural:music-6`,icon:`🏟️`},{tier:7,name:{en:`cosmic choir`,ru:`космический хор`},tts:{en:`You are a cosmic choir!`,ru:`Ты — космический хор!`},model:`procedural:music-7`,icon:`🌌`}],rigHooks:{idle:`procedural:idle-music`,move:`procedural:move-music`,jump:`procedural:jump-music`,land:`procedural:land-music`,stumble:`procedural:stumble-music`,celebrate:`procedural:celebrate-music`,powerup:`procedural:powerup-music`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Ft={id:`scale.ocean`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Ocean scale: from a plankton to a kraken.`,icon:`🐟`,name:{en:`Ocean`,ru:`Океан`},steps:[{tier:1,name:{en:`plankton`,ru:`планктон`},tts:{en:`You are a plankton!`,ru:`Ты — планктон!`},model:`procedural:ocean-1`,icon:`🦠`},{tier:2,name:{en:`shrimp`,ru:`креветка`},tts:{en:`You are a shrimp!`,ru:`Ты — креветка!`},model:`procedural:ocean-2`,icon:`🦐`},{tier:3,name:{en:`fish`,ru:`рыбка`},tts:{en:`You are a fish!`,ru:`Ты — рыбка!`},model:`procedural:ocean-3`,icon:`🐟`},{tier:4,name:{en:`dolphin`,ru:`дельфин`},tts:{en:`You are a dolphin!`,ru:`Ты — дельфин!`},model:`procedural:ocean-4`,icon:`🐬`},{tier:5,name:{en:`shark`,ru:`акула`},tts:{en:`You are a shark!`,ru:`Ты — акула!`},model:`procedural:ocean-5`,icon:`🦈`},{tier:6,name:{en:`whale`,ru:`кит`},tts:{en:`You are a whale!`,ru:`Ты — кит!`},model:`procedural:ocean-6`,icon:`🐋`},{tier:7,name:{en:`kraken`,ru:`кракен`},tts:{en:`You are a kraken!`,ru:`Ты — кракен!`},model:`procedural:ocean-7`,icon:`🐙`}],rigHooks:{idle:`procedural:idle-ocean`,move:`procedural:move-ocean`,jump:`procedural:jump-ocean`,land:`procedural:land-ocean`,stumble:`procedural:stumble-ocean`,celebrate:`procedural:celebrate-ocean`,powerup:`procedural:powerup-ocean`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},It={id:`scale.robot`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Robot scale: from a simple robot to a complex transformer.`,icon:`🤖`,name:{en:`Robots`,ru:`Роботы`},steps:[{tier:1,name:{en:`simple robot`,ru:`простой робот`},tts:{en:`You are a simple robot!`,ru:`Ты — простой робот!`},model:`procedural:robot-1`,icon:`🔩`},{tier:2,name:{en:`helper bot`,ru:`робот-помощник`},tts:{en:`You are a helper bot!`,ru:`Ты — робот-помощник!`},model:`procedural:robot-2`,icon:`🤖`},{tier:3,name:{en:`rover`,ru:`луноход`},tts:{en:`You are a rover!`,ru:`Ты — луноход!`},model:`procedural:robot-3`,icon:`🛰️`},{tier:4,name:{en:`mech`,ru:`мех`},tts:{en:`You are a mech!`,ru:`Ты — мех!`},model:`procedural:robot-4`,icon:`🦾`},{tier:5,name:{en:`android`,ru:`андроид`},tts:{en:`You are a android!`,ru:`Ты — андроид!`},model:`procedural:robot-5`,icon:`🦿`},{tier:6,name:{en:`megabot`,ru:`мегабот`},tts:{en:`You are a megabot!`,ru:`Ты — мегабот!`},model:`procedural:robot-6`,icon:`🚀`},{tier:7,name:{en:`transformer`,ru:`трансформер`},tts:{en:`You are a transformer!`,ru:`Ты — трансформер!`},model:`procedural:robot-7`,icon:`🛸`}],rigHooks:{idle:`procedural:idle-boxy`,move:`procedural:move-boxy`,jump:`procedural:jump-boxy`,land:`procedural:land-boxy`,stumble:`procedural:stumble-boxy`,celebrate:`procedural:celebrate-boxy`,powerup:`procedural:powerup-boxy`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Lt={id:`scale.ships`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Ships scale: from a raft to a sky airship.`,icon:`⛵`,name:{en:`Ships`,ru:`Корабли`},steps:[{tier:1,name:{en:`raft`,ru:`плот`},tts:{en:`You are a raft!`,ru:`Ты — плот!`},model:`procedural:ships-1`,icon:`🪵`},{tier:2,name:{en:`canoe`,ru:`каноэ`},tts:{en:`You are a canoe!`,ru:`Ты — каноэ!`},model:`procedural:ships-2`,icon:`🛶`},{tier:3,name:{en:`sailboat`,ru:`парусник`},tts:{en:`You are a sailboat!`,ru:`Ты — парусник!`},model:`procedural:ships-3`,icon:`⛵`},{tier:4,name:{en:`brigantine`,ru:`бригантина`},tts:{en:`You are a brigantine!`,ru:`Ты — бригантина!`},model:`procedural:ships-4`,icon:`🚤`},{tier:5,name:{en:`galleon`,ru:`галеон`},tts:{en:`You are a galleon!`,ru:`Ты — галеон!`},model:`procedural:ships-5`,icon:`🚢`},{tier:6,name:{en:`flagship`,ru:`флагман`},tts:{en:`You are a flagship!`,ru:`Ты — флагман!`},model:`procedural:ships-6`,icon:`⚓`},{tier:7,name:{en:`sky airship`,ru:`небесный дирижабль`},tts:{en:`You are a sky airship!`,ru:`Ты — небесный дирижабль!`},model:`procedural:ships-7`,icon:`🎈`}],rigHooks:{idle:`procedural:idle-ships`,move:`procedural:move-ships`,jump:`procedural:jump-ships`,land:`procedural:land-ships`,stumble:`procedural:stumble-ships`,celebrate:`procedural:celebrate-ships`,powerup:`procedural:powerup-ships`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Rt={id:`scale.vehicles`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Vehicles scale: from a tricycle to a starship.`,icon:`🚲`,name:{en:`Vehicles`,ru:`Транспорт`},steps:[{tier:1,name:{en:`tricycle`,ru:`трёхколёсник`},tts:{en:`You are a tricycle!`,ru:`Ты — трёхколёсник!`},model:`procedural:vehicles-1`,icon:`🛺`},{tier:2,name:{en:`bicycle`,ru:`велосипед`},tts:{en:`You are a bicycle!`,ru:`Ты — велосипед!`},model:`procedural:vehicles-2`,icon:`🚲`},{tier:3,name:{en:`scooter`,ru:`скутер`},tts:{en:`You are a scooter!`,ru:`Ты — скутер!`},model:`procedural:vehicles-3`,icon:`🛵`},{tier:4,name:{en:`car`,ru:`машина`},tts:{en:`You are a car!`,ru:`Ты — машина!`},model:`procedural:vehicles-4`,icon:`🚗`},{tier:5,name:{en:`race car`,ru:`гоночная машина`},tts:{en:`You are a race car!`,ru:`Ты — гоночная машина!`},model:`procedural:vehicles-5`,icon:`🏎️`},{tier:6,name:{en:`jet`,ru:`самолёт`},tts:{en:`You are a jet!`,ru:`Ты — самолёт!`},model:`procedural:vehicles-6`,icon:`✈️`},{tier:7,name:{en:`starship`,ru:`звездолёт`},tts:{en:`You are a starship!`,ru:`Ты — звездолёт!`},model:`procedural:vehicles-7`,icon:`🚀`}],rigHooks:{idle:`procedural:idle-vehicles`,move:`procedural:move-vehicles`,jump:`procedural:jump-vehicles`,land:`procedural:land-vehicles`,stumble:`procedural:stumble-vehicles`,celebrate:`procedural:celebrate-vehicles`,powerup:`procedural:powerup-vehicles`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},zt={id:`scale.weather`,kind:`complexity-scale`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`PROMPT.md`,description:`Weather scale: from a dewdrop to a aurora.`,icon:`⛅`,name:{en:`Weather`,ru:`Погода`},steps:[{tier:1,name:{en:`dewdrop`,ru:`росинка`},tts:{en:`You are a dewdrop!`,ru:`Ты — росинка!`},model:`procedural:weather-1`,icon:`💧`},{tier:2,name:{en:`raindrop`,ru:`капля дождя`},tts:{en:`You are a raindrop!`,ru:`Ты — капля дождя!`},model:`procedural:weather-2`,icon:`🌧️`},{tier:3,name:{en:`cloud`,ru:`облако`},tts:{en:`You are a cloud!`,ru:`Ты — облако!`},model:`procedural:weather-3`,icon:`☁️`},{tier:4,name:{en:`shower`,ru:`ливень`},tts:{en:`You are a shower!`,ru:`Ты — ливень!`},model:`procedural:weather-4`,icon:`🌦️`},{tier:5,name:{en:`storm`,ru:`гроза`},tts:{en:`You are a storm!`,ru:`Ты — гроза!`},model:`procedural:weather-5`,icon:`⛈️`},{tier:6,name:{en:`tornado`,ru:`торнадо`},tts:{en:`You are a tornado!`,ru:`Ты — торнадо!`},model:`procedural:weather-6`,icon:`🌪️`},{tier:7,name:{en:`aurora`,ru:`северное сияние`},tts:{en:`You are a aurora!`,ru:`Ты — северное сияние!`},model:`procedural:weather-7`,icon:`🌌`}],rigHooks:{idle:`procedural:idle-weather`,move:`procedural:move-weather`,jump:`procedural:jump-weather`,land:`procedural:land-weather`,stumble:`procedural:stumble-weather`,celebrate:`procedural:celebrate-weather`,powerup:`procedural:powerup-weather`},customization:[{slot:`primary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`secondary-color`,kind:`color`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`pattern`,kind:`pattern`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`size`,kind:`size`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`accessory`,kind:`accessory`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`trail`,kind:`trail`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`aura`,kind:`aura`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]},{slot:`idle-style`,kind:`idle-style`,unlocks:[{range:[1,3],stars:0},{range:[4,7],stars:20},{range:[8,10],stars:60}]}]},Bt={id:`illustration.apple`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A shiny apple with a leaf (line art, 100×100).`,prompt:`Draw 'apple' as simple, friendly line art for children in a 100×100 SVG viewBox: a shiny apple with a leaf. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`apple`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🍎`,tags:[`word-art`]},Vt={id:`illustration.ball`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A bouncy ball (line art, 100×100).`,prompt:`Draw 'ball' as simple, friendly line art for children in a 100×100 SVG viewBox: a bouncy ball. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`ball`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`⚽`,tags:[`word-art`]},Ht={id:`illustration.bike`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A bicycle (line art, 100×100).`,prompt:`Draw 'bike' as simple, friendly line art for children in a 100×100 SVG viewBox: a bicycle. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`bike`]},entry:`art.svg`,animation:`drive`,fallbackEmoji:`🚲`,tags:[`word-art`]},Ut={id:`illustration.bird`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A little bird with wings up (line art, 100×100).`,prompt:`Draw 'bird' as simple, friendly line art for children in a 100×100 SVG viewBox: a little bird with wings up. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`bird`]},entry:`art.svg`,animation:`fly`,fallbackEmoji:`🐦`,tags:[`word-art`]},Wt={id:`illustration.boat`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A little boat on the water (line art, 100×100).`,prompt:`Draw 'boat' as simple, friendly line art for children in a 100×100 SVG viewBox: a little boat on the water. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`boat`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🚤`,tags:[`word-art`]},Gt={id:`illustration.book`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An open book (line art, 100×100).`,prompt:`Draw 'book' as simple, friendly line art for children in a 100×100 SVG viewBox: an open book. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`book`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`📖`,tags:[`word-art`]},Kt={id:`illustration.box`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A cardboard box (line art, 100×100).`,prompt:`Draw 'box' as simple, friendly line art for children in a 100×100 SVG viewBox: a cardboard box. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`box`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`📦`,tags:[`word-art`]},qt={id:`illustration.cake`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A birthday cake with a candle (line art, 100×100).`,prompt:`Draw 'cake' as simple, friendly line art for children in a 100×100 SVG viewBox: a birthday cake with a candle. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`cake`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🎂`,tags:[`word-art`]},Jt={id:`illustration.cat`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A cat face with whiskers (line art, 100×100).`,prompt:`Draw 'cat' as simple, friendly line art for children in a 100×100 SVG viewBox: a cat face with whiskers. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`cat`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🐱`,tags:[`word-art`]},Yt={id:`illustration.clock`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An alarm clock (line art, 100×100).`,prompt:`Draw 'clock' as simple, friendly line art for children in a 100×100 SVG viewBox: an alarm clock. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`clock`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`⏰`,tags:[`word-art`]},Xt={id:`illustration.cloud`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A fluffy cloud (line art, 100×100).`,prompt:`Draw 'cloud' as simple, friendly line art for children in a 100×100 SVG viewBox: a fluffy cloud. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`cloud`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`☁️`,tags:[`word-art`]},Zt={id:`illustration.dad`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A smiling dad with a round face and a mustache (line art, 100×100).`,prompt:`Draw 'dad' as simple, friendly line art for children in a 100×100 SVG viewBox: a smiling dad with a round face and a mustache. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`dad`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`👨`,tags:[`word-art`]},Qt={id:`illustration.deer`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A deer with antlers (line art, 100×100).`,prompt:`Draw 'deer' as simple, friendly line art for children in a 100×100 SVG viewBox: a deer with antlers. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`deer`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🦌`,tags:[`word-art`]},$t={id:`illustration.desk`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A small desk with a drawer and a lamp (line art, 100×100).`,prompt:`Draw 'desk' as simple, friendly line art for children in a 100×100 SVG viewBox: a small desk with a drawer and a lamp. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`desk`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🪑`,tags:[`word-art`]},en={id:`illustration.dog`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A puppy with floppy ears (line art, 100×100).`,prompt:`Draw 'dog' as simple, friendly line art for children in a 100×100 SVG viewBox: a puppy with floppy ears. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`dog`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🐶`,tags:[`word-art`]},tn={id:`illustration.dress`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A pretty dress with a wide skirt (line art, 100×100).`,prompt:`Draw 'dress' as simple, friendly line art for children in a 100×100 SVG viewBox: a pretty dress with a wide skirt. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`dress`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`👗`,tags:[`word-art`]},nn={id:`illustration.easel`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An easel holding a painted canvas (line art, 100×100).`,prompt:`Draw 'easel' as simple, friendly line art for children in a 100×100 SVG viewBox: an easel holding a painted canvas. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`easel`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🎨`,tags:[`word-art`]},rn={id:`illustration.eel`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A long wavy eel (line art, 100×100).`,prompt:`Draw 'eel' as simple, friendly line art for children in a 100×100 SVG viewBox: a long wavy eel. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`eel`]},entry:`art.svg`,animation:`swim`,fallbackEmoji:`🐍`,tags:[`word-art`]},an={id:`illustration.egg`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An egg with a little crack (line art, 100×100).`,prompt:`Draw 'egg' as simple, friendly line art for children in a 100×100 SVG viewBox: an egg with a little crack. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`egg`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🥚`,tags:[`word-art`]},on={id:`illustration.elf`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A cheerful elf with a pointy hat and ears (line art, 100×100).`,prompt:`Draw 'elf' as simple, friendly line art for children in a 100×100 SVG viewBox: a cheerful elf with a pointy hat and ears. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`elf`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🧝`,tags:[`word-art`]},sn={id:`illustration.fire`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A campfire with flames over crossed logs (line art, 100×100).`,prompt:`Draw 'fire' as simple, friendly line art for children in a 100×100 SVG viewBox: a campfire with flames over crossed logs. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`fire`]},entry:`art.svg`,animation:`pulse`,fallbackEmoji:`🔥`,tags:[`word-art`]},cn={id:`illustration.fish`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A round fish with a tail fin (line art, 100×100).`,prompt:`Draw 'fish' as simple, friendly line art for children in a 100×100 SVG viewBox: a round fish with a tail fin. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`fish`]},entry:`art.svg`,animation:`swim`,fallbackEmoji:`🐟`,tags:[`word-art`]},ln={id:`illustration.flag`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A flag waving on a pole (line art, 100×100).`,prompt:`Draw 'flag' as simple, friendly line art for children in a 100×100 SVG viewBox: a flag waving on a pole. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`flag`]},entry:`art.svg`,animation:`wave`,fallbackEmoji:`🚩`,tags:[`word-art`]},un={id:`illustration.flask`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A round lab flask with bubbling liquid (line art, 100×100).`,prompt:`Draw 'flask' as simple, friendly line art for children in a 100×100 SVG viewBox: a round lab flask with bubbling liquid. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`flask`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`⚗️`,tags:[`word-art`]},dn={id:`illustration.flower`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A flower with five petals (line art, 100×100).`,prompt:`Draw 'flower' as simple, friendly line art for children in a 100×100 SVG viewBox: a flower with five petals. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`flower`]},entry:`art.svg`,animation:`wave`,fallbackEmoji:`🌸`,tags:[`word-art`]},fn={id:`illustration.fox`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A fox face (line art, 100×100).`,prompt:`Draw 'fox' as simple, friendly line art for children in a 100×100 SVG viewBox: a fox face. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`fox`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🦊`,tags:[`word-art`]},pn={id:`illustration.frog`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A smiling frog (line art, 100×100).`,prompt:`Draw 'frog' as simple, friendly line art for children in a 100×100 SVG viewBox: a smiling frog. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`frog`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🐸`,tags:[`word-art`]},mn={id:`illustration.ghost`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A friendly little ghost (line art, 100×100).`,prompt:`Draw 'ghost' as simple, friendly line art for children in a 100×100 SVG viewBox: a friendly little ghost. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`ghost`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`👻`,tags:[`word-art`]},hn={id:`illustration.gift`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A wrapped gift box with a bow (line art, 100×100).`,prompt:`Draw 'gift' as simple, friendly line art for children in a 100×100 SVG viewBox: a wrapped gift box with a bow. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`gift`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🎁`,tags:[`word-art`]},gn={id:`illustration.giraffe`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A tall giraffe with spots (line art, 100×100).`,prompt:`Draw 'giraffe' as simple, friendly line art for children in a 100×100 SVG viewBox: a tall giraffe with spots. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`giraffe`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🦒`,tags:[`word-art`]},_n={id:`illustration.goat`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A goat with curly horns and a beard (line art, 100×100).`,prompt:`Draw 'goat' as simple, friendly line art for children in a 100×100 SVG viewBox: a goat with curly horns and a beard. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`goat`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🐐`,tags:[`word-art`]},vn={id:`illustration.grass`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`Tufts of grass (line art, 100×100).`,prompt:`Draw 'grass' as simple, friendly line art for children in a 100×100 SVG viewBox: tufts of grass. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`grass`]},entry:`art.svg`,animation:`wave`,fallbackEmoji:`🌿`,tags:[`word-art`]},yn={id:`illustration.heart`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A big heart (line art, 100×100).`,prompt:`Draw 'heart' as simple, friendly line art for children in a 100×100 SVG viewBox: a big heart. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`heart`]},entry:`art.svg`,animation:`pulse`,fallbackEmoji:`❤️`,tags:[`word-art`]},bn={id:`illustration.hill`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`Green hills under the sun (line art, 100×100).`,prompt:`Draw 'hill' as simple, friendly line art for children in a 100×100 SVG viewBox: green hills under the sun. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`hill`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`⛰️`,tags:[`word-art`]},xn={id:`illustration.house`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A small house with a door and window (line art, 100×100).`,prompt:`Draw 'house' as simple, friendly line art for children in a 100×100 SVG viewBox: a small house with a door and window. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`house`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🏠`,tags:[`word-art`]},Sn={id:`illustration.ice`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An ice cube (line art, 100×100).`,prompt:`Draw 'ice' as simple, friendly line art for children in a 100×100 SVG viewBox: an ice cube. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`ice`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`🧊`,tags:[`word-art`]},Cn={id:`illustration.key`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`An old-fashioned key (line art, 100×100).`,prompt:`Draw 'key' as simple, friendly line art for children in a 100×100 SVG viewBox: an old-fashioned key. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`key`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🔑`,tags:[`word-art`]},wn={id:`illustration.kid`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A happy kid waving (line art, 100×100).`,prompt:`Draw 'kid' as simple, friendly line art for children in a 100×100 SVG viewBox: a happy kid waving. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`kid`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🧒`,tags:[`word-art`]},Tn={id:`illustration.lake`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A calm lake between two hills under a sun (line art, 100×100).`,prompt:`Draw 'lake' as simple, friendly line art for children in a 100×100 SVG viewBox: a calm lake between two hills under a sun. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`lake`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🏞️`,tags:[`word-art`]},En={id:`illustration.leaf`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A single leaf with a center vein (line art, 100×100).`,prompt:`Draw 'leaf' as simple, friendly line art for children in a 100×100 SVG viewBox: a single leaf with a center vein. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`leaf`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🍃`,tags:[`word-art`]},Dn={id:`illustration.moon`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A crescent moon with stars (line art, 100×100).`,prompt:`Draw 'moon' as simple, friendly line art for children in a 100×100 SVG viewBox: a crescent moon with stars. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`moon`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🌙`,tags:[`word-art`]},On={id:`illustration.nest`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A bird nest with three eggs (line art, 100×100).`,prompt:`Draw 'nest' as simple, friendly line art for children in a 100×100 SVG viewBox: a bird nest with three eggs. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`nest`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🪺`,tags:[`word-art`]},kn={id:`illustration.pizza`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A slice of pizza (line art, 100×100).`,prompt:`Draw 'pizza' as simple, friendly line art for children in a 100×100 SVG viewBox: a slice of pizza. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`pizza`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`🍕`,tags:[`word-art`]},An={id:`illustration.queen`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A queen with a crown (line art, 100×100).`,prompt:`Draw 'queen' as simple, friendly line art for children in a 100×100 SVG viewBox: a queen with a crown. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`queen`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`👸`,tags:[`word-art`]},jn={id:`illustration.rake`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A garden rake (line art, 100×100).`,prompt:`Draw 'rake' as simple, friendly line art for children in a 100×100 SVG viewBox: a garden rake. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`rake`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🧹`,tags:[`word-art`]},Mn={id:`illustration.robot`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A friendly robot (line art, 100×100).`,prompt:`Draw 'robot' as simple, friendly line art for children in a 100×100 SVG viewBox: a friendly robot. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`robot`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🤖`,tags:[`word-art`]},Nn={id:`illustration.rocket`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A rocket blasting off (line art, 100×100).`,prompt:`Draw 'rocket' as simple, friendly line art for children in a 100×100 SVG viewBox: a rocket blasting off. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`rocket`]},entry:`art.svg`,animation:`fly`,fallbackEmoji:`🚀`,tags:[`word-art`]},Pn={id:`illustration.sail`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A sailboat with a big triangular sail (line art, 100×100).`,prompt:`Draw 'sail' as simple, friendly line art for children in a 100×100 SVG viewBox: a sailboat with a big triangular sail. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`sail`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`⛵`,tags:[`word-art`]},Fn={id:`illustration.salad`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A bowl of salad with leaves and a tomato (line art, 100×100).`,prompt:`Draw 'salad' as simple, friendly line art for children in a 100×100 SVG viewBox: a bowl of salad with leaves and a tomato. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`salad`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🥗`,tags:[`word-art`]},In={id:`illustration.sea`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`Rolling sea waves (line art, 100×100).`,prompt:`Draw 'sea' as simple, friendly line art for children in a 100×100 SVG viewBox: rolling sea waves. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`sea`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🌊`,tags:[`word-art`]},Ln={id:`illustration.seal`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A happy seal balancing a ball on its nose (line art, 100×100).`,prompt:`Draw 'seal' as simple, friendly line art for children in a 100×100 SVG viewBox: a happy seal balancing a ball on its nose. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`seal`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🦭`,tags:[`word-art`]},Rn={id:`illustration.seed`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A seed in the soil with a tiny sprout (line art, 100×100).`,prompt:`Draw 'seed' as simple, friendly line art for children in a 100×100 SVG viewBox: a seed in the soil with a tiny sprout. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`seed`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🌱`,tags:[`word-art`]},zn={id:`illustration.shark`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A friendly shark with a big fin (line art, 100×100).`,prompt:`Draw 'shark' as simple, friendly line art for children in a 100×100 SVG viewBox: a friendly shark with a big fin. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`shark`]},entry:`art.svg`,animation:`swim`,fallbackEmoji:`🦈`,tags:[`word-art`]},Bn={id:`illustration.shell`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A scallop seashell (line art, 100×100).`,prompt:`Draw 'shell' as simple, friendly line art for children in a 100×100 SVG viewBox: a scallop seashell. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`shell`]},entry:`art.svg`,animation:`wiggle`,fallbackEmoji:`🐚`,tags:[`word-art`]},Vn={id:`illustration.ski`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A pair of skis with poles (line art, 100×100).`,prompt:`Draw 'ski' as simple, friendly line art for children in a 100×100 SVG viewBox: a pair of skis with poles. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`ski`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🎿`,tags:[`word-art`]},Hn={id:`illustration.sled`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A wooden sled on two curled runners (line art, 100×100).`,prompt:`Draw 'sled' as simple, friendly line art for children in a 100×100 SVG viewBox: a wooden sled on two curled runners. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`sled`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🛷`,tags:[`word-art`]},Un={id:`illustration.snake`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A curvy snake (line art, 100×100).`,prompt:`Draw 'snake' as simple, friendly line art for children in a 100×100 SVG viewBox: a curvy snake. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`snake`]},entry:`art.svg`,animation:`swim`,fallbackEmoji:`🐍`,tags:[`word-art`]},Wn={id:`illustration.snow`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A snowflake (line art, 100×100).`,prompt:`Draw 'snow' as simple, friendly line art for children in a 100×100 SVG viewBox: a snowflake. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`snow`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`❄️`,tags:[`word-art`]},Gn={id:`illustration.star`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A five-pointed star (line art, 100×100).`,prompt:`Draw 'star' as simple, friendly line art for children in a 100×100 SVG viewBox: a five-pointed star. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`star`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`⭐`,tags:[`word-art`]},Kn={id:`illustration.sun`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A smiling sun with rays (line art, 100×100).`,prompt:`Draw 'sun' as simple, friendly line art for children in a 100×100 SVG viewBox: a smiling sun with rays. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`sun`]},entry:`art.svg`,animation:`spin`,fallbackEmoji:`☀️`,tags:[`word-art`]},qn={id:`illustration.tea`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A steaming cup of tea (line art, 100×100).`,prompt:`Draw 'tea' as simple, friendly line art for children in a 100×100 SVG viewBox: a steaming cup of tea. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`tea`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🍵`,tags:[`word-art`]},Jn={id:`illustration.tiger`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A tiger face with stripes (line art, 100×100).`,prompt:`Draw 'tiger' as simple, friendly line art for children in a 100×100 SVG viewBox: a tiger face with stripes. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`tiger`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🐯`,tags:[`word-art`]},Yn={id:`illustration.tree`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A round leafy tree (line art, 100×100).`,prompt:`Draw 'tree' as simple, friendly line art for children in a 100×100 SVG viewBox: a round leafy tree. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`tree`]},entry:`art.svg`,animation:`wave`,fallbackEmoji:`🌳`,tags:[`word-art`]},Xn={id:`illustration.truck`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A delivery truck (line art, 100×100).`,prompt:`Draw 'truck' as simple, friendly line art for children in a 100×100 SVG viewBox: a delivery truck. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`truck`]},entry:`art.svg`,animation:`drive`,fallbackEmoji:`🚚`,tags:[`word-art`]},Zn={id:`illustration.turtle`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A turtle with a patterned shell (line art, 100×100).`,prompt:`Draw 'turtle' as simple, friendly line art for children in a 100×100 SVG viewBox: a turtle with a patterned shell. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`turtle`]},entry:`art.svg`,animation:`float`,fallbackEmoji:`🐢`,tags:[`word-art`]},Qn={id:`illustration.wave`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A waving hand (line art, 100×100).`,prompt:`Draw 'wave' as simple, friendly line art for children in a 100×100 SVG viewBox: a waving hand. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`wave`]},entry:`art.svg`,animation:`wave`,fallbackEmoji:`👋`,tags:[`word-art`]},$n={id:`illustration.zebra`,kind:`illustration`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],description:`A zebra with stripes (line art, 100×100).`,prompt:`Draw 'zebra' as simple, friendly line art for children in a 100×100 SVG viewBox: a zebra with stripes. Use only basic shapes (circle, ellipse, rect, line, polygon, path) with no inline styles, so the game can stroke and animate them. Give fillable shapes class f1 (main colour), f2 (green/nature), f3 (warm accent) or f4 (light/skin/gold). 6–12 elements, readable at a glance, no text.`,words:{en:[`zebra`]},entry:`art.svg`,animation:`bounce`,fallbackEmoji:`🦓`,tags:[`word-art`]},er=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M50 30 Q70 18 82 38 Q90 64 70 84 Q60 90 50 84 Q40 90 30 84 Q10 64 18 38 Q30 18 50 30 Z"/>
  <path d="M50 30 Q50 18 56 10"/>
  <path class="f2" d="M54 18 Q68 8 72 18 Q60 24 54 18 Z"/>
</svg>
`,tr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f3" cx="50" cy="50" r="30"/>
  <path d="M22 40 Q50 52 78 40 M24 64 Q50 54 76 64 M50 20 Q40 50 50 80"/>
</svg>
`,nr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="26" cy="66" r="16"/>
  <circle cx="74" cy="66" r="16"/>
  <path d="M26 66 L44 40 L66 40 L74 66 M44 40 L54 66 L66 40 M40 32 L50 32 M66 40 L62 28 L72 28"/>
</svg>
`,rr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f1" cx="50" cy="56" rx="22" ry="16"/>
  <circle class="f1" cx="70" cy="42" r="10"/>
  <circle cx="73" cy="40" r="1.5"/>
  <polygon class="f4" points="80,42 90,45 80,48"/>
  <path class="f1" d="M44 50 Q36 26 54 34 Q50 44 44 50 Z"/>
  <path class="f1" d="M28 58 L14 52 L22 64 Z"/>
</svg>
`,ir=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M14 56 L86 56 L74 76 L26 76 Z"/>
  <rect class="f4" x="36" y="40" width="24" height="16" rx="2"/>
  <circle cx="48" cy="48" r="3"/>
  <path d="M8 84 Q18 80 28 84 T48 84 T68 84 T88 84"/>
</svg>
`,ar=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M50 26 Q30 16 12 24 L12 80 Q30 72 50 82 Z"/>
  <path class="f4" d="M50 26 Q70 16 88 24 L88 80 Q70 72 50 82 Z"/>
  <line x1="50" y1="26" x2="50" y2="82"/>
  <path d="M20 38 L40 40 M20 48 L40 50 M60 40 L80 38 M60 50 L80 48"/>
</svg>
`,or=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M18 36 L50 22 L82 36 L50 50 Z"/>
  <path class="f4" d="M18 36 L18 72 L50 86 L50 50 Z"/>
  <path class="f4" d="M50 50 L82 36 L82 72 L50 86 Z"/>
  <path d="M34 29 L66 43"/>
</svg>
`,sr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f3" x="18" y="48" width="64" height="36" rx="3"/>
  <path d="M18 58 Q28 66 38 58 T58 58 T82 58"/>
  <rect class="f1" x="46" y="30" width="8" height="18" rx="1"/>
  <path class="f4" d="M50 30 Q44 22 50 14 Q56 22 50 30 Z"/>
</svg>
`,cr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="54" r="26"/>
  <polygon class="f4" points="28,40 30,14 46,30"/>
  <polygon class="f4" points="72,40 70,14 54,30"/>
  <circle cx="41" cy="50" r="2.5"/>
  <circle cx="59" cy="50" r="2.5"/>
  <polygon class="f3" points="46,58 54,58 50,62"/>
  <path d="M50 62 Q44 68 40 64 M50 62 Q56 68 60 64"/>
  <path d="M20 56 L36 58 M20 64 L36 62 M80 56 L64 58 M80 64 L64 62"/>
</svg>
`,lr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="54" r="30"/>
  <circle cx="50" cy="54" r="2"/>
  <path d="M50 54 L50 36 M50 54 L64 62"/>
  <path d="M26 26 Q20 20 28 16 L36 24 M74 26 Q80 20 72 16 L64 24"/>
  <line x1="34" y1="82" x2="28" y2="90"/>
  <line x1="66" y1="82" x2="72" y2="90"/>
</svg>
`,ur=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M24 70 Q10 70 12 56 Q14 44 28 46 Q30 28 48 30 Q62 18 72 34 Q90 34 88 52 Q90 70 72 70 Z"/>
</svg>
`,dr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="38" r="20"/>
  <path d="M42 48 Q50 54 58 48"/>
  <circle cx="43" cy="34" r="2"/>
  <circle cx="57" cy="34" r="2"/>
  <path d="M30 28 Q50 8 70 28"/>
  <path class="f1" d="M28 90 Q50 60 72 90"/>
</svg>
`,fr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f4" cx="50" cy="62" rx="24" ry="14"/>
  <circle class="f4" cx="74" cy="40" r="9"/>
  <path d="M72 32 L66 18 L60 22 M66 18 L70 10 M78 32 L84 18 L90 22 M84 18 L80 10"/>
  <line x1="34" y1="74" x2="32" y2="92"/>
  <line x1="46" y1="76" x2="46" y2="92"/>
  <line x1="58" y1="76" x2="58" y2="92"/>
  <line x1="68" y1="72" x2="70" y2="92"/>
  <circle cx="77" cy="40" r="1.5"/>
</svg>
`,pr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f3" x="15" y="45" width="70" height="8" rx="3"/>
  <line x1="20" y1="53" x2="20" y2="88"/>
  <line x1="80" y1="53" x2="80" y2="88"/>
  <rect class="f3" x="55" y="53" width="22" height="16" rx="3"/>
  <line x1="62" y1="61" x2="70" y2="61"/>
  <path d="M30 45 L34 28 L44 22"/>
  <path class="f4" d="M40 18 L52 26 L44 30 Z"/>
</svg>
`,mr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="50" r="24"/>
  <ellipse class="f3" cx="26" cy="46" rx="8" ry="16"/>
  <ellipse class="f3" cx="74" cy="46" rx="8" ry="16"/>
  <circle cx="42" cy="44" r="2.5"/>
  <circle cx="58" cy="44" r="2.5"/>
  <ellipse class="f3" cx="50" cy="56" rx="5" ry="4"/>
  <path d="M44 64 Q50 70 56 64"/>
</svg>
`,hr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M40 15 L60 15 L58 38 L80 88 L20 88 L42 38 Z"/>
  <line x1="42" y1="38" x2="58" y2="38"/>
  <path d="M30 70 Q50 64 70 70"/>
  <line x1="44" y1="15" x2="40" y2="8"/>
  <line x1="56" y1="15" x2="60" y2="8"/>
</svg>
`,gr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f4" x="25" y="15" width="50" height="45" rx="3"/>
  <path class="f1" d="M35 45 Q45 25 55 40 T70 30"/>
  <circle class="f3" cx="40" cy="30" r="5"/>
  <line x1="30" y1="60" x2="20" y2="92"/>
  <line x1="70" y1="60" x2="80" y2="92"/>
  <line x1="50" y1="60" x2="50" y2="90"/>
</svg>
`,_r=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M10 58 Q25 30 40 54 T70 50 Q80 46 84 48"/>
  <path d="M10 66 Q25 40 40 62 T70 58 Q80 56 84 56"/>
  <ellipse class="f2" cx="86" cy="52" rx="8" ry="6"/>
  <circle cx="88" cy="50" r="1.5"/>
  <path d="M10 58 L4 62 L10 66"/>
</svg>
`,vr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M50 12 Q78 12 78 56 Q78 88 50 88 Q22 88 22 56 Q22 12 50 12 Z"/>
  <path d="M34 46 L42 40 L48 48 L56 40 L64 48"/>
</svg>
`,yr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="55" r="18"/>
  <path class="f2" d="M32 45 L50 10 L68 45 Z"/>
  <circle class="f3" cx="50" cy="10" r="4"/>
  <path d="M32 55 L20 48 L32 62 M68 55 L80 48 L68 62"/>
  <circle cx="44" cy="54" r="2"/>
  <circle cx="56" cy="54" r="2"/>
  <path d="M44 63 Q50 68 56 63"/>
</svg>
`,br=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M50 15 Q75 40 66 64 Q62 74 50 74 Q36 74 34 62 Q30 44 44 30 Q46 46 52 44 Q48 30 50 15 Z"/>
  <path class="f4" d="M50 50 Q60 58 56 68 Q50 72 44 66 Q42 58 50 50 Z"/>
  <line x1="25" y1="88" x2="75" y2="76"/>
  <line x1="25" y1="76" x2="75" y2="88"/>
</svg>
`,xr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M20 50 Q45 22 72 50 Q45 78 20 50 Z"/>
  <polygon class="f1" points="72,50 90,36 90,64"/>
  <circle cx="34" cy="46" r="3"/>
  <path d="M44 40 Q48 50 44 60"/>
</svg>
`,Sr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <line x1="25" y1="10" x2="25" y2="92"/>
  <path class="f3" d="M25 14 Q45 6 60 16 T90 16 L90 46 Q75 38 60 46 T25 44 Z"/>
  <circle cx="25" cy="10" r="3"/>
</svg>
`,Cr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M42 15 L42 40 L22 78 Q20 86 30 86 L70 86 Q80 86 78 78 L58 40 L58 15"/>
  <line x1="38" y1="15" x2="62" y2="15"/>
  <path class="f2" d="M28 68 L72 68"/>
  <circle cx="46" cy="58" r="3"/>
  <circle cx="54" cy="50" r="2"/>
</svg>
`,wr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f3" cx="50" cy="30" r="9"/>
  <circle class="f3" cx="64" cy="40" r="9"/>
  <circle class="f3" cx="58" cy="56" r="9"/>
  <circle class="f3" cx="42" cy="56" r="9"/>
  <circle class="f3" cx="36" cy="40" r="9"/>
  <circle class="f4" cx="50" cy="44" r="7"/>
  <path d="M50 62 L50 92"/>
  <path class="f2" d="M50 80 Q36 72 32 78 Q40 86 50 84"/>
</svg>
`,Tr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M20 22 L36 44 L50 40 L64 44 L80 22 L78 52 Q66 80 50 84 Q34 80 22 52 Z"/>
  <path class="f4" d="M36 60 Q50 70 64 60 Q60 80 50 84 Q40 80 36 60 Z"/>
  <circle cx="40" cy="52" r="2.5"/>
  <circle cx="60" cy="52" r="2.5"/>
  <circle cx="50" cy="72" r="3"/>
</svg>
`,Er=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f2" cx="50" cy="60" rx="32" ry="24"/>
  <circle class="f2" cx="34" cy="34" r="10"/>
  <circle class="f2" cx="66" cy="34" r="10"/>
  <circle cx="34" cy="34" r="4"/>
  <circle cx="66" cy="34" r="4"/>
  <path d="M34 66 Q50 76 66 66"/>
</svg>
`,Dr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M25 85 L25 45 Q25 15 50 15 Q75 15 75 45 L75 85 L66 78 L58 86 L50 78 L42 86 L34 78 Z"/>
  <circle cx="42" cy="42" r="4"/>
  <circle cx="58" cy="42" r="4"/>
  <ellipse cx="50" cy="56" rx="4" ry="5"/>
</svg>
`,Or=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f3" x="18" y="42" width="64" height="46" rx="3"/>
  <rect class="f3" x="14" y="32" width="72" height="12" rx="3"/>
  <line x1="50" y1="32" x2="50" y2="88"/>
  <path class="f4" d="M50 32 Q34 14 30 24 Q30 32 50 32 Q66 14 70 24 Q70 32 50 32"/>
</svg>
`,kr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M30 90 L32 60 Q30 46 46 46 L60 46 L60 20 Q60 10 70 12 L78 16 L72 22 L68 24 L68 60 L66 90"/>
  <circle class="f3" cx="44" cy="58" r="3"/>
  <circle class="f3" cx="56" cy="66" r="3"/>
  <circle class="f3" cx="64" cy="36" r="3"/>
  <circle cx="70" cy="16" r="1.5"/>
  <line x1="64" y1="8" x2="64" y2="4"/>
  <line x1="70" y1="8" x2="72" y2="4"/>
</svg>
`,Ar=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M30 30 Q50 20 70 30 Q72 60 50 72 Q28 60 30 30 Z"/>
  <path d="M34 28 Q24 10 38 12 M66 28 Q76 10 62 12"/>
  <circle cx="42" cy="42" r="2"/>
  <circle cx="58" cy="42" r="2"/>
  <path d="M46 72 L50 86 L54 72"/>
</svg>
`,jr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M15 88 Q20 60 14 40 M22 88 Q28 56 36 34 M34 88 Q40 66 34 48 M46 88 Q50 52 60 30 M58 88 Q62 64 56 44 M70 88 Q74 58 86 40 M80 88 Q82 70 78 56"/>
  <line x1="8" y1="88" x2="92" y2="88"/>
</svg>
`,Mr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M50 85 Q12 60 14 36 Q16 16 34 16 Q46 16 50 30 Q54 16 66 16 Q84 16 86 36 Q88 60 50 85 Z"/>
</svg>
`,Nr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f2" d="M5 85 Q30 35 55 85 Z"/>
  <path class="f2" d="M40 85 Q65 45 95 85 Z"/>
  <circle class="f4" cx="78" cy="24" r="9"/>
</svg>
`,Pr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon class="f3" points="15,48 50,15 85,48"/>
  <rect class="f4" x="22" y="48" width="56" height="40" rx="1"/>
  <rect class="f1" x="42" y="62" width="16" height="26" rx="1"/>
  <rect class="f1" x="28" y="54" width="12" height="12" rx="1"/>
</svg>
`,Fr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M28 32 L58 20 L82 34 L52 46 Z"/>
  <path class="f1" d="M28 32 L28 70 L52 84 L52 46 Z"/>
  <path class="f1" d="M52 46 L82 34 L82 72 L52 84 Z"/>
  <path d="M60 40 L70 36"/>
</svg>
`,Ir=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="28" cy="50" r="14"/>
  <circle cx="28" cy="50" r="5"/>
  <path d="M42 50 L88 50 L88 62 M76 50 L76 60 M66 50 L66 58"/>
</svg>
`,Lr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="28" r="12"/>
  <circle cx="46" cy="26" r="1.5"/>
  <circle cx="54" cy="26" r="1.5"/>
  <path d="M45 32 Q50 36 55 32"/>
  <path class="f1" d="M50 40 L50 68"/>
  <path d="M50 46 L34 34 M50 46 L66 54"/>
  <path d="M50 68 L40 88 M50 68 L60 88"/>
</svg>
`,Rr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f2" d="M5 60 L30 35 L50 55 L70 30 L95 60"/>
  <ellipse class="f1" cx="50" cy="72" rx="42" ry="12"/>
  <path d="M30 72 Q38 68 46 72 M54 76 Q62 72 70 76"/>
  <circle class="f4" cx="78" cy="20" r="7"/>
</svg>
`,zr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f2" d="M20 80 Q20 20 80 20 Q80 80 20 80 Z"/>
  <path d="M20 80 L70 30"/>
  <path d="M38 62 L36 48 M50 50 L48 36 M50 50 L62 52 M38 62 L50 64"/>
</svg>
`,Br=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M58 14 Q24 20 26 52 Q30 84 64 86 Q40 74 40 50 Q40 26 58 14 Z"/>
  <polygon class="f4" points="74,30 77,37 84,37 78,42 80,49 74,45 68,49 70,42 64,37 71,37"/>
  <circle cx="80" cy="66" r="2"/>
</svg>
`,Vr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f1" cx="38" cy="52" rx="8" ry="10"/>
  <ellipse class="f1" cx="50" cy="48" rx="8" ry="10"/>
  <ellipse class="f1" cx="62" cy="52" rx="8" ry="10"/>
  <path class="f3" d="M14 56 Q50 92 86 56 Z"/>
  <path d="M20 62 L80 62 M24 70 L76 70"/>
</svg>
`,Hr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M14 22 Q50 8 86 22 L50 92 Z"/>
  <path class="f3" d="M14 22 Q50 8 86 22 L82 30 Q50 18 18 30 Z"/>
  <circle class="f3" cx="44" cy="40" r="5"/>
  <circle class="f3" cx="58" cy="50" r="5"/>
  <circle class="f3" cx="48" cy="62" r="4"/>
</svg>
`,Ur=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="52" r="18"/>
  <polygon class="f4" points="30,30 36,14 44,26 50,10 56,26 64,14 70,30"/>
  <circle cx="44" cy="50" r="2"/>
  <circle cx="56" cy="50" r="2"/>
  <path d="M44 60 Q50 64 56 60"/>
  <path class="f1" d="M28 92 Q50 64 72 92"/>
</svg>
`,Wr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <line x1="50" y1="10" x2="50" y2="62"/>
  <rect class="f3" x="26" y="62" width="48" height="6" rx="3"/>
  <line x1="30" y1="68" x2="30" y2="84"/>
  <line x1="40" y1="68" x2="40" y2="84"/>
  <line x1="50" y1="68" x2="50" y2="84"/>
  <line x1="60" y1="68" x2="60" y2="84"/>
  <line x1="70" y1="68" x2="70" y2="84"/>
</svg>
`,Gr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f1" x="26" y="30" width="48" height="36" rx="3"/>
  <circle class="f4" cx="40" cy="46" r="5"/>
  <circle class="f4" cx="60" cy="46" r="5"/>
  <path d="M40 58 L60 58"/>
  <line x1="50" y1="30" x2="50" y2="18"/>
  <circle class="f3" cx="50" cy="15" r="4"/>
  <rect class="f1" x="32" y="66" width="36" height="20" rx="3"/>
  <line x1="26" y1="72" x2="16" y2="82"/>
  <line x1="74" y1="72" x2="84" y2="82"/>
</svg>
`,Kr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M50 8 Q68 26 66 60 L34 60 Q32 26 50 8 Z"/>
  <circle class="f1" cx="50" cy="34" r="7"/>
  <path class="f3" d="M34 48 L22 66 L34 62 Z M66 48 L78 66 L66 62 Z"/>
  <path class="f3" d="M40 62 Q50 92 60 62"/>
</svg>
`,qr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon class="f4" points="50,12 50,64 80,64"/>
  <polygon class="f1" points="46,22 46,64 22,64"/>
  <line x1="48" y1="10" x2="48" y2="68"/>
  <path class="f3" d="M18 70 L82 70 L72 84 L28 84 Z"/>
  <path d="M10 90 Q20 86 30 90 T50 90 T70 90 T90 90"/>
</svg>
`,Jr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M15 50 Q50 95 85 50 Z"/>
  <path class="f2" d="M25 50 Q30 30 42 44"/>
  <path class="f2" d="M40 48 Q50 25 60 46"/>
  <path class="f2" d="M58 47 Q70 30 76 50"/>
  <circle class="f3" cx="48" cy="45" r="6"/>
</svg>
`,Yr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M5 55 Q20 40 35 55 T65 55 T95 55 L95 90 L5 90 Z"/>
  <path d="M5 72 Q20 62 35 72 T65 72 T95 72"/>
  <circle class="f4" cx="80" cy="20" r="7"/>
</svg>
`,Xr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M14 84 Q14 66 34 62 Q54 58 60 44 Q64 34 74 36 Q84 38 82 50 Q80 60 70 66 Q60 84 14 84 Z"/>
  <circle class="f3" cx="76" cy="20" r="9"/>
  <circle cx="74" cy="44" r="2"/>
  <path d="M82 46 L88 44"/>
  <path d="M40 84 L34 92 L48 92 Z"/>
  <path d="M14 84 L6 78 M14 84 L6 90"/>
</svg>
`,Zr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f3" cx="50" cy="72" rx="14" ry="9"/>
  <path d="M50 63 L50 40"/>
  <path class="f2" d="M50 48 Q35 40 32 30 Q46 30 50 42"/>
  <path class="f2" d="M50 44 Q62 34 70 34 Q66 46 50 48"/>
  <line x1="15" y1="82" x2="85" y2="82"/>
</svg>
`,Qr=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M10 55 Q40 30 80 48 L92 40 L90 55 L92 70 L80 62 Q40 76 10 55 Z"/>
  <polygon class="f1" points="42,38 52,18 58,40"/>
  <circle cx="22" cy="50" r="2"/>
  <path d="M18 60 Q24 62 30 60"/>
</svg>
`,$r=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M50 85 L18 45 Q50 5 82 45 Z"/>
  <path d="M50 85 L30 30 M50 85 L50 22 M50 85 L70 30 M50 85 L22 46 M50 85 L78 46"/>
</svg>
`,ei=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f3" d="M20 85 L70 20 Q74 16 76 22 L28 88 Z"/>
  <path class="f3" d="M34 88 L82 26 Q86 22 88 28 L42 92 Z"/>
  <line x1="30" y1="20" x2="50" y2="80"/>
  <line x1="60" y1="30" x2="62" y2="80"/>
</svg>
`,ti=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f3" x="20" y="45" width="60" height="12" rx="3"/>
  <path d="M15 70 L80 70 Q92 70 90 58"/>
  <line x1="30" y1="57" x2="30" y2="70"/>
  <line x1="70" y1="57" x2="70" y2="70"/>
  <path d="M15 70 Q8 70 10 62"/>
</svg>
`,ni=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M12 80 Q30 60 48 76 T80 66 Q90 56 82 44 Q74 36 78 28"/>
  <path d="M16 84 Q30 66 48 82 T84 70 Q96 56 86 42 Q80 36 82 30"/>
  <ellipse class="f2" cx="80" cy="22" rx="9" ry="7"/>
  <circle cx="83" cy="20" r="1.5"/>
  <path d="M88 24 L94 26 M94 26 L96 22 M94 26 L96 30"/>
</svg>
`,ri=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path d="M50 12 L50 88 M17 31 L83 69 M17 69 L83 31"/>
  <path d="M44 20 L50 26 L56 20 M44 80 L50 74 L56 80 M20 40 L28 38 L26 30 M80 60 L72 62 L74 70 M20 60 L28 62 L26 70 M80 40 L72 38 L74 30"/>
</svg>
`,ii=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <polygon class="f4" points="50,10 61,38 92,38 67,56 77,86 50,68 23,86 33,56 8,38 39,38"/>
</svg>
`,ai=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="50" r="18"/>
  <path d="M50 10 L50 22 M50 78 L50 90 M10 50 L22 50 M78 50 L90 50 M22 22 L30 30 M70 70 L78 78 M22 78 L30 70 M70 30 L78 22"/>
  <path d="M42 54 Q50 60 58 54"/>
  <circle cx="43" cy="46" r="1.5"/>
  <circle cx="57" cy="46" r="1.5"/>
</svg>
`,oi=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f1" d="M22 45 L78 45 L72 80 Q70 88 60 88 L40 88 Q30 88 28 80 Z"/>
  <path d="M77 52 Q92 52 88 66 Q84 72 73 70"/>
  <path d="M40 36 Q34 28 40 20 M52 36 Q46 28 52 20 M64 36 Q58 28 64 20"/>
</svg>
`,si=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f4" cx="50" cy="52" r="30"/>
  <circle class="f4" cx="28" cy="26" r="8"/>
  <circle class="f4" cx="72" cy="26" r="8"/>
  <circle cx="40" cy="46" r="3"/>
  <circle cx="60" cy="46" r="3"/>
  <path class="f3" d="M46 58 L54 58 L50 63 Z"/>
  <path d="M50 63 L50 68 M42 70 Q50 74 58 70"/>
  <path d="M50 22 L50 32 M42 24 L44 32 M58 24 L56 32 M22 50 L32 52 M78 50 L68 52"/>
</svg>
`,ci=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle class="f2" cx="50" cy="38" r="26"/>
  <circle class="f2" cx="34" cy="50" r="14"/>
  <circle class="f2" cx="66" cy="50" r="14"/>
  <rect class="f3" x="44" y="58" width="12" height="32" rx="2"/>
  <line x1="20" y1="90" x2="80" y2="90"/>
</svg>
`,li=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect class="f1" x="10" y="36" width="52" height="34" rx="3"/>
  <path class="f3" d="M62 46 L80 46 L90 58 L90 70 L62 70 Z"/>
  <circle class="f4" cx="28" cy="74" r="8"/>
  <circle class="f4" cx="74" cy="74" r="8"/>
  <rect x="68" y="50" width="12" height="8" rx="1"/>
</svg>
`,ui=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f2" d="M18 66 Q20 30 52 30 Q84 30 84 66 Z"/>
  <circle class="f4" cx="90" cy="58" r="8"/>
  <circle cx="92" cy="56" r="1.5"/>
  <path d="M36 66 L32 80 M70 66 L74 80"/>
  <path d="M36 52 L52 40 L68 52 L52 64 Z"/>
</svg>
`,di=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <path class="f4" d="M34 86 Q20 70 22 54 L24 40 Q26 34 30 40 L32 52 L32 22 Q34 16 38 22 L40 48 L42 16 Q46 10 48 18 L50 48 L54 22 Q58 16 60 24 L58 56 Q64 46 70 44 Q76 46 70 56 Q62 76 52 86 Z"/>
  <path d="M74 20 Q82 24 82 32 M80 12 Q90 18 90 30"/>
</svg>
`,fi=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <ellipse class="f4" cx="46" cy="58" rx="26" ry="14"/>
  <path d="M70 54 L80 30 Q86 24 90 32 L88 40 L80 44"/>
  <path d="M30 50 L34 70 M42 46 L44 72 M54 46 L54 72 M64 48 L62 70"/>
  <line x1="26" y1="68" x2="24" y2="90"/>
  <line x1="36" y1="70" x2="36" y2="90"/>
  <line x1="56" y1="70" x2="56" y2="90"/>
  <line x1="66" y1="68" x2="68" y2="90"/>
  <circle cx="85" cy="32" r="1.5"/>
</svg>
`,pi={id:`campaign.en`,kind:`campaign-rules`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Campaign slot rules for English: 26 letter levels + 7 key-group levels. Milestone 1 pins levels 1–4 to the vertical-slice templates; later slots are filled by seed from templates that satisfy minLetters and the view band (relaxed if nothing fits).`,description:`English campaign: view arc 2D → isometric → 3D → mixed → 4D finale; M1 pins levels 1–4.`,language:`lang.en`,slots:[{level:1,viewBand:[`2d`],havocIntensity:[0,0],fixedTemplate:`template.pulse-runner@1`},{level:2,viewBand:[`2d`],havocIntensity:[0,.26],fixedTemplate:`template.platformer@1`},{level:3,viewBand:[`2d`],havocIntensity:[0,.29],fixedTemplate:`template.tower-defence@1`},{level:4,viewBand:[`2d`],havocIntensity:[0,.32],fixedTemplate:`template.racer@1`},{level:5,viewBand:[`2d`],havocIntensity:[0,.35]},{level:6,viewBand:[`2d`],havocIntensity:[0,.38]},{level:7,viewBand:[`2d`,`2.5d`,`iso`],havocIntensity:[0,.41],boss:!0},{level:8,viewBand:[`iso`],havocIntensity:[0,.44]},{level:9,viewBand:[`iso`],havocIntensity:[0,.47]},{level:10,viewBand:[`iso`],havocIntensity:[0,.5]},{level:11,viewBand:[`iso`],havocIntensity:[0,.53]},{level:12,viewBand:[`3d`,`fpv`],havocIntensity:[0,.56]},{level:13,viewBand:[`3d`,`fpv`],havocIntensity:[0,.59]},{level:14,viewBand:[`3d`,`fpv`],havocIntensity:[0,.62]},{level:15,viewBand:[`3d`,`fpv`],havocIntensity:[0,.65]},{level:16,viewBand:[`split`,`3d`,`iso`,`2d`],havocIntensity:[0,.68]},{level:17,viewBand:[`3d`,`fpv`],havocIntensity:[0,.71]},{level:18,viewBand:[`3d`,`fpv`],havocIntensity:[0,.74]},{level:19,viewBand:[`3d`,`fpv`],havocIntensity:[0,.77]},{level:20,viewBand:[`3d`,`fpv`],havocIntensity:[0,.8]},{level:21,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.83]},{level:22,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.86]},{level:23,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.89],boss:!0},{level:24,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.92]},{level:25,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.95]},{level:26,viewBand:[`4d`,`3d`,`iso`,`2d`],havocIntensity:[0,.98],boss:!0},{level:27,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:28,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:29,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:30,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:31,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:32,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:33,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]}],constraints:{noTemplateRepeatWithin:3,noStyleTwice:!1,dictatedShare:.6},dropTable:[{item:`powerup.shield@1`,weight:2},{item:`powerup.slow-mo@1`,weight:1},{item:`powerup.reveal@1`,weight:2}],pityAfterTicks:300},mi={id:`campaign.ru`,kind:`campaign-rules`,version:1,license:`CC0-1.0`,authors:[`agent:claude`],prompt:`Campaign slot rules for Russian: 32 letter levels + 7 key-group levels. The English view arc (2D → isometric → 3D → mixed → 4D finale) is stretched proportionally over 32 letter levels; levels 1–4 are pinned to the vertical-slice templates like English, the last letter level is the finale, and key-group slots follow.`,description:`Russian campaign: the English view arc stretched to 32 letter levels, then 7 key-group levels.`,language:`lang.ru`,slots:[{level:1,viewBand:[`2d`],havocIntensity:[0,0],fixedTemplate:`template.pulse-runner@1`},{level:2,viewBand:[`2d`],havocIntensity:[0,.26],fixedTemplate:`template.platformer@1`},{level:3,viewBand:[`2d`],havocIntensity:[0,.29],fixedTemplate:`template.tower-defence@1`},{level:4,viewBand:[`2d`],havocIntensity:[0,.32],fixedTemplate:`template.racer@1`},{level:5,viewBand:[`2d`],havocIntensity:[0,.35]},{level:6,viewBand:[`2d`],havocIntensity:[0,.35]},{level:7,viewBand:[`2d`],havocIntensity:[0,.38]},{level:8,viewBand:[`2d`],havocIntensity:[0,.38]},{level:9,viewBand:[`2d`,`2.5d`,`iso`],havocIntensity:[0,.41],boss:!0},{level:10,viewBand:[`iso`],havocIntensity:[0,.44]},{level:11,viewBand:[`iso`],havocIntensity:[0,.47]},{level:12,viewBand:[`iso`],havocIntensity:[0,.5]},{level:13,viewBand:[`iso`],havocIntensity:[0,.53]},{level:14,viewBand:[`iso`],havocIntensity:[0,.53]},{level:15,viewBand:[`3d`,`fpv`],havocIntensity:[0,.56]},{level:16,viewBand:[`3d`,`fpv`],havocIntensity:[0,.59]},{level:17,viewBand:[`3d`,`fpv`],havocIntensity:[0,.62]},{level:18,viewBand:[`3d`,`fpv`],havocIntensity:[0,.65]},{level:19,viewBand:[`3d`,`fpv`],havocIntensity:[0,.65]},{level:20,viewBand:[`split`,`3d`,`iso`,`2d`],havocIntensity:[0,.68]},{level:21,viewBand:[`3d`,`fpv`],havocIntensity:[0,.71]},{level:22,viewBand:[`3d`,`fpv`],havocIntensity:[0,.74]},{level:23,viewBand:[`3d`,`fpv`],havocIntensity:[0,.77]},{level:24,viewBand:[`3d`,`fpv`],havocIntensity:[0,.8]},{level:25,viewBand:[`3d`,`fpv`],havocIntensity:[0,.8]},{level:26,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.83]},{level:27,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.86]},{level:28,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.89],boss:!0},{level:29,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.92]},{level:30,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.92]},{level:31,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,.95]},{level:32,viewBand:[`4d`,`3d`,`iso`,`2d`],havocIntensity:[0,.98],boss:!0},{level:33,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:34,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:35,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:36,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:37,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:38,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]},{level:39,viewBand:[`2d`,`iso`,`3d`],havocIntensity:[0,1]}],constraints:{noTemplateRepeatWithin:3,noStyleTwice:!1,dictatedShare:.6},dropTable:[{item:`powerup.shield@1`,weight:2},{item:`powerup.slow-mo@1`,weight:1},{item:`powerup.reveal@1`,weight:2}],pityAfterTicks:300},hi=e=>Object.values(e),gi=hi(Object.assign({"../../content/languages/en/manifest.json":Pe,"../../content/languages/ru/manifest.json":Fe})),_i=Object.assign({"../../content/languages/en/words/blocklist.txt":Ie,"../../content/languages/en/words/common.txt":Le,"../../content/languages/en/words/easter-egg.txt":Re,"../../content/languages/ru/words/blocklist.txt":ze,"../../content/languages/ru/words/common.txt":Be,"../../content/languages/ru/words/easter-egg.txt":Ve}),vi=hi(Object.assign({"../../content/templates/brick-breaker/manifest.json":He,"../../content/templates/bubble-popper/manifest.json":Ue,"../../content/templates/climbing-tower/manifest.json":We,"../../content/templates/crystal-gallery/manifest.json":Ge,"../../content/templates/dungeon-crawler/manifest.json":Ke,"../../content/templates/garden-grower/manifest.json":qe,"../../content/templates/marble-run/manifest.json":Je,"../../content/templates/maze-snake/manifest.json":Ye,"../../content/templates/platformer/manifest.json":Xe,"../../content/templates/pulse-runner/manifest.json":Ze,"../../content/templates/racer/manifest.json":Qe,"../../content/templates/space-tunnel/manifest.json":$e,"../../content/templates/tower-defence/manifest.json":et,"../../content/templates/wave-surfing/manifest.json":tt,"../../content/templates/word-city/manifest.json":nt})),yi=hi(Object.assign({"../../content/styles/flat/manifest.json":rt,"../../content/styles/neon/manifest.json":it})),bi=hi(Object.assign({"../../content/palettes/dusk.json":at,"../../content/palettes/meadow.json":ot,"../../content/palettes/synth.json":st})),xi=hi(Object.assign({"../../content/havocs/gravity-tilt/manifest.json":ct,"../../content/havocs/map-rotate/manifest.json":lt})),Si=hi(Object.assign({"../../content/abilities/home-row-secret.json":ut,"../../content/abilities/jump.json":dt,"../../content/abilities/shield-word.json":ft,"../../content/abilities/slow-word.json":pt,"../../content/abilities/voice-chipmunk.json":mt,"../../content/abilities/voice-giant.json":ht,"../../content/abilities/voice-robot.json":gt,"../../content/abilities/voice-sleepy.json":_t,"../../content/abilities/voice-speedy.json":vt})),Ci=hi(Object.assign({"../../content/voices/chipmunk.json":yt,"../../content/voices/giant.json":bt,"../../content/voices/robot.json":xt,"../../content/voices/sleepy.json":St,"../../content/voices/speedy.json":Ct})),wi=hi(Object.assign({"../../content/powerups/reveal.json":wt,"../../content/powerups/shield.json":Tt,"../../content/powerups/slow-mo.json":Et})),Ti=hi(Object.assign({"../../content/scales/buildings/manifest.json":Dt,"../../content/scales/cats/manifest.json":Ot,"../../content/scales/cosmos/manifest.json":kt,"../../content/scales/dragon/manifest.json":At,"../../content/scales/flowers/manifest.json":jt,"../../content/scales/human/manifest.json":Mt,"../../content/scales/light/manifest.json":Nt,"../../content/scales/music/manifest.json":Pt,"../../content/scales/ocean/manifest.json":Ft,"../../content/scales/robot/manifest.json":It,"../../content/scales/ships/manifest.json":Lt,"../../content/scales/vehicles/manifest.json":Rt,"../../content/scales/weather/manifest.json":zt})),Ei=Object.assign({"../../content/illustrations/apple/manifest.json":Bt,"../../content/illustrations/ball/manifest.json":Vt,"../../content/illustrations/bike/manifest.json":Ht,"../../content/illustrations/bird/manifest.json":Ut,"../../content/illustrations/boat/manifest.json":Wt,"../../content/illustrations/book/manifest.json":Gt,"../../content/illustrations/box/manifest.json":Kt,"../../content/illustrations/cake/manifest.json":qt,"../../content/illustrations/cat/manifest.json":Jt,"../../content/illustrations/clock/manifest.json":Yt,"../../content/illustrations/cloud/manifest.json":Xt,"../../content/illustrations/dad/manifest.json":Zt,"../../content/illustrations/deer/manifest.json":Qt,"../../content/illustrations/desk/manifest.json":$t,"../../content/illustrations/dog/manifest.json":en,"../../content/illustrations/dress/manifest.json":tn,"../../content/illustrations/easel/manifest.json":nn,"../../content/illustrations/eel/manifest.json":rn,"../../content/illustrations/egg/manifest.json":an,"../../content/illustrations/elf/manifest.json":on,"../../content/illustrations/fire/manifest.json":sn,"../../content/illustrations/fish/manifest.json":cn,"../../content/illustrations/flag/manifest.json":ln,"../../content/illustrations/flask/manifest.json":un,"../../content/illustrations/flower/manifest.json":dn,"../../content/illustrations/fox/manifest.json":fn,"../../content/illustrations/frog/manifest.json":pn,"../../content/illustrations/ghost/manifest.json":mn,"../../content/illustrations/gift/manifest.json":hn,"../../content/illustrations/giraffe/manifest.json":gn,"../../content/illustrations/goat/manifest.json":_n,"../../content/illustrations/grass/manifest.json":vn,"../../content/illustrations/heart/manifest.json":yn,"../../content/illustrations/hill/manifest.json":bn,"../../content/illustrations/house/manifest.json":xn,"../../content/illustrations/ice/manifest.json":Sn,"../../content/illustrations/key/manifest.json":Cn,"../../content/illustrations/kid/manifest.json":wn,"../../content/illustrations/lake/manifest.json":Tn,"../../content/illustrations/leaf/manifest.json":En,"../../content/illustrations/moon/manifest.json":Dn,"../../content/illustrations/nest/manifest.json":On,"../../content/illustrations/pizza/manifest.json":kn,"../../content/illustrations/queen/manifest.json":An,"../../content/illustrations/rake/manifest.json":jn,"../../content/illustrations/robot/manifest.json":Mn,"../../content/illustrations/rocket/manifest.json":Nn,"../../content/illustrations/sail/manifest.json":Pn,"../../content/illustrations/salad/manifest.json":Fn,"../../content/illustrations/sea/manifest.json":In,"../../content/illustrations/seal/manifest.json":Ln,"../../content/illustrations/seed/manifest.json":Rn,"../../content/illustrations/shark/manifest.json":zn,"../../content/illustrations/shell/manifest.json":Bn,"../../content/illustrations/ski/manifest.json":Vn,"../../content/illustrations/sled/manifest.json":Hn,"../../content/illustrations/snake/manifest.json":Un,"../../content/illustrations/snow/manifest.json":Wn,"../../content/illustrations/star/manifest.json":Gn,"../../content/illustrations/sun/manifest.json":Kn,"../../content/illustrations/tea/manifest.json":qn,"../../content/illustrations/tiger/manifest.json":Jn,"../../content/illustrations/tree/manifest.json":Yn,"../../content/illustrations/truck/manifest.json":Xn,"../../content/illustrations/turtle/manifest.json":Zn,"../../content/illustrations/wave/manifest.json":Qn,"../../content/illustrations/zebra/manifest.json":$n}),Di=Object.assign({"../../content/illustrations/apple/art.svg":er,"../../content/illustrations/ball/art.svg":tr,"../../content/illustrations/bike/art.svg":nr,"../../content/illustrations/bird/art.svg":rr,"../../content/illustrations/boat/art.svg":ir,"../../content/illustrations/book/art.svg":ar,"../../content/illustrations/box/art.svg":or,"../../content/illustrations/cake/art.svg":sr,"../../content/illustrations/cat/art.svg":cr,"../../content/illustrations/clock/art.svg":lr,"../../content/illustrations/cloud/art.svg":ur,"../../content/illustrations/dad/art.svg":dr,"../../content/illustrations/deer/art.svg":fr,"../../content/illustrations/desk/art.svg":pr,"../../content/illustrations/dog/art.svg":mr,"../../content/illustrations/dress/art.svg":hr,"../../content/illustrations/easel/art.svg":gr,"../../content/illustrations/eel/art.svg":_r,"../../content/illustrations/egg/art.svg":vr,"../../content/illustrations/elf/art.svg":yr,"../../content/illustrations/fire/art.svg":br,"../../content/illustrations/fish/art.svg":xr,"../../content/illustrations/flag/art.svg":Sr,"../../content/illustrations/flask/art.svg":Cr,"../../content/illustrations/flower/art.svg":wr,"../../content/illustrations/fox/art.svg":Tr,"../../content/illustrations/frog/art.svg":Er,"../../content/illustrations/ghost/art.svg":Dr,"../../content/illustrations/gift/art.svg":Or,"../../content/illustrations/giraffe/art.svg":kr,"../../content/illustrations/goat/art.svg":Ar,"../../content/illustrations/grass/art.svg":jr,"../../content/illustrations/heart/art.svg":Mr,"../../content/illustrations/hill/art.svg":Nr,"../../content/illustrations/house/art.svg":Pr,"../../content/illustrations/ice/art.svg":Fr,"../../content/illustrations/key/art.svg":Ir,"../../content/illustrations/kid/art.svg":Lr,"../../content/illustrations/lake/art.svg":Rr,"../../content/illustrations/leaf/art.svg":zr,"../../content/illustrations/moon/art.svg":Br,"../../content/illustrations/nest/art.svg":Vr,"../../content/illustrations/pizza/art.svg":Hr,"../../content/illustrations/queen/art.svg":Ur,"../../content/illustrations/rake/art.svg":Wr,"../../content/illustrations/robot/art.svg":Gr,"../../content/illustrations/rocket/art.svg":Kr,"../../content/illustrations/sail/art.svg":qr,"../../content/illustrations/salad/art.svg":Jr,"../../content/illustrations/sea/art.svg":Yr,"../../content/illustrations/seal/art.svg":Xr,"../../content/illustrations/seed/art.svg":Zr,"../../content/illustrations/shark/art.svg":Qr,"../../content/illustrations/shell/art.svg":$r,"../../content/illustrations/ski/art.svg":ei,"../../content/illustrations/sled/art.svg":ti,"../../content/illustrations/snake/art.svg":ni,"../../content/illustrations/snow/art.svg":ri,"../../content/illustrations/star/art.svg":ii,"../../content/illustrations/sun/art.svg":ai,"../../content/illustrations/tea/art.svg":oi,"../../content/illustrations/tiger/art.svg":si,"../../content/illustrations/tree/art.svg":ci,"../../content/illustrations/truck/art.svg":li,"../../content/illustrations/turtle/art.svg":ui,"../../content/illustrations/wave/art.svg":di,"../../content/illustrations/zebra/art.svg":fi}),Oi=Object.entries(Ei).map(([e,t])=>({...t,svg:Di[e.replace(`manifest.json`,t.entry)]??``}));function ki(e,t){return Oi.find(n=>n.words[t]?.includes(e))}var Ai=hi(Object.assign({"../../content/campaign/en.json":pi,"../../content/campaign/ru.json":mi}));function ji(e){let t={},n=[];for(let r of e.split(`
`)){let e=r.trim();!e||e.startsWith(`#`)||t[e]||(t[e]=!0,n.push(e.normalize(`NFC`)))}return n}function Mi(e){let t=gi.find(t=>t.id===e||t.id===`lang.${e}`);if(!t)throw Error(`Unknown language ${e}`);let n=Object.keys(_i).find(e=>e.includes(`/languages/${t.id.replace(/^lang\./,``)}/`))?.split(`/words/`)[0],r=e=>{let t=`${n}/${e}`;if(!(t in _i))throw Error(`Missing language file ${t}`);return _i[t]},i={};for(let[e,n]of Object.entries(t.words))i[e]=ji(r(n));let a=ji(r(t.blocklist)),o={},s={};for(let[e,n]of Object.entries(t.layout))n.char in o||(o[n.char]=e);for(let[e,n]of Object.entries(t.layout))n.shift&&!(n.shift in o)&&(o[n.shift]=e,s[n.shift]=!0);return{...t,wordLists:i,blockWords:a.filter(e=>!e.startsWith(`~`)),blockSubstrings:a.filter(e=>e.startsWith(`~`)).map(e=>e.slice(1)),codeOf:o,needsShift:s}}var Ni=gi;function Pi(e,t,n){let r=[],i=e=>{e&&!r.includes(e)&&r.push(e)};for(let r of e)if(r===`Shift`)for(let e of n){let n=t.codeOf[e],r=n?t.layout[n].shift:void 0;r&&/\p{L}/u.test(e)&&i(r)}else[...r].length===1?i(r):i(t.layout[r]?.char);return r}var Fi=e=>e.split(`@`)[0];function Ii(e,t,n){let r=oe.fromSeed(`${e}:campaign`),i=[t.order,...t.orderVariants??[]],a=r.int(i.length),o=i[a],s=[],c=[],l=[],u=[],d=[...o.map(e=>({keys:e})),...(t.keyGroups??[]).map(e=>({keys:[],group:e}))],f=[];for(let e=0;e<d.length;e++){let i=d[e],a=i.keys;i.group&&(a=Pi(i.group.keys,t,c).filter(e=>!c.includes(e)),f.push(...a));for(let e of a)e!==` `&&!c.includes(e)&&c.push(e);let o=n.rules.slots.find(t=>t.level===e+1)??{level:e+1,viewBand:[`2d`,`iso`,`3d`]},p;if(o.fixedTemplate)p=Fi(o.fixedTemplate);else{let e=(e,t)=>e.minLetters<=c.length&&(e.maxLetters===void 0||e.maxLetters>=c.length)&&(!t||e.views.some(e=>o.viewBand.includes(e))&&!l.slice(-(n.rules.constraints?.noTemplateRepeatWithin??1)).includes(e.id)),t=n.templates.filter(t=>e(t,!0));t.length||(t=n.templates.filter(t=>e(t,!1)&&t.id!==l[l.length-1])),t.length||(t=n.templates.filter(t=>e(t,!1))),p=r.pick(t.sort((e,t)=>e.id<t.id?-1:1)).id}let m=n.templates.find(e=>e.id===p);l.push(p);let h=m.views.find(e=>o.viewBand.includes(e))??m.views[0],g=n.styles.slice().sort((e,t)=>e.id<t.id?-1:1),_=n.palettes.slice().sort((e,t)=>e.id<t.id?-1:1),v=g[0].id,y=_[0].id;for(let e=0;e<8&&(v=r.pick(g).id,y=r.pick(_).id,u.slice(-2).includes(`${v}|${y}`));e++);u.push(`${v}|${y}`);let b=(m.supportsHavocs??[]).filter(e=>n.havocs.some(t=>t.id===e)),x=Math.min(1e3,(o.havocIntensity?.[1]??.5)*1e3)|0;s.push({index:e+1,newKeys:[...a],letters:[...c],templateId:p,view:h,styleId:v,paletteId:y,havocIds:e===0||x===0?[]:b,havocMaxP:x,boss:!!o.boss,keyGroup:i.group?{id:i.group.id,name:i.group.name?.[t.id.replace(/^lang\./,``)]??i.group.id,keys:[...i.group.keys]}:void 0,groupChars:[...f]})}return{seed:e,language:t.id,orderVariant:a,levels:s}}var Li=[40,60,80],Ri={};function zi(e){return Ri[e]??=Mi(e)}function Bi(e,t=`en`){let n=zi(t),r=Ai.find(e=>e.language===n.id);if(!r)throw Error(`No campaign rules for ${n.id}`);return Ii(e,n,{rules:r,templates:vi,styles:yi,palettes:bi,havocs:xi})}function Vi(e,t,n,r){let i=zi(t),a=n.index,o=vi.find(e=>e.id===n.templateId);return{seed:e,levelIndex:a,language:i,letters:n.letters,newKeys:n.newKeys,tier:r.tier,targetStars:r.targetStars??1,templateId:n.templateId,inputMode:o.inputMode,stageLengths:Li,abilities:Si.slice().sort((e,t)=>e.id<t.id?-1:1),powerups:wi.slice().sort((e,t)=>e.id<t.id?-1:1),collected:r.collected??[],weakKeys:r.weakKeys??[],groupChars:n.groupChars}}var Hi=e=>e.filter(e=>e!==` `&&e!==`;`&&!/\p{Ll}/u.test(e));function Ui(e,t,n,r,i=`en`){let a=zi(i),o=vi.find(e=>e.id===t);if(!o)throw Error(`Unknown template ${t}`);return{seed:e,levelIndex:1,language:a,letters:n,newKeys:n.slice(-1),tier:r.tier,targetStars:r.targetStars??1,templateId:t,inputMode:o.inputMode,stageLengths:Li,abilities:Si.slice().sort((e,t)=>e.id<t.id?-1:1),powerups:wi.slice().sort((e,t)=>e.id<t.id?-1:1),collected:r.collected??[],weakKeys:r.weakKeys??[],groupChars:Hi(n)}}var Wi={id:`template.brick-breaker`,vBase:3e3,init:()=>({x:0,popped:0,lastHit:-1,stumble:-1}),onTick(e,t){e.popped++,e.lastHit=t.frame},onError(e,t){e.stumble=t.frame},step(e,t){e.x+=t.v},isAtRest:()=>!0},Gi=589824,Ki=196608;function qi(e){return e.bubbles.filter(e=>e.popped<0)}function Ji(e,t){let n=2+Math.min(t.state.stage,2);for(;qi(e).length<n;){let n=t.spawnTarget();if(!n)return;let r=0,i=-1;for(let t=0;t<4;t++){let n=qi(e).filter(e=>e.col===t).reduce((e,t)=>Math.min(e,t.y),786432);n>i&&(i=n,r=t)}e.bubbles.push({id:n.id,y:Math.min(0,i-Ki),col:r,popped:-1})}}var Yi={id:`template.bubble-popper`,vBase:2400,init:()=>({bubbles:[],pops:0,stumble:-1}),onStageStart(e,t){e.bubbles=e.bubbles.filter(e=>e.popped>=0).slice(-6),Ji(e,t)},onTick(e,t){Ji(e,t)},onTargetComplete(e,t,n){let r=e.bubbles.find(e=>e.id===n.id);r&&(r.popped=t.frame,e.pops++),e.bubbles=e.bubbles.filter(e=>e.popped<0||t.frame-e.popped<120).slice(-12),Ji(e,t)},onError(e,t){e.stumble=t.frame},step(e,t){if(t.v===0)return;let n=N(N(t.v,4)*t.hazardP,1e3);for(let t of e.bubbles)t.popped>=0||(t.y+=n,t.y>=589824&&(t.y=393216))},isAtRest:()=>!0},Xi={id:`template.climbing-tower`,vBase:2600,init:()=>({holds:0,flags:[],lastHold:-1,stumble:-1}),onTick(e,t,n){e.holds++,e.lastHold=t.frame,n===` `&&(e.flags=[...e.flags,e.holds].slice(-16))},onError(e,t){e.stumble=t.frame},step(){},isAtRest:()=>!0},Zi=655360,Qi=196608,$i=e=>e.crystals.filter(e=>e.sung<0);function ea(e,t){let n=2+Math.min(t.state.stage,2);for(;$i(e).length<n;){let n=t.spawnTarget();if(!n)return;let r=$i(e).map(e=>e.slot),i=[2,1,3,0,4].find(e=>!r.includes(e))??n.id%5;e.crystals.push({id:n.id,d:Zi,slot:i,sung:-1})}}var ta={id:`template.crystal-gallery`,vBase:2400,init:()=>({crystals:[],sung:0,stumble:-1}),onStageStart(e,t){e.crystals=e.crystals.filter(e=>e.sung>=0).slice(-4),ea(e,t)},onTick(e,t){ea(e,t)},onTargetComplete(e,t,n){let r=e.crystals.find(e=>e.id===n.id);r&&(r.sung=t.frame,e.sung++),e.crystals=e.crystals.filter(e=>e.sung<0||t.frame-e.sung<90).slice(-10),ea(e,t)},onError(e,t){e.stumble=t.frame},step(e,t){if(t.v===0)return;let n=N(N(t.v,3)*t.hazardP,1e3);for(let t of e.crystals)t.sung<0&&t.d>196608&&(t.d=Math.max(Qi,t.d-n))},isAtRest:()=>!0},na={id:`template.dungeon-crawler`,vBase:2600,init:()=>({steps:0,gems:0,lastGem:-1,lastStep:-1,stumble:-1}),onTick(e,t){e.steps++,e.lastStep=t.frame,e.steps%6==3&&(e.gems++,e.lastGem=t.frame)},onError(e,t){e.stumble=t.frame},step(){},isAtRest:()=>!0},ra=65536,ia={id:`template.garden-grower`,vBase:3200,init:()=>({x:0,planted:0,plantedAt:[],sunflowers:[],stumble:-1}),onTick(e,t,n){e.plantedAt[e.planted%40]=t.frame,n===` `&&e.planted>0&&(e.sunflowers=[...e.sunflowers,e.planted-1].slice(-12)),e.planted++},onError(e,t){e.stumble=t.frame},step(e,t){let n=e.planted*ra;e.x<n&&(e.x=Math.min(n,e.x+Math.max(t.v,1200)))},isAtRest:e=>e.x>=e.planted*ra},aa=65536,oa={id:`template.marble-run`,vBase:3e3,init:()=>({laid:1,pos:0,bells:[],stumble:-1}),onTick(e,t,n){n===` `&&(e.bells=[...e.bells,e.laid].slice(-16)),e.laid++},onError(e,t){e.stumble=t.frame},step(e,t){let n=(e.laid-1)*aa;e.pos<n&&(e.pos=Math.min(n,e.pos+Math.max(t.v,2e3,N(n-e.pos,10))))},isAtRest:e=>e.pos>=(e.laid-1)*aa},sa={id:`template.maze-snake`,vBase:2600,init:()=>({steps:0,length:3,berries:0,lastStep:-1,stumble:-1}),onTick(e,t){e.steps++,e.lastStep=t.frame,e.length=Math.min(14,3+N(e.steps,8)),e.steps%5==0&&e.berries++},onError(e,t){e.stumble=t.frame},step(){},isAtRest:()=>!0},ca=65536,la=3*ca,ua=ca/2,da={id:`template.platformer`,vBase:3e3,init:()=>({x:0,gaps:[],coins:[],collected:0,lastCollect:-1,stumble:-1}),onTick(e,t,n){if(n!==` `)return;let r=N(e.x+la,ca)*ca,i=e.gaps[e.gaps.length-1];i!==void 0&&r-i<196608||(e.gaps.push(r),e.gaps.length>12&&e.gaps.shift(),t.rng.chance(600)&&(e.coins.push(r+ca/2),e.coins.length>12&&e.coins.shift()))},onError(e,t){e.stumble=t.frame},step(e,t){if(t.v!==0)for(e.x+=t.v;e.coins.length&&e.coins[0]<=e.x;)e.coins.shift(),e.collected++,e.lastCollect=t.frame},isAtRest:()=>!0},fa=196608,pa={id:`template.pulse-runner`,vBase:3600,init:()=>({x:0,lit:0,lastBeat:-1,stumble:-1}),onTick(e,t){e.lastBeat=t.frame;let n=N(e.x,fa)+1;e.lit<n&&(e.lit=n)},onError(e,t){e.stumble=t.frame},step(e,t){e.x+=t.v},isAtRest:()=>!0};function ma(e,t){return e===0?t?1:-1:0}function ha(e,t){let n=t.state.prompt.text.split(` `).length,r=[e.lane];for(let e=1;e<n;e++)r.push(ma(r[e-1],t.rng.chance(500)));e.wordLanes=r,e.word=0}var ga={id:`template.racer`,vBase:9e3,init:()=>({z:0,lane:0,laneFrame:-1,wordLanes:[0],word:0,boostFrame:-1,stumble:-1}),onStageStart(e,t){ha(e,t)},onTick(e,t,n){n===` `&&(e.word=Math.min(e.word+1,e.wordLanes.length-1),e.lane=e.wordLanes[e.word],e.laneFrame=t.frame,e.boostFrame=t.frame)},onError(e,t){e.stumble=t.frame},step(e,t){e.z+=t.v},isAtRest:()=>!0},_a=196608,va={id:`template.space-tunnel`,vBase:7e3,init:()=>({z:0,lastBeat:-1,stumble:-1}),onTick(e,t){e.lastBeat=t.frame},onError(e,t){e.stumble=t.frame},step(e,t){e.z+=t.v},isAtRest:()=>!0},ya=786432,ba=163840;function xa(e){let t=0;for(let n of e.creatures)n.frozen<0&&t++;return t}function Sa(e,t){let n=2+Math.min(t.state.stage,2);for(;xa(e)<n;){let n=t.spawnTarget();if(!n)return;let r=0;for(;r<393216&&e.creatures.some(e=>e.frozen<0&&e.pos>r-163840&&e.pos<r+163840);)r+=ba;e.creatures.push({id:n.id,pos:r,lane:n.id%3,frozen:-1})}}var Ca={id:`template.tower-defence`,vBase:2400,init:()=>({creatures:[],bonks:0,lastBonk:-1,frozenCount:0,stumble:-1}),onStageStart(e,t){e.creatures=e.creatures.filter(e=>e.frozen>=0).slice(-6),Sa(e,t)},onTick(e,t){Sa(e,t)},onTargetComplete(e,t,n){let r=e.creatures.find(e=>e.id===n.id);r&&(r.frozen=t.frame,e.frozenCount++),e.creatures=e.creatures.filter(e=>e.frozen<0||t.frame-e.frozen<600).slice(-14),Sa(e,t)},onError(e,t){e.stumble=t.frame},step(e,t){if(t.v===0)return;let n=N(N(t.v,3)*t.hazardP,1e3);for(let r of e.creatures)r.frozen>=0||(r.pos+=n,r.pos>=786432&&(r.pos=524288,e.bonks++,e.lastBonk=t.frame))},isAtRest:()=>!0},wa={id:`template.wave-surfing`,vBase:8e3,init:()=>({z:0,energy:0,lastBeat:-1,stumble:-1}),onTick(e,t){e.energy=Math.min(1e3,e.energy+120),e.lastBeat=t.frame},onError(e,t){e.stumble=t.frame},step(e,t){e.z+=t.v,e.energy>0&&(e.energy=Math.max(0,e.energy-4))},isAtRest:e=>e.energy===0};function Ta(e){return e.plots.filter(e=>e.id>=0).length}function Ea(e,t){let n=2+Math.min(t.state.stage,2),r=0;for(;Ta(e)<n&&r++<16;){let n=e.plots[e.next];if(e.next=(e.next+5)%16,n.id>=0)continue;let r=t.spawnTarget();if(!r)return;n.id=r.id}}var Da=Object.assign({"../../content/templates/brick-breaker/sim.ts":Wi,"../../content/templates/bubble-popper/sim.ts":Yi,"../../content/templates/climbing-tower/sim.ts":Xi,"../../content/templates/crystal-gallery/sim.ts":ta,"../../content/templates/dungeon-crawler/sim.ts":na,"../../content/templates/garden-grower/sim.ts":ia,"../../content/templates/marble-run/sim.ts":oa,"../../content/templates/maze-snake/sim.ts":sa,"../../content/templates/platformer/sim.ts":da,"../../content/templates/pulse-runner/sim.ts":pa,"../../content/templates/racer/sim.ts":ga,"../../content/templates/space-tunnel/sim.ts":va,"../../content/templates/tower-defence/sim.ts":Ca,"../../content/templates/wave-surfing/sim.ts":wa,"../../content/templates/word-city/sim.ts":{id:`template.word-city`,vBase:2400,init:()=>({plots:Array.from({length:16},()=>({id:-1,height:0,builtAt:-1,round:0})),next:0,built:0,crane:0,stumble:-1}),onStageStart(e,t){for(let t of e.plots)t.id=-1;Ea(e,t)},onTick(e,t){Ea(e,t)},onTargetComplete(e,t,n){let r=e.plots.find(e=>e.id===n.id);r&&(r.id=-1,r.round++,r.height=Math.min(9,r.height+n.text.trim().length),r.builtAt=t.frame,e.built++),Ea(e,t)},onError(e,t){e.stumble=t.frame},step(e,t){e.crane+=t.v},isAtRest:()=>!0}}),Oa={};for(let e of Object.values(Da))Oa[e.id]=e;function ka(e){let t=Oa[e.split(`@`)[0]];if(!t)throw Error(`No simulation for template ${e}`);return t}var Aa=1e3,ja=1001,Ma=1002,Na=1003,Pa=1004,Fa=1005,Ia=1006,La=1007,Ra=1008,za=1009,Ba=1010,Va=1011,Ha=1012,Ua=1013,Wa=1014,Ga=1015,Ka=1016,qa=1017,Ja=1018,Ya=1020,Xa=35902,Za=35899,Qa=1021,$a=1022,eo=1023,to=1026,no=1027,ro=1028,io=1029,ao=1030,oo=1031,so=1033,co=33776,lo=33777,uo=33778,fo=33779,po=35840,mo=35841,ho=35842,go=35843,_o=36196,vo=37492,yo=37496,bo=37488,xo=37489,So=37490,Co=37491,wo=37808,To=37809,Eo=37810,Do=37811,Oo=37812,ko=37813,Ao=37814,jo=37815,Mo=37816,No=37817,Po=37818,Fo=37819,Io=37820,Lo=37821,Ro=36492,zo=36494,Bo=36495,Vo=36283,Ho=36284,Uo=36285,Wo=36286,Go=2300,Ko=2301,qo=2302,Jo=2303,Yo=2400,Xo=2401,Zo=2402,Qo=3200,$o=`srgb`,es=`srgb-linear`,ts=`linear`,ns=`srgb`,rs=7680,is=35044,as=2e3;function os(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function ss(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function cs(e){return document.createElementNS(`http://www.w3.org/1999/xhtml`,e)}function ls(){let e=cs(`canvas`);return e.style.display=`block`,e}var us={};function ds(...e){let t=`THREE.`+e.shift();console.log(t,...e)}function fs(e){let t=e[0];if(typeof t==`string`&&t.startsWith(`TSL:`)){let t=e[1];t&&t.isStackTrace?e[0]+=` `+t.getLocation():e[1]=`Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.`}return e}function z(...e){e=fs(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.warn(n.getError(t)):console.warn(t,...e)}}function B(...e){e=fs(e);let t=`THREE.`+e.shift();{let n=e[0];n&&n.isStackTrace?console.error(n.getError(t)):console.error(t,...e)}}function ps(...e){let t=e.join(` `);t in us||(us[t]=!0,z(...e))}function ms(e,t,n){return new Promise(function(r,i){function a(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:i();break;case e.TIMEOUT_EXPIRED:setTimeout(a,n);break;default:r()}}setTimeout(a,n)})}var hs={0:0,2:6,4:4,3:5,1:1,6:2,7:7,5:3},gs=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n!==void 0&&n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let r=n[e];if(r!==void 0){let e=r.indexOf(t);e!==-1&&r.splice(e,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let t=n.slice(0);for(let n=0,r=t.length;n<r;n++)t[n].call(this,e);e.target=null}}},_s=`00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff`.split(`.`),vs=1234567,ys=Math.PI/180,bs=180/Math.PI;function xs(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(_s[e&255]+_s[e>>8&255]+_s[e>>16&255]+_s[e>>24&255]+`-`+_s[t&255]+_s[t>>8&255]+`-`+_s[t>>16&15|64]+_s[t>>24&255]+`-`+_s[n&63|128]+_s[n>>8&255]+`-`+_s[n>>16&255]+_s[n>>24&255]+_s[r&255]+_s[r>>8&255]+_s[r>>16&255]+_s[r>>24&255]).toLowerCase()}function V(e,t,n){return Math.max(t,Math.min(n,e))}function Ss(e,t){return(e%t+t)%t}function Cs(e,t,n,r,i){return r+(e-t)*(i-r)/(n-t)}function ws(e,t,n){return e===t?0:(n-e)/(t-e)}function Ts(e,t,n){return(1-n)*e+n*t}function Es(e,t,n,r){return Ts(e,t,1-Math.exp(-n*r))}function Ds(e,t=1){return t-Math.abs(Ss(e,t*2)-t)}function Os(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*(3-2*e))}function ks(e,t,n){return e<=t?0:e>=n?1:(e=(e-t)/(n-t),e*e*e*(e*(e*6-15)+10))}function As(e,t){return e+Math.floor(Math.random()*(t-e+1))}function js(e,t){return e+Math.random()*(t-e)}function Ms(e){return e*(.5-Math.random())}function Ns(e){e!==void 0&&(vs=e);let t=vs+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ps(e){return e*ys}function Fs(e){return e*bs}function Is(e){return e>0&&Number.isInteger(e)&&2**Math.round(Math.log2(e))===e}function Ls(e){return 2**Math.ceil(Math.log(e)/Math.LN2)}function Rs(e){return 2**Math.floor(Math.log(e)/Math.LN2)}function zs(e,t,n,r,i){let a=Math.cos,o=Math.sin,s=a(n/2),c=o(n/2),l=a((t+r)/2),u=o((t+r)/2),d=a((t-r)/2),f=o((t-r)/2),p=a((r-t)/2),m=o((r-t)/2);switch(i){case`XYX`:e.set(s*u,c*d,c*f,s*l);break;case`YZY`:e.set(c*f,s*u,c*d,s*l);break;case`ZXZ`:e.set(c*d,c*f,s*u,s*l);break;case`XZX`:e.set(s*u,c*m,c*p,s*l);break;case`YXY`:e.set(c*p,s*u,c*m,s*l);break;case`ZYZ`:e.set(c*m,c*p,s*u,s*l);break;default:z(`MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: `+i)}}function Bs(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Vs(e,t){if(t.constructor===Float32Array)return e;let n=Bs(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.max(e/n,-1)}function Hs(e,t){if(t.constructor===Float32Array)return e;let n=Bs(t);if(n===void 0)throw Error(`THREE.MathUtils: Invalid component type.`);return Math.round(e*n)}var Us={DEG2RAD:ys,RAD2DEG:bs,generateUUID:xs,clamp:V,euclideanModulo:Ss,mapLinear:Cs,inverseLerp:ws,lerp:Ts,damp:Es,pingpong:Ds,smoothstep:Os,smootherstep:ks,randInt:As,randFloat:js,randFloatSpread:Ms,seededRandom:Ns,degToRad:Ps,radToDeg:Fs,isPowerOfTwo:Is,ceilPowerOfTwo:Ls,floorPowerOfTwo:Rs,setQuaternionFromProperEuler:zs,normalize:Hs,denormalize:Vs},H=class{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error(`THREE.Vector2: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error(`THREE.Vector2: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6],this.y=r[1]*t+r[4]*n+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(V(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),r=Math.sin(t),i=this.x-e.x,a=this.y-e.y;return this.x=i*n-a*r+e.x,this.y=i*r+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ws=class{constructor(e=0,t=0,n=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=r}static slerpFlat(e,t,n,r,i,a,o){let s=n[r+0],c=n[r+1],l=n[r+2],u=n[r+3],d=i[a+0],f=i[a+1],p=i[a+2],m=i[a+3];if(u!==m||s!==d||c!==f||l!==p){let e=s*d+c*f+l*p+u*m;e<0&&(d=-d,f=-f,p=-p,m=-m,e=-e);let t=1-o;if(e<.9995){let n=Math.acos(e),r=Math.sin(n);t=Math.sin(t*n)/r,o=Math.sin(o*n)/r,s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o}else{s=s*t+d*o,c=c*t+f*o,l=l*t+p*o,u=u*t+m*o;let e=1/Math.sqrt(s*s+c*c+l*l+u*u);s*=e,c*=e,l*=e,u*=e}}e[t]=s,e[t+1]=c,e[t+2]=l,e[t+3]=u}static multiplyQuaternionsFlat(e,t,n,r,i,a){let o=n[r],s=n[r+1],c=n[r+2],l=n[r+3],u=i[a],d=i[a+1],f=i[a+2],p=i[a+3];return e[t]=o*p+l*u+s*f-c*d,e[t+1]=s*p+l*d+c*u-o*f,e[t+2]=c*p+l*f+o*d-s*u,e[t+3]=l*p-o*u-s*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,r){return this._x=e,this._y=t,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,r=e._y,i=e._z,a=e._order,o=Math.cos,s=Math.sin,c=o(n/2),l=o(r/2),u=o(i/2),d=s(n/2),f=s(r/2),p=s(i/2);switch(a){case`XYZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`YXZ`:this._x=d*l*u+c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`ZXY`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u-d*f*p;break;case`ZYX`:this._x=d*l*u-c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u+d*f*p;break;case`YZX`:this._x=d*l*u+c*f*p,this._y=c*f*u+d*l*p,this._z=c*l*p-d*f*u,this._w=c*l*u-d*f*p;break;case`XZY`:this._x=d*l*u-c*f*p,this._y=c*f*u-d*l*p,this._z=c*l*p+d*f*u,this._w=c*l*u+d*f*p;break;default:z(`Quaternion: .setFromEuler() encountered an unknown order: `+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,r=Math.sin(n);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],r=t[4],i=t[8],a=t[1],o=t[5],s=t[9],c=t[2],l=t[6],u=t[10],d=n+o+u;if(d>0){let e=.5/Math.sqrt(d+1);this._w=.25/e,this._x=(l-s)*e,this._y=(i-c)*e,this._z=(a-r)*e}else if(n>o&&n>u){let e=2*Math.sqrt(1+n-o-u);this._w=(l-s)/e,this._x=.25*e,this._y=(r+a)/e,this._z=(i+c)/e}else if(o>u){let e=2*Math.sqrt(1+o-n-u);this._w=(i-c)/e,this._x=(r+a)/e,this._y=.25*e,this._z=(s+l)/e}else{let e=2*Math.sqrt(1+u-n-o);this._w=(a-r)/e,this._x=(i+c)/e,this._y=(s+l)/e,this._z=.25*e}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(V(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let r=Math.min(1,t/n);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x*=e,this._y*=e,this._z*=e,this._w*=e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=t._x,s=t._y,c=t._z,l=t._w;return this._x=n*l+a*o+r*c-i*s,this._y=r*l+a*s+i*o-n*c,this._z=i*l+a*c+n*s-r*o,this._w=a*l-n*o-r*s-i*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,r=e._y,i=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,r=-r,i=-i,a=-a,o=-o);let s=1-t;if(o<.9995){let e=Math.acos(o),c=Math.sin(e);s=Math.sin(s*e)/c,t=Math.sin(t*e)/c,this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this._onChangeCallback()}else this._x=this._x*s+n*t,this._y=this._y*s+r*t,this._z=this._z*s+i*t,this._w=this._w*s+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),i=Math.sqrt(n);return this.set(r*Math.sin(e),r*Math.cos(e),i*Math.sin(t),i*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},U=class{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error(`THREE.Vector3: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error(`THREE.Vector3: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ks.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ks.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6]*r,this.y=i[1]*t+i[4]*n+i[7]*r,this.z=i[2]*t+i[5]*n+i[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=e.elements,a=1/(i[3]*t+i[7]*n+i[11]*r+i[15]);return this.x=(i[0]*t+i[4]*n+i[8]*r+i[12])*a,this.y=(i[1]*t+i[5]*n+i[9]*r+i[13])*a,this.z=(i[2]*t+i[6]*n+i[10]*r+i[14])*a,this}applyQuaternion(e){let t=this.x,n=this.y,r=this.z,i=e.x,a=e.y,o=e.z,s=e.w,c=2*(a*r-o*n),l=2*(o*t-i*r),u=2*(i*n-a*t);return this.x=t+s*c+a*u-o*l,this.y=n+s*l+o*c-i*u,this.z=r+s*u+i*l-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,r=this.z,i=e.elements;return this.x=i[0]*t+i[4]*n+i[8]*r,this.y=i[1]*t+i[5]*n+i[9]*r,this.z=i[2]*t+i[6]*n+i[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this.z=V(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this.z=V(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,r=e.y,i=e.z,a=t.x,o=t.y,s=t.z;return this.x=r*s-i*o,this.y=i*a-n*s,this.z=n*o-r*a,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Gs.copy(this).projectOnVector(e),this.sub(Gs)}reflect(e){return this.sub(Gs.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(V(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,r=this.z-e.z;return t*t+n*n+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let r=Math.sin(t)*e;return this.x=r*Math.sin(n),this.y=Math.cos(t)*e,this.z=r*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Gs=new U,Ks=new Ws,W=class{static{this.prototype.isMatrix3=!0}constructor(e,t,n,r,i,a,o,s,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c)}set(e,t,n,r,i,a,o,s,c){let l=this.elements;return l[0]=e,l[1]=r,l[2]=o,l[3]=t,l[4]=i,l[5]=s,l[6]=n,l[7]=a,l[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[3],s=n[6],c=n[1],l=n[4],u=n[7],d=n[2],f=n[5],p=n[8],m=r[0],h=r[3],g=r[6],_=r[1],v=r[4],y=r[7],b=r[2],x=r[5],S=r[8];return i[0]=a*m+o*_+s*b,i[3]=a*h+o*v+s*x,i[6]=a*g+o*y+s*S,i[1]=c*m+l*_+u*b,i[4]=c*h+l*v+u*x,i[7]=c*g+l*y+u*S,i[2]=d*m+f*_+p*b,i[5]=d*h+f*v+p*x,i[8]=d*g+f*y+p*S,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8];return t*a*l-t*o*c-n*i*l+n*o*s+r*i*c-r*a*s}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=l*a-o*c,d=o*s-l*i,f=c*i-a*s,p=t*u+n*d+r*f;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);let m=1/p;return e[0]=u*m,e[1]=(r*c-l*n)*m,e[2]=(o*n-r*a)*m,e[3]=d*m,e[4]=(l*t-r*s)*m,e[5]=(r*i-o*t)*m,e[6]=f*m,e[7]=(n*s-c*t)*m,e[8]=(a*t-n*i)*m,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,r,i,a,o){let s=Math.cos(i),c=Math.sin(i);return this.set(n*s,n*c,-n*(s*a+c*o)+a+e,-r*c,r*s,-r*(-c*a+s*o)+o+t,0,0,1),this}scale(e,t){return ps(`Matrix3: .scale() is deprecated. Use .makeScale() instead.`),this.premultiply(qs.makeScale(e,t)),this}rotate(e){return ps(`Matrix3: .rotate() is deprecated. Use .makeRotation() instead.`),this.premultiply(qs.makeRotation(-e)),this}translate(e,t){return ps(`Matrix3: .translate() is deprecated. Use .makeTranslation() instead.`),this.premultiply(qs.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<9;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},qs=new W,Js=new W().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ys=new W().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Xs(){let e={enabled:!0,workingColorSpace:es,spaces:{},convert:function(e,t,n){return this.enabled===!1||t===n||!t||!n||(this.spaces[t].transfer===`srgb`&&(e.r=Zs(e.r),e.g=Zs(e.g),e.b=Zs(e.b)),this.spaces[t].primaries!==this.spaces[n].primaries&&(e.applyMatrix3(this.spaces[t].toXYZ),e.applyMatrix3(this.spaces[n].fromXYZ)),this.spaces[n].transfer===`srgb`&&(e.r=Qs(e.r),e.g=Qs(e.g),e.b=Qs(e.b))),e},workingToColorSpace:function(e,t){return this.convert(e,this.workingColorSpace,t)},colorSpaceToWorking:function(e,t){return this.convert(e,t,this.workingColorSpace)},getPrimaries:function(e){return this.spaces[e].primaries},getTransfer:function(e){return e===``?ts:this.spaces[e].transfer},getToneMappingMode:function(e){return this.spaces[e].outputColorSpaceConfig.toneMappingMode||`standard`},getLuminanceCoefficients:function(e,t=this.workingColorSpace){return e.fromArray(this.spaces[t].luminanceCoefficients)},define:function(e){Object.assign(this.spaces,e)},_getMatrix:function(e,t,n){return e.copy(this.spaces[n].fromXYZ).multiply(this.spaces[t].toXYZ)},_getDrawingBufferColorSpace:function(e){return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(e=this.workingColorSpace){return this.spaces[e].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],r=[.3127,.329];return e.define({[es]:{primaries:t,whitePoint:r,transfer:ts,toXYZ:Js,fromXYZ:Ys,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:$o},outputColorSpaceConfig:{drawingBufferColorSpace:$o}},[$o]:{primaries:t,whitePoint:r,transfer:ns,toXYZ:Js,fromXYZ:Ys,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:$o}}}),e}var G=Xs();function Zs(e){return e<.04045?e*.0773993808:(e*.9478672986+.0521327014)**2.4}function Qs(e){return e<.0031308?e*12.92:1.055*e**.41666-.055}var $s,ec=class{static getDataURL(e,t=`image/png`){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>`u`)return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{$s===void 0&&($s=cs(`canvas`)),$s.width=e.width,$s.height=e.height;let t=$s.getContext(`2d`);e instanceof ImageData?t.putImageData(e,0,0):t.drawImage(e,0,0,e.width,e.height),n=$s}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap){let t=cs(`canvas`);t.width=e.width,t.height=e.height;let n=t.getContext(`2d`);n.drawImage(e,0,0,e.width,e.height);let r=n.getImageData(0,0,e.width,e.height),i=r.data;for(let e=0;e<i.length;e++)i[e]=Zs(i[e]/255)*255;return n.putImageData(r,0,0),t}if(e.data){let t=e.data.slice(0);for(let e=0;e<t.length;e++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[e]=Math.floor(Zs(t[e]/255)*255):t[e]=Zs(t[e]);return{data:t,width:e.width,height:e.height}}return z(`ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.`),e}},tc=0,nc=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:tc++}),this.uuid=xs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<`u`&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<`u`&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t===null?e.set(0,0,0):e.set(t.width||0,t.height||0,t.depth||0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:``},r=this.data;if(r!==null){let e;if(Array.isArray(r)){e=[];for(let t=0,n=r.length;t<n;t++)r[t].isDataTexture?e.push(rc(r[t].image)):e.push(rc(r[t]))}else e=rc(r);n.url=e}return t||(e.images[this.uuid]=n),n}};function rc(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap?ec.getDataURL(e):e.data?{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name}:(z(`Texture: Unable to serialize Texture.`),{})}var ic=0,ac=new U,oc=class e extends gs{constructor(t=e.DEFAULT_IMAGE,n=e.DEFAULT_MAPPING,r=ja,i=ja,a=Ia,o=Ra,s=eo,c=za,l=e.DEFAULT_ANISOTROPY,u=``){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ic++}),this.uuid=xs(),this.name=``,this.source=new nc(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=r,this.wrapT=i,this.magFilter=a,this.minFilter=o,this.anisotropy=l,this.format=s,this.internalFormat=null,this.type=c,this.offset=new H(0,0),this.repeat=new H(1,1),this.center=new H(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new W,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ac).x}get height(){return this.source.getSize(ac).y}get depth(){return this.source.getSize(ac).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){z(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Texture.setValues(): property '${t}' does not exist.`):r&&n&&r.isVector2&&n.isVector2||r&&n&&r.isVector3&&n.isVector3||r&&n&&r.isMatrix3&&n.isMatrix3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:`Texture`,generator:`Texture.toJSON`},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:`dispose`})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Aa:e.x-=Math.floor(e.x);break;case ja:e.x=e.x<0?0:1;break;case Ma:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x-=Math.floor(e.x)}if(e.y<0||e.y>1)switch(this.wrapT){case Aa:e.y-=Math.floor(e.y);break;case ja:e.y=e.y<0?0:1;break;case Ma:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y-=Math.floor(e.y)}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};oc.DEFAULT_IMAGE=null,oc.DEFAULT_MAPPING=300,oc.DEFAULT_ANISOTROPY=1;var sc=class{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,r=1){this.x=e,this.y=t,this.z=n,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,r){return this.x=e,this.y=t,this.z=n,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error(`THREE.Vector4: index is out of range: `+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error(`THREE.Vector4: index is out of range: `+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w===void 0?1:e.w,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,r=this.z,i=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*r+a[12]*i,this.y=a[1]*t+a[5]*n+a[9]*r+a[13]*i,this.z=a[2]*t+a[6]*n+a[10]*r+a[14]*i,this.w=a[3]*t+a[7]*n+a[11]*r+a[15]*i,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,r,i,a=.01,o=.1,s=e.elements,c=s[0],l=s[4],u=s[8],d=s[1],f=s[5],p=s[9],m=s[2],h=s[6],g=s[10];if(Math.abs(l-d)<a&&Math.abs(u-m)<a&&Math.abs(p-h)<a){if(Math.abs(l+d)<o&&Math.abs(u+m)<o&&Math.abs(p+h)<o&&Math.abs(c+f+g-3)<o)return this.set(1,0,0,0),this;t=Math.PI;let e=(c+1)/2,s=(f+1)/2,_=(g+1)/2,v=(l+d)/4,y=(u+m)/4,b=(p+h)/4;return e>s&&e>_?e<a?(n=0,r=.707106781,i=.707106781):(n=Math.sqrt(e),r=v/n,i=y/n):s>_?s<a?(n=.707106781,r=0,i=.707106781):(r=Math.sqrt(s),n=v/r,i=b/r):_<a?(n=.707106781,r=.707106781,i=0):(i=Math.sqrt(_),n=y/i,r=b/i),this.set(n,r,i,t),this}let _=Math.sqrt((h-p)*(h-p)+(u-m)*(u-m)+(d-l)*(d-l));return Math.abs(_)<.001&&(_=1),this.x=(h-p)/_,this.y=(u-m)/_,this.z=(d-l)/_,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=V(this.x,e.x,t.x),this.y=V(this.y,e.y,t.y),this.z=V(this.z,e.z,t.z),this.w=V(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=V(this.x,e,t),this.y=V(this.y,e,t),this.z=V(this.z,e,t),this.w=V(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(V(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},cc=class extends gs{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ia,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new sc(0,0,e,t),this.scissorTest=!1,this.viewport=new sc(0,0,e,t),this.textures=[];let r=n.count;for(let i=0;i<r;i++)this.textures[i]=new oc({width:e,height:t,depth:n.depth}),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:Ia,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.mipmapsAutoUpdate!==void 0&&(t.mipmapsAutoUpdate=e.mipmapsAutoUpdate),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let r=0,i=this.textures.length;r<i;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=n,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let n=Object.assign({},e.textures[t].image);this.textures[t].source=new nc(n)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null){if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture}else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:`dispose`})}},lc=class extends cc{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},uc=class extends oc{constructor(e=null,t=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Na,this.minFilter=Na,this.wrapR=ja,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}},dc=class extends oc{constructor(e=null,t=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:r},this.magFilter=Na,this.minFilter=Na,this.wrapR=ja,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}},fc=class e{static{this.prototype.isMatrix4=!0}constructor(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h)}set(e,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h){let g=this.elements;return g[0]=e,g[4]=t,g[8]=n,g[12]=r,g[1]=i,g[5]=a,g[9]=o,g[13]=s,g[2]=c,g[6]=l,g[10]=u,g[14]=d,g[3]=f,g[7]=p,g[11]=m,g[15]=h,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new e().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,r=1/pc.setFromMatrixColumn(e,0).length(),i=1/pc.setFromMatrixColumn(e,1).length(),a=1/pc.setFromMatrixColumn(e,2).length();return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=0,t[4]=n[4]*i,t[5]=n[5]*i,t[6]=n[6]*i,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,r=e.y,i=e.z,a=Math.cos(n),o=Math.sin(n),s=Math.cos(r),c=Math.sin(r),l=Math.cos(i),u=Math.sin(i);if(e.order===`XYZ`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=-s*u,t[8]=c,t[1]=n+r*c,t[5]=e-i*c,t[9]=-o*s,t[2]=i-e*c,t[6]=r+n*c,t[10]=a*s}else if(e.order===`YXZ`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e+i*o,t[4]=r*o-n,t[8]=a*c,t[1]=a*u,t[5]=a*l,t[9]=-o,t[2]=n*o-r,t[6]=i+e*o,t[10]=a*s}else if(e.order===`ZXY`){let e=s*l,n=s*u,r=c*l,i=c*u;t[0]=e-i*o,t[4]=-a*u,t[8]=r+n*o,t[1]=n+r*o,t[5]=a*l,t[9]=i-e*o,t[2]=-a*c,t[6]=o,t[10]=a*s}else if(e.order===`ZYX`){let e=a*l,n=a*u,r=o*l,i=o*u;t[0]=s*l,t[4]=r*c-n,t[8]=e*c+i,t[1]=s*u,t[5]=i*c+e,t[9]=n*c-r,t[2]=-c,t[6]=o*s,t[10]=a*s}else if(e.order===`YZX`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=i-e*u,t[8]=r*u+n,t[1]=u,t[5]=a*l,t[9]=-o*l,t[2]=-c*l,t[6]=n*u+r,t[10]=e-i*u}else if(e.order===`XZY`){let e=a*s,n=a*c,r=o*s,i=o*c;t[0]=s*l,t[4]=-u,t[8]=c*l,t[1]=e*u+i,t[5]=a*l,t[9]=n*u-r,t[2]=r*u-n,t[6]=o*l,t[10]=i*u+e}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(hc,e,gc)}lookAt(e,t,n){let r=this.elements;return yc.subVectors(e,t),yc.lengthSq()===0&&(yc.z=1),yc.normalize(),_c.crossVectors(n,yc),_c.lengthSq()===0&&(Math.abs(n.z)===1?yc.x+=1e-4:yc.z+=1e-4,yc.normalize(),_c.crossVectors(n,yc)),_c.normalize(),vc.crossVectors(yc,_c),r[0]=_c.x,r[4]=vc.x,r[8]=yc.x,r[1]=_c.y,r[5]=vc.y,r[9]=yc.y,r[2]=_c.z,r[6]=vc.z,r[10]=yc.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,r=t.elements,i=this.elements,a=n[0],o=n[4],s=n[8],c=n[12],l=n[1],u=n[5],d=n[9],f=n[13],p=n[2],m=n[6],h=n[10],g=n[14],_=n[3],v=n[7],y=n[11],b=n[15],x=r[0],S=r[4],C=r[8],w=r[12],T=r[1],E=r[5],D=r[9],O=r[13],k=r[2],A=r[6],j=r[10],ee=r[14],M=r[3],te=r[7],ne=r[11],re=r[15];return i[0]=a*x+o*T+s*k+c*M,i[4]=a*S+o*E+s*A+c*te,i[8]=a*C+o*D+s*j+c*ne,i[12]=a*w+o*O+s*ee+c*re,i[1]=l*x+u*T+d*k+f*M,i[5]=l*S+u*E+d*A+f*te,i[9]=l*C+u*D+d*j+f*ne,i[13]=l*w+u*O+d*ee+f*re,i[2]=p*x+m*T+h*k+g*M,i[6]=p*S+m*E+h*A+g*te,i[10]=p*C+m*D+h*j+g*ne,i[14]=p*w+m*O+h*ee+g*re,i[3]=_*x+v*T+y*k+b*M,i[7]=_*S+v*E+y*A+b*te,i[11]=_*C+v*D+y*j+b*ne,i[15]=_*w+v*O+y*ee+b*re,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[12],a=e[1],o=e[5],s=e[9],c=e[13],l=e[2],u=e[6],d=e[10],f=e[14],p=e[3],m=e[7],h=e[11],g=e[15],_=s*f-c*d,v=o*f-c*u,y=o*d-s*u,b=a*f-c*l,x=a*d-s*l,S=a*u-o*l;return t*(m*_-h*v+g*y)-n*(p*_-h*b+g*x)+r*(p*v-m*b+g*S)-i*(p*y-m*x+h*S)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],r=e[8],i=e[1],a=e[5],o=e[9],s=e[2],c=e[6],l=e[10];return t*(a*l-o*c)-n*(i*l-o*s)+r*(i*c-a*s)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],r=e[2],i=e[3],a=e[4],o=e[5],s=e[6],c=e[7],l=e[8],u=e[9],d=e[10],f=e[11],p=e[12],m=e[13],h=e[14],g=e[15],_=t*o-n*a,v=t*s-r*a,y=t*c-i*a,b=n*s-r*o,x=n*c-i*o,S=r*c-i*s,C=l*m-u*p,w=l*h-d*p,T=l*g-f*p,E=u*h-d*m,D=u*g-f*m,O=d*g-f*h,k=_*O-v*D+y*E+b*T-x*w+S*C;if(k===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/k;return e[0]=(o*O-s*D+c*E)*A,e[1]=(r*D-n*O-i*E)*A,e[2]=(m*S-h*x+g*b)*A,e[3]=(d*x-u*S-f*b)*A,e[4]=(s*T-a*O-c*w)*A,e[5]=(t*O-r*T+i*w)*A,e[6]=(h*y-p*S-g*v)*A,e[7]=(l*S-d*y+f*v)*A,e[8]=(a*D-o*T+c*C)*A,e[9]=(n*T-t*D-i*C)*A,e[10]=(p*x-m*y+g*_)*A,e[11]=(u*y-l*x-f*_)*A,e[12]=(o*w-a*E-s*C)*A,e[13]=(t*E-n*w+r*C)*A,e[14]=(m*v-p*b-h*_)*A,e[15]=(l*b-u*v+d*_)*A,this}scale(e){let t=this.elements,n=e.x,r=e.y,i=e.z;return t[0]*=n,t[4]*=r,t[8]*=i,t[1]*=n,t[5]*=r,t[9]*=i,t[2]*=n,t[6]*=r,t[10]*=i,t[3]*=n,t[7]*=r,t[11]*=i,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,r))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),r=Math.sin(t),i=1-n,a=e.x,o=e.y,s=e.z,c=i*a,l=i*o;return this.set(c*a+n,c*o-r*s,c*s+r*o,0,c*o+r*s,l*o+n,l*s-r*a,0,c*s-r*o,l*s+r*a,i*s*s+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,r,i,a){return this.set(1,n,i,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,n){let r=this.elements,i=t._x,a=t._y,o=t._z,s=t._w,c=i+i,l=a+a,u=o+o,d=i*c,f=i*l,p=i*u,m=a*l,h=a*u,g=o*u,_=s*c,v=s*l,y=s*u,b=n.x,x=n.y,S=n.z;return r[0]=(1-(m+g))*b,r[1]=(f+y)*b,r[2]=(p-v)*b,r[3]=0,r[4]=(f-y)*x,r[5]=(1-(d+g))*x,r[6]=(h+_)*x,r[7]=0,r[8]=(p+v)*S,r[9]=(h-_)*S,r[10]=(1-(d+m))*S,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,n){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let i=this.determinantAffine();if(i===0)return n.set(1,1,1),t.identity(),this;let a=pc.set(r[0],r[1],r[2]).length(),o=pc.set(r[4],r[5],r[6]).length(),s=pc.set(r[8],r[9],r[10]).length();i<0&&(a=-a),mc.copy(this);let c=1/a,l=1/o,u=1/s;return mc.elements[0]*=c,mc.elements[1]*=c,mc.elements[2]*=c,mc.elements[4]*=l,mc.elements[5]*=l,mc.elements[6]*=l,mc.elements[8]*=u,mc.elements[9]*=u,mc.elements[10]*=u,t.setFromRotationMatrix(mc),n.x=a,n.y=o,n.z=s,this}makePerspective(e,t,n,r,i,a,o=as,s=!1){let c=this.elements,l=2*i/(t-e),u=2*i/(n-r),d=(t+e)/(t-e),f=(n+r)/(n-r),p,m;if(s)p=i/(a-i),m=a*i/(a-i);else if(o===2e3)p=-(a+i)/(a-i),m=-2*a*i/(a-i);else if(o===2001)p=-a/(a-i),m=-a*i/(a-i);else throw Error(`THREE.Matrix4.makePerspective(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,r,i,a,o=as,s=!1){let c=this.elements,l=2/(t-e),u=2/(n-r),d=-(t+e)/(t-e),f=-(n+r)/(n-r),p,m;if(s)p=1/(a-i),m=a/(a-i);else if(o===2e3)p=-2/(a-i),m=-(a+i)/(a-i);else if(o===2001)p=-1/(a-i),m=-i/(a-i);else throw Error(`THREE.Matrix4.makeOrthographic(): Invalid coordinate system: `+o);return c[0]=l,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=p,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let e=0;e<16;e++)if(t[e]!==n[e])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},pc=new U,mc=new fc,hc=new U(0,0,0),gc=new U(1,1,1),_c=new U,vc=new U,yc=new U,bc=new fc,xc=new Ws,Sc=class e{constructor(t=0,n=0,r=0,i=e.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=r,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,r=this._order){return this._x=e,this._y=t,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let r=e.elements,i=r[0],a=r[4],o=r[8],s=r[1],c=r[5],l=r[9],u=r[2],d=r[6],f=r[10];switch(t){case`XYZ`:this._y=Math.asin(V(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-l,f),this._z=Math.atan2(-a,i)):(this._x=Math.atan2(d,c),this._z=0);break;case`YXZ`:this._x=Math.asin(-V(l,-1,1)),Math.abs(l)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(s,c)):(this._y=Math.atan2(-u,i),this._z=0);break;case`ZXY`:this._x=Math.asin(V(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(s,i));break;case`ZYX`:this._y=Math.asin(-V(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(s,i)):(this._x=0,this._z=Math.atan2(-a,c));break;case`YZX`:this._z=Math.asin(V(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-l,c),this._y=Math.atan2(-u,i)):(this._x=0,this._y=Math.atan2(o,f));break;case`XZY`:this._z=Math.asin(-V(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,i)):(this._x=Math.atan2(-l,f),this._y=0);break;default:z(`Euler: .setFromRotationMatrix() encountered an unknown order: `+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return bc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(bc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xc.setFromEuler(this),this.setFromQuaternion(xc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sc.DEFAULT_ORDER=`XYZ`;var Cc=class{constructor(){this.mask=1}set(e){this.mask=1<<e>>>0}enable(e){this.mask|=1<<e}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e}disable(e){this.mask&=~(1<<e)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return!!(this.mask&1<<e)}},wc=0,Tc=new U,Ec=new Ws,Dc=new fc,Oc=new U,kc=new U,Ac=new U,jc=new Ws,Mc=new U(1,0,0),Nc=new U(0,1,0),Pc=new U(0,0,1),Fc={type:`added`},Ic={type:`removed`},Lc={type:`childadded`,child:null},Rc={type:`childremoved`,child:null},zc=class e extends gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wc++}),this.uuid=xs(),this.name=``,this.type=`Object3D`,this.parent=null,this.children=[],this.up=e.DEFAULT_UP.clone();let t=new U,n=new Sc,r=new Ws,i=new U(1,1,1);function a(){r.setFromEuler(n,!1)}function o(){n.setFromQuaternion(r,void 0,!1)}n._onChange(a),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new fc},normalMatrix:{value:new W}}),this.matrix=new fc,this.matrixWorld=new fc,this.matrixAutoUpdate=e.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ec.setFromAxisAngle(e,t),this.quaternion.multiply(Ec),this}rotateOnWorldAxis(e,t){return Ec.setFromAxisAngle(e,t),this.quaternion.premultiply(Ec),this}rotateX(e){return this.rotateOnAxis(Mc,e)}rotateY(e){return this.rotateOnAxis(Nc,e)}rotateZ(e){return this.rotateOnAxis(Pc,e)}translateOnAxis(e,t){return Tc.copy(e).applyQuaternion(this.quaternion),this.position.add(Tc.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Mc,e)}translateY(e){return this.translateOnAxis(Nc,e)}translateZ(e){return this.translateOnAxis(Pc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dc.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Oc.copy(e):Oc.set(e,t,n);let r=this.parent;this.updateWorldMatrix(!0,!1),kc.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dc.lookAt(kc,Oc,this.up):Dc.lookAt(Oc,kc,this.up),this.quaternion.setFromRotationMatrix(Dc),r&&(Dc.extractRotation(r.matrixWorld),Ec.setFromRotationMatrix(Dc),this.quaternion.premultiply(Ec.invert()))}add(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return e===this?(B(`Object3D.add: object can't be added as a child of itself.`,e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Fc),Lc.child=e,this.dispatchEvent(Lc),Lc.child=null):B(`Object3D.add: object not an instance of THREE.Object3D.`,e),this)}remove(e){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ic),Rc.child=e,this.dispatchEvent(Rc),Rc.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dc.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dc.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dc),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Fc),Lc.child=e,this.dispatchEvent(Lc),Lc.child=null,this}getObjectById(e){return this.getObjectByProperty(`id`,e)}getObjectByName(e){return this.getObjectByProperty(`name`,e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,r=this.children.length;n<r;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);let r=this.children;for(let i=0,a=r.length;i<a;i++)r[i].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kc,e,Ac),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(kc,jc,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,n=e.y,r=e.z,i=this.matrix.elements;i[12]+=t-i[0]*t-i[4]*n-i[8]*r,i[13]+=n-i[1]*t-i[5]*n-i[9]*r,i[14]+=r-i[2]*t-i[6]*n-i[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let n=0,r=t.length;n<r;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){let e=this.children;for(let t=0,r=e.length;t<r;t++)e[t].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==`string`,n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:`Object`,generator:`Object3D.toJSON`});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type=`InstancedMesh`,r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type=`BatchedMesh`,r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(e=>({...e,boundingBox:e.boundingBox?e.boundingBox.toJSON():void 0,boundingSphere:e.boundingSphere?e.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(e=>({...e})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function i(t,n){return t[n.uuid]===void 0&&(t[n.uuid]=n.toJSON(e)),n.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=i(e.geometries,this.geometry);let t=this.geometry.parameters;if(t!==void 0&&t.shapes!==void 0){let n=t.shapes;if(Array.isArray(n))for(let t=0,r=n.length;t<r;t++){let r=n[t];i(e.shapes,r)}else i(e.shapes,n)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(i(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0){if(Array.isArray(this.material)){let t=[];for(let n=0,r=this.material.length;n<r;n++)t.push(i(e.materials,this.material[n]));r.material=t}else r.material=i(e.materials,this.material)}if(this.children.length>0){r.children=[];for(let t=0;t<this.children.length;t++)r.children.push(this.children[t].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let t=0;t<this.animations.length;t++){let n=this.animations[t];r.animations.push(i(e.animations,n))}}if(t){let t=a(e.geometries),r=a(e.materials),i=a(e.textures),o=a(e.images),s=a(e.shapes),c=a(e.skeletons),l=a(e.animations),u=a(e.nodes);t.length>0&&(n.geometries=t),r.length>0&&(n.materials=r),i.length>0&&(n.textures=i),o.length>0&&(n.images=o),s.length>0&&(n.shapes=s),c.length>0&&(n.skeletons=c),l.length>0&&(n.animations=l),u.length>0&&(n.nodes=u)}return n.object=r,n;function a(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot===null?null:e.pivot.clone(),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let t=0;t<e.children.length;t++){let n=e.children[t];this.add(n.clone())}return this}dispose(){this.dispatchEvent({type:`dispose`})}};zc.DEFAULT_UP=new U(0,1,0),zc.DEFAULT_MATRIX_AUTO_UPDATE=!0,zc.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var K=class extends zc{constructor(){super(),this.isGroup=!0,this.type=`Group`}},Bc={type:`move`},Vc=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new K,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new K,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new U,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new U),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new K,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new U,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new U,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:`connected`,data:e}),this}disconnect(e){return this.dispatchEvent({type:`disconnected`,data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let r=null,i=null,a=null,o=this._targetRay,s=this._grip,c=this._hand;if(e&&t.session.visibilityState!==`visible-blurred`){if(c&&e.hand){a=!0;for(let r of e.hand.values()){let e=t.getJointPose(r,n),i=this._getHandJoint(c,r);e!==null&&(i.matrix.fromArray(e.transform.matrix),i.matrix.decompose(i.position,i.quaternion,i.scale),i.matrixWorldNeedsUpdate=!0,i.jointRadius=e.radius),i.visible=e!==null}let r=c.joints[`index-finger-tip`],i=c.joints[`thumb-tip`],o=r.position.distanceTo(i.position);c.inputState.pinching&&o>.025?(c.inputState.pinching=!1,this.dispatchEvent({type:`pinchend`,handedness:e.handedness,target:this})):!c.inputState.pinching&&o<=.015&&(c.inputState.pinching=!0,this.dispatchEvent({type:`pinchstart`,handedness:e.handedness,target:this}))}else s!==null&&e.gripSpace&&(i=t.getPose(e.gripSpace,n),i!==null&&(s.matrix.fromArray(i.transform.matrix),s.matrix.decompose(s.position,s.quaternion,s.scale),s.matrixWorldNeedsUpdate=!0,i.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(i.linearVelocity)):s.hasLinearVelocity=!1,i.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(i.angularVelocity)):s.hasAngularVelocity=!1,s.eventsEnabled&&s.dispatchEvent({type:`gripUpdated`,data:e,target:this})));o!==null&&(r=t.getPose(e.targetRaySpace,n),r===null&&i!==null&&(r=i),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Bc)))}return o!==null&&(o.visible=r!==null),s!==null&&(s.visible=i!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new K;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}},Hc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Uc={h:0,s:0,l:0},Wc={h:0,s:0,l:0};function Gc(e,t,n){return n<0&&(n+=1),n>1&&--n,n<1/6?e+(t-e)*6*n:n<1/2?t:n<2/3?e+(t-e)*6*(2/3-n):e}var q=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let t=e;t&&t.isColor?this.copy(t):typeof t==`number`?this.setHex(t):typeof t==`string`&&this.setStyle(t)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$o){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,G.colorSpaceToWorking(this,t),this}setRGB(e,t,n,r=G.workingColorSpace){return this.r=e,this.g=t,this.b=n,G.colorSpaceToWorking(this,r),this}setHSL(e,t,n,r=G.workingColorSpace){if(e=Ss(e,1),t=V(t,0,1),n=V(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,i=2*n-r;this.r=Gc(i,r,e+1/3),this.g=Gc(i,r,e),this.b=Gc(i,r,e-1/3)}return G.colorSpaceToWorking(this,r),this}setStyle(e,t=$o){function n(t){t!==void 0&&parseFloat(t)<1&&z(`Color: Alpha component of `+e+` will be ignored.`)}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let i,a=r[1],o=r[2];switch(a){case`rgb`:case`rgba`:if(i=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(255,parseInt(i[1],10))/255,Math.min(255,parseInt(i[2],10))/255,Math.min(255,parseInt(i[3],10))/255,t);if(i=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setRGB(Math.min(100,parseFloat(i[1]))/100,Math.min(100,parseFloat(i[2]))/100,Math.min(100,parseFloat(i[3]))/100,t);break;case`hsl`:case`hsla`:if(i=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(i[4]),this.setHSL(parseFloat(i[1])/360,parseFloat(i[2])/100,parseFloat(i[3])/100,t);break;default:z(`Color: Unknown color model `+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let n=r[1],i=n.length;if(i===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(i===6)return this.setHex(parseInt(n,16),t);z(`Color: Invalid hex color `+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$o){let n=Hc[e.toLowerCase()];return n===void 0?z(`Color: Unknown color `+e):this.setHex(n,t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zs(e.r),this.g=Zs(e.g),this.b=Zs(e.b),this}copyLinearToSRGB(e){return this.r=Qs(e.r),this.g=Qs(e.g),this.b=Qs(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$o){return G.workingToColorSpace(Kc.copy(this),e),Math.round(V(Kc.r*255,0,255))*65536+Math.round(V(Kc.g*255,0,255))*256+Math.round(V(Kc.b*255,0,255))}getHexString(e=$o){return(`000000`+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=G.workingColorSpace){G.workingToColorSpace(Kc.copy(this),t);let n=Kc.r,r=Kc.g,i=Kc.b,a=Math.max(n,r,i),o=Math.min(n,r,i),s,c,l=(o+a)/2;if(o===a)s=0,c=0;else{let e=a-o;switch(c=l<=.5?e/(a+o):e/(2-a-o),a){case n:s=(r-i)/e+(r<i?6:0);break;case r:s=(i-n)/e+2;break;case i:s=(n-r)/e+4}s/=6}return e.h=s,e.s=c,e.l=l,e}getRGB(e,t=G.workingColorSpace){return G.workingToColorSpace(Kc.copy(this),t),e.r=Kc.r,e.g=Kc.g,e.b=Kc.b,e}getStyle(e=$o){G.workingToColorSpace(Kc.copy(this),e);let t=Kc.r,n=Kc.g,r=Kc.b;return e===`srgb`?`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(r*255)})`:`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`}offsetHSL(e,t,n){return this.getHSL(Uc),this.setHSL(Uc.h+e,Uc.s+t,Uc.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Uc),e.getHSL(Wc);let n=Ts(Uc.h,Wc.h,t),r=Ts(Uc.s,Wc.s,t),i=Ts(Uc.l,Wc.l,t);return this.setHSL(n,r,i),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,r=this.b,i=e.elements;return this.r=i[0]*t+i[3]*n+i[6]*r,this.g=i[1]*t+i[4]*n+i[7]*r,this.b=i[2]*t+i[5]*n+i[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Kc=new q;q.NAMES=Hc;var qc=class extends zc{constructor(){super(),this.isScene=!0,this.type=`Scene`,this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sc,this.environmentIntensity=1,this.environmentRotation=new Sc,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background===null?null:e.background.clone(),this.environment=e.environment===null?null:e.environment.clone(),this.fog=e.fog===null?null:e.fog.clone(),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial===null?null:e.overrideMaterial.clone(),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Jc=new U,Yc=new U,Xc=new U,Zc=new U,Qc=new U,$c=new U,el=new U,tl=new U,nl=new U,rl=new U,il=new sc,al=new sc,ol=new sc,sl=class e{constructor(e=new U,t=new U,n=new U){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,r){r.subVectors(n,t),Jc.subVectors(e,t),r.cross(Jc);let i=r.lengthSq();return i>0?r.multiplyScalar(1/Math.sqrt(i)):r.set(0,0,0)}static getBarycoord(e,t,n,r,i){Jc.subVectors(r,t),Yc.subVectors(n,t),Xc.subVectors(e,t);let a=Jc.dot(Jc),o=Jc.dot(Yc),s=Jc.dot(Xc),c=Yc.dot(Yc),l=Yc.dot(Xc),u=a*c-o*o;if(u===0)return i.set(0,0,0),null;let d=1/u,f=(c*s-o*l)*d,p=(a*l-o*s)*d;return i.set(1-f-p,p,f)}static containsPoint(e,t,n,r){return this.getBarycoord(e,t,n,r,Zc)!==null&&Zc.x>=0&&Zc.y>=0&&Zc.x+Zc.y<=1}static getInterpolation(e,t,n,r,i,a,o,s){return this.getBarycoord(e,t,n,r,Zc)===null?(s.x=0,s.y=0,`z`in s&&(s.z=0),`w`in s&&(s.w=0),null):(s.setScalar(0),s.addScaledVector(i,Zc.x),s.addScaledVector(a,Zc.y),s.addScaledVector(o,Zc.z),s)}static getInterpolatedAttribute(e,t,n,r,i,a){return il.setScalar(0),al.setScalar(0),ol.setScalar(0),il.fromBufferAttribute(e,t),al.fromBufferAttribute(e,n),ol.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(il,i.x),a.addScaledVector(al,i.y),a.addScaledVector(ol,i.z),a}static isFrontFacing(e,t,n,r){return Jc.subVectors(n,t),Yc.subVectors(e,t),Jc.cross(Yc).dot(r)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,r){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,n,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Jc.subVectors(this.c,this.b),Yc.subVectors(this.a,this.b),Jc.cross(Yc).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return e.getNormal(this.a,this.b,this.c,t)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,n){return e.getBarycoord(t,this.a,this.b,this.c,n)}getInterpolation(t,n,r,i,a){return e.getInterpolation(t,this.a,this.b,this.c,n,r,i,a)}containsPoint(t){return e.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return e.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,r=this.b,i=this.c,a,o;Qc.subVectors(r,n),$c.subVectors(i,n),tl.subVectors(e,n);let s=Qc.dot(tl),c=$c.dot(tl);if(s<=0&&c<=0)return t.copy(n);nl.subVectors(e,r);let l=Qc.dot(nl),u=$c.dot(nl);if(l>=0&&u<=l)return t.copy(r);let d=s*u-l*c;if(d<=0&&s>=0&&l<=0&&s-l>0)return a=s/(s-l),t.copy(n).addScaledVector(Qc,a);rl.subVectors(e,i);let f=Qc.dot(rl),p=$c.dot(rl);if(p>=0&&f<=p)return t.copy(i);let m=f*c-s*p;if(m<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector($c,o);let h=l*p-f*u;if(h<=0&&u-l>=0&&f-p>=0)return el.subVectors(i,r),o=(u-l)/(u-l+(f-p)),t.copy(r).addScaledVector(el,o);let g=1/(h+m+d);return a=m*g,o=d*g,t.copy(n).addScaledVector(Qc,a).addScaledVector($c,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},cl=class{constructor(e=new U(1/0,1/0,1/0),t=new U(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ul.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ul.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=ul.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute(`position`);if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let t=0,n=r.count;t<n;t++)e.isMesh===!0?e.getVertexPosition(t,ul):ul.fromBufferAttribute(r,t),ul.applyMatrix4(e.matrixWorld),this.expandByPoint(ul);else e.boundingBox===void 0?(n.boundingBox===null&&n.computeBoundingBox(),dl.copy(n.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),dl.copy(e.boundingBox)),dl.applyMatrix4(e.matrixWorld),this.union(dl)}let r=e.children;for(let e=0,n=r.length;e<n;e++)this.expandByObject(r[e],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ul),ul.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(vl),yl.subVectors(this.max,vl),fl.subVectors(e.a,vl),pl.subVectors(e.b,vl),ml.subVectors(e.c,vl),hl.subVectors(pl,fl),gl.subVectors(ml,pl),_l.subVectors(fl,ml);let t=[0,-hl.z,hl.y,0,-gl.z,gl.y,0,-_l.z,_l.y,hl.z,0,-hl.x,gl.z,0,-gl.x,_l.z,0,-_l.x,-hl.y,hl.x,0,-gl.y,gl.x,0,-_l.y,_l.x,0];return!Sl(t,fl,pl,ml,yl)||(t=[1,0,0,0,1,0,0,0,1],!Sl(t,fl,pl,ml,yl))?!1:(bl.crossVectors(hl,gl),t=[bl.x,bl.y,bl.z],Sl(t,fl,pl,ml,yl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ul).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ul).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()||(ll[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ll[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ll[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ll[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ll[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ll[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ll[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ll[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ll)),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ll=[new U,new U,new U,new U,new U,new U,new U,new U],ul=new U,dl=new cl,fl=new U,pl=new U,ml=new U,hl=new U,gl=new U,_l=new U,vl=new U,yl=new U,bl=new U,xl=new U;function Sl(e,t,n,r,i){for(let a=0,o=e.length-3;a<=o;a+=3){xl.fromArray(e,a);let o=i.x*Math.abs(xl.x)+i.y*Math.abs(xl.y)+i.z*Math.abs(xl.z),s=t.dot(xl),c=n.dot(xl),l=r.dot(xl);if(Math.max(-Math.max(s,c,l),Math.min(s,c,l))>o)return!1}return!0}var Cl=new U,wl=new H,Tl=0,El=class extends gs{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw TypeError(`THREE.BufferAttribute: array should be a Typed Array.`);this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Tl++}),this.name=``,this.array=e,this.itemSize=t,this.count=e===void 0?0:e.length/t,this.normalized=n,this.usage=is,this.updateRanges=[],this.gpuType=Ga,this.version=0,this._normalizationScale=e===void 0?void 0:Bs(e)}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let r=0,i=this.itemSize;r<i;r++)this.array[e+r]=t.array[n+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)wl.fromBufferAttribute(this,t),wl.applyMatrix3(e),this.setXY(t,wl.x,wl.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Cl.fromBufferAttribute(this,t),Cl.applyMatrix3(e),this.setXYZ(t,Cl.x,Cl.y,Cl.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Cl.fromBufferAttribute(this,t),Cl.applyMatrix4(e),this.setXYZ(t,Cl.x,Cl.y,Cl.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Cl.fromBufferAttribute(this,t),Cl.applyNormalMatrix(e),this.setXYZ(t,Cl.x,Cl.y,Cl.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Cl.fromBufferAttribute(this,t),Cl.transformDirection(e),this.setXYZ(t,Cl.x,Cl.y,Cl.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=this._denormalize(t)),t}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=this._denormalize(t)),t}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=this._denormalize(t)),t}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=this._denormalize(t)),t}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,r){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e*=this.itemSize,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=r,this.array[e+3]=i,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:`dispose`})}_denormalize(e){let t=this._normalizationScale;return t===void 0?Vs(e,this.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?Hs(e,this.array):Math.round(e*t)}},Dl=class extends El{constructor(e,t,n){super(new Uint16Array(e),t,n)}},Ol=class extends El{constructor(e,t,n){super(new Uint32Array(e),t,n)}},J=class extends El{constructor(e,t,n){super(new Float32Array(e),t,n)}},kl=new cl,Al=new U,jl=new U,Ml=class{constructor(e=new U,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t===void 0?kl.setFromPoints(e).getCenter(n):n.copy(t);let r=0;for(let t=0,i=e.length;t<i;t++)r=Math.max(r,n.distanceToSquared(e[t]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius*=e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Al.subVectors(e,this.center);let t=Al.lengthSq();if(t>this.radius*this.radius){let e=Math.sqrt(t),n=(e-this.radius)*.5;this.center.addScaledVector(Al,n/e),this.radius+=n}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(jl.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Al.copy(e.center).add(jl)),this.expandByPoint(Al.copy(e.center).sub(jl))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},Nl=0,Pl=new fc,Fl=new zc,Il=new U,Ll=new cl,Rl=new cl,zl=new U,Bl=class e extends gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nl++}),this.uuid=xs(),this.name=``,this.type=`BufferGeometry`,this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return this.index=Array.isArray(e)?new(os(e)?Ol:Dl)(e,1):e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let t=new W().getNormalMatrix(e);n.applyNormalMatrix(t),n.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Pl.makeRotationFromQuaternion(e),this.applyMatrix4(Pl),this}rotateX(e){return Pl.makeRotationX(e),this.applyMatrix4(Pl),this}rotateY(e){return Pl.makeRotationY(e),this.applyMatrix4(Pl),this}rotateZ(e){return Pl.makeRotationZ(e),this.applyMatrix4(Pl),this}translate(e,t,n){return Pl.makeTranslation(e,t,n),this.applyMatrix4(Pl),this}scale(e,t,n){return Pl.makeScale(e,t,n),this.applyMatrix4(Pl),this}lookAt(e){return Fl.lookAt(e),Fl.updateMatrix(),this.applyMatrix4(Fl.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Il).negate(),this.translate(Il.x,Il.y,Il.z),this}setFromPoints(e){let t=this.getAttribute(`position`);if(t===void 0){let t=[];for(let n=0,r=e.length;n<r;n++){let r=e[n];t.push(r.x,r.y,r.z||0)}this.setAttribute(`position`,new J(t,3))}else{let n=Math.min(e.length,t.count);for(let r=0;r<n;r++){let n=e[r];t.setXYZ(r,n.x,n.y,n.z||0)}e.length>t.count&&z(`BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.`),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new cl);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.`,this),this.boundingBox.set(new U(-1/0,-1/0,-1/0),new U(1/0,1/0,1/0));else{if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Ll.setFromBufferAttribute(n),this.morphTargetsRelative?(zl.addVectors(this.boundingBox.min,Ll.min),this.boundingBox.expandByPoint(zl),zl.addVectors(this.boundingBox.max,Ll.max),this.boundingBox.expandByPoint(zl)):(this.boundingBox.expandByPoint(Ll.min),this.boundingBox.expandByPoint(Ll.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&B(`BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.`,this)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ml);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute)B(`BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.`,this),this.boundingSphere.set(new U,1/0);else if(e){let n=this.boundingSphere.center;if(Ll.setFromBufferAttribute(e),t)for(let e=0,n=t.length;e<n;e++){let n=t[e];Rl.setFromBufferAttribute(n),this.morphTargetsRelative?(zl.addVectors(Ll.min,Rl.min),Ll.expandByPoint(zl),zl.addVectors(Ll.max,Rl.max),Ll.expandByPoint(zl)):(Ll.expandByPoint(Rl.min),Ll.expandByPoint(Rl.max))}Ll.getCenter(n);let r=0;for(let t=0,i=e.count;t<i;t++)zl.fromBufferAttribute(e,t),r=Math.max(r,n.distanceToSquared(zl));if(t)for(let i=0,a=t.length;i<a;i++){let a=t[i],o=this.morphTargetsRelative;for(let t=0,i=a.count;t<i;t++)zl.fromBufferAttribute(a,t),o&&(Il.fromBufferAttribute(e,t),zl.add(Il)),r=Math.max(r,n.distanceToSquared(zl))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&B(`BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.`,this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){B(`BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)`);return}let n=t.position,r=t.normal,i=t.uv,a=this.getAttribute(`tangent`);(a===void 0||a.count!==n.count)&&(a=new El(new Float32Array(4*n.count),4),this.setAttribute(`tangent`,a));let o=[],s=[],c=new Uint8Array(n.count);for(let e=0;e<n.count;e++)o[e]=new U,s[e]=new U;let l=new U,u=new U,d=new U,f=new H,p=new H,m=new H,h=new U,g=new U;function _(e,t,r){c[e]=c[t]=c[r]=1,l.fromBufferAttribute(n,e),u.fromBufferAttribute(n,t),d.fromBufferAttribute(n,r),f.fromBufferAttribute(i,e),p.fromBufferAttribute(i,t),m.fromBufferAttribute(i,r),u.sub(l),d.sub(l),p.sub(f),m.sub(f);let a=1/(p.x*m.y-m.x*p.y);isFinite(a)&&(h.copy(u).multiplyScalar(m.y).addScaledVector(d,-p.y).multiplyScalar(a),g.copy(d).multiplyScalar(p.x).addScaledVector(u,-m.x).multiplyScalar(a),o[e].add(h),o[t].add(h),o[r].add(h),s[e].add(g),s[t].add(g),s[r].add(g))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let t=0,n=v.length;t<n;++t){let n=v[t],r=n.start,i=n.count;for(let t=r,n=r+i;t<n;t+=3)_(e.getX(t+0),e.getX(t+1),e.getX(t+2))}let y=new U,b=new U,x=new U,S=new U;function C(e){x.fromBufferAttribute(r,e),S.copy(x);let t=o[e];y.copy(t),y.sub(x.multiplyScalar(x.dot(t))).normalize(),b.crossVectors(S,t);let n=b.dot(s[e])<0?-1:1;a.setXYZW(e,y.x,y.y,y.z,n)}for(let e=0,t=n.count;e<t;++e)c[e]&&C(e);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute(`position`);if(t!==void 0){let n=this.getAttribute(`normal`);if(n===void 0||n.count!==t.count)n=new El(new Float32Array(t.count*3),3),this.setAttribute(`normal`,n);else for(let e=0,t=n.count;e<t;e++)n.setXYZ(e,0,0,0);let r=new U,i=new U,a=new U,o=new U,s=new U,c=new U,l=new U,u=new U;if(e)for(let d=0,f=e.count;d<f;d+=3){let f=e.getX(d+0),p=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,f),i.fromBufferAttribute(t,p),a.fromBufferAttribute(t,m),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),o.fromBufferAttribute(n,f),s.fromBufferAttribute(n,p),c.fromBufferAttribute(n,m),o.add(l),s.add(l),c.add(l),n.setXYZ(f,o.x,o.y,o.z),n.setXYZ(p,s.x,s.y,s.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let e=0,o=t.count;e<o;e+=3)r.fromBufferAttribute(t,e+0),i.fromBufferAttribute(t,e+1),a.fromBufferAttribute(t,e+2),l.subVectors(a,i),u.subVectors(r,i),l.cross(u),n.setXYZ(e+0,l.x,l.y,l.z),n.setXYZ(e+1,l.x,l.y,l.z),n.setXYZ(e+2,l.x,l.y,l.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)zl.fromBufferAttribute(e,t),zl.normalize(),e.setXYZ(t,zl.x,zl.y,zl.z)}toNonIndexed(){function t(e,t){let n=e.array,r=e.itemSize,i=e.normalized,a=new n.constructor(t.length*r),o=0,s=0;for(let i=0,c=t.length;i<c;i++){o=e.isInterleavedBufferAttribute?t[i]*e.data.stride+e.offset:t[i]*r;for(let e=0;e<r;e++)a[s++]=n[o++]}return new El(a,r,i)}if(this.index===null)return z(`BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.`),this;let n=new e,r=this.index.array,i=this.attributes;for(let e in i){let a=i[e],o=t(a,r);n.setAttribute(e,o)}let a=this.morphAttributes;for(let e in a){let i=[],o=a[e];for(let e=0,n=o.length;e<n;e++){let n=o[e],a=t(n,r);i.push(a)}n.morphAttributes[e]=i}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let e=0,t=o.length;e<t;e++){let t=o[e];n.addGroup(t.start,t.count,t.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:`BufferGeometry`,generator:`BufferGeometry.toJSON`}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?`BufferGeometry`:this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let t=this.parameters;for(let n in t)t[n]!==void 0&&(e[n]=t[n]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let t in n){let r=n[t];e.data.attributes[t]=r.toJSON(e.data)}let r={},i=!1;for(let t in this.morphAttributes){let n=this.morphAttributes[t],a=[];for(let t=0,r=n.length;t<r;t++){let r=n[t];a.push(r.toJSON(e.data))}a.length>0&&(r[t]=a,i=!0)}i&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let r=e.attributes;for(let e in r){let n=r[e];this.setAttribute(e,n.clone(t))}let i=e.morphAttributes;for(let e in i){let n=[],r=i[e];for(let e=0,i=r.length;e<i;e++)n.push(r[e].clone(t));this.morphAttributes[e]=n}this.morphTargetsRelative=e.morphTargetsRelative;let a=e.groups;for(let e=0,t=a.length;e<t;e++){let t=a[e];this.addGroup(t.start,t.count,t.materialIndex)}let o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());let s=e.boundingSphere;return s!==null&&(this.boundingSphere=s.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:`dispose`})}},Vl=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e===void 0?0:e.length/t,this.usage=is,this.updateRanges=[],this.version=0,this.uuid=xs()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let r=0,i=this.stride;r<i;r++)this.array[e+r]=t.array[n+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Hl(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[t]),r=new this.constructor(n,this.stride);return r.setUsage(this.usage),r}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={});let t=Hl(this.array);e.arrayBuffers[t]===void 0&&(e.arrayBuffers[t]=Array.from(new Uint32Array(this.array.slice(0).buffer)));let n={uuid:this.uuid,buffer:t,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}};function Hl(e){return e.buffer._uuid===void 0&&(e.buffer._uuid=xs()),e.byteOffset===0&&e.byteLength===e.buffer.byteLength?e.buffer._uuid:e.buffer._uuid+`:`+e.byteOffset+`:`+e.byteLength}var Ul=new U,Wl=class e{constructor(e,t,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name=``,this.data=e,this.itemSize=t,this.offset=n,this.normalized=r,this._normalizationScale=e===void 0?void 0:Bs(e.array)}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ul.fromBufferAttribute(this,t),Ul.applyMatrix4(e),this.setXYZ(t,Ul.x,Ul.y,Ul.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ul.fromBufferAttribute(this,t),Ul.applyNormalMatrix(e),this.setXYZ(t,Ul.x,Ul.y,Ul.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ul.fromBufferAttribute(this,t),Ul.transformDirection(e),this.setXYZ(t,Ul.x,Ul.y,Ul.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=this._denormalize(n)),n}setComponent(e,t,n){return this.normalized&&(n=this._normalize(n)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=this._normalize(t)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=this._denormalize(t)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=this._denormalize(t)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=this._denormalize(t)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=this._denormalize(t)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this}setXYZW(e,t,n,r,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=this._normalize(t),n=this._normalize(n),r=this._normalize(r),i=this._normalize(i)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=r,this.data.array[e+3]=i,this}clone(t){if(t===void 0){ds(`InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return new El(new this.array.constructor(e),this.itemSize,this.normalized)}return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new e(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){ds(`InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.`);let e=[];for(let t=0;t<this.count;t++){let n=t*this.data.stride+this.offset;for(let t=0;t<this.itemSize;t++)e.push(this.data.array[n+t])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}_denormalize(e){let t=this._normalizationScale;return t===void 0?Vs(e,this.data.array):Math.max(e/t,-1)}_normalize(e){let t=this._normalizationScale;return t===void 0?Hs(e,this.data.array):Math.round(e*t)}},Gl=new U,Kl=new U,ql=new W,Jl=class{constructor(e=new U(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,r){return this.normal.set(e,t,n),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let r=Gl.subVectors(n,t).cross(Kl.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let r=e.delta(Gl),i=this.normal.dot(r);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let a=-(e.start.dot(this.normal)+this.constant)/i;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(r,a)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||ql.getNormalMatrix(e),r=this.coplanarPoint(Gl).applyMatrix4(e),i=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(i),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},Yl=0,Xl=class extends gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yl++}),this.uuid=xs(),this.name=``,this.type=`Material`,this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new q(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=rs,this.stencilZFail=rs,this.stencilZPass=rs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){z(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];r===void 0?z(`Material: '${t}' is not a property of THREE.${this.type}.`):r&&r.isColor?r.set(n):r&&r.isVector2&&n&&n.isVector2||r&&r.isEuler&&n&&n.isEuler||r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e==`string`;t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:`Material`,generator:`Material.toJSON`}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(e=>e.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(e){let t=[];for(let n in e){let r=e[n];delete r.metadata,t.push(r)}return t}if(t){let t=r(e.textures),i=r(e.images);t.length>0&&(n.textures=t),i.length>0&&(n.images=i)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new q().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.diffuseRoughness!==void 0&&(this.diffuseRoughness=e.diffuseRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum),e.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1]),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(e=>new Jl().fromJSON(e))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(this.vertexColors=typeof e.vertexColors==`number`?e.vertexColors>0:e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let t=e.normalScale;Array.isArray(t)===!1&&(t=[t,t]),this.normalScale=new H().fromArray(t)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new H().fromArray(e.clearcoatNormalScale)),e.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let e=t.length;n=Array(e);for(let r=0;r!==e;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:`dispose`})}set needsUpdate(e){e===!0&&this.version++}},Zl=class extends Xl{constructor(e){super(),this.isSpriteMaterial=!0,this.type=`SpriteMaterial`,this.color=new q(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Ql,$l=new U,eu=new U,tu=new U,nu=new H,ru=new H,iu=new fc,au=new U,ou=new U,su=new U,cu=new H,lu=new H,uu=new H,du=class extends zc{constructor(e=new Zl){if(super(),this.isSprite=!0,this.type=`Sprite`,Ql===void 0){Ql=new Bl;let e=new Vl(new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),5);Ql.setIndex([0,1,2,0,2,3]),Ql.setAttribute(`position`,new Wl(e,3,0,!1)),Ql.setAttribute(`uv`,new Wl(e,2,3,!1))}this.geometry=Ql,this.material=e,this.center=new H(.5,.5),this.count=1}intersectsFrustum(e){return e.intersectsSprite(this)}raycast(e,t){e.camera===null&&B(`Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.`),eu.setFromMatrixScale(this.matrixWorld),iu.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),tu.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&eu.multiplyScalar(-tu.z);let n=this.material.rotation,r,i;n!==0&&(i=Math.cos(n),r=Math.sin(n));let a=this.center;fu(au.set(-.5,-.5,0),tu,a,eu,r,i),fu(ou.set(.5,-.5,0),tu,a,eu,r,i),fu(su.set(.5,.5,0),tu,a,eu,r,i),cu.set(0,0),lu.set(1,0),uu.set(1,1);let o=e.ray.intersectTriangle(au,ou,su,!1,$l);if(o===null&&(fu(ou.set(-.5,.5,0),tu,a,eu,r,i),lu.set(0,1),o=e.ray.intersectTriangle(au,su,ou,!1,$l),o===null))return;let s=e.ray.origin.distanceTo($l);s<e.near||s>e.far||t.push({distance:s,point:$l.clone(),uv:sl.getInterpolation($l,au,ou,su,cu,lu,uu,new H),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}toJSON(e){let t=super.toJSON(e);return t.object.center=this.center.toArray(),t}};function fu(e,t,n,r,i,a){nu.subVectors(e,n).addScalar(.5).multiply(r),i===void 0?ru.copy(nu):(ru.x=a*nu.x-i*nu.y,ru.y=i*nu.x+a*nu.y),e.copy(t),e.x+=ru.x,e.y+=ru.y,e.applyMatrix4(iu)}var pu=new U,mu=new U,hu=new U,gu=new U,_u=class{constructor(e=new U,t=new U(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pu)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=pu.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pu.copy(this.origin).addScaledVector(this.direction,t),pu.distanceToSquared(e))}distanceSqToSegment(e,t,n,r){mu.copy(e).add(t).multiplyScalar(.5),hu.copy(t).sub(e).normalize(),gu.copy(this.origin).sub(mu);let i=e.distanceTo(t)*.5,a=-this.direction.dot(hu),o=gu.dot(this.direction),s=-gu.dot(hu),c=gu.lengthSq(),l=Math.abs(1-a*a),u,d,f,p;if(l>0){if(u=a*s-o,d=a*o-s,p=i*l,u>=0){if(d>=-p){if(d<=p){let e=1/l;u*=e,d*=e,f=u*(u+a*d+2*o)+d*(a*u+d+2*s)+c}else d=i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d=-i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c}else d<=-p?(u=Math.max(0,-(-a*i+o)),d=u>0?-i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c):d<=p?(u=0,d=Math.min(Math.max(-i,-s),i),f=d*(d+2*s)+c):(u=Math.max(0,-(a*i+o)),d=u>0?i:Math.min(Math.max(-i,-s),i),f=-u*u+d*(d+2*s)+c)}else d=a>0?-i:i,u=Math.max(0,-(a*d+o)),f=-u*u+d*(d+2*s)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(mu).addScaledVector(hu,d),f}intersectSphere(e,t){if(e.radius<0)return null;pu.subVectors(e.center,this.origin);let n=pu.dot(this.direction),r=pu.dot(pu)-n*n,i=e.radius*e.radius;if(r>i)return null;let a=Math.sqrt(i-r),o=n-a,s=n+a;return s<0?null:o<0?this.at(s,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,r,i,a,o,s,c=1/this.direction.x,l=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),l>=0?(i=(e.min.y-d.y)*l,a=(e.max.y-d.y)*l):(i=(e.max.y-d.y)*l,a=(e.min.y-d.y)*l),n>a||i>r||((i>n||isNaN(n))&&(n=i),(a<r||isNaN(r))&&(r=a),u>=0?(o=(e.min.z-d.z)*u,s=(e.max.z-d.z)*u):(o=(e.max.z-d.z)*u,s=(e.min.z-d.z)*u),n>s||o>r)||((o>n||n!==n)&&(n=o),(s<r||r!==r)&&(r=s),r<0)?null:this.at(n>=0?n:r,t)}intersectsBox(e){return this.intersectBox(e,pu)!==null}intersectTriangle(e,t,n,r,i){let a=this.origin,o=this.direction,s=o.x,c=o.y,l=o.z,u=e.x-a.x,d=e.y-a.y,f=e.z-a.z,p=t.x-a.x,m=t.y-a.y,h=t.z-a.z,g=n.x-a.x,_=n.y-a.y,v=n.z-a.z,y=Math.abs(s),b=Math.abs(c),x=Math.abs(l),S,C,w,T,E,D,O,k,A,j,ee,M;if(y>=b&&y>=x?(w=s,D=u,A=p,M=g,s>=0?(S=c,C=l,T=d,E=f,O=m,k=h,j=_,ee=v):(S=l,C=c,T=f,E=d,O=h,k=m,j=v,ee=_)):b>=x?(w=c,D=d,A=m,M=_,c>=0?(S=l,C=s,T=f,E=u,O=h,k=p,j=v,ee=g):(S=s,C=l,T=u,E=f,O=p,k=h,j=g,ee=v)):(w=l,D=f,A=h,M=v,l>=0?(S=s,C=c,T=u,E=d,O=p,k=m,j=g,ee=_):(S=c,C=s,T=d,E=u,O=m,k=p,j=_,ee=g)),w===0)return null;let te=S/w,ne=C/w,re=1/w,ie=T-te*D,ae=E-ne*D,oe=O-te*A,se=k-ne*A,N=j-te*M,ce=ee-ne*M,P=N*se-ce*oe,le=ie*ce-ae*N,ue=oe*ae-se*ie;if(r){if(P<0||le<0||ue<0)return null}else if((P<0||le<0||ue<0)&&(P>0||le>0||ue>0))return null;let de=P+le+ue;if(de===0)return null;let fe=re*(P*D+le*A+ue*M);return(de>0?fe<0:fe>0)?null:this.at(fe/de,i)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},vu=class extends Xl{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type=`MeshBasicMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sc,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},yu=new fc,bu=new _u,xu=new Ml,Su=new U,Cu=new U,wu=new U,Tu=new U,Eu=new U,Du=new U,Ou=new U,ku=new U,Y=class extends zc{constructor(e=new Bl,t=new vu){super(),this.isMesh=!0,this.type=`Mesh`,this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.morphTargetInfluences=e.morphTargetInfluences===void 0?void 0:e.morphTargetInfluences.slice(),this.morphTargetDictionary=e.morphTargetDictionary===void 0?void 0:Object.assign({},e.morphTargetDictionary),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){let n=e[t[0]];if(n!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let e=0,t=n.length;e<t;e++){let t=n[e].name||String(e);this.morphTargetInfluences.push(0),this.morphTargetDictionary[t]=e}}}}getVertexPosition(e,t){let n=this.geometry,r=n.attributes.position,i=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(r,e);let o=this.morphTargetInfluences;if(i&&o){Du.set(0,0,0);for(let n=0,r=i.length;n<r;n++){let r=o[n],s=i[n];r!==0&&(Eu.fromBufferAttribute(s,e),a?Du.addScaledVector(Eu,r):Du.addScaledVector(Eu.sub(t),r))}t.add(Du)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,r=this.material,i=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),xu.copy(n.boundingSphere),xu.applyMatrix4(i),bu.copy(e.ray).recast(e.near),xu.containsPoint(bu.origin)===!1&&(bu.intersectSphere(xu,Su)===null||bu.origin.distanceToSquared(Su)>(e.far-e.near)**2)||(yu.copy(i).invert(),bu.copy(e.ray).applyMatrix4(yu),(n.boundingBox===null||bu.intersectsBox(n.boundingBox)!==!1)&&this._computeIntersections(e,t,bu)))}_computeIntersections(e,t,n){let r,i=this.geometry,a=this.material,o=i.index,s=i.attributes.position,c=i.attributes.uv,l=i.attributes.uv1,u=i.attributes.normal,d=i.groups,f=i.drawRange;if(o!==null){if(Array.isArray(a))for(let i=0,s=d.length;i<s;i++){let s=d[i],p=a[s.materialIndex],m=Math.max(s.start,f.start),h=Math.min(o.count,Math.min(s.start+s.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=o.getX(i),d=o.getX(i+1),f=o.getX(i+2);r=ju(this,p,e,n,c,l,u,a,d,f),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=s.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),s=Math.min(o.count,f.start+f.count);for(let d=i,f=s;d<f;d+=3){let i=o.getX(d),s=o.getX(d+1),f=o.getX(d+2);r=ju(this,a,e,n,c,l,u,i,s,f),r&&(r.faceIndex=Math.floor(d/3),t.push(r))}}}else if(s!==void 0){if(Array.isArray(a))for(let i=0,o=d.length;i<o;i++){let o=d[i],p=a[o.materialIndex],m=Math.max(o.start,f.start),h=Math.min(s.count,Math.min(o.start+o.count,f.start+f.count));for(let i=m,a=h;i<a;i+=3){let a=i,s=i+1,d=i+2;r=ju(this,p,e,n,c,l,u,a,s,d),r&&(r.faceIndex=Math.floor(i/3),r.face.materialIndex=o.materialIndex,t.push(r))}}else{let i=Math.max(0,f.start),o=Math.min(s.count,f.start+f.count);for(let s=i,d=o;s<d;s+=3){let i=s,o=s+1,d=s+2;r=ju(this,a,e,n,c,l,u,i,o,d),r&&(r.faceIndex=Math.floor(s/3),t.push(r))}}}}};function Au(e,t,n,r,i,a,o,s){let c;if(c=t.side===1?r.intersectTriangle(o,a,i,!0,s):r.intersectTriangle(i,a,o,t.side===0,s),c===null)return null;ku.copy(s),ku.applyMatrix4(e.matrixWorld);let l=n.ray.origin.distanceTo(ku);return l<n.near||l>n.far?null:{distance:l,point:ku.clone(),object:e}}function ju(e,t,n,r,i,a,o,s,c,l){e.getVertexPosition(s,Cu),e.getVertexPosition(c,wu),e.getVertexPosition(l,Tu);let u=Au(e,t,n,r,Cu,wu,Tu,Ou);if(u){let e=new U;sl.getBarycoord(Ou,Cu,wu,Tu,e),i&&(u.uv=sl.getInterpolatedAttribute(i,s,c,l,e,new H)),a&&(u.uv1=sl.getInterpolatedAttribute(a,s,c,l,e,new H)),o&&(u.normal=sl.getInterpolatedAttribute(o,s,c,l,e,new U),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));let t={a:s,b:c,c:l,normal:new U,materialIndex:0};sl.getNormal(Cu,wu,Tu,t.normal),u.face=t,u.barycoord=e}return u}var Mu=class extends oc{constructor(e=null,t=1,n=1,r,i,a,o,s,c=Na,l=Na,u,d){super(null,a,o,s,c,l,r,i,u,d),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Nu=new Ml,Pu=new H(.5,.5),Fu=new U,Iu=class{constructor(e=new Jl,t=new Jl,n=new Jl,r=new Jl,i=new Jl,a=new Jl){this.planes=[e,t,n,r,i,a]}set(e,t,n,r,i,a){let o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(r),o[4].copy(i),o[5].copy(a),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=as,n=!1){let r=this.planes,i=e.elements,a=i[0],o=i[1],s=i[2],c=i[3],l=i[4],u=i[5],d=i[6],f=i[7],p=i[8],m=i[9],h=i[10],g=i[11],_=i[12],v=i[13],y=i[14],b=i[15];if(r[0].setComponents(c-a,f-l,g-p,b-_).normalize(),r[1].setComponents(c+a,f+l,g+p,b+_).normalize(),r[2].setComponents(c+o,f+u,g+m,b+v).normalize(),r[3].setComponents(c-o,f-u,g-m,b-v).normalize(),n)r[4].setComponents(s,d,h,y).normalize(),r[5].setComponents(c-s,f-d,g-h,b-y).normalize();else if(r[4].setComponents(c-s,f-d,g-h,b-y).normalize(),t===2e3)r[5].setComponents(c+s,f+d,g+h,b+y).normalize();else if(t===2001)r[5].setComponents(s,d,h,y).normalize();else throw Error(`THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: `+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Nu.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Nu.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Nu)}intersectsSprite(e){return Nu.center.set(0,0,0),Nu.radius=.7071067811865476+Pu.distanceTo(e.center),Nu.applyMatrix4(e.matrixWorld),this.intersectsSphere(Nu)}intersectsSphere(e){let t=this.planes,n=e.center,r=-e.radius;for(let e=0;e<6;e++)if(t[e].distanceToPoint(n)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let r=t[n];if(Fu.x=r.normal.x>0?e.max.x:e.min.x,Fu.y=r.normal.y>0?e.max.y:e.min.y,Fu.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Fu)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Lu=new fc,Ru=class e{constructor(){this.coordinateSystem=as,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let e=0;e<t.length;e++){let r=t[e];Lu.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[e]===void 0&&(n[e]=new Iu),n[e].setFromProjectionMatrix(Lu,r.coordinateSystem,r.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let r=0;r<e._count;r++)t[r]===void 0&&(t[r]=new Iu),t[r].copy(n[r]);return this._count=e._count,this}clone(){return new e().copy(this)}},zu=class extends oc{constructor(e=[],t=301,n,r,i,a,o,s,c,l){super(e,t,n,r,i,a,o,s,c,l),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Bu=class extends oc{constructor(e,t,n,r,i,a,o,s,c){super(e,t,n,r,i,a,o,s,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},Vu=class extends oc{constructor(e,t,n=Wa,r,i,a,o=Na,s=Na,c,l=to,u=1){if(l!==1026&&l!==1027)throw Error(`THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat`);super({width:e,height:t,depth:u},r,i,a,o,s,l,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new nc(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},Hu=class extends Vu{constructor(e,t=Wa,n=301,r,i,a=Na,o=Na,s,c=to){let l={width:e,height:e,depth:1},u=[l,l,l,l,l,l];super(e,e,t,n,r,i,a,o,s,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Uu=class extends oc{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},X=class e extends Bl{constructor(e=1,t=1,n=1,r=1,i=1,a=1){super(),this.type=`BoxGeometry`,this.parameters={width:e,height:t,depth:n,widthSegments:r,heightSegments:i,depthSegments:a};let o=this;r=Math.floor(r),i=Math.floor(i),a=Math.floor(a);let s=[],c=[],l=[],u=[],d=0,f=0;p(`z`,`y`,`x`,-1,-1,n,t,e,a,i,0),p(`z`,`y`,`x`,1,-1,n,t,-e,a,i,1),p(`x`,`z`,`y`,1,1,e,n,t,r,a,2),p(`x`,`z`,`y`,1,-1,e,n,-t,r,a,3),p(`x`,`y`,`z`,1,-1,e,t,n,r,i,4),p(`x`,`y`,`z`,-1,-1,e,t,-n,r,i,5),this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2));function p(e,t,n,r,i,a,p,m,h,g,_){let v=a/h,y=p/g,b=a/2,x=p/2,S=m/2,C=h+1,w=g+1,T=0,E=0,D=new U;for(let a=0;a<w;a++){let o=a*y-x;for(let s=0;s<C;s++)D[e]=(s*v-b)*r,D[t]=o*i,D[n]=S,c.push(D.x,D.y,D.z),D[e]=0,D[t]=0,D[n]=m>0?1:-1,l.push(D.x,D.y,D.z),u.push(s/h),u.push(1-a/g),T+=1}for(let e=0;e<g;e++)for(let t=0;t<h;t++){let n=d+t+C*e,r=d+t+C*(e+1),i=d+(t+1)+C*(e+1),a=d+(t+1)+C*e;s.push(n,r,a),s.push(r,i,a),E+=6}o.addGroup(f,E,_),f+=E,d+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Wu=class e extends Bl{constructor(e=1,t=1,n=4,r=8,i=1){super(),this.type=`CapsuleGeometry`,this.parameters={radius:e,height:t,capSegments:n,radialSegments:r,heightSegments:i},t=Math.max(0,t),n=Math.max(1,Math.floor(n)),r=Math.max(3,Math.floor(r)),i=Math.max(1,Math.floor(i));let a=[],o=[],s=[],c=[],l=t/2,u=Math.PI/2*e,d=t,f=2*u+d,p=n*2+i,m=r+1,h=new U,g=new U;for(let _=0;_<=p;_++){let v=0,y=0,b=0,x=0;if(_<=n){let t=_/n,r=t*Math.PI/2;y=-l-e*Math.cos(r),b=e*Math.sin(r),x=-e*Math.cos(r),v=t*u}else if(_<=n+i){let r=(_-n)/i;y=-l+r*t,b=e,x=0,v=u+r*d}else{let t=(_-n-i)/n,r=t*Math.PI/2;y=l+e*Math.sin(r),b=e*Math.cos(r),x=e*Math.sin(r),v=u+d+t*u}let S=Math.max(0,Math.min(1,v/f)),C=0;_===0?C=.5/r:_===p&&(C=-.5/r);for(let e=0;e<=r;e++){let t=e/r,n=t*Math.PI*2,i=Math.sin(n),a=Math.cos(n);g.x=-b*a,g.y=y,g.z=b*i,o.push(g.x,g.y,g.z),h.set(-b*a,x,b*i),h.normalize(),s.push(h.x,h.y,h.z),c.push(t+C,S)}if(_>0){let e=(_-1)*m;for(let t=0;t<r;t++){let n=e+t,r=e+t+1,i=_*m+t,o=_*m+t+1;a.push(n,r,i),a.push(r,o,i)}}}this.setIndex(a),this.setAttribute(`position`,new J(o,3)),this.setAttribute(`normal`,new J(s,3)),this.setAttribute(`uv`,new J(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}},Gu=class e extends Bl{constructor(e=1,t=32,n=0,r=Math.PI*2){super(),this.type=`CircleGeometry`,this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:r},t=Math.max(3,t);let i=[],a=[],o=[],s=[],c=new U,l=new H;a.push(0,0,0),o.push(0,0,1),s.push(.5,.5);for(let i=0,u=3;i<=t;i++,u+=3){let d=n+i/t*r;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),l.x=(a[u]/e+1)/2,l.y=(a[u+1]/e+1)/2,s.push(l.x,l.y)}for(let e=1;e<=t;e++)i.push(e,e+1,0);this.setIndex(i),this.setAttribute(`position`,new J(a,3)),this.setAttribute(`normal`,new J(o,3)),this.setAttribute(`uv`,new J(s,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Ku=class e extends Bl{constructor(e=1,t=1,n=1,r=32,i=1,a=!1,o=0,s=Math.PI*2){super(),this.type=`CylinderGeometry`,this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:r,heightSegments:i,openEnded:a,thetaStart:o,thetaLength:s};let c=this;r=Math.floor(r),i=Math.floor(i);let l=[],u=[],d=[],f=[],p=0,m=[],h=n/2,g=0;_(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(l),this.setAttribute(`position`,new J(u,3)),this.setAttribute(`normal`,new J(d,3)),this.setAttribute(`uv`,new J(f,2));function _(){let a=new U,_=new U,v=0,y=(t-e)/n;for(let c=0;c<=i;c++){let l=[],g=c/i,v=g*(t-e)+e;for(let e=0;e<=r;e++){let t=e/r,i=t*s+o,c=Math.sin(i),m=Math.cos(i);_.x=v*c,_.y=-g*n+h,_.z=v*m,u.push(_.x,_.y,_.z),a.set(c,y,m).normalize(),d.push(a.x,a.y,a.z),f.push(t,1-g),l.push(p++)}m.push(l)}for(let n=0;n<r;n++)for(let r=0;r<i;r++){let a=m[r][n],o=m[r+1][n],s=m[r+1][n+1],c=m[r][n+1];(e>0||r!==0)&&(l.push(a,o,c),v+=3),(t>0||r!==i-1)&&(l.push(o,s,c),v+=3)}c.addGroup(g,v,0),g+=v}function v(n){let i=p,a=new H,m=new U,_=0,v=n===!0?e:t,y=n===!0?1:-1;for(let e=1;e<=r;e++)u.push(0,h*y,0),d.push(0,y,0),f.push(.5,.5),p++;let b=p;for(let e=0;e<=r;e++){let t=e/r*s+o,n=Math.cos(t),i=Math.sin(t);m.x=v*i,m.y=h*y,m.z=v*n,u.push(m.x,m.y,m.z),d.push(0,y,0),a.x=n*.5+.5,a.y=i*.5*y+.5,f.push(a.x,a.y),p++}for(let e=0;e<r;e++){let t=i+e,r=b+e;n===!0?l.push(r,r+1,t):l.push(r+1,r,t),_+=3}c.addGroup(g,_,n===!0?1:2),g+=_}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},qu=class e extends Ku{constructor(e=1,t=1,n=32,r=1,i=!1,a=0,o=Math.PI*2){super(0,e,t,n,r,i,a,o),this.type=`ConeGeometry`,this.parameters={radius:e,height:t,radialSegments:n,heightSegments:r,openEnded:i,thetaStart:a,thetaLength:o}}static fromJSON(t){return new e(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Ju=class e extends Bl{constructor(e=[],t=[],n=1,r=0){super(),this.type=`PolyhedronGeometry`,this.parameters={vertices:e,indices:t,radius:n,detail:r};let i=[],a=[];o(r),c(n),l(),this.setAttribute(`position`,new J(i,3)),this.setAttribute(`normal`,new J(i.slice(),3)),this.setAttribute(`uv`,new J(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(e){let n=new U,r=new U,i=new U;for(let a=0;a<t.length;a+=3)f(t[a+0],n),f(t[a+1],r),f(t[a+2],i),s(n,r,i,e)}function s(e,t,n,r){let i=r+1,a=[];for(let r=0;r<=i;r++){a[r]=[];let o=e.clone().lerp(n,r/i),s=t.clone().lerp(n,r/i),c=i-r;for(let e=0;e<=c;e++)e===0&&r===i?a[r][e]=o:a[r][e]=o.clone().lerp(s,e/c)}for(let e=0;e<i;e++)for(let t=0;t<2*(i-e)-1;t++){let n=Math.floor(t/2);t%2==0?(d(a[e][n+1]),d(a[e+1][n]),d(a[e][n])):(d(a[e][n+1]),d(a[e+1][n+1]),d(a[e+1][n]))}}function c(e){let t=new U;for(let n=0;n<i.length;n+=3)t.x=i[n+0],t.y=i[n+1],t.z=i[n+2],t.normalize().multiplyScalar(e),i[n+0]=t.x,i[n+1]=t.y,i[n+2]=t.z}function l(){let e=new U;for(let t=0;t<i.length;t+=3){e.x=i[t+0],e.y=i[t+1],e.z=i[t+2];let n=h(e)/2/Math.PI+.5,r=g(e)/Math.PI+.5;a.push(n,1-r)}p(),u()}function u(){for(let e=0;e<a.length;e+=6){let t=a[e+0],n=a[e+2],r=a[e+4];Math.max(t,n,r)>.9&&Math.min(t,n,r)<.1&&(t<.2&&(a[e+0]+=1),n<.2&&(a[e+2]+=1),r<.2&&(a[e+4]+=1))}}function d(e){i.push(e.x,e.y,e.z)}function f(t,n){let r=t*3;n.x=e[r+0],n.y=e[r+1],n.z=e[r+2]}function p(){let e=new U,t=new U,n=new U,r=new U,o=new H,s=new H,c=new H;for(let l=0,u=0;l<i.length;l+=9,u+=6){e.set(i[l+0],i[l+1],i[l+2]),t.set(i[l+3],i[l+4],i[l+5]),n.set(i[l+6],i[l+7],i[l+8]),o.set(a[u+0],a[u+1]),s.set(a[u+2],a[u+3]),c.set(a[u+4],a[u+5]),r.copy(e).add(t).add(n).divideScalar(3);let d=h(r);m(o,u+0,e,d),m(s,u+2,t,d),m(c,u+4,n,d)}}function m(e,t,n,r){r<0&&e.x===1&&(a[t]=e.x-1),n.x===0&&n.z===0&&(a[t]=r/2/Math.PI+.5)}function h(e){return Math.atan2(e.z,-e.x)}function g(e){return Math.atan2(-e.y,Math.sqrt(e.x*e.x+e.z*e.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.vertices,t.indices,t.radius,t.detail)}},Yu=class{constructor(){this.type=`Curve`,this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){z(`Curve: .getPoint() not implemented.`)}getPointAt(e,t){let n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){let t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],n,r=this.getPoint(0),i=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),i+=n.distanceTo(r),t.push(i),r=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let n=this.getLengths(),r=0,i=n.length,a;a=t||e*n[i-1];let o=0,s=i-1,c;for(;o<=s;)if(r=Math.floor(o+(s-o)/2),c=n[r]-a,c<0)o=r+1;else if(c>0)s=r-1;else{s=r;break}if(r=s,n[r]===a)return r/(i-1);let l=n[r],u=n[r+1]-l,d=(a-l)/u;return(r+d)/(i-1)}getTangent(e,t){let n=1e-4,r=e-n,i=e+n;r<0&&(r=0),i>1&&(i=1);let a=this.getPoint(r),o=this.getPoint(i),s=t||(a.isVector2?new H:new U);return s.copy(o).sub(a).normalize(),s}getTangentAt(e,t){let n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){let n=new U,r=[],i=[],a=[],o=new U,s=new fc;for(let t=0;t<=e;t++){let n=t/e;r[t]=this.getTangentAt(n,new U)}i[0]=new U,a[0]=new U;let c=Number.MAX_VALUE,l=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);l<=c&&(c=l,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),i[0].crossVectors(r[0],o),a[0].crossVectors(r[0],i[0]);for(let t=1;t<=e;t++){if(i[t]=i[t-1].clone(),a[t]=a[t-1].clone(),o.crossVectors(r[t-1],r[t]),o.length()>2**-52){o.normalize();let e=Math.acos(V(r[t-1].dot(r[t]),-1,1));i[t].applyMatrix4(s.makeRotationAxis(o,e))}a[t].crossVectors(r[t],i[t])}if(t===!0){let t=Math.acos(V(i[0].dot(i[e]),-1,1));t/=e,r[0].dot(o.crossVectors(i[0],i[e]))>0&&(t=-t);for(let n=1;n<=e;n++)i[n].applyMatrix4(s.makeRotationAxis(r[n],t*n)),a[n].crossVectors(r[n],i[n])}return{tangents:r,normals:i,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let e={metadata:{version:4.7,type:`Curve`,generator:`Curve.toJSON`}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this.cacheArcLengths=null,this}},Xu=class extends Yu{constructor(e=0,t=0,n=1,r=1,i=0,a=Math.PI*2,o=!1,s=0){super(),this.isEllipseCurve=!0,this.type=`EllipseCurve`,this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=r,this.aStartAngle=i,this.aEndAngle=a,this.aClockwise=o,this.aRotation=s}getPoint(e,t=new H){let n=t,r=Math.PI*2,i=this.aEndAngle-this.aStartAngle,a=Math.abs(i)<2**-52;for(;i<0;)i+=r;for(;i>r;)i-=r;i<2**-52&&(i=a?0:r),this.aClockwise===!0&&!a&&(i===r?i=-r:i-=r);let o=this.aStartAngle+e*i,s=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let e=Math.cos(this.aRotation),t=Math.sin(this.aRotation),n=s-this.aX,r=c-this.aY;s=n*e-r*t+this.aX,c=n*t+r*e+this.aY}return n.set(s,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){let e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}},Zu=class extends Xu{constructor(e,t,n,r,i,a){super(e,t,n,n,r,i,a),this.isArcCurve=!0,this.type=`ArcCurve`}};function Qu(){let e=0,t=0,n=0,r=0;function i(i,a,o,s){e=i,t=o,n=-3*i+3*a-2*o-s,r=2*i-2*a+o+s}return{initCatmullRom:function(e,t,n,r,a){i(t,n,a*(n-e),a*(r-t))},initNonuniformCatmullRom:function(e,t,n,r,a,o,s){let c=(t-e)/a-(n-e)/(a+o)+(n-t)/o,l=(n-t)/o-(r-t)/(o+s)+(r-n)/s;c*=o,l*=o,i(t,n,c,l)},calc:function(i){let a=i*i,o=a*i;return e+t*i+n*a+r*o}}}var $u=new U,ed=new U,td=new Qu,nd=new Qu,rd=new Qu,id=class extends Yu{constructor(e=[],t=!1,n=`centripetal`,r=.5){super(),this.isCatmullRomCurve3=!0,this.type=`CatmullRomCurve3`,this.points=e,this.closed=t,this.curveType=n,this.tension=r}getPoint(e,t=new U){let n=t,r=this.points,i=r.length,a=(i-+!this.closed)*e,o=Math.floor(a),s=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/i)+1)*i:s===0&&o===i-1&&(o=i-2,s=1);let c,l;this.closed||o>0?c=r[(o-1)%i]:(ed.subVectors(r[0],r[1]).add(r[0]),c=ed);let u=r[o%i],d=r[(o+1)%i];if(this.closed||o+2<i?l=r[(o+2)%i]:($u.subVectors(r[i-1],r[i-2]).add(r[i-1]),l=$u),this.curveType===`centripetal`||this.curveType===`chordal`){let e=this.curveType===`chordal`?.5:.25,t=c.distanceToSquared(u)**+e,n=u.distanceToSquared(d)**+e,r=d.distanceToSquared(l)**+e;n<1e-4&&(n=1),t<1e-4&&(t=n),r<1e-4&&(r=n),td.initNonuniformCatmullRom(c.x,u.x,d.x,l.x,t,n,r),nd.initNonuniformCatmullRom(c.y,u.y,d.y,l.y,t,n,r),rd.initNonuniformCatmullRom(c.z,u.z,d.z,l.z,t,n,r)}else this.curveType===`catmullrom`&&(td.initCatmullRom(c.x,u.x,d.x,l.x,this.tension),nd.initCatmullRom(c.y,u.y,d.y,l.y,this.tension),rd.initCatmullRom(c.z,u.z,d.z,l.z,this.tension));return n.set(td.calc(s),nd.calc(s),rd.calc(s)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new U().fromArray(n))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};function ad(e,t,n,r,i){let a=(r-t)*.5,o=(i-n)*.5,s=e*e,c=e*s;return(2*n-2*r+a+o)*c+(-3*n+3*r-2*a-o)*s+a*e+n}function od(e,t){let n=1-e;return n*n*t}function sd(e,t){return 2*(1-e)*e*t}function cd(e,t){return e*e*t}function ld(e,t,n,r){return od(e,t)+sd(e,n)+cd(e,r)}function ud(e,t){let n=1-e;return n*n*n*t}function dd(e,t){let n=1-e;return 3*n*n*e*t}function fd(e,t){return 3*(1-e)*e*e*t}function pd(e,t){return e*e*e*t}function md(e,t,n,r,i){return ud(e,t)+dd(e,n)+fd(e,r)+pd(e,i)}var hd=class extends Yu{constructor(e=new H,t=new H,n=new H,r=new H){super(),this.isCubicBezierCurve=!0,this.type=`CubicBezierCurve`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(md(e,r.x,i.x,a.x,o.x),md(e,r.y,i.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},gd=class extends Yu{constructor(e=new U,t=new U,n=new U,r=new U){super(),this.isCubicBezierCurve3=!0,this.type=`CubicBezierCurve3`,this.v0=e,this.v1=t,this.v2=n,this.v3=r}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2,o=this.v3;return n.set(md(e,r.x,i.x,a.x,o.x),md(e,r.y,i.y,a.y,o.y),md(e,r.z,i.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}},_d=class extends Yu{constructor(e=new H,t=new H){super(),this.isLineCurve=!0,this.type=`LineCurve`,this.v1=e,this.v2=t}getPoint(e,t=new H){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new H){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},vd=class extends Yu{constructor(e=new U,t=new U){super(),this.isLineCurve3=!0,this.type=`LineCurve3`,this.v1=e,this.v2=t}getPoint(e,t=new U){let n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new U){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},yd=Object.freeze({__proto__:null,ArcCurve:Zu,CatmullRomCurve3:id,CubicBezierCurve:hd,CubicBezierCurve3:gd,EllipseCurve:Xu,LineCurve:_d,LineCurve3:vd,QuadraticBezierCurve:class extends Yu{constructor(e=new H,t=new H,n=new H){super(),this.isQuadraticBezierCurve=!0,this.type=`QuadraticBezierCurve`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new H){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ld(e,r.x,i.x,a.x),ld(e,r.y,i.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},QuadraticBezierCurve3:class extends Yu{constructor(e=new U,t=new U,n=new U){super(),this.isQuadraticBezierCurve3=!0,this.type=`QuadraticBezierCurve3`,this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new U){let n=t,r=this.v0,i=this.v1,a=this.v2;return n.set(ld(e,r.x,i.x,a.x),ld(e,r.y,i.y,a.y),ld(e,r.z,i.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){let e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}},SplineCurve:class extends Yu{constructor(e=[]){super(),this.isSplineCurve=!0,this.type=`SplineCurve`,this.points=e}getPoint(e,t=new H){let n=t,r=this.points,i=(r.length-1)*e,a=Math.floor(i),o=i-a,s=r[a===0?a:a-1],c=r[a],l=r[a>r.length-2?r.length-1:a+1],u=r[a>r.length-3?r.length-1:a+2];return n.set(ad(o,s.x,c.x,l.x,u.x),ad(o,s.y,c.y,l.y,u.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(n.clone())}return this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){let n=this.points[t];e.points.push(n.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){let n=e.points[t];this.points.push(new H().fromArray(n))}return this}}}),bd=class extends Yu{constructor(){super(),this.type=`CurvePath`,this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(e){this.curves.push(e)}closePath(){let e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){let n=e.isVector2===!0?`LineCurve`:`LineCurve3`;this.curves.push(new yd[n](t,e))}return this}getPoint(e,t){let n=e*this.getLength(),r=this.getCurveLengths(),i=0;for(;i<r.length;){if(r[i]>=n){let e=r[i]-n,a=this.curves[i],o=a.getLength(),s=o===0?0:1-e/o;return a.getPointAt(s,t)}i++}return null}getLength(){let e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let e=[],t=0;for(let n=0,r=this.curves.length;n<r;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){let t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){let t=[],n;for(let r=0,i=this.curves;r<i.length;r++){let a=i[r],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,s=a.getPoints(o);for(let e=0;e<s.length;e++){let r=s[e];n&&n.equals(r)||(t.push(r),n=r)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(n.clone())}return this.autoClose=e.autoClose,this.cacheLengths=null,this}toJSON(){let e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){let n=this.curves[t];e.curves.push(n.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){let n=e.curves[t];this.curves.push(new yd[n.type]().fromJSON(n))}return this.cacheLengths=null,this}},xd=class e extends Ju{constructor(e=1,t=0){let n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1];super(r,[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],e,t),this.type=`IcosahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Sd=class e extends Ju{constructor(e=1,t=0){super([1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],e,t),this.type=`OctahedronGeometry`,this.parameters={radius:e,detail:t}}static fromJSON(t){return new e(t.radius,t.detail)}},Cd=class e extends Bl{constructor(e=1,t=1,n=1,r=1){super(),this.type=`PlaneGeometry`,this.parameters={width:e,height:t,widthSegments:n,heightSegments:r};let i=e/2,a=t/2,o=Math.floor(n),s=Math.floor(r),c=o+1,l=s+1,u=e/o,d=t/s,f=[],p=[],m=[],h=[];for(let e=0;e<l;e++){let t=e*d-a;for(let n=0;n<c;n++){let r=n*u-i;p.push(r,-t,0),m.push(0,0,1),h.push(n/o),h.push(1-e/s)}}for(let e=0;e<s;e++)for(let t=0;t<o;t++){let n=t+c*e,r=t+c*(e+1),i=t+1+c*(e+1),a=t+1+c*e;f.push(n,r,a),f.push(r,i,a)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.width,t.height,t.widthSegments,t.heightSegments)}},wd=class e extends Bl{constructor(e=.5,t=1,n=32,r=1,i=0,a=Math.PI*2){super(),this.type=`RingGeometry`,this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:r,thetaStart:i,thetaLength:a},n=Math.max(3,n),r=Math.max(1,r);let o=[],s=[],c=[],l=[],u=e,d=(t-e)/r,f=new U,p=new H;for(let e=0;e<=r;e++){for(let e=0;e<=n;e++){let r=i+e/n*a;f.x=u*Math.cos(r),f.y=u*Math.sin(r),s.push(f.x,f.y,f.z),c.push(0,0,1),p.x=(f.x/t+1)/2,p.y=(f.y/t+1)/2,l.push(p.x,p.y)}u+=d}for(let e=0;e<r;e++){let t=e*(n+1);for(let e=0;e<n;e++){let r=e+t,i=r,a=r+n+1,s=r+n+2,c=r+1;o.push(i,a,c),o.push(a,s,c)}}this.setIndex(o),this.setAttribute(`position`,new J(s,3)),this.setAttribute(`normal`,new J(c,3)),this.setAttribute(`uv`,new J(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Td=class e extends Bl{constructor(e=1,t=32,n=16,r=0,i=Math.PI*2,a=0,o=Math.PI){super(),this.type=`SphereGeometry`,this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:r,phiLength:i,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));let s=Math.min(a+o,Math.PI),c=0,l=[],u=new U,d=new U,f=[],p=[],m=[],h=[];for(let f=0;f<=n;f++){let g=[],_=f/n,v=a+_*o,y=e*Math.cos(v),b=Math.sqrt(e*e-y*y),x=0;f===0&&a===0?x=.5/t:f===n&&s===Math.PI&&(x=-.5/t);for(let e=0;e<=t;e++){let n=e/t,a=r+n*i;u.x=-b*Math.cos(a),u.y=y,u.z=b*Math.sin(a),p.push(u.x,u.y,u.z),d.copy(u).normalize(),m.push(d.x,d.y,d.z),h.push(n+x,1-_),g.push(c++)}l.push(g)}for(let e=0;e<n;e++)for(let r=0;r<t;r++){let t=l[e][r+1],i=l[e][r],o=l[e+1][r],c=l[e+1][r+1];(e!==0||a>0)&&f.push(t,i,c),(e!==n-1||s<Math.PI)&&f.push(i,o,c)}this.setIndex(f),this.setAttribute(`position`,new J(p,3)),this.setAttribute(`normal`,new J(m,3)),this.setAttribute(`uv`,new J(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Ed=class e extends Bl{constructor(e=1,t=.4,n=12,r=48,i=Math.PI*2,a=0,o=Math.PI*2){super(),this.type=`TorusGeometry`,this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:r,arc:i,thetaStart:a,thetaLength:o},n=Math.floor(n),r=Math.floor(r);let s=[],c=[],l=[],u=[],d=new U,f=new U,p=new U;for(let s=0;s<=n;s++){let m=a+s/n*o;for(let a=0;a<=r;a++){let o=a/r*i;f.x=(e+t*Math.cos(m))*Math.cos(o),f.y=(e+t*Math.cos(m))*Math.sin(o),f.z=t*Math.sin(m),c.push(f.x,f.y,f.z),d.x=e*Math.cos(o),d.y=e*Math.sin(o),p.subVectors(f,d).normalize(),l.push(p.x,p.y,p.z),u.push(a/r),u.push(s/n)}}for(let e=1;e<=n;e++)for(let t=1;t<=r;t++){let n=(r+1)*e+t-1,i=(r+1)*(e-1)+t-1,a=(r+1)*(e-1)+t,o=(r+1)*e+t;s.push(n,i,o),s.push(i,a,o)}this.setIndex(s),this.setAttribute(`position`,new J(c,3)),this.setAttribute(`normal`,new J(l,3)),this.setAttribute(`uv`,new J(u,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(t){return new e(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function Dd(e){let t={};for(let n in e){t[n]={};for(let r in e[n]){let i=e[n][r];if(kd(i))i.isRenderTargetTexture?(z(`UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().`),t[n][r]=null):t[n][r]=i.clone();else if(Array.isArray(i)){if(kd(i[0])){let e=[];for(let t=0,n=i.length;t<n;t++)e[t]=i[t].clone();t[n][r]=e}else t[n][r]=i.slice()}else t[n][r]=i}}return t}function Od(e){let t={};for(let n=0;n<e.length;n++){let r=Dd(e[n]);for(let e in r)t[e]=r[e]}return t}function kd(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ad(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function jd(e){let t=e.getRenderTarget();return t===null?e.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:G.workingColorSpace}var Md={clone:Dd,merge:Od},Nd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Pd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Fd=class extends Xl{constructor(e){super(),this.isShaderMaterial=!0,this.type=`ShaderMaterial`,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Nd,this.fragmentShader=Pd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Dd(e.uniforms),this.uniformsGroups=Ad(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let n in this.uniforms){let r=this.uniforms[n].value;r&&r.isTexture?t.uniforms[n]={type:`t`,value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[n]={type:`c`,value:r.getHex()}:r&&r.isVector2?t.uniforms[n]={type:`v2`,value:r.toArray()}:r&&r.isVector3?t.uniforms[n]={type:`v3`,value:r.toArray()}:r&&r.isVector4?t.uniforms[n]={type:`v4`,value:r.toArray()}:r&&r.isMatrix3?t.uniforms[n]={type:`m3`,value:r.toArray()}:r&&r.isMatrix4?t.uniforms[n]={type:`m4`,value:r.toArray()}:t.uniforms[n]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let e in this.extensions)this.extensions[e]===!0&&(n[e]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let r=e.uniforms[n];switch(this.uniforms[n]={},r.type){case`t`:this.uniforms[n].value=t[r.value]||null;break;case`c`:this.uniforms[n].value=new q().setHex(r.value);break;case`v2`:this.uniforms[n].value=new H().fromArray(r.value);break;case`v3`:this.uniforms[n].value=new U().fromArray(r.value);break;case`v4`:this.uniforms[n].value=new sc().fromArray(r.value);break;case`m3`:this.uniforms[n].value=new W().fromArray(r.value);break;case`m4`:this.uniforms[n].value=new fc().fromArray(r.value);break;default:this.uniforms[n].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let t in e.extensions)this.extensions[t]=e.extensions[t];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Id=class extends Fd{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type=`RawShaderMaterial`}},Ld=class extends Xl{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type=`MeshStandardMaterial`,this.defines={STANDARD:``},this.color=new q(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new H(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sc,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:``},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},Rd=class extends Xl{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type=`MeshLambertMaterial`,this.color=new q(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new q(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new H(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sc,this.combine=0,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap=`round`,this.wireframeLinejoin=`round`,this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},zd=class extends Xl{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type=`MeshDepthMaterial`,this.depthPacking=Qo,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Bd=class extends Xl{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type=`MeshDistanceMaterial`,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Vd(e,t){return!e||e.constructor===t?e:typeof t.BYTES_PER_ELEMENT==`number`?new t(e):Array.prototype.slice.call(e)}function Hd(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}var Ud=class{constructor(e,t,n,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r===void 0?new t.constructor(n):r,this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,r=t[n],i=t[n-1];validate_interval:{seek:{let a;linear_scan:{forward_scan:if(!(e<r)){for(let a=n+2;;){if(r===void 0){if(e<i)break forward_scan;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(i=r,r=t[++n],e<r)break seek}a=t.length;break linear_scan}if(!(e>=i)){let o=t[1];e<o&&(n=2,i=o);for(let a=n-2;;){if(i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===a)break;if(r=i,i=t[--n-1],e>=i)break seek}a=n,n=0;break linear_scan}break validate_interval}for(;n<a;){let r=n+a>>>1;e<t[r]?a=r:n=r+1}if(r=t[n],i=t[n-1],i===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,i,r)}return this.interpolate_(n,i,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,r=this.valueSize,i=e*r;for(let e=0;e!==r;++e)t[e]=n[i+e];return t}interpolate_(){throw Error(`THREE.Interpolant: Call to abstract method.`)}intervalChanged_(){}},Wd=class extends Ud{constructor(e,t,n,r){super(e,t,n,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yo,endingEnd:Yo}}intervalChanged_(e,t,n){let r=this.parameterPositions,i=e-2,a=e+1,o=r[i],s=r[a];if(o===void 0)switch(this.getSettings_().endingStart){case Xo:i=e,o=2*t-n;break;case Zo:i=r.length-2,o=t+r[i]-r[i+1];break;default:i=e,o=n}if(s===void 0)switch(this.getSettings_().endingEnd){case Xo:a=e,s=2*n-t;break;case Zo:a=1,s=n+r[1]-r[0];break;default:a=e-1,s=t}let c=(n-t)*.5,l=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(s-n),this._offsetPrev=i*l,this._offsetNext=a*l}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,p=(n-t)/(r-t),m=p*p,h=m*p,g=-d*h+2*d*m-d*p,_=(1+d)*h+(-1.5-2*d)*m+(-.5+d)*p+1,v=(-1-f)*h+(1.5+f)*m+.5*p,y=f*h-f*m;for(let e=0;e!==o;++e)i[e]=g*a[l+e]+_*a[c+e]+v*a[s+e]+y*a[u+e];return i}},Gd=class extends Ud{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=(n-t)/(r-t),u=1-l;for(let e=0;e!==o;++e)i[e]=a[c+e]*u+a[s+e]*l;return i}},Kd=class extends Ud{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e){return this.copySampleValue_(e-1)}},qd=class extends Ud{interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=e*o,c=s-o,l=this.inTangents,u=this.outTangents;if(!l||!u){let e=(n-t)/(r-t),l=1-e;for(let t=0;t!==o;++t)i[t]=a[c+t]*l+a[s+t]*e;return i}let d=o*2,f=e-1;for(let p=0;p!==o;++p){let o=a[c+p],m=a[s+p],h=f*d+p*2,g=u[h],_=u[h+1],v=e*d+p*2,y=l[v],b=l[v+1],x=Xd(n,t,g,y,r);i[p]=Jd(x,o,_,b,m)}return i}};function Jd(e,t,n,r,i){let a=1-e;return a*a*a*t+3*a*a*e*n+3*a*e*e*r+e*e*e*i}function Yd(e,t,n,r,i){let a=1-e;return 3*a*a*(n-t)+6*a*e*(r-n)+3*e*e*(i-r)}function Xd(e,t,n,r,i){let a=(e-t)/(i-t);for(let o=0;o<8;o++){let o=Jd(a,t,n,r,i)-e;if(Math.abs(o)<1e-10)break;let s=Yd(a,t,n,r,i);if(Math.abs(s)<1e-10)break;a=Math.max(0,Math.min(1,a-o/s))}return a}var Zd=class{constructor(e,t,n,r){if(e===void 0)throw Error(`THREE.KeyframeTrack: track name is undefined`);if(t===void 0||t.length===0)throw Error(`THREE.KeyframeTrack: no keyframes in track named `+e);this.name=e,this.times=Vd(t,this.TimeBufferType),this.values=Vd(n,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Vd(e.times,Array),values:Vd(e.values,Array)};let t=e.getInterpolation();t!==e.DefaultInterpolation&&(n.interpolation=t),Hd(e.settings)&&(n.settings={inTangents:Vd(e.settings.inTangents,Array),outTangents:Vd(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Kd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Gd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Wd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new qd(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Go:t=this.InterpolantFactoryMethodDiscrete;break;case Ko:t=this.InterpolantFactoryMethodLinear;break;case qo:t=this.InterpolantFactoryMethodSmooth;break;case Jo:t=this.InterpolantFactoryMethodBezier}if(t===void 0){let t=`unsupported interpolation for `+this.ValueTypeName+` keyframe track named `+this.name;if(this.createInterpolant===void 0){if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(t)}return z(`KeyframeTrack:`,t),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Go;case this.InterpolantFactoryMethodLinear:return Ko;case this.InterpolantFactoryMethodSmooth:return qo;case this.InterpolantFactoryMethodBezier:return Jo}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]+=e;Hd(this.settings)&&(Qd(this.settings.inTangents,e),Qd(this.settings.outTangents,e))}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,r=t.length;n!==r;++n)t[n]*=e;Hd(this.settings)&&($d(this.settings.inTangents,e),$d(this.settings.outTangents,e))}return this}trim(e,t){let n=this.times,r=n.length,i=0,a=r-1;for(;i!==r&&n[i]<e;)++i;for(;a!==-1&&n[a]>t;)--a;if(++a,i!==0||a!==r){i>=a&&(a=Math.max(a,1),i=a-1);let e=this.getValueSize();this.times=n.slice(i,a),this.values=this.values.slice(i*e,a*e)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(B(`KeyframeTrack: Invalid value size in track.`,this),e=!1);let n=this.times,r=this.values,i=n.length;i===0&&(B(`KeyframeTrack: Track is empty.`,this),e=!1);let a=null;for(let t=0;t!==i;t++){let r=n[t];if(typeof r==`number`&&isNaN(r)){B(`KeyframeTrack: Time is not a valid number.`,this,t,r),e=!1;break}if(a!==null&&a>r){B(`KeyframeTrack: Out of order keys.`,this,t,r,a),e=!1;break}a=r}if(r!==void 0&&ss(r))for(let t=0,n=r.length;t!==n;++t){let n=r[t];if(isNaN(n)){B(`KeyframeTrack: Value is not a valid number.`,this,t,n),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),r=this.getInterpolation()===qo,i=e.length-1,a=1;for(let o=1;o<i;++o){let i=!1,s=e[o];if(s!==e[o+1]&&(o!==1||s!==e[0])){if(r)i=!0;else{let e=o*n,r=e-n,a=e+n;for(let o=0;o!==n;++o){let n=t[e+o];if(n!==t[r+o]||n!==t[a+o]){i=!0;break}}}}if(i){if(o!==a){e[a]=e[o];let r=o*n,i=a*n;for(let e=0;e!==n;++e)t[i+e]=t[r+e]}++a}}if(i>0){e[a]=e[i];for(let e=i*n,r=a*n,o=0;o!==n;++o)t[r+o]=t[e+o];++a}return a===e.length?(this.times=e,this.values=t):(this.times=e.slice(0,a),this.values=t.slice(0,a*n)),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,r=new n(this.name,e,t);return r.createInterpolant=this.createInterpolant,Hd(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Qd(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]+=t}function $d(e,t){for(let n=0,r=e.length;n!==r;n+=2)e[n]*=t}Zd.prototype.ValueTypeName=``,Zd.prototype.TimeBufferType=Float32Array,Zd.prototype.ValueBufferType=Float32Array,Zd.prototype.DefaultInterpolation=Ko;var ef=class extends Zd{constructor(e,t,n){super(e,t,n)}};ef.prototype.ValueTypeName=`bool`,ef.prototype.ValueBufferType=Array,ef.prototype.DefaultInterpolation=Go,ef.prototype.InterpolantFactoryMethodLinear=void 0,ef.prototype.InterpolantFactoryMethodSmooth=void 0;var tf=class extends Zd{constructor(e,t,n,r){super(e,t,n,r)}};tf.prototype.ValueTypeName=`color`;var nf=class extends Zd{constructor(e,t,n,r){super(e,t,n,r)}};nf.prototype.ValueTypeName=`number`;var rf=class extends Ud{constructor(e,t,n,r){super(e,t,n,r)}interpolate_(e,t,n,r){let i=this.resultBuffer,a=this.sampleValues,o=this.valueSize,s=(n-t)/(r-t),c=e*o;for(let e=c+o;c!==e;c+=4)Ws.slerpFlat(i,0,a,c-o,a,c,s);return i}},af=class extends Zd{constructor(e,t,n,r){super(e,t,n,r)}InterpolantFactoryMethodLinear(e){return new rf(this.times,this.values,this.getValueSize(),e)}};af.prototype.ValueTypeName=`quaternion`,af.prototype.InterpolantFactoryMethodSmooth=void 0;var of=class extends Zd{constructor(e,t,n){super(e,t,n)}};of.prototype.ValueTypeName=`string`,of.prototype.ValueBufferType=Array,of.prototype.DefaultInterpolation=Go,of.prototype.InterpolantFactoryMethodLinear=void 0,of.prototype.InterpolantFactoryMethodSmooth=void 0;var sf=class extends Zd{constructor(e,t,n,r){super(e,t,n,r)}};sf.prototype.ValueTypeName=`vector`;var cf=class extends zc{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super(),this.isLight=!0,this.type=`Light`,this.color=new q(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}},lf=new fc,uf=new U,df=new U,ff=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new H(512,512),this.mapType=za,this.map=null,this.mapPass=null,this.matrix=new fc,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Iu,this._frameExtents=new H(1,1),this._viewportCount=1,this._viewports=[new sc(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;uf.setFromMatrixPosition(e.matrixWorld),t.position.copy(uf),df.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(df),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,r){lf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(lf,e.coordinateSystem,e.reversedDepth);let i=this._frameExtents,a=r?r.z/i.x:1,o=r?r.w/i.y:1,s=r?r.x/i.x:0,c=r?r.y/i.y:0;e.coordinateSystem===2001||e.reversedDepth?t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+s,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(lf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},pf=new U,mf=new Ws,hf=new U,gf=class extends zc{constructor(){super(),this.isCamera=!0,this.type=`Camera`,this.matrixWorldInverse=new fc,this.projectionMatrix=new fc,this.projectionMatrixInverse=new fc,this.coordinateSystem=as,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(pf,mf,hf),hf.x===1&&hf.y===1&&hf.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pf,mf,hf.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(pf,mf,hf),hf.x===1&&hf.y===1&&hf.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pf,mf,hf.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},_f=new U,vf=new H,yf=new H,bf=class extends gf{constructor(e=50,t=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type=`PerspectiveCamera`,this.fov=e,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=bs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(ys*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bs*2*Math.atan(Math.tan(ys*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){_f.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(_f.x,_f.y).multiplyScalar(-e/_f.z),_f.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_f.x,_f.y).multiplyScalar(-e/_f.z)}getViewSize(e,t){return this.getViewBounds(e,vf,yf),t.subVectors(yf,vf)}setViewOffset(e,t,n,r,i,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(ys*.5*this.fov)/this.zoom,n=2*t,r=this.aspect*n,i=-.5*r,a=this.view;if(this.view!==null&&this.view.enabled){let e=a.fullWidth,o=a.fullHeight;i+=a.offsetX*r/e,t-=a.offsetY*n/o,r*=a.width/e,n*=a.height/o}let o=this.filmOffset;o!==0&&(i+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(i,i+r,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},xf=class extends ff{constructor(){super(new bf(90,1,.5,500)),this.isPointLightShadow=!0}},Sf=class extends cf{constructor(e,t,n=0,r=2){super(e,t),this.isPointLight=!0,this.type=`PointLight`,this.distance=n,this.decay=r,this.shadow=new xf}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}},Cf=class extends gf{constructor(e=-1,t=1,n=1,r=-1,i=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type=`OrthographicCamera`,this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=r,this.near=i,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,r,i,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=r,this.view.width=i,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2,i=n-e,a=n+e,o=r+t,s=r-t;if(this.view!==null&&this.view.enabled){let e=(this.right-this.left)/this.view.fullWidth/this.zoom,t=(this.top-this.bottom)/this.view.fullHeight/this.zoom;i+=e*this.view.offsetX,a=i+e*this.view.width,o-=t*this.view.offsetY,s=o-t*this.view.height}this.projectionMatrix.makeOrthographic(i,a,o,s,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},wf=class extends ff{constructor(){super(new Cf(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Tf=class extends cf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type=`DirectionalLight`,this.position.copy(zc.DEFAULT_UP),this.updateMatrix(),this.target=new zc,this.shadow=new wf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}},Ef=class extends cf{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type=`AmbientLight`}},Df=-90,Of=1,kf=class extends zc{constructor(e,t,n){super(),this.type=`CubeCamera`,this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new bf(Df,Of,e,t);r.layers=this.layers,this.add(r);let i=new bf(Df,Of,e,t);i.layers=this.layers,this.add(i);let a=new bf(Df,Of,e,t);a.layers=this.layers,this.add(a);let o=new bf(Df,Of,e,t);o.layers=this.layers,this.add(o);let s=new bf(Df,Of,e,t);s.layers=this.layers,this.add(s);let c=new bf(Df,Of,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,r,i,a,o,s]=t;for(let e of t)this.remove(e);if(e===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),i.up.set(0,0,-1),i.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),s.up.set(0,1,0),s.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),i.up.set(0,0,1),i.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),s.up.set(0,-1,0),s.lookAt(0,0,-1);else throw Error(`THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: `+e);for(let e of t)this.add(e),e.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[i,a,o,s,c,l]=this.children,u=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;let m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let h=!1;h=e.isWebGLRenderer===!0?e.state.buffers.depth.getReversed():e.reversedDepthBuffer,e.setRenderTarget(n,0,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,i),e.setRenderTarget(n,1,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(n,4,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.mipmapsAutoUpdate=m,e.setRenderTarget(n,5,r),h&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(u,d,f),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}},Af=class extends bf{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}},jf=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(e){this._document=e,e.hidden!==void 0&&(this._pageVisibilityHandler=Mf.bind(this),e.addEventListener(`visibilitychange`,this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener(`visibilitychange`,this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(e){return this._timescale=e,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(e){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(e===void 0?performance.now():e)-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Mf(){this._document.hidden===!1&&this.reset()}var Nf=`\\[\\]\\.:\\/`,Pf=RegExp(`[\\[\\]\\.:\\/]`,`g`),Ff=`[^\\[\\]\\.:\\/]`,If=`[^`+Nf.replace(`\\.`,``)+`]`,Lf=`((?:WC+[\\/:])*)`.replace(`WC`,Ff),Rf=`(WCOD+)?`.replace(`WCOD`,If),zf=`(?:\\.(WC+)(?:\\[(.+)\\])?)?`.replace(`WC`,Ff),Bf=`\\.(WC+)(?:\\[(.+)\\])?`.replace(`WC`,Ff),Vf=RegExp(`^`+Lf+Rf+zf+Bf+`$`),Hf=[`material`,`materials`,`bones`,`map`],Uf=class{constructor(e,t,n){let r=n||Wf.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,r=this._bindings[n];r!==void 0&&r.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let r=this._targetGroup.nCachedObjects_,i=n.length;r!==i;++r)n[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},Wf=class e{constructor(t,n,r){this.path=n,this.parsedPath=r||e.parseTrackName(n),this.node=e.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,r){return t&&t.isAnimationObjectGroup?new e.Composite(t,n,r):new e(t,n,r)}static sanitizeNodeName(e){return e.replace(/\s/g,`_`).replace(Pf,``)}static parseTrackName(e){let t=Vf.exec(e);if(t===null)throw Error(`THREE.PropertyBinding: Cannot parse trackName: `+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=n.nodeName&&n.nodeName.lastIndexOf(`.`);if(r!==void 0&&r!==-1){let e=n.nodeName.substring(r+1);Hf.indexOf(e)!==-1&&(n.nodeName=n.nodeName.substring(0,r),n.objectName=e)}if(n.propertyName===null||n.propertyName.length===0)throw Error(`THREE.PropertyBinding: can not parse propertyName from trackName: `+e);return n}static findNode(e,t){if(t===void 0||t===``||t===`.`||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(e){for(let r=0;r<e.length;r++){let i=e[r];if(i.name===t||i.uuid===t)return i;let a=n(i.children);if(a)return a}return null},r=n(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)e[t++]=n[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let r=0,i=n.length;r!==i;++r)n[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let t=this.node,n=this.parsedPath,r=n.objectName,i=n.propertyName,a=n.propertyIndex;if(t||(t=e.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){z(`PropertyBinding: No target node found for track: `+this.path+`.`);return}if(r){let e=n.objectIndex;switch(r){case`materials`:if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.materials){B(`PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.`,this);return}t=t.material.materials;break;case`bones`:if(!t.skeleton){B(`PropertyBinding: Can not bind to bones as node does not have a skeleton.`,this);return}t=t.skeleton.bones;for(let n=0;n<t.length;n++)if(t[n].name===e){e=n;break}break;case`map`:if(`map`in t){t=t.map;break}if(!t.material){B(`PropertyBinding: Can not bind to material as node does not have a material.`,this);return}if(!t.material.map){B(`PropertyBinding: Can not bind to material.map as node.material does not have a map.`,this);return}t=t.material.map;break;default:if(t[r]===void 0){B(`PropertyBinding: Can not bind to objectName of node undefined.`,this);return}t=t[r]}if(e!==void 0){if(t[e]===void 0){B(`PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.`,this,t);return}t=t[e]}}let o=t[i];if(o===void 0){let e=n.nodeName;B(`PropertyBinding: Trying to update property for track: `+e+`.`+i+` but it wasn't found.`,t);return}let s=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?s=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(s=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(a!==void 0){if(i===`morphTargetInfluences`){if(!t.geometry){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.`,this);return}if(!t.geometry.morphAttributes){B(`PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.`,this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=a}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][s]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Wf.Composite=Uf,Wf.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3},Wf.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2},Wf.prototype.GetterByBindingType=[Wf.prototype._getValue_direct,Wf.prototype._getValue_array,Wf.prototype._getValue_arrayElement,Wf.prototype._getValue_toArray],Wf.prototype.SetterByBindingTypeAndVersioning=[[Wf.prototype._setValue_direct,Wf.prototype._setValue_direct_setNeedsUpdate,Wf.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Wf.prototype._setValue_array,Wf.prototype._setValue_array_setNeedsUpdate,Wf.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Wf.prototype._setValue_arrayElement,Wf.prototype._setValue_arrayElement_setNeedsUpdate,Wf.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Wf.prototype._setValue_fromArray,Wf.prototype._setValue_fromArray_setNeedsUpdate,Wf.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]],class{static{this.prototype.isMatrix2=!0}constructor(e,t,n,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,r){let i=this.elements;return i[0]=e,i[2]=t,i[1]=n,i[3]=r,this}};function Gf(e,t,n,r){let i=Kf(r);switch(n){case Qa:return e*t;case ro:return e*t/i.components*i.byteLength;case io:return e*t/i.components*i.byteLength;case ao:return e*t*2/i.components*i.byteLength;case oo:return e*t*2/i.components*i.byteLength;case $a:return e*t*3/i.components*i.byteLength;case eo:return e*t*4/i.components*i.byteLength;case so:return e*t*4/i.components*i.byteLength;case co:case lo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case uo:case fo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case mo:case go:return Math.max(e,16)*Math.max(t,8)/4;case po:case ho:return Math.max(e,8)*Math.max(t,8)/2;case _o:case vo:case bo:case xo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case yo:case So:case Co:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case wo:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case To:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case Eo:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case Do:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case Oo:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case ko:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case Ao:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case jo:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case Mo:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case No:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case Po:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case Fo:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case Io:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case Lo:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case Ro:case zo:case Bo:return Math.ceil(e/4)*Math.ceil(t/4)*16;case Vo:case Ho:return Math.ceil(e/4)*Math.ceil(t/4)*8;case Uo:case Wo:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function Kf(e){switch(e){case za:case Ba:return{byteLength:1,components:1};case Ha:case Va:case Ka:return{byteLength:2,components:1};case qa:case Ja:return{byteLength:2,components:4};case Wa:case Ua:case Ga:return{byteLength:4,components:1};case Xa:case Za:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`register`,{detail:{revision:`187`}})),typeof window<`u`&&(window.__THREE__?z(`WARNING: Multiple instances of Three.js being imported.`):window.__THREE__=`187`);function qf(){let e=null,t=!1,n=null,r=null;function i(t,a){r=e.requestAnimationFrame(i),n(t,a)}return{start:function(){t!==!0&&n!==null&&e!==null&&(r=e.requestAnimationFrame(i),t=!0)},stop:function(){e!==null&&e.cancelAnimationFrame(r),t=!1},setAnimationLoop:function(e){n=e},setContext:function(t){e=t}}}function Jf(e){let t=new WeakMap;function n(t,n){let r=t.array,i=t.usage,a=r.byteLength,o=e.createBuffer();e.bindBuffer(n,o),e.bufferData(n,r,i),t.onUploadCallback();let s;if(r instanceof Float32Array)s=e.FLOAT;else if(typeof Float16Array<`u`&&r instanceof Float16Array)s=e.HALF_FLOAT;else if(r instanceof Uint16Array)s=t.isFloat16BufferAttribute?e.HALF_FLOAT:e.UNSIGNED_SHORT;else if(r instanceof Int16Array)s=e.SHORT;else if(r instanceof Uint32Array)s=e.UNSIGNED_INT;else if(r instanceof Int32Array)s=e.INT;else if(r instanceof Int8Array)s=e.BYTE;else if(r instanceof Uint8Array)s=e.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)s=e.UNSIGNED_BYTE;else throw Error(`THREE.WebGLAttributes: Unsupported buffer data format: `+r);return{buffer:o,type:s,bytesPerElement:r.BYTES_PER_ELEMENT,version:t.version,size:a}}function r(t,n,r){let i=n.array,a=n.updateRanges;if(e.bindBuffer(r,t),a.length===0)e.bufferSubData(r,0,i);else{a.sort((e,t)=>e.start-t.start);let t=0;for(let e=1;e<a.length;e++){let n=a[t],r=a[e];r.start<=n.start+n.count+1?n.count=Math.max(n.count,r.start+r.count-n.start):(++t,a[t]=r)}a.length=t+1;for(let t=0,n=a.length;t<n;t++){let n=a[t];e.bufferSubData(r,n.start*i.BYTES_PER_ELEMENT,i,n.start,n.count)}n.clearUpdateRanges()}n.onUploadCallback()}function i(e){return e.isInterleavedBufferAttribute&&(e=e.data),t.get(e)}function a(n){n.isInterleavedBufferAttribute&&(n=n.data);let r=t.get(n);r&&(e.deleteBuffer(r.buffer),t.delete(n))}function o(e,i){if(e.isInterleavedBufferAttribute&&(e=e.data),e.isGLBufferAttribute){let n=t.get(e);(!n||n.version<e.version)&&t.set(e,{buffer:e.buffer,type:e.type,bytesPerElement:e.elementSize,version:e.version});return}let a=t.get(e);if(a===void 0)t.set(e,n(e,i));else if(a.version<e.version){if(a.size!==e.array.byteLength)throw Error(`THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.`);r(a.buffer,e,i),a.version=e.version}}return{get:i,remove:a,update:o}}var Z={alphahash_fragment:`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,alphahash_pars_fragment:`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,alphamap_fragment:`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,alphamap_pars_fragment:`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,alphatest_fragment:`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,alphatest_pars_fragment:`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,aomap_fragment:`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,aomap_pars_fragment:`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,batching_pars_vertex:`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,batching_vertex:`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,begin_vertex:`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,beginnormal_vertex:`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,bsdfs:`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,iridescence_fragment:`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bumpmap_pars_fragment:`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,clipping_planes_fragment:`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,clipping_planes_pars_fragment:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,clipping_planes_pars_vertex:`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,clipping_planes_vertex:`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,color_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,color_pars_fragment:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,color_pars_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,color_vertex:`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,common:`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,defaultnormal_vertex:`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,displacementmap_pars_vertex:`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,displacementmap_vertex:`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,emissivemap_fragment:`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,emissivemap_pars_fragment:`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,colorspace_fragment:`gl_FragColor = linearToOutputTexel( gl_FragColor );`,colorspace_pars_fragment:`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,envmap_fragment:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,envmap_common_pars_fragment:`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,envmap_pars_fragment:`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,envmap_pars_vertex:`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,envmap_physical_pars_fragment:`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,envmap_vertex:`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,fog_vertex:`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fog_pars_vertex:`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,fog_fragment:`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,fog_pars_fragment:`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,gradientmap_pars_fragment:`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,lightmap_pars_fragment:`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,lights_lambert_fragment:`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,lights_lambert_pars_fragment:`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lights_pars_begin:`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,lights_toon_fragment:`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,lights_toon_pars_fragment:`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,lights_phong_fragment:`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lights_phong_pars_fragment:`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lights_physical_fragment:`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lights_physical_pars_fragment:`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,lights_fragment_begin:`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,lights_fragment_maps:`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lights_fragment_end:`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lightprobes_pars_fragment:`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,logdepthbuf_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,logdepthbuf_pars_fragment:`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_pars_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,logdepthbuf_vertex:`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,map_fragment:`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,map_pars_fragment:`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,map_particle_fragment:`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,map_particle_pars_fragment:`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,metalnessmap_fragment:`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,metalnessmap_pars_fragment:`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,morphinstance_vertex:`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,morphcolor_vertex:`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,morphnormal_vertex:`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,morphtarget_pars_vertex:`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,morphtarget_vertex:`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,normal_fragment_begin:`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,normal_fragment_maps:`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,normal_pars_fragment:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_pars_vertex:`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,normal_vertex:`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,normalmap_pars_fragment:`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,clearcoat_normal_fragment_begin:`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,clearcoat_normal_fragment_maps:`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,clearcoat_pars_fragment:`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,iridescence_pars_fragment:`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,opaque_fragment:`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,packing:`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,premultiplied_alpha_fragment:`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,project_vertex:`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dithering_fragment:`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,dithering_pars_fragment:`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,roughnessmap_fragment:`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,roughnessmap_pars_fragment:`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,shadowmap_pars_fragment:`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,shadowmap_pars_vertex:`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,shadowmap_vertex:`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,shadowmask_pars_fragment:`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,skinbase_vertex:`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,skinning_pars_vertex:`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,skinning_vertex:`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,skinnormal_vertex:`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,specularmap_fragment:`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,specularmap_pars_fragment:`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tonemapping_fragment:`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tonemapping_pars_fragment:`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,transmission_fragment:`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,transmission_pars_fragment:`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uv_pars_fragment:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_pars_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,uv_vertex:`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,worldpos_vertex:`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,background_vert:`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,background_frag:`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,backgroundCube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,backgroundCube_frag:`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cube_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cube_frag:`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,depth_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,depth_frag:`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,distance_vert:`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,distance_frag:`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,equirect_vert:`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,equirect_frag:`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,linedashed_vert:`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,linedashed_frag:`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,meshbasic_vert:`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,meshbasic_frag:`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshlambert_vert:`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshlambert_frag:`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshmatcap_vert:`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,meshmatcap_frag:`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshnormal_vert:`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,meshnormal_frag:`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,meshphong_vert:`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshphong_frag:`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshphysical_vert:`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,meshphysical_frag:`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,meshtoon_vert:`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,meshtoon_frag:`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,points_vert:`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,points_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,shadow_vert:`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,shadow_frag:`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sprite_vert:`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,sprite_frag:`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`},Q={common:{diffuse:{value:new q(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new W}},envmap:{envMap:{value:null},envMapRotation:{value:new W},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new W}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new W}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new W},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new W},normalScale:{value:new H(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new W},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new W}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new W}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new W}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new q(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new q(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0},uvTransform:{value:new W}},sprite:{diffuse:{value:new q(16777215)},opacity:{value:1},center:{value:new H(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new W},alphaMap:{value:null},alphaMapTransform:{value:new W},alphaTest:{value:0}}},Yf={basic:{uniforms:Od([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.fog]),vertexShader:Z.meshbasic_vert,fragmentShader:Z.meshbasic_frag},lambert:{uniforms:Od([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new q(0)},envMapIntensity:{value:1}}]),vertexShader:Z.meshlambert_vert,fragmentShader:Z.meshlambert_frag},phong:{uniforms:Od([Q.common,Q.specularmap,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,Q.lights,{emissive:{value:new q(0)},specular:{value:new q(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Z.meshphong_vert,fragmentShader:Z.meshphong_frag},standard:{uniforms:Od([Q.common,Q.envmap,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.roughnessmap,Q.metalnessmap,Q.fog,Q.lights,{emissive:{value:new q(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag},toon:{uniforms:Od([Q.common,Q.aomap,Q.lightmap,Q.emissivemap,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.gradientmap,Q.fog,Q.lights,{emissive:{value:new q(0)}}]),vertexShader:Z.meshtoon_vert,fragmentShader:Z.meshtoon_frag},matcap:{uniforms:Od([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,Q.fog,{matcap:{value:null}}]),vertexShader:Z.meshmatcap_vert,fragmentShader:Z.meshmatcap_frag},points:{uniforms:Od([Q.points,Q.fog]),vertexShader:Z.points_vert,fragmentShader:Z.points_frag},dashed:{uniforms:Od([Q.common,Q.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Z.linedashed_vert,fragmentShader:Z.linedashed_frag},depth:{uniforms:Od([Q.common,Q.displacementmap]),vertexShader:Z.depth_vert,fragmentShader:Z.depth_frag},normal:{uniforms:Od([Q.common,Q.bumpmap,Q.normalmap,Q.displacementmap,{opacity:{value:1}}]),vertexShader:Z.meshnormal_vert,fragmentShader:Z.meshnormal_frag},sprite:{uniforms:Od([Q.sprite,Q.fog]),vertexShader:Z.sprite_vert,fragmentShader:Z.sprite_frag},background:{uniforms:{uvTransform:{value:new W},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Z.background_vert,fragmentShader:Z.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new W}},vertexShader:Z.backgroundCube_vert,fragmentShader:Z.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Z.cube_vert,fragmentShader:Z.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Z.equirect_vert,fragmentShader:Z.equirect_frag},distance:{uniforms:Od([Q.common,Q.displacementmap,{referencePosition:{value:new U},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Z.distance_vert,fragmentShader:Z.distance_frag},shadow:{uniforms:Od([Q.lights,Q.fog,{color:{value:new q(0)},opacity:{value:1}}]),vertexShader:Z.shadow_vert,fragmentShader:Z.shadow_frag}};Yf.physical={uniforms:Od([Yf.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new W},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new W},clearcoatNormalScale:{value:new H(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new W},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new W},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new W},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new W},sheen:{value:0},sheenColor:{value:new q(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new W},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new W},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new W},transmissionSamplerSize:{value:new H},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new W},attenuationDistance:{value:0},attenuationColor:{value:new q(0)},specularColor:{value:new q(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new W},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new W},anisotropyVector:{value:new H},anisotropyMap:{value:null},anisotropyMapTransform:{value:new W}}]),vertexShader:Z.meshphysical_vert,fragmentShader:Z.meshphysical_frag};var Xf={r:0,b:0,g:0},Zf=new fc,Qf=new W;Qf.set(-1,0,0,0,1,0,0,0,1);function $f(e,t,n,r,i,a){let o=new q(0),s=i===!0?0:1,c,l,u=null,d=0,f=null;function p(e){let n=e.isScene===!0?e.background:null;if(n&&n.isTexture){let r=e.backgroundBlurriness>0;n=t.get(n,r)}return n}function m(t){let r=!1,i=p(t);i===null?g(o,s):i&&i.isColor&&(g(i,1),r=!0);let c=e.xr.getEnvironmentBlendMode();c===`additive`?n.buffers.color.setClear(0,0,0,1,a):c===`alpha-blend`&&n.buffers.color.setClear(0,0,0,0,a),(e.autoClear||r)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil))}function h(t,n){let i=p(n);i&&i.isCubeTexture?(l===void 0&&(l=new Y(new X(1,1,1),new Fd({name:`BackgroundCubeMaterial`,uniforms:Dd(Yf.backgroundCube.uniforms),vertexShader:Yf.backgroundCube.vertexShader,fragmentShader:Yf.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute(`normal`),l.geometry.deleteAttribute(`uv`),l.onBeforeRender=function(e,t,n){this.matrixWorld.copyPosition(n.matrixWorld)},Object.defineProperty(l.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(l)),l.material.uniforms.envMap.value=i,l.material.uniforms.backgroundBlurriness.value=n.backgroundBlurriness,l.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,l.material.uniforms.backgroundRotation.value.setFromMatrix4(Zf.makeRotationFromEuler(n.backgroundRotation)).transpose(),i.isRenderTargetTexture===!1&&l.material.uniforms.backgroundRotation.value.premultiply(Qf),l.material.toneMapped=G.getTransfer(i.colorSpace)!==ns,(u!==i||d!==i.version||f!==e.toneMapping)&&(l.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),l.layers.enableAll(),t.unshift(l,l.geometry,l.material,0,0,null)):i&&i.isTexture&&(c===void 0&&(c=new Y(new Cd(2,2),new Fd({name:`BackgroundMaterial`,uniforms:Dd(Yf.background.uniforms),vertexShader:Yf.background.vertexShader,fragmentShader:Yf.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute(`normal`),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=i,c.material.uniforms.backgroundIntensity.value=n.backgroundIntensity,c.material.toneMapped=G.getTransfer(i.colorSpace)!==ns,i.matrixAutoUpdate===!0&&i.updateMatrix(),c.material.uniforms.uvTransform.value.copy(i.matrix),(u!==i||d!==i.version||f!==e.toneMapping)&&(c.material.needsUpdate=!0,u=i,d=i.version,f=e.toneMapping),c.layers.enableAll(),t.unshift(c,c.geometry,c.material,0,0,null))}function g(t,r){t.getRGB(Xf,jd(e)),n.buffers.color.setClear(Xf.r,Xf.g,Xf.b,r,a)}function _(){l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(e,t=1){o.set(e),s=t,g(o,s)},getClearAlpha:function(){return s},setClearAlpha:function(e){s=e,g(o,s)},render:m,addToRenderList:h,dispose:_}}function ep(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),r={},i=f(null),a=i,o=!1;function s(n,r,i,s,c){let u=!1,f=d(n,s,i,r);a!==f&&(a=f,l(a.object)),u=p(n,s,i,c),u&&m(n,s,i,c),c!==null&&t.update(c,e.ELEMENT_ARRAY_BUFFER),(u||o)&&(o=!1,b(n,r,i,s),c!==null&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(c).buffer))}function c(){return e.createVertexArray()}function l(t){return e.bindVertexArray(t)}function u(t){return e.deleteVertexArray(t)}function d(e,t,n,i){let a=i.wireframe===!0,o=r[t.id];o===void 0&&(o={},r[t.id]=o);let s=e.isInstancedMesh===!0?e.id:0,l=o[s];l===void 0&&(l={},o[s]=l);let u=l[n.id];u===void 0&&(u={},l[n.id]=u);let d=u[a];return d===void 0&&(d=f(c()),u[a]=d),d}function f(e){let t=[],r=[],i=[];for(let e=0;e<n;e++)t[e]=0,r[e]=0,i[e]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:t,enabledAttributes:r,attributeDivisors:i,object:e,attributes:{},index:null}}function p(e,t,n,r){let i=a.attributes,o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=i[t],r=o[t];if(r===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(r=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(r=e.instanceColor)),n===void 0||n.attribute!==r||r&&n.data!==r.data)return!0;s++}return a.attributesNum!==s||a.index!==r}function m(e,t,n,r){let i={},o=t.attributes,s=0,c=n.getAttributes();for(let t in c)if(c[t].location>=0){let n=o[t];n===void 0&&(t===`instanceMatrix`&&e.instanceMatrix&&(n=e.instanceMatrix),t===`instanceColor`&&e.instanceColor&&(n=e.instanceColor));let r={};r.attribute=n,n&&n.data&&(r.data=n.data),i[t]=r,s++}a.attributes=i,a.attributesNum=s,a.index=r}function h(){let e=a.newAttributes;for(let t=0,n=e.length;t<n;t++)e[t]=0}function g(e){_(e,0)}function _(t,n){let r=a.newAttributes,i=a.enabledAttributes,o=a.attributeDivisors;r[t]=1,i[t]===0&&(e.enableVertexAttribArray(t),i[t]=1),o[t]!==n&&(e.vertexAttribDivisor(t,n),o[t]=n)}function v(){let t=a.newAttributes,n=a.enabledAttributes;for(let r=0,i=n.length;r<i;r++)n[r]!==t[r]&&(e.disableVertexAttribArray(r),n[r]=0)}function y(t,n,r,i,a,o,s){s===!0?e.vertexAttribIPointer(t,n,r,a,o):e.vertexAttribPointer(t,n,r,i,a,o)}function b(n,r,i,a){h();let o=a.attributes,s=i.getAttributes(),c=r.defaultAttributeValues;for(let r in s){let i=s[r];if(i.location>=0){let s=o[r];if(s===void 0&&(r===`instanceMatrix`&&n.instanceMatrix&&(s=n.instanceMatrix),r===`instanceColor`&&n.instanceColor&&(s=n.instanceColor)),s!==void 0){let r=s.normalized,o=s.itemSize,c=t.get(s);if(c===void 0)continue;let l=c.buffer,u=c.type,d=c.bytesPerElement,f=u===e.INT||u===e.UNSIGNED_INT||s.gpuType===1013;if(s.isInterleavedBufferAttribute){let t=s.data,c=t.isInterleavedBuffer===!0?t.stride:t.itemSize,p=s.offset;if(t.isInstancedInterleavedBuffer||t.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,t.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=t.meshPerAttribute*t.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,c*d,(p+o/i.locationSize*e)*d,f)}else{if(s.isInstancedBufferAttribute){for(let e=0;e<i.locationSize;e++)_(i.location+e,s.meshPerAttribute);n.isInstancedMesh!==!0&&a._maxInstanceCount===void 0&&(a._maxInstanceCount=s.meshPerAttribute*s.count)}else for(let e=0;e<i.locationSize;e++)g(i.location+e);e.bindBuffer(e.ARRAY_BUFFER,l);for(let e=0;e<i.locationSize;e++)y(i.location+e,o/i.locationSize,u,r,o*d,o/i.locationSize*e*d,f)}}else if(c!==void 0){let t=c[r];if(t!==void 0)switch(t.length){case 2:e.vertexAttrib2fv(i.location,t);break;case 3:e.vertexAttrib3fv(i.location,t);break;case 4:e.vertexAttrib4fv(i.location,t);break;default:e.vertexAttrib1fv(i.location,t)}}}}v()}function x(){T();for(let e in r){let t=r[e];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e]}}function S(e){if(r[e.id]===void 0)return;let t=r[e.id];for(let e in t){let n=t[e];for(let e in n){let t=n[e];for(let e in t)u(t[e].object),delete t[e];delete n[e]}}delete r[e.id]}function C(e){for(let t in r){let n=r[t];for(let t in n){let r=n[t];if(r[e.id]===void 0)continue;let i=r[e.id];for(let e in i)u(i[e].object),delete i[e];delete r[e.id]}}}function w(e){for(let t in r){let n=r[t],i=e.isInstancedMesh===!0?e.id:0,a=n[i];if(a!==void 0){for(let e in a){let t=a[e];for(let e in t)u(t[e].object),delete t[e];delete a[e]}delete n[i],Object.keys(n).length===0&&delete r[t]}}}function T(){E(),o=!0,a!==i&&(a=i,l(a.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:s,reset:T,resetDefaultState:E,dispose:x,releaseStatesOfGeometry:S,releaseStatesOfObject:w,releaseStatesOfProgram:C,initAttributes:h,enableAttribute:g,disableUnusedAttributes:v}}function tp(e,t,n){let r;function i(e){r=e}function a(t,i){e.drawArrays(r,t,i),n.update(i,r,1)}function o(t,i,a){a!==0&&(e.drawArraysInstanced(r,t,i,a),n.update(i,r,a))}function s(e,i,a){if(a===0)return;t.get(`WEBGL_multi_draw`).multiDrawArraysWEBGL(r,e,0,i,0,a);let o=0;for(let e=0;e<a;e++)o+=i[e];n.update(o,r,1)}this.setMode=i,this.render=a,this.renderInstances=o,this.renderMultiDraw=s}function np(e,t,n,r){let i;function a(){if(i!==void 0)return i;if(t.has(`EXT_texture_filter_anisotropic`)===!0){let n=t.get(`EXT_texture_filter_anisotropic`);i=e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(t){return t===1023||r.convert(t)===e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT)}function s(n){let i=n===1016&&(t.has(`EXT_color_buffer_half_float`)||t.has(`EXT_color_buffer_float`));return!(n!==1009&&n!==1015&&!i&&r.convert(n)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))}function c(t){if(t===`highp`){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return`highp`;t=`mediump`}return t===`mediump`&&e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0?`mediump`:`lowp`}let l=n.precision===void 0?`highp`:n.precision,u=c(l);u!==l&&(z(`WebGLRenderer:`,l,`not supported, using`,u,`instead.`),l=u);let d=n.reversedDepthBuffer===!0&&t.has(`EXT_clip_control`),f=n.logarithmicDepthBuffer===!0&&d===!1;n.reversedDepthBuffer===!0&&d===!1&&z(`WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.`),n.logarithmicDepthBuffer===!0&&d===!0&&z(`WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.`);let p=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),h=e.getParameter(e.MAX_TEXTURE_SIZE),g=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),_=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),y=e.getParameter(e.MAX_VARYING_VECTORS),b=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),x=e.getParameter(e.MAX_SAMPLES),S=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:s,precision:l,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:m,maxTextureSize:h,maxCubemapSize:g,maxAttributes:_,maxVertexUniforms:v,maxVaryings:y,maxFragmentUniforms:b,maxSamples:x,samples:S}}function rp(e){let t=this,n=null,r=0,i=!1,a=!1,o=new Jl,s=new W,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(e,t){let n=e.length!==0||t||r!==0||i;return i=t,r=e.length,n},this.beginShadows=function(){a=!0,u(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(e,t){n=u(e,t,0)},this.setState=function(t,o,s){let d=t.clippingPlanes,f=t.clipIntersection,p=t.clipShadows,m=e.get(t);if(!i||d===null||d.length===0||a&&!p)a?u(null):l();else{let e=a?0:r,t=e*4,i=m.clippingState||null;c.value=i,i=u(d,o,t,s);for(let e=0;e!==t;++e)i[e]=n[e];m.clippingState=i,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=e}};function l(){c.value!==n&&(c.value=n,c.needsUpdate=r>0),t.numPlanes=r,t.numIntersection=0}function u(e,n,r,i){let a=e===null?0:e.length,l=null;if(a!==0){if(l=c.value,i!==!0||l===null){let t=r+a*4,i=n.matrixWorldInverse;s.getNormalMatrix(i),(l===null||l.length<t)&&(l=new Float32Array(t));for(let t=0,n=r;t!==a;++t,n+=4)o.copy(e[t]).applyMatrix4(i,s),o.normal.toArray(l,n),l[n+3]=o.constant}c.value=l,c.needsUpdate=!0}return t.numPlanes=a,t.numIntersection=0,l}}var ip=class extends lc{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},r=[n,n,n,n,n,n];this.texture=new zu(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new X(5,5,5),i=new Fd({name:`CubemapFromEquirect`,uniforms:Dd(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});i.uniforms.tEquirect.value=t;let a=new Y(r,i),o=t.minFilter;return t.minFilter===1008&&(t.minFilter=Ia),new kf(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,r=!0){let i=e.getRenderTarget();for(let i=0;i<6;i++)e.setRenderTarget(this,i),e.clear(t,n,r);e.setRenderTarget(i)}},ap=256,op=3,sp=20,cp=256,lp=16,up=3,dp=new U,fp=new q,pp=class e{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new kf(1,10,null),this._boxMesh=new Y(new X(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=.1,r=100,i={}){let{size:a=256,position:o=dp}=i,s=this._renderer;this._setSize(a);let c=this._allocateTarget(),l=this._getSourceTarget(!0);t>0&&(l.texture.mipmapsAutoUpdate=!1);let u=s.autoClear,d=s.autoClearColor,f=s.autoClearDepth,p=s.autoClearStencil,m=e.background;s.autoClear=!0,s.autoClearColor=!0,s.autoClearDepth=!0,s.autoClearStencil=!0,m===null&&(e.background=s.getClearColor(fp));let h=new kf(n,r,l);return h.position.copy(o),h.update(s,e),s.autoClear=u,s.autoClearColor=d,s.autoClearDepth=f,s.autoClearStencil=p,e.background=m,t>0&&(l.texture.mipmapsAutoUpdate=!0,this._blur(c,t)),this._applyPMREM(c),c}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=bp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=yp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(ap,Rs(e))}_fromTexture(e,t){e.mapping===301||e.mapping===302?this._setSize(e.image.length===0?ap:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=mp(e,!1,!1),n=Math.log2(e)-op;for(let r=0;r<=n;r++)t.texture.mipmaps.push({width:e>>r,height:e>>r});return t.texture.name=`PMREM`,t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==t||e&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=mp(t,!0,e)),this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let r=this._boxMesh,i=this._cubeCamera;r.material=n,i.renderTarget=e,i.activeMipmapLevel=t;let a=e.width>>t;e.viewport.set(0,0,a,a),i.update(this._renderer,r),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;e.mapping===301||e.mapping===302?(this._cubemapMaterial===null&&(this._cubemapMaterial=bp()),t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=yp()),t=this._equirectMaterial),t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=gp(),this._integrationMaterial=_p());let n=this._cubeSize,r=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(n/lp);for(let o=0;o<=r;o++){let s=e.lodToRoughness(o,r);if(o>r-up)a.roughness.value=s,this._renderCube(t,o,this._integrationMaterial);else{let e=s>0?Math.log2(n)+.5*Math.log2(6/(cp*s**4))+.5:0;i.roughness.value=s,i.lodBias.value=e,this._renderCube(t,o,this._ggxMaterial)}}}_blur(e,t){this._blurMaterial===null&&(this._blurMaterial=vp());let n=this._blurMaterial,r=n.uniforms,i=this._sourceTarget;r.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,r.envMap.value=i.texture,this._renderCube(e,0,n),r.envMap.value=e.texture,this._renderCube(i,0,n)}};function mp(e,t,n){return new ip(e,{minFilter:Ra,generateMipmaps:t,type:Ka,colorSpace:es,depthBuffer:n})}function hp(e,t,n){return new Fd({name:e,uniforms:t,vertexShader:Z.cube_vert,fragmentShader:n,side:1,blending:0,depthTest:!1,depthWrite:!1})}function gp(){return hp(`PMREMGGXConvolution`,{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${cp}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function _p(){return hp(`PMREMGGXIntegration`,{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:lp}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function vp(){return hp(`PMREMSphericalGaussianBlur`,{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${sp}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function yp(){return hp(`PMREMEquirectangularToCubemap`,{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function bp(){return hp(`PMREMCubemapToCubemap`,{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function xp(e){let t=new WeakMap,n=new WeakMap,r=null;function i(e,t=!1){return e==null?null:t?o(e):a(e)}function a(n){if(n&&n.isTexture){let r=n.mapping;if(r===303||r===304){if(t.has(n)){let e=t.get(n).texture;return s(e,n.mapping)}{let r=n.image;if(r&&r.height>0){let i=new ip(r.height);return i.fromEquirectangularTexture(e,n),t.set(n,i),n.addEventListener(`dispose`,l),s(i.texture,n.mapping)}return null}}}return n}function o(t){if(t&&t.isTexture&&t.isPMREMTexture!==!0){let i=t.mapping,a=i===303||i===304,o=i===301||i===302;if(a||o){let i=n.get(t),s=i===void 0?0:i.texture.pmremVersion;if(t.isRenderTargetTexture&&t.pmremVersion!==s)return r===null&&(r=new pp(e)),i=a?r.fromEquirectangular(t,i):r.fromCubemap(t,i),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),i.texture;if(i!==void 0)return i.texture;{let s=t.image;return a&&s&&s.height>0||o&&s&&c(s)?(r===null&&(r=new pp(e)),i=a?r.fromEquirectangular(t):r.fromCubemap(t),i.texture.pmremVersion=t.pmremVersion,n.set(t,i),t.addEventListener(`dispose`,u),i.texture):null}}}return t}function s(e,t){return t===303?e.mapping=301:t===304&&(e.mapping=302),e}function c(e){let t=0;for(let n=0;n<6;n++)e[n]!==void 0&&t++;return t===6}function l(e){let n=e.target;n.removeEventListener(`dispose`,l);let r=t.get(n);r!==void 0&&(t.delete(n),r.dispose())}function u(e){let t=e.target;t.removeEventListener(`dispose`,u);let r=n.get(t);r!==void 0&&(n.delete(t),r.dispose())}function d(){t=new WeakMap,n=new WeakMap,r!==null&&(r.dispose(),r=null)}return{get:i,dispose:d}}function Sp(e){let t={};function n(n){if(t[n]!==void 0)return t[n];let r=e.getExtension(n);return t[n]=r,r}return{has:function(e){return n(e)!==null},init:function(){n(`EXT_color_buffer_float`),n(`WEBGL_clip_cull_distance`),n(`OES_texture_float_linear`),n(`EXT_color_buffer_half_float`),n(`WEBGL_multisampled_render_to_texture`),n(`WEBGL_render_shared_exponent`)},get:function(e){let t=n(e);return t===null&&ps(`WebGLRenderer: `+e+` extension not supported.`),t}}}function Cp(e,t,n,r){let i={},a=new WeakMap,o=new FinalizationRegistry(e=>delete i[e]);function s(e){c(e.target)}function c(e){e.index!==null&&t.remove(e.index);for(let n in e.attributes)t.remove(e.attributes[n]);e.removeEventListener(`dispose`,s),delete i[e.id],o.unregister(e);let c=a.get(e);c&&(t.remove(c),a.delete(e)),r.releaseStatesOfGeometry(e),e.isInstancedBufferGeometry===!0&&delete e._maxInstanceCount,n.memory.geometries--}function l(e,t){return i[t.id]===void 0&&(t.addEventListener(`dispose`,s),i[t.id]=new WeakRef(t),o.register(t,t.id,t),n.memory.geometries++),t}function u(n){let r=n.attributes;for(let n in r)t.update(r[n],e.ARRAY_BUFFER)}function d(e){let n=e.index,r=e.attributes.position,i=0;if(r===void 0)return;let o=n===null?r.array.length/3-1:n.array.length,s=new(r.count>=65535?Ol:Dl)(Math.ceil(o/3)*6,1),c=s.array;if(n!==null){let e=n.array;i=n.version;for(let t=0,n=0;t<o;t+=3){let r=e[t+0],i=e[t+1],a=e[t+2];c[n++]=r,c[n++]=i,c[n++]=i,c[n++]=a,c[n++]=a,c[n++]=r}}else{i=r.version;for(let e=0,t=0;e<o;e+=3){let n=e+0,r=e+1,i=e+2;c[t++]=n,c[t++]=r,c[t++]=r,c[t++]=i,c[t++]=i,c[t++]=n}}s.version=i;let l=a.get(e);l&&t.remove(l),a.set(e,s)}function f(e){let t=a.get(e);if(t){let n=e.index;n!==null&&t.version<n.version&&d(e)}else d(e);return a.get(e)}function p(){for(let e in i){let t=i[e].deref();t!==void 0&&c(t)}}return{get:l,update:u,getWireframeAttribute:f,dispose:p}}function wp(e,t,n){let r;function i(e){r=e}let a,o;function s(e){a=e.type,o=e.bytesPerElement}function c(t,i){e.drawElements(r,i,a,t*o),n.update(i,r,1)}function l(t,i,s){s!==0&&(e.drawElementsInstanced(r,i,a,t*o,s),n.update(i,r,s))}function u(e,i,o){if(o===0)return;t.get(`WEBGL_multi_draw`).multiDrawElementsWEBGL(r,i,0,a,e,0,o);let s=0;for(let e=0;e<o;e++)s+=i[e];n.update(s,r,1)}this.setMode=i,this.setIndex=s,this.render=c,this.renderInstances=l,this.renderMultiDraw=u}function Tp(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function r(t,r,i){switch(n.calls++,r){case e.TRIANGLES:n.triangles+=t/3*i;break;case e.LINES:n.lines+=t/2*i;break;case e.LINE_STRIP:n.lines+=i*(t-1);break;case e.LINE_LOOP:n.lines+=i*t;break;case e.POINTS:n.points+=i*t;break;default:B(`WebGLInfo: Unknown draw mode:`,r)}}function i(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:i,update:r}}function Ep(e,t,n){let r=new WeakMap,i=new sc;function a(a,o,s){let c=a.morphTargetInfluences,l=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=l===void 0?0:l.length,d=r.get(o);if(d===void 0||d.count!==u){d!==void 0&&d.texture.dispose();let e=o.morphAttributes.position!==void 0,n=o.morphAttributes.normal!==void 0,a=o.morphAttributes.color!==void 0,s=o.morphAttributes.position||[],c=o.morphAttributes.normal||[],l=o.morphAttributes.color||[],f=0;e===!0&&(f=1),n===!0&&(f=2),a===!0&&(f=3);let p=o.attributes.position.count*f,m=1;p>t.maxTextureSize&&(m=Math.ceil(p/t.maxTextureSize),p=t.maxTextureSize);let h=new Float32Array(p*m*4*u),g=new uc(h,p,m,u);g.type=Ga,g.needsUpdate=!0;let _=f*4;for(let t=0;t<u;t++){let r=s[t],o=c[t],u=l[t],d=p*m*4*t;for(let t=0;t<r.count;t++){let s=t*_;e===!0&&(i.fromBufferAttribute(r,t),h[d+s+0]=i.x,h[d+s+1]=i.y,h[d+s+2]=i.z,h[d+s+3]=0),n===!0&&(i.fromBufferAttribute(o,t),h[d+s+4]=i.x,h[d+s+5]=i.y,h[d+s+6]=i.z,h[d+s+7]=0),a===!0&&(i.fromBufferAttribute(u,t),h[d+s+8]=i.x,h[d+s+9]=i.y,h[d+s+10]=i.z,h[d+s+11]=u.itemSize===4?i.w:1)}}d={count:u,texture:g,size:new H(p,m)},r.set(o,d);function v(){g.dispose(),r.delete(o),o.removeEventListener(`dispose`,v)}o.addEventListener(`dispose`,v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)s.getUniforms().setValue(e,`morphTexture`,a.morphTexture,n);else{let t=0;for(let e=0;e<c.length;e++)t+=c[e];let n=o.morphTargetsRelative?1:1-t;s.getUniforms().setValue(e,`morphTargetBaseInfluence`,n),s.getUniforms().setValue(e,`morphTargetInfluences`,c)}s.getUniforms().setValue(e,`morphTargetsTexture`,d.texture,n),s.getUniforms().setValue(e,`morphTargetsTextureSize`,d.size)}return{update:a}}function Dp(e,t,n,r,i){let a=new WeakMap;function o(r){let o=i.render.frame,s=r.geometry,l=t.get(r,s);if(a.get(l)!==o&&(t.update(l),a.set(l,o)),r.isInstancedMesh&&(r.hasEventListener(`dispose`,c)===!1&&r.addEventListener(`dispose`,c),a.get(r)!==o&&(n.update(r.instanceMatrix,e.ARRAY_BUFFER),r.instanceColor!==null&&n.update(r.instanceColor,e.ARRAY_BUFFER),a.set(r,o))),r.isSkinnedMesh){let e=r.skeleton;a.get(e)!==o&&(e.update(),a.set(e,o))}return l}function s(){a=new WeakMap}function c(e){let t=e.target;t.removeEventListener(`dispose`,c),r.releaseStatesOfObject(t),n.remove(t.instanceMatrix),t.instanceColor!==null&&n.remove(t.instanceColor)}return{update:o,dispose:s}}var Op={1:`LINEAR_TONE_MAPPING`,2:`REINHARD_TONE_MAPPING`,3:`CINEON_TONE_MAPPING`,4:`ACES_FILMIC_TONE_MAPPING`,6:`AGX_TONE_MAPPING`,7:`NEUTRAL_TONE_MAPPING`,5:`CUSTOM_TONE_MAPPING`};function kp(e,t,n,r,i,a){let o=new lc(t,n,{type:e,depthBuffer:i,stencilBuffer:a,samples:r?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),s=null,c=null,l=null,u=new Bl;u.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute(`uv`,new J([0,2,0,0,2,0],2));let d=new Id({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Y(u,d),p=new Cf(-1,1,1,-1,0,1),m=null,h=null,g=!1,_,v=null,y=[],b=!1;this.setSize=function(e,t){o.setSize(e,t),s!==null&&s.setSize(e,t),c!==null&&c.setSize(e,t);for(let n=0;n<y.length;n++){let r=y[n];r.setSize&&r.setSize(e,t)}},this.setEffects=function(e){y=e,b=y.length>0&&y[0].isRenderPass===!0;let t=o.width,n=o.height;y.length>0&&s===null&&(s=new lc(t,n,{type:Ka,depthBuffer:!1,stencilBuffer:!1}),c=new lc(t,n,{type:Ka,depthBuffer:!1,stencilBuffer:!1}));let r=i===!0&&y.some(e=>e.needsDepthTexture===!0);r!==(o.depthTexture!==null)&&(r===!0&&l===null&&(l=new Vu(t,n),a===!0&&(l.format=no,l.type=Ya)),o.dispose(),o.depthTexture=r?l:null,o.resolveDepthBuffer=r,o.storeMultisampledDepthBuffer=r);for(let e=0;e<y.length;e++){let i=y[e];i.setSize&&i.setSize(t,n),r&&i.needsDepthTexture===!0&&i.setDepthTexture&&i.setDepthTexture(l)}},this.begin=function(e,t){if(g||e.toneMapping===0&&y.length===0)return!1;if(v=t,t!==null){let e=t.width,n=t.height;(o.width!==e||o.height!==n)&&this.setSize(e,n)}return b===!1&&e.setRenderTarget(o),_=e.toneMapping,e.toneMapping=0,!0},this.hasRenderPass=function(){return b},this.end=function(e,t){e.toneMapping=_,g=!0;let n=o,r=s;for(let i=0;i<y.length;i++){let a=y[i];a.enabled!==!1&&(a.render(e,r,n,t),a.needsSwap!==!1&&(n=r,r=r===s?c:s))}if(m!==e.outputColorSpace||h!==e.toneMapping){m=e.outputColorSpace,h=e.toneMapping,d.defines={},G.getTransfer(m)===`srgb`&&(d.defines.SRGB_TRANSFER=``);let t=Op[h];t&&(d.defines[t]=``),d.needsUpdate=!0}d.uniforms.tDiffuse.value=n.texture,e.setRenderTarget(v),e.render(f,p),v=null,g=!1},this.isCompositing=function(){return g},this.dispose=function(){o.dispose(),s!==null&&s.dispose(),c!==null&&c.dispose(),u.dispose(),d.dispose()}}var Ap=new oc,jp=new Vu(1,1),Mp=new Hu(1),Np=new uc,Pp=new dc,Fp=new zu,Ip=[],Lp=[],Rp=new Float32Array(16),zp=new Float32Array(9),Bp=new Float32Array(4);function Vp(e,t,n){let r=e[0];if(r<=0||r>0)return e;let i=t*n,a=Ip[i];if(a===void 0&&(a=new Float32Array(i),Ip[i]=a),t!==0){r.toArray(a,0);for(let r=1,i=0;r!==t;++r)i+=n,e[r].toArray(a,i)}return a}function Hp(e,t){if(e.length!==t.length)return!1;for(let n=0,r=e.length;n<r;n++)if(e[n]!==t[n])return!1;return!0}function Up(e,t){for(let n=0,r=t.length;n<r;n++)e[n]=t[n]}function Wp(e,t){let n=Lp[t];n===void 0&&(n=new Int32Array(t),Lp[t]=n);for(let r=0;r!==t;++r)n[r]=e.allocateTextureUnit();return n}function Gp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1f(this.addr,t),n[0]=t)}function Kp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Hp(n,t))return;e.uniform2fv(this.addr,t),Up(n,t)}}function qp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else if(t.r!==void 0)(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)&&(e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b);else{if(Hp(n,t))return;e.uniform3fv(this.addr,t),Up(n,t)}}function Jp(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Hp(n,t))return;e.uniform4fv(this.addr,t),Up(n,t)}}function Yp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Hp(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Up(n,t)}else{if(Hp(n,r))return;Bp.set(r),e.uniformMatrix2fv(this.addr,!1,Bp),Up(n,r)}}function Xp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Hp(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Up(n,t)}else{if(Hp(n,r))return;zp.set(r),e.uniformMatrix3fv(this.addr,!1,zp),Up(n,r)}}function Zp(e,t){let n=this.cache,r=t.elements;if(r===void 0){if(Hp(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Up(n,t)}else{if(Hp(n,r))return;Rp.set(r),e.uniformMatrix4fv(this.addr,!1,Rp),Up(n,r)}}function Qp(e,t){let n=this.cache;n[0]!==t&&(e.uniform1i(this.addr,t),n[0]=t)}function $p(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Hp(n,t))return;e.uniform2iv(this.addr,t),Up(n,t)}}function em(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Hp(n,t))return;e.uniform3iv(this.addr,t),Up(n,t)}}function tm(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Hp(n,t))return;e.uniform4iv(this.addr,t),Up(n,t)}}function nm(e,t){let n=this.cache;n[0]!==t&&(e.uniform1ui(this.addr,t),n[0]=t)}function rm(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y)&&(e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y);else{if(Hp(n,t))return;e.uniform2uiv(this.addr,t),Up(n,t)}}function im(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)&&(e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z);else{if(Hp(n,t))return;e.uniform3uiv(this.addr,t),Up(n,t)}}function am(e,t){let n=this.cache;if(t.x!==void 0)(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)&&(e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w);else{if(Hp(n,t))return;e.uniform4uiv(this.addr,t),Up(n,t)}}function om(e){return e.version===0&&(e.compareFunction=519,e.needsUpdate=!0),e}function sm(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_2D_SHADOW?om(jp):Ap,n.setTexture2D(t||a,i)}function cm(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture3D(t||Pp,i)}function lm(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i);let a;a=this.type===e.SAMPLER_CUBE_SHADOW?om(Mp):Fp,n.setTextureCube(t||a,i)}function um(e,t,n){let r=this.cache,i=n.allocateTextureUnit();r[0]!==i&&(e.uniform1i(this.addr,i),r[0]=i),n.setTexture2DArray(t||Np,i)}function dm(e){switch(e){case 5126:return Gp;case 35664:return Kp;case 35665:return qp;case 35666:return Jp;case 35674:return Yp;case 35675:return Xp;case 35676:return Zp;case 5124:case 35670:return Qp;case 35667:case 35671:return $p;case 35668:case 35672:return em;case 35669:case 35673:return tm;case 5125:return nm;case 36294:return rm;case 36295:return im;case 36296:return am;case 35678:case 36198:case 36298:case 36306:case 35682:return sm;case 35679:case 36299:case 36307:return cm;case 35680:case 36300:case 36308:case 36293:return lm;case 36289:case 36303:case 36311:case 36292:return um}}function fm(e,t){e.uniform1fv(this.addr,t)}function pm(e,t){let n=Vp(t,this.size,2);e.uniform2fv(this.addr,n)}function mm(e,t){let n=Vp(t,this.size,3);e.uniform3fv(this.addr,n)}function hm(e,t){let n=Vp(t,this.size,4);e.uniform4fv(this.addr,n)}function gm(e,t){let n=Vp(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function _m(e,t){let n=Vp(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function vm(e,t){let n=Vp(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function ym(e,t){e.uniform1iv(this.addr,t)}function bm(e,t){e.uniform2iv(this.addr,t)}function xm(e,t){e.uniform3iv(this.addr,t)}function Sm(e,t){e.uniform4iv(this.addr,t)}function Cm(e,t){e.uniform1uiv(this.addr,t)}function wm(e,t){e.uniform2uiv(this.addr,t)}function Tm(e,t){e.uniform3uiv(this.addr,t)}function Em(e,t){e.uniform4uiv(this.addr,t)}function Dm(e,t,n){let r=this.cache,i=t.length,a=Wp(n,i);Hp(r,a)||(e.uniform1iv(this.addr,a),Up(r,a));let o;o=this.type===e.SAMPLER_2D_SHADOW?om(jp):Ap;for(let e=0;e!==i;++e)n.setTexture2D(t[e]||o,a[e])}function Om(e,t,n){let r=this.cache,i=t.length,a=Wp(n,i);Hp(r,a)||(e.uniform1iv(this.addr,a),Up(r,a));for(let e=0;e!==i;++e)n.setTexture3D(t[e]||Pp,a[e])}function km(e,t,n){let r=this.cache,i=t.length,a=Wp(n,i);Hp(r,a)||(e.uniform1iv(this.addr,a),Up(r,a));let o;o=this.type===e.SAMPLER_CUBE_SHADOW?om(Mp):Fp;for(let e=0;e!==i;++e)n.setTextureCube(t[e]||o,a[e])}function Am(e,t,n){let r=this.cache,i=t.length,a=Wp(n,i);Hp(r,a)||(e.uniform1iv(this.addr,a),Up(r,a));for(let e=0;e!==i;++e)n.setTexture2DArray(t[e]||Np,a[e])}function jm(e){switch(e){case 5126:return fm;case 35664:return pm;case 35665:return mm;case 35666:return hm;case 35674:return gm;case 35675:return _m;case 35676:return vm;case 5124:case 35670:return ym;case 35667:case 35671:return bm;case 35668:case 35672:return xm;case 35669:case 35673:return Sm;case 5125:return Cm;case 36294:return wm;case 36295:return Tm;case 36296:return Em;case 35678:case 36198:case 36298:case 36306:case 35682:return Dm;case 35679:case 36299:case 36307:return Om;case 35680:case 36300:case 36308:case 36293:return km;case 36289:case 36303:case 36311:case 36292:return Am}}var Mm=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=dm(t.type)}},Nm=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jm(t.type)}},Pm=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let r=this.seq;for(let i=0,a=r.length;i!==a;++i){let a=r[i];a.setValue(e,t[a.id],n)}}},Fm=/(\w+)(\])?(\[|\.)?/g;function Im(e,t){e.seq.push(t),e.map[t.id]=t}function Lm(e,t,n){let r=e.name,i=r.length;for(Fm.lastIndex=0;;){let a=Fm.exec(r),o=Fm.lastIndex,s=a[1],c=a[2]===`]`,l=a[3];if(c&&(s|=0),l===void 0||l===`[`&&o+2===i){Im(n,l===void 0?new Mm(s,e,t):new Nm(s,e,t));break}{let e=n.map[s];e===void 0&&(e=new Pm(s),Im(n,e)),n=e}}}var Rm=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let n=e.getActiveUniform(t,r);Lm(n,e.getUniformLocation(t,n.name),this)}let r=[],i=[];for(let t of this.seq)t.type===e.SAMPLER_2D_SHADOW||t.type===e.SAMPLER_CUBE_SHADOW||t.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(t):i.push(t);r.length>0&&(this.seq=r.concat(i))}setValue(e,t,n,r){let i=this.map[t];i!==void 0&&i.setValue(e,n,r)}setOptional(e,t,n){let r=t[n];r!==void 0&&this.setValue(e,n,r)}static upload(e,t,n,r){for(let i=0,a=t.length;i!==a;++i){let a=t[i],o=n[a.id];o.needsUpdate!==!1&&a.setValue(e,o.value,r)}}static seqWithValue(e,t){let n=[];for(let r=0,i=e.length;r!==i;++r){let i=e[r];i.id in t&&n.push(i)}return n}};function zm(e,t,n){let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),r}var Bm=37297,Vm=0;function Hm(e,t){let n=e.split(`
`),r=[],i=Math.max(t-6,0),a=Math.min(t+6,n.length);for(let e=i;e<a;e++){let i=e+1;r.push(`${i===t?`>`:` `} ${i}: ${n[e]}`)}return r.join(`
`)}var Um=new W;function Wm(e){G._getMatrix(Um,G.workingColorSpace,e);let t=`mat3( ${Um.elements.map(e=>e.toFixed(4))} )`;switch(G.getTransfer(e)){case ts:return[t,`LinearTransferOETF`];case ns:return[t,`sRGBTransferOETF`];default:return z(`WebGLProgram: Unsupported color space: `,e),[t,`LinearTransferOETF`]}}function Gm(e,t,n){let r=e.getShaderParameter(t,e.COMPILE_STATUS),i=(e.getShaderInfoLog(t)||``).trim();if(r&&i===``)return``;let a=/ERROR: 0:(\d+)/.exec(i);if(a){let r=parseInt(a[1]);return n.toUpperCase()+`

`+i+`

`+Hm(e.getShaderSource(t),r)}return i}function Km(e,t){let n=Wm(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,`}`].join(`
`)}var qm={1:`Linear`,2:`Reinhard`,3:`Cineon`,4:`ACESFilmic`,6:`AgX`,7:`Neutral`,5:`Custom`};function Jm(e,t){let n=qm[t];return n===void 0?(z(`WebGLProgram: Unsupported toneMapping:`,t),`vec3 `+e+`( vec3 color ) { return LinearToneMapping( color ); }`):`vec3 `+e+`( vec3 color ) { return `+n+`ToneMapping( color ); }`}var Ym=new U;function Xm(){return G.getLuminanceCoefficients(Ym),[`float luminance( const in vec3 rgb ) {`,`	const vec3 weights = vec3( ${Ym.x.toFixed(4)}, ${Ym.y.toFixed(4)}, ${Ym.z.toFixed(4)} );`,`	return dot( weights, rgb );`,`}`].join(`
`)}function Zm(e){return[e.extensionClipCullDistance?`#extension GL_ANGLE_clip_cull_distance : require`:``,e.extensionMultiDraw?`#extension GL_ANGLE_multi_draw : require`:``].filter(eh).join(`
`)}function Qm(e){let t=[];for(let n in e){let r=e[n];r!==!1&&t.push(`#define `+n+` `+r)}return t.join(`
`)}function $m(e,t){let n={},r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<r;i++){let r=e.getActiveAttrib(t,i),a=r.name,o=1;r.type===e.FLOAT_MAT2&&(o=2),r.type===e.FLOAT_MAT3&&(o=3),r.type===e.FLOAT_MAT4&&(o=4),n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function eh(e){return e!==``}function th(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function nh(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var rh=/^[ \t]*#include +<([\w\d./]+)>/gm;function ih(e){return e.replace(rh,ah)}function ah(e,t){let n=Z[t];if(n===void 0)throw Error(`THREE.WebGLProgram: Can not resolve #include <`+t+`>`);return ih(n)}var oh=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sh(e){return e.replace(oh,ch)}function ch(e,t,n,r){let i=``;for(let e=parseInt(t);e<parseInt(n);e++)i+=r.replace(/\[\s*i\s*\]/g,`[ `+e+` ]`).replace(/UNROLLED_LOOP_INDEX/g,e);return i}function lh(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;return e.precision===`highp`?t+=`
#define HIGH_PRECISION`:e.precision===`mediump`?t+=`
#define MEDIUM_PRECISION`:e.precision===`lowp`&&(t+=`
#define LOW_PRECISION`),t}var uh={1:`SHADOWMAP_TYPE_PCF`,3:`SHADOWMAP_TYPE_VSM`};function dh(e){return uh[e.shadowMapType]||`SHADOWMAP_TYPE_BASIC`}var fh={302:`ENVMAP_MODE_REFRACTION`};function ph(e){return e.envMap===!1?`ENVMAP_MODE_REFLECTION`:fh[e.envMapMode]||`ENVMAP_MODE_REFLECTION`}var mh={0:`ENVMAP_BLENDING_MULTIPLY`,1:`ENVMAP_BLENDING_MIX`,2:`ENVMAP_BLENDING_ADD`};function hh(e){return e.envMap===!1?`ENVMAP_BLENDING_NONE`:mh[e.combine]||`ENVMAP_BLENDING_NONE`}function gh(e,t,n,r){let i=e.getContext(),a=n.defines,o=n.vertexShader,s=n.fragmentShader,c=dh(n),l=n.envMapPMREM===!0?`ENVMAP_TYPE_PMREM`:`ENVMAP_TYPE_CUBE`,u=ph(n),d=hh(n),f=Zm(n),p=Qm(a),m=i.createProgram(),h,g,_=n.glslVersion?`#version `+n.glslVersion+`
`:``;n.isRawShaderMaterial?(h=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(eh).join(`
`),h.length>0&&(h+=`
`),g=[`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p].filter(eh).join(`
`),g.length>0&&(g+=`
`)):(h=[lh(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.extensionClipCullDistance?`#define USE_CLIP_DISTANCE`:``,n.batching?`#define USE_BATCHING`:``,n.batchingColor?`#define USE_BATCHING_COLOR`:``,n.instancing?`#define USE_INSTANCING`:``,n.instancingColor?`#define USE_INSTANCING_COLOR`:``,n.instancingMorph?`#define USE_INSTANCING_MORPH`:``,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.map?`#define USE_MAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+u:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.displacementMap?`#define USE_DISPLACEMENTMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.mapUv?`#define MAP_UV `+n.mapUv:``,n.alphaMapUv?`#define ALPHAMAP_UV `+n.alphaMapUv:``,n.lightMapUv?`#define LIGHTMAP_UV `+n.lightMapUv:``,n.aoMapUv?`#define AOMAP_UV `+n.aoMapUv:``,n.emissiveMapUv?`#define EMISSIVEMAP_UV `+n.emissiveMapUv:``,n.bumpMapUv?`#define BUMPMAP_UV `+n.bumpMapUv:``,n.normalMapUv?`#define NORMALMAP_UV `+n.normalMapUv:``,n.displacementMapUv?`#define DISPLACEMENTMAP_UV `+n.displacementMapUv:``,n.metalnessMapUv?`#define METALNESSMAP_UV `+n.metalnessMapUv:``,n.roughnessMapUv?`#define ROUGHNESSMAP_UV `+n.roughnessMapUv:``,n.anisotropyMapUv?`#define ANISOTROPYMAP_UV `+n.anisotropyMapUv:``,n.clearcoatMapUv?`#define CLEARCOATMAP_UV `+n.clearcoatMapUv:``,n.clearcoatNormalMapUv?`#define CLEARCOAT_NORMALMAP_UV `+n.clearcoatNormalMapUv:``,n.clearcoatRoughnessMapUv?`#define CLEARCOAT_ROUGHNESSMAP_UV `+n.clearcoatRoughnessMapUv:``,n.diffuseRoughnessMapUv?`#define DIFFUSE_ROUGHNESSMAP_UV `+n.diffuseRoughnessMapUv:``,n.iridescenceMapUv?`#define IRIDESCENCEMAP_UV `+n.iridescenceMapUv:``,n.iridescenceThicknessMapUv?`#define IRIDESCENCE_THICKNESSMAP_UV `+n.iridescenceThicknessMapUv:``,n.sheenColorMapUv?`#define SHEEN_COLORMAP_UV `+n.sheenColorMapUv:``,n.sheenRoughnessMapUv?`#define SHEEN_ROUGHNESSMAP_UV `+n.sheenRoughnessMapUv:``,n.specularMapUv?`#define SPECULARMAP_UV `+n.specularMapUv:``,n.specularColorMapUv?`#define SPECULAR_COLORMAP_UV `+n.specularColorMapUv:``,n.specularIntensityMapUv?`#define SPECULAR_INTENSITYMAP_UV `+n.specularIntensityMapUv:``,n.transmissionMapUv?`#define TRANSMISSIONMAP_UV `+n.transmissionMapUv:``,n.thicknessMapUv?`#define THICKNESSMAP_UV `+n.thicknessMapUv:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexNormals?`#define HAS_NORMAL`:``,n.vertexColors?`#define USE_COLOR`:``,n.vertexAlphas?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.flatShading?`#define FLAT_SHADED`:``,n.skinning?`#define USE_SKINNING`:``,n.morphTargets?`#define USE_MORPHTARGETS`:``,n.morphNormals&&n.flatShading===!1?`#define USE_MORPHNORMALS`:``,n.morphColors?`#define USE_MORPHCOLORS`:``,n.morphTargetsCount>0?`#define MORPHTARGETS_TEXTURE_STRIDE `+n.morphTextureStride:``,n.morphTargetsCount>0?`#define MORPHTARGETS_COUNT `+n.morphTargetsCount:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.sizeAttenuation?`#define USE_SIZEATTENUATION`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 modelMatrix;`,`uniform mat4 modelViewMatrix;`,`uniform mat4 projectionMatrix;`,`uniform mat4 viewMatrix;`,`uniform mat3 normalMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,`#ifdef USE_INSTANCING`,`	attribute mat4 instanceMatrix;`,`#endif`,`#ifdef USE_INSTANCING_COLOR`,`	attribute vec3 instanceColor;`,`#endif`,`#ifdef USE_INSTANCING_MORPH`,`	uniform sampler2D morphTexture;`,`#endif`,`attribute vec3 position;`,`attribute vec3 normal;`,`attribute vec2 uv;`,`#ifdef USE_UV1`,`	attribute vec2 uv1;`,`#endif`,`#ifdef USE_UV2`,`	attribute vec2 uv2;`,`#endif`,`#ifdef USE_UV3`,`	attribute vec2 uv3;`,`#endif`,`#ifdef USE_TANGENT`,`	attribute vec4 tangent;`,`#endif`,`#if defined( USE_COLOR_ALPHA )`,`	attribute vec4 color;`,`#elif defined( USE_COLOR )`,`	attribute vec3 color;`,`#endif`,`#ifdef USE_SKINNING`,`	attribute vec4 skinIndex;`,`	attribute vec4 skinWeight;`,`#endif`,`
`].filter(eh).join(`
`),g=[lh(n),`#define SHADER_TYPE `+n.shaderType,`#define SHADER_NAME `+n.shaderName,p,n.useFog&&n.fog?`#define USE_FOG`:``,n.useFog&&n.fogExp2?`#define FOG_EXP2`:``,n.alphaToCoverage?`#define ALPHA_TO_COVERAGE`:``,n.map?`#define USE_MAP`:``,n.matcap?`#define USE_MATCAP`:``,n.envMap?`#define USE_ENVMAP`:``,n.envMap?`#define `+l:``,n.envMap?`#define `+u:``,n.envMap?`#define `+d:``,n.envMapPMREM?`#define ENVMAP_MAX_LOD `+n.envMapMaxLod+`.0`:``,n.envMapPMREM?`#define ENVMAP_SIZE `+n.envMapSize+`.0`:``,n.lightMap?`#define USE_LIGHTMAP`:``,n.aoMap?`#define USE_AOMAP`:``,n.bumpMap?`#define USE_BUMPMAP`:``,n.normalMap?`#define USE_NORMALMAP`:``,n.normalMapObjectSpace?`#define USE_NORMALMAP_OBJECTSPACE`:``,n.normalMapTangentSpace?`#define USE_NORMALMAP_TANGENTSPACE`:``,n.packedNormalMap?`#define USE_PACKED_NORMALMAP`:``,n.emissiveMap?`#define USE_EMISSIVEMAP`:``,n.anisotropy?`#define USE_ANISOTROPY`:``,n.anisotropyMap?`#define USE_ANISOTROPYMAP`:``,n.clearcoat?`#define USE_CLEARCOAT`:``,n.clearcoatMap?`#define USE_CLEARCOATMAP`:``,n.clearcoatRoughnessMap?`#define USE_CLEARCOAT_ROUGHNESSMAP`:``,n.clearcoatNormalMap?`#define USE_CLEARCOAT_NORMALMAP`:``,n.diffuseRoughness?`#define USE_DIFFUSE_ROUGHNESS`:``,n.diffuseRoughnessMap?`#define USE_DIFFUSE_ROUGHNESSMAP`:``,n.dispersion?`#define USE_DISPERSION`:``,n.retroreflection?`#define USE_RETROREFLECTION`:``,n.iridescence?`#define USE_IRIDESCENCE`:``,n.iridescenceMap?`#define USE_IRIDESCENCEMAP`:``,n.iridescenceThicknessMap?`#define USE_IRIDESCENCE_THICKNESSMAP`:``,n.specularMap?`#define USE_SPECULARMAP`:``,n.specularColorMap?`#define USE_SPECULAR_COLORMAP`:``,n.specularIntensityMap?`#define USE_SPECULAR_INTENSITYMAP`:``,n.roughnessMap?`#define USE_ROUGHNESSMAP`:``,n.metalnessMap?`#define USE_METALNESSMAP`:``,n.alphaMap?`#define USE_ALPHAMAP`:``,n.alphaTest?`#define USE_ALPHATEST`:``,n.alphaHash?`#define USE_ALPHAHASH`:``,n.sheen?`#define USE_SHEEN`:``,n.sheenColorMap?`#define USE_SHEEN_COLORMAP`:``,n.sheenRoughnessMap?`#define USE_SHEEN_ROUGHNESSMAP`:``,n.transmission?`#define USE_TRANSMISSION`:``,n.transmissionMap?`#define USE_TRANSMISSIONMAP`:``,n.thicknessMap?`#define USE_THICKNESSMAP`:``,n.vertexTangents&&n.flatShading===!1?`#define USE_TANGENT`:``,n.vertexColors||n.instancingColor?`#define USE_COLOR`:``,n.vertexAlphas||n.batchingColor?`#define USE_COLOR_ALPHA`:``,n.vertexUv1s?`#define USE_UV1`:``,n.vertexUv2s?`#define USE_UV2`:``,n.vertexUv3s?`#define USE_UV3`:``,n.pointsUvs?`#define USE_POINTS_UV`:``,n.gradientMap?`#define USE_GRADIENTMAP`:``,n.flatShading?`#define FLAT_SHADED`:``,n.doubleSided?`#define DOUBLE_SIDED`:``,n.flipSided?`#define FLIP_SIDED`:``,n.shadowMapEnabled?`#define USE_SHADOWMAP`:``,n.shadowMapEnabled?`#define `+c:``,n.premultipliedAlpha?`#define PREMULTIPLIED_ALPHA`:``,n.numLightProbes>0?`#define USE_LIGHT_PROBES`:``,n.decodeVideoTexture?`#define DECODE_VIDEO_TEXTURE`:``,n.decodeVideoTextureEmissive?`#define DECODE_VIDEO_TEXTURE_EMISSIVE`:``,n.logarithmicDepthBuffer?`#define USE_LOGARITHMIC_DEPTH_BUFFER`:``,n.reversedDepthBuffer?`#define USE_REVERSED_DEPTH_BUFFER`:``,`uniform mat4 viewMatrix;`,`uniform vec3 cameraPosition;`,`uniform bool isOrthographic;`,n.toneMapping===0?``:`#define TONE_MAPPING`,n.toneMapping===0?``:Z.tonemapping_pars_fragment,n.toneMapping===0?``:Jm(`toneMapping`,n.toneMapping),n.dithering?`#define DITHERING`:``,n.opaque?`#define OPAQUE`:``,Z.colorspace_pars_fragment,Km(`linearToOutputTexel`,n.outputColorSpace),Xm(),n.useDepthPacking?`#define DEPTH_PACKING `+n.depthPacking:``,`
`].filter(eh).join(`
`)),o=ih(o),o=th(o,n),o=nh(o,n),s=ih(s),s=th(s,n),s=nh(s,n),o=sh(o),s=sh(s),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,h=[f,`#define attribute in`,`#define varying out`,`#define texture2D texture`].join(`
`)+`
`+h,g=[`#define varying in`,n.glslVersion===`300 es`?``:`layout(location = 0) out highp vec4 pc_fragColor;`,n.glslVersion===`300 es`?``:`#define gl_FragColor pc_fragColor`,`#define gl_FragDepthEXT gl_FragDepth`,`#define texture2D texture`,`#define textureCube texture`,`#define texture2DProj textureProj`,`#define texture2DLodEXT textureLod`,`#define texture2DProjLodEXT textureProjLod`,`#define textureCubeLodEXT textureLod`,`#define texture2DGradEXT textureGrad`,`#define texture2DProjGradEXT textureProjGrad`,`#define textureCubeGradEXT textureGrad`].join(`
`)+`
`+g);let v=_+h+o,y=_+g+s,b=zm(i,i.VERTEX_SHADER,v),x=zm(i,i.FRAGMENT_SHADER,y);i.attachShader(m,b),i.attachShader(m,x),n.index0AttributeName===void 0?n.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,`position`):i.bindAttribLocation(m,0,n.index0AttributeName),i.linkProgram(m);function S(t){if(e.debug.checkShaderErrors){let n=i.getProgramInfoLog(m)||``,r=i.getShaderInfoLog(b)||``,a=i.getShaderInfoLog(x)||``,o=n.trim(),s=r.trim(),c=a.trim(),l=!0,u=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1){if(l=!1,typeof e.debug.onShaderError==`function`)e.debug.onShaderError(i,m,b,x);else{let e=Gm(i,b,`vertex`),n=Gm(i,x,`fragment`);B(`WebGLProgram: Shader Error `+i.getError()+` - VALIDATE_STATUS `+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+t.name+`
Material Type: `+t.type+`

Program Info Log: `+o+`
`+e+`
`+n)}}else o===``?(s===``||c===``)&&(u=!1):z(`WebGLProgram: Program Info Log:`,o);u&&(t.diagnostics={runnable:l,programLog:o,vertexShader:{log:s,prefix:h},fragmentShader:{log:c,prefix:g}})}i.deleteShader(b),i.deleteShader(x),C=new Rm(i,m),w=$m(i,m)}let C;this.getUniforms=function(){return C===void 0&&S(this),C};let w;this.getAttributes=function(){return w===void 0&&S(this),w};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=i.getProgramParameter(m,Bm)),T},this.destroy=function(){r.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=Vm++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=b,this.fragmentShader=x,this}var _h=0,vh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(n)===!1&&(r.add(n),n.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let e of t)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new yh(e),t.set(e,n)),n}},yh=class{constructor(e){this.id=_h++,this.code=e,this.usedTimes=0}};function bh(e){return e===1030||e===37490||e===36285}function xh(e,t,n,r,i,a){let o=new Cc,s=new vh,c=new Set,l=[],u=new Map,d=r.logarithmicDepthBuffer,f={MeshDepthMaterial:`depth`,MeshDistanceMaterial:`distance`,MeshNormalMaterial:`normal`,MeshBasicMaterial:`basic`,MeshLambertMaterial:`lambert`,MeshPhongMaterial:`phong`,MeshToonMaterial:`toon`,MeshStandardMaterial:`physical`,MeshPhysicalMaterial:`physical`,MeshMatcapMaterial:`matcap`,LineBasicMaterial:`basic`,LineDashedMaterial:`dashed`,PointsMaterial:`points`,ShadowMaterial:`shadow`,SpriteMaterial:`sprite`};function p(e){return c.add(e),e===0?`uv`:`uv${e}`}function m(i,o,l,u,m,h){let g=u.fog,_=m.geometry,v=i.isMeshStandardMaterial||i.isMeshLambertMaterial||i.isMeshPhongMaterial?u.environment:null,y=i.isMeshStandardMaterial||i.isMeshLambertMaterial&&!i.envMap||i.isMeshPhongMaterial&&!i.envMap,b=t.get(i.envMap||v,y),x=f[i.type],S=r.precision;i.precision!==null&&(S=r.getMaxPrecision(i.precision),S!==i.precision&&z(`WebGLProgram.getParameters:`,i.precision,`not supported, using`,S,`instead.`));let C=_.morphAttributes.position||_.morphAttributes.normal||_.morphAttributes.color,w=C===void 0?0:C.length,T=0;_.morphAttributes.position!==void 0&&(T=1),_.morphAttributes.normal!==void 0&&(T=2),_.morphAttributes.color!==void 0&&(T=3);let E,D,O,k;if(x){let e=Yf[x];E=e.vertexShader,D=e.fragmentShader}else{E=i.vertexShader,D=i.fragmentShader;let e=s.getVertexShaderStage(i),t=s.getFragmentShaderStage(i);s.update(i,e,t),O=e.id,k=t.id}let A=e.getRenderTarget(),j=e.state.buffers.depth.getReversed(),ee=m.isInstancedMesh===!0,M=m.isBatchedMesh===!0,te=!!i.map,ne=!!i.matcap,re=!!b,ie=re&&b.isPMREMTexture===!0,ae=!!i.aoMap,oe=!!i.lightMap,se=!!i.bumpMap&&i.wireframe===!1,N=!!i.normalMap,ce=!!i.displacementMap,P=!!i.emissiveMap,le=!!i.metalnessMap,ue=!!i.roughnessMap,de=i.anisotropy>0,fe=i.clearcoat>0,pe=i.diffuseRoughness>0,me=i.dispersion>0,he=i.retroreflectivity>0,ge=i.iridescence>0,_e=i.sheen>0,ve=i.transmission>0,ye=de&&!!i.anisotropyMap,be=fe&&!!i.clearcoatMap,xe=fe&&!!i.clearcoatNormalMap,Se=fe&&!!i.clearcoatRoughnessMap,Ce=pe&&!!i.diffuseRoughnessMap,F=ge&&!!i.iridescenceMap,we=ge&&!!i.iridescenceThicknessMap,Te=_e&&!!i.sheenColorMap,Ee=_e&&!!i.sheenRoughnessMap,I=!!i.specularMap,De=!!i.specularColorMap,L=!!i.specularIntensityMap,R=ve&&!!i.transmissionMap,Oe=ve&&!!i.thicknessMap,ke=!!i.gradientMap,Ae=!!i.alphaMap,je=i.alphaTest>0,Me=!!i.alphaHash,Ne=!!i.extensions,Pe=0;i.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Pe=e.toneMapping);let Fe=ie?b.isCompressedCubeTexture?b.image[0].mipmaps:b.mipmaps:null,Ie={shaderID:x,shaderType:i.type,shaderName:i.name,vertexShader:E,fragmentShader:D,defines:i.defines,customVertexShaderID:O,customFragmentShaderID:k,isRawShaderMaterial:i.isRawShaderMaterial===!0,glslVersion:i.glslVersion,precision:S,batching:M,batchingColor:M&&m._colorsTexture!==null,instancing:ee,instancingColor:ee&&m.instanceColor!==null,instancingMorph:ee&&m.morphTexture!==null,outputColorSpace:A===null?e.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:G.workingColorSpace,alphaToCoverage:!!i.alphaToCoverage,map:te,matcap:ne,envMap:re,envMapMode:re&&b.mapping,envMapPMREM:ie,envMapMaxLod:ie?Fe.length-1:null,envMapSize:ie?Fe[0].width:null,aoMap:ae,lightMap:oe,bumpMap:se,normalMap:N,displacementMap:ce,emissiveMap:P,normalMapObjectSpace:N&&i.normalMapType===1,normalMapTangentSpace:N&&i.normalMapType===0,packedNormalMap:N&&i.normalMapType===0&&bh(i.normalMap.format),metalnessMap:le,roughnessMap:ue,anisotropy:de,anisotropyMap:ye,clearcoat:fe,clearcoatMap:be,clearcoatNormalMap:xe,clearcoatRoughnessMap:Se,diffuseRoughness:pe,diffuseRoughnessMap:Ce,dispersion:me,retroreflection:he,iridescence:ge,iridescenceMap:F,iridescenceThicknessMap:we,sheen:_e,sheenColorMap:Te,sheenRoughnessMap:Ee,specularMap:I,specularColorMap:De,specularIntensityMap:L,transmission:ve,transmissionMap:R,thicknessMap:Oe,gradientMap:ke,opaque:i.transparent===!1&&i.blending===1&&i.alphaToCoverage===!1,alphaMap:Ae,alphaTest:je,alphaHash:Me,combine:i.combine,mapUv:te&&p(i.map.channel),aoMapUv:ae&&p(i.aoMap.channel),lightMapUv:oe&&p(i.lightMap.channel),bumpMapUv:se&&p(i.bumpMap.channel),normalMapUv:N&&p(i.normalMap.channel),displacementMapUv:ce&&p(i.displacementMap.channel),emissiveMapUv:P&&p(i.emissiveMap.channel),metalnessMapUv:le&&p(i.metalnessMap.channel),roughnessMapUv:ue&&p(i.roughnessMap.channel),anisotropyMapUv:ye&&p(i.anisotropyMap.channel),clearcoatMapUv:be&&p(i.clearcoatMap.channel),clearcoatNormalMapUv:xe&&p(i.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&p(i.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:Ce&&p(i.diffuseRoughnessMap.channel),iridescenceMapUv:F&&p(i.iridescenceMap.channel),iridescenceThicknessMapUv:we&&p(i.iridescenceThicknessMap.channel),sheenColorMapUv:Te&&p(i.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&p(i.sheenRoughnessMap.channel),specularMapUv:I&&p(i.specularMap.channel),specularColorMapUv:De&&p(i.specularColorMap.channel),specularIntensityMapUv:L&&p(i.specularIntensityMap.channel),transmissionMapUv:R&&p(i.transmissionMap.channel),thicknessMapUv:Oe&&p(i.thicknessMap.channel),alphaMapUv:Ae&&p(i.alphaMap.channel),vertexTangents:!!_.attributes.tangent&&(N||de),vertexNormals:!!_.attributes.normal,vertexColors:i.vertexColors,vertexAlphas:i.vertexColors===!0&&!!_.attributes.color&&_.attributes.color.itemSize===4,pointsUvs:m.isPoints===!0&&!!_.attributes.uv&&(te||Ae),fog:!!g,useFog:i.fog===!0,fogExp2:!!g&&g.isFogExp2,flatShading:i.wireframe===!1&&(i.flatShading===!0||_.attributes.normal===void 0&&N===!1&&(i.isMeshLambertMaterial||i.isMeshPhongMaterial||i.isMeshStandardMaterial||i.isMeshPhysicalMaterial)),sizeAttenuation:i.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:j,skinning:m.isSkinnedMesh===!0,hasPositionAttribute:_.attributes.position!==void 0,morphTargets:_.morphAttributes.position!==void 0,morphNormals:_.morphAttributes.normal!==void 0,morphColors:_.morphAttributes.color!==void 0,morphTargetsCount:w,morphTextureStride:T,numSunLights:o.sun.length,numDirLights:o.directional.length,numPointLights:o.point.length,numSpotLights:o.spot.length,numSpotLightMaps:o.spotLightMap.length,numRectAreaLights:o.rectArea.length,numHemiLights:o.hemi.length,numSunLightShadows:o.sunShadowMap.length,numDirLightShadows:o.directionalShadowMap.length,numPointLightShadows:o.pointShadowMap.length,numSpotLightShadows:o.spotShadowMap.length,numSpotLightShadowsWithMaps:o.numSpotLightShadowsWithMaps,numLightProbes:o.numLightProbes,numLightProbeGrids:h.filter(e=>e.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:i.dithering,shadowMapEnabled:e.shadowMap.enabled&&l.length>0,shadowMapType:e.shadowMap.type,toneMapping:Pe,decodeVideoTexture:te&&i.map.isVideoTexture===!0&&G.getTransfer(i.map.colorSpace)===`srgb`,decodeVideoTextureEmissive:P&&i.emissiveMap.isVideoTexture===!0&&G.getTransfer(i.emissiveMap.colorSpace)===`srgb`,premultipliedAlpha:i.premultipliedAlpha,doubleSided:i.side===2,flipSided:i.side===1,useDepthPacking:i.depthPacking>=0,depthPacking:i.depthPacking||0,index0AttributeName:i.index0AttributeName,extensionClipCullDistance:Ne&&i.extensions.clipCullDistance===!0&&n.has(`WEBGL_clip_cull_distance`),extensionMultiDraw:(Ne&&i.extensions.multiDraw===!0||M)&&n.has(`WEBGL_multi_draw`),rendererExtensionParallelShaderCompile:n.has(`KHR_parallel_shader_compile`),customProgramCacheKey:i.customProgramCacheKey()};return Ie.vertexUv1s=c.has(1),Ie.vertexUv2s=c.has(2),Ie.vertexUv3s=c.has(3),c.clear(),Ie}function h(t){let n=[];if(t.shaderID?n.push(t.shaderID):(n.push(t.customVertexShaderID),n.push(t.customFragmentShaderID)),t.defines!==void 0)for(let e in t.defines)n.push(e),n.push(t.defines[e]);return t.isRawShaderMaterial===!1&&(g(n,t),_(n,t),n.push(e.outputColorSpace)),n.push(t.customProgramCacheKey),n.join()}function g(e,t){e.push(t.precision),e.push(t.outputColorSpace),e.push(t.envMapMode),e.push(t.envMapPMREM),e.push(t.envMapMaxLod),e.push(t.envMapSize),e.push(t.mapUv),e.push(t.alphaMapUv),e.push(t.lightMapUv),e.push(t.aoMapUv),e.push(t.bumpMapUv),e.push(t.normalMapUv),e.push(t.displacementMapUv),e.push(t.emissiveMapUv),e.push(t.metalnessMapUv),e.push(t.roughnessMapUv),e.push(t.anisotropyMapUv),e.push(t.clearcoatMapUv),e.push(t.clearcoatNormalMapUv),e.push(t.clearcoatRoughnessMapUv),e.push(t.diffuseRoughnessMapUv),e.push(t.iridescenceMapUv),e.push(t.iridescenceThicknessMapUv),e.push(t.sheenColorMapUv),e.push(t.sheenRoughnessMapUv),e.push(t.specularMapUv),e.push(t.specularColorMapUv),e.push(t.specularIntensityMapUv),e.push(t.transmissionMapUv),e.push(t.thicknessMapUv),e.push(t.combine),e.push(t.fogExp2),e.push(t.sizeAttenuation),e.push(t.morphTargetsCount),e.push(t.numSunLights),e.push(t.numDirLights),e.push(t.numPointLights),e.push(t.numSpotLights),e.push(t.numSpotLightMaps),e.push(t.numHemiLights),e.push(t.numRectAreaLights),e.push(t.numSunLightShadows),e.push(t.numDirLightShadows),e.push(t.numPointLightShadows),e.push(t.numSpotLightShadows),e.push(t.numSpotLightShadowsWithMaps),e.push(t.numLightProbes),e.push(t.numLightProbeGrids),e.push(t.shadowMapType),e.push(t.toneMapping),e.push(t.numClippingPlanes),e.push(t.numClipIntersection),e.push(t.depthPacking)}function _(e,t){o.disableAll(),t.instancing&&o.enable(0),t.instancingColor&&o.enable(1),t.instancingMorph&&o.enable(2),t.matcap&&o.enable(3),t.envMap&&o.enable(4),t.normalMapObjectSpace&&o.enable(5),t.normalMapTangentSpace&&o.enable(6),t.clearcoat&&o.enable(7),t.iridescence&&o.enable(8),t.alphaTest&&o.enable(9),t.vertexColors&&o.enable(10),t.vertexAlphas&&o.enable(11),t.vertexUv1s&&o.enable(12),t.vertexUv2s&&o.enable(13),t.vertexUv3s&&o.enable(14),t.vertexTangents&&o.enable(15),t.anisotropy&&o.enable(16),t.alphaHash&&o.enable(17),t.batching&&o.enable(18),t.dispersion&&o.enable(19),t.retroreflection&&o.enable(24),t.diffuseRoughness&&o.enable(25),t.batchingColor&&o.enable(20),t.gradientMap&&o.enable(21),t.packedNormalMap&&o.enable(22),t.vertexNormals&&o.enable(23),e.push(o.mask),o.disableAll(),t.fog&&o.enable(0),t.useFog&&o.enable(1),t.flatShading&&o.enable(2),t.logarithmicDepthBuffer&&o.enable(3),t.reversedDepthBuffer&&o.enable(4),t.skinning&&o.enable(5),t.morphTargets&&o.enable(6),t.morphNormals&&o.enable(7),t.morphColors&&o.enable(8),t.premultipliedAlpha&&o.enable(9),t.shadowMapEnabled&&o.enable(10),t.doubleSided&&o.enable(11),t.flipSided&&o.enable(12),t.useDepthPacking&&o.enable(13),t.dithering&&o.enable(14),t.transmission&&o.enable(15),t.sheen&&o.enable(16),t.opaque&&o.enable(17),t.pointsUvs&&o.enable(18),t.decodeVideoTexture&&o.enable(19),t.decodeVideoTextureEmissive&&o.enable(20),t.alphaToCoverage&&o.enable(21),t.numLightProbeGrids>0&&o.enable(22),t.hasPositionAttribute&&o.enable(23),e.push(o.mask)}function v(e){let t=f[e.type],n;if(t){let e=Yf[t];n=Md.clone(e.uniforms)}else n=e.uniforms;return n}function y(t,n){let r=u.get(n);return r===void 0?(r=new gh(e,n,t,i),l.push(r),u.set(n,r)):++r.usedTimes,r}function b(e){if(--e.usedTimes===0){let t=l.indexOf(e);l[t]=l[l.length-1],l.pop(),u.delete(e.cacheKey),e.destroy()}}function x(e){s.remove(e)}function S(){s.dispose()}return{getParameters:m,getProgramCacheKey:h,getUniforms:v,acquireProgram:y,releaseProgram:b,releaseShaderCache:x,programs:l,dispose:S}}function Sh(){let e=new WeakMap;function t(t){return e.has(t)}function n(t){let n=e.get(t);return n===void 0&&(n={},e.set(t,n)),n}function r(t){e.delete(t)}function i(t,n,r){e.get(t)[n]=r}function a(){e=new WeakMap}return{has:t,get:n,remove:r,update:i,dispose:a}}function Ch(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.material.id===t.material.id?e.materialVariant===t.materialVariant?e.z===t.z?e.id-t.id:e.z-t.z:e.materialVariant-t.materialVariant:e.material.id-t.material.id:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function wh(e,t){return e.groupOrder===t.groupOrder?e.renderOrder===t.renderOrder?e.z===t.z?e.id-t.id:t.z-e.z:e.renderOrder-t.renderOrder:e.groupOrder-t.groupOrder}function Th(){let e=[],t=0,n=[],r=[],i=[];function a(){t=0,n.length=0,r.length=0,i.length=0}function o(e){let t=0;return e.isInstancedMesh&&(t+=2),e.isSkinnedMesh&&(t+=1),t}function s(n,r,i,a,s,c){let l=e[t];return l===void 0?(l={id:n.id,object:n,geometry:r,material:i,materialVariant:o(n),groupOrder:a,renderOrder:n.renderOrder,z:s,group:c},e[t]=l):(l.id=n.id,l.object=n,l.geometry=r,l.material=i,l.materialVariant=o(n),l.groupOrder=a,l.renderOrder=n.renderOrder,l.z=s,l.group=c),t++,l}function c(e,t,a,o,c,l,u){u.reversedDepth===!0&&(c=-c);let d=s(e,t,a,o,c,l);a.transmission>0?r.push(d):a.transparent===!0?i.push(d):n.push(d)}function l(e,t,a,o,c,l){let u=s(e,t,a,o,c,l);a.transmission>0?r.unshift(u):a.transparent===!0?i.unshift(u):n.unshift(u)}function u(e,t){n.length>1&&n.sort(e||Ch),r.length>1&&r.sort(t||wh),i.length>1&&i.sort(t||wh)}function d(){for(let n=t,r=e.length;n<r;n++){let t=e[n];if(t.id===null)break;t.id=null,t.object=null,t.geometry=null,t.material=null,t.group=null}}return{opaque:n,transmissive:r,transparent:i,init:a,push:c,unshift:l,finish:d,sort:u}}function Eh(){let e=new WeakMap;function t(t,n){let r=e.get(t),i;return r===void 0?(i=new Th,e.set(t,[i])):n>=r.length?(i=new Th,r.push(i)):i=r[n],i}function n(){e=new WeakMap}return{get:t,dispose:n}}function Dh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={direction:new U,color:new q};break;case`SpotLight`:n={position:new U,direction:new U,color:new q,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case`PointLight`:n={position:new U,color:new q,distance:0,decay:0};break;case`HemisphereLight`:n={direction:new U,skyColor:new q,groundColor:new q};break;case`RectAreaLight`:n={color:new q,position:new U,halfWidth:new U,halfHeight:new U}}return e[t.id]=n,n}}}function Oh(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case`SunLight`:case`DirectionalLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H};break;case`SpotLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H};break;case`PointLight`:n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new H,shadowCameraNear:1,shadowCameraFar:1e3}}return e[t.id]=n,n}}}var kh=0;function Ah(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+ +!!t.map-!!e.map}function jh(e){let t=new Dh,n=Oh(),r={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let e=0;e<9;e++)r.probe.push(new U);let i=new U,a=new fc,o=new fc;function s(i){let a=0,o=0,s=0;for(let e=0;e<9;e++)r.probe[e].set(0,0,0);let c=0,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y=0,b=0,x=0;i.sort(Ah);for(let e=0,S=i.length;e<S;e++){let S=i[e],C=S.color,w=S.intensity,T=S.distance,E=null;if(S.shadow&&S.shadow.map&&(E=S.shadow.map.texture.format===1030?S.shadow.map.texture:S.shadow.map.depthTexture||S.shadow.map.texture),S.isAmbientLight)a+=C.r*w,o+=C.g*w,s+=C.b*w;else if(S.isLightProbe){for(let e=0;e<9;e++)r.probe[e].addScaledVector(S.sh.coefficients[e],w);x++}else if(S.isSunLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()),r.sunShadow[l]=t,r.sunShadowMap[l]=E;let i=e.getViewportCount();for(let t=0;t<i;t++)r.sunShadowMatrix[u+t]=e.getMatrix(t),r.sunShadowCascade[u+t]=e._cascadeData[t];u+=i,l++}r.sun[c]=e,c++}else if(S.isDirectionalLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,r.directionalShadow[d]=t,r.directionalShadowMap[d]=E,r.directionalShadowMatrix[d]=S.shadow.matrix,g++}r.directional[d]=e,d++}else if(S.isSpotLight){let e=t.get(S);e.position.setFromMatrixPosition(S.matrixWorld),e.color.copy(C).multiplyScalar(w),e.distance=T,e.coneCos=Math.cos(S.angle),e.penumbraCos=Math.cos(S.angle*(1-S.penumbra)),e.decay=S.decay,r.spot[p]=e;let i=S.shadow;if(S.map&&(r.spotLightMap[y]=S.map,y++,i.updateMatrices(S),S.castShadow&&b++),r.spotLightMatrix[p]=i.matrix,S.castShadow){let e=n.get(S);e.shadowIntensity=i.intensity,e.shadowBias=i.bias,e.shadowNormalBias=i.normalBias,e.shadowRadius=i.radius,e.shadowMapSize=i.mapSize,r.spotShadow[p]=e,r.spotShadowMap[p]=E,v++}p++}else if(S.isRectAreaLight){let e=t.get(S);e.color.copy(C).multiplyScalar(w),e.halfWidth.set(S.width*.5,0,0),e.halfHeight.set(0,S.height*.5,0),r.rectArea[m]=e,m++}else if(S.isPointLight){let e=t.get(S);if(e.color.copy(S.color).multiplyScalar(S.intensity),e.distance=S.distance,e.decay=S.decay,S.castShadow){let e=S.shadow,t=n.get(S);t.shadowIntensity=e.intensity,t.shadowBias=e.bias,t.shadowNormalBias=e.normalBias,t.shadowRadius=e.radius,t.shadowMapSize=e.mapSize,t.shadowCameraNear=e.camera.near,t.shadowCameraFar=e.camera.far,r.pointShadow[f]=t,r.pointShadowMap[f]=E,r.pointShadowMatrix[f]=S.shadow.matrix,_++}r.point[f]=e,f++}else if(S.isHemisphereLight){let e=t.get(S);e.skyColor.copy(S.color).multiplyScalar(w),e.groundColor.copy(S.groundColor).multiplyScalar(w),r.hemi[h]=e,h++}}m>0&&(e.has(`OES_texture_float_linear`)===!0?(r.rectAreaLTC1=Q.LTC_FLOAT_1,r.rectAreaLTC2=Q.LTC_FLOAT_2):(r.rectAreaLTC1=Q.LTC_HALF_1,r.rectAreaLTC2=Q.LTC_HALF_2)),r.ambient[0]=a,r.ambient[1]=o,r.ambient[2]=s;let S=r.hash;(S.sunLength!==c||S.directionalLength!==d||S.pointLength!==f||S.spotLength!==p||S.rectAreaLength!==m||S.hemiLength!==h||S.numSunShadows!==l||S.numDirectionalShadows!==g||S.numPointShadows!==_||S.numSpotShadows!==v||S.numSpotMaps!==y||S.numLightProbes!==x)&&(r.sun.length=c,r.directional.length=d,r.spot.length=p,r.rectArea.length=m,r.point.length=f,r.hemi.length=h,r.sunShadow.length=l,r.sunShadowMap.length=l,r.sunShadowMatrix.length=u,r.sunShadowCascade.length=u,r.directionalShadow.length=g,r.directionalShadowMap.length=g,r.directionalShadowMatrix.length=g,r.pointShadow.length=_,r.pointShadowMap.length=_,r.pointShadowMatrix.length=_,r.spotShadow.length=v,r.spotShadowMap.length=v,r.spotLightMatrix.length=v+y-b,r.spotLightMap.length=y,r.numSpotLightShadowsWithMaps=b,r.numLightProbes=x,S.sunLength=c,S.directionalLength=d,S.pointLength=f,S.spotLength=p,S.rectAreaLength=m,S.hemiLength=h,S.numSunShadows=l,S.numDirectionalShadows=g,S.numPointShadows=_,S.numSpotShadows=v,S.numSpotMaps=y,S.numLightProbes=x,r.version=kh++)}function c(e,t){let n=0,s=0,c=0,l=0,u=0,d=0,f=t.matrixWorldInverse;for(let t=0,p=e.length;t<p;t++){let p=e[t];if(p.isSunLight){let e=r.sun[n];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),n++}else if(p.isDirectionalLight){let e=r.directional[s];e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),s++}else if(p.isSpotLight){let e=r.spot[l];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),e.direction.setFromMatrixPosition(p.matrixWorld),i.setFromMatrixPosition(p.target.matrixWorld),e.direction.sub(i),e.direction.transformDirection(f),l++}else if(p.isRectAreaLight){let e=r.rectArea[u];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),o.identity(),a.copy(p.matrixWorld),a.premultiply(f),o.extractRotation(a),e.halfWidth.set(p.width*.5,0,0),e.halfHeight.set(0,p.height*.5,0),e.halfWidth.applyMatrix4(o),e.halfHeight.applyMatrix4(o),u++}else if(p.isPointLight){let e=r.point[c];e.position.setFromMatrixPosition(p.matrixWorld),e.position.applyMatrix4(f),c++}else if(p.isHemisphereLight){let e=r.hemi[d];e.direction.setFromMatrixPosition(p.matrixWorld),e.direction.transformDirection(f),d++}}}return{setup:s,setupView:c,state:r}}function Mh(e){let t=new jh(e),n=[],r=[],i=[];function a(e){u.camera=e,n.length=0,r.length=0,i.length=0}function o(e){e.isLightProbeGrid?i.push(e):n.push(e)}function s(e){r.push(e)}function c(){t.setup(n),i.sort((e,t)=>e.priority-t.priority||e.id-t.id)}function l(e){t.setupView(n,e)}let u={lightsArray:n,shadowsArray:r,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:u,setupLights:c,setupLightsView:l,pushLight:o,pushShadow:s}}function Nh(e){let t=new WeakMap;function n(n,r=0){let i=t.get(n),a;return i===void 0?(a=new Mh(e),t.set(n,[a])):r>=i.length?(a=new Mh(e),i.push(a)):a=i[r],a}function r(){t=new WeakMap}return{get:n,dispose:r}}var Ph=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fh=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Ih=[new U(1,0,0),new U(-1,0,0),new U(0,1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1)],Lh=[new U(0,-1,0),new U(0,-1,0),new U(0,0,1),new U(0,0,-1),new U(0,-1,0),new U(0,-1,0)],Rh=new fc,zh=new U,Bh=new U;function Vh(e,t,n){let r=new Iu,i=new H,a=new H,o=new sc,s=new zd,c=new Bd,l={},u=n.maxTextureSize,d={0:1,1:0,2:2},f=new Fd({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new H},radius:{value:4}},vertexShader:Ph,fragmentShader:Fh}),p=f.clone();p.defines.HORIZONTAL_PASS=1;let m=new Bl;m.setAttribute(`position`,new El(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let h=new Y(m,f),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let _=this.type;this.render=function(t,n,s){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||t.length===0)return;this.type===2&&(z(`WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.`),this.type=1);let c=e.getRenderTarget(),l=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),f=e.state;f.setBlending(0),f.buffers.depth.getReversed()===!0?f.buffers.color.setClear(0,0,0,0):f.buffers.color.setClear(1,1,1,1),f.buffers.depth.setTest(!0),f.setScissorTest(!1);let p=_!==this.type;p&&n.traverse(function(e){e.material&&(Array.isArray(e.material)?e.material.forEach(e=>e.needsUpdate=!0):e.material.needsUpdate=!0)});for(let c=0,l=t.length;c<l;c++){let l=t[c],d=l.shadow;if(d===void 0){z(`WebGLShadowMap:`,l,`has no shadow.`);continue}if(d.autoUpdate===!1&&d.needsUpdate===!1)continue;i.copy(d.mapSize);let m=d.getFrameExtents();i.multiply(m),a.copy(d.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(a.x=Math.floor(u/m.x),i.x=a.x*m.x,d.mapSize.x=a.x),i.y>u&&(a.y=Math.floor(u/m.y),i.y=a.y*m.y,d.mapSize.y=a.y));let h=e.state.buffers.depth.getReversed();if(d.camera._reversedDepth=h,d.map===null||p===!0){if(d.map!==null&&(d.map.depthTexture!==null&&(d.map.depthTexture.dispose(),d.map.depthTexture=null),d.map.dispose()),this.type===3){if(l.isPointLight){z(`WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.`);continue}d.map=new lc(i.x,i.y,{format:ao,type:Ka,minFilter:Ia,magFilter:Ia,generateMipmaps:!1}),d.map.texture.name=l.name+`.shadowMap`,d.map.depthTexture=new Vu(i.x,i.y,Ga),d.map.depthTexture.name=l.name+`.shadowMapDepth`,d.map.depthTexture.format=to,d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Na,d.map.depthTexture.magFilter=Na}else l.isPointLight?(d.map=new ip(i.x),d.map.depthTexture=new Hu(i.x,Wa)):(d.map=new lc(i.x,i.y),d.map.depthTexture=new Vu(i.x,i.y,Wa)),d.map.depthTexture.name=l.name+`.shadowMap`,d.map.depthTexture.format=to,this.type===1?(d.map.depthTexture.compareFunction=h?518:515,d.map.depthTexture.minFilter=Ia,d.map.depthTexture.magFilter=Ia):(d.map.depthTexture.compareFunction=null,d.map.depthTexture.minFilter=Na,d.map.depthTexture.magFilter=Na);d.camera.updateProjectionMatrix()}d.map.isWebGLCubeRenderTarget!==!0&&(d.map.width!==i.x||d.map.height!==i.y)&&d.map.setSize(i.x,i.y);let g=d.map.isWebGLCubeRenderTarget?6:d.getViewportCount();l.isPointLight!==!0&&d.updateMatrices(l,s);let _=d.camera.layers.mask&4294967294?d.camera.layers:s.layers;for(let t=0;t<g;t++){let i=d.getCamera(t);if(l.isPointLight){let e=d.camera,n=d.matrix,r=l.distance||e.far;r!==e.far&&(e.far=r,e.updateProjectionMatrix()),zh.setFromMatrixPosition(l.matrixWorld),e.position.copy(zh),Bh.copy(e.position),Bh.add(Ih[t]),e.up.copy(Lh[t]),e.lookAt(Bh),e.updateMatrixWorld(),n.makeTranslation(-zh.x,-zh.y,-zh.z),Rh.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),d._frustum.setFromProjectionMatrix(Rh,e.coordinateSystem,e.reversedDepth)}if(d.map.isWebGLCubeRenderTarget)e.setRenderTarget(d.map,t),e.clear();else{t===0&&(e.setRenderTarget(d.map),e.clear());let n=d.getViewport(t);o.set(a.x*n.x,a.y*n.y,a.x*n.z,a.y*n.w),f.viewport(o)}r=d.getFrustum(t),b(n,s,i,l,_,this.type)}d.isPointLightShadow!==!0&&this.type===3&&v(d,s),d.needsUpdate=!1}_=this.type,g.needsUpdate=!1,e.setRenderTarget(c,l,d)};function v(n,r){let a=t.update(h);f.defines.VSM_SAMPLES!==n.blurSamples&&(f.defines.VSM_SAMPLES=n.blurSamples,p.defines.VSM_SAMPLES=n.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),n.mapPass===null?n.mapPass=new lc(i.x,i.y,{format:ao,type:Ka}):(n.mapPass.width!==n.map.width||n.mapPass.height!==n.map.height)&&n.mapPass.setSize(n.map.width,n.map.height),f.uniforms.shadow_pass.value=n.map.depthTexture,f.uniforms.resolution.value.set(n.map.width,n.map.height),f.uniforms.radius.value=n.radius,e.setRenderTarget(n.mapPass),e.clear(),e.renderBufferDirect(r,null,a,f,h,null),p.uniforms.shadow_pass.value=n.mapPass.texture,p.uniforms.resolution.value.set(n.map.width,n.map.height),p.uniforms.radius.value=n.radius,e.setRenderTarget(n.map),e.clear(),e.renderBufferDirect(r,null,a,p,h,null)}function y(t,n,r,i){let a=null,o=r.isPointLight===!0?t.customDistanceMaterial:t.customDepthMaterial;if(o!==void 0)a=o;else if(a=r.isPointLight===!0?c:s,e.localClippingEnabled&&n.clipShadows===!0&&Array.isArray(n.clippingPlanes)&&n.clippingPlanes.length!==0||n.displacementMap&&n.displacementScale!==0||n.alphaMap&&n.alphaTest>0||n.map&&n.alphaTest>0||n.alphaToCoverage===!0){let e=a.uuid,t=n.uuid,r=l[e];r===void 0&&(r={},l[e]=r);let i=r[t];i===void 0&&(i=a.clone(),r[t]=i,n.addEventListener(`dispose`,x)),a=i}if(a.visible=n.visible,a.wireframe=n.wireframe,i===3?a.side=n.shadowSide===null?n.side:n.shadowSide:a.side=n.shadowSide===null?d[n.side]:n.shadowSide,a.alphaMap=n.alphaMap,a.alphaTest=n.alphaToCoverage===!0?.5:n.alphaTest,a.map=n.map,a.clipShadows=n.clipShadows,a.clippingPlanes=n.clippingPlanes,a.clipIntersection=n.clipIntersection,a.displacementMap=n.displacementMap,a.displacementScale=n.displacementScale,a.displacementBias=n.displacementBias,a.wireframeLinewidth=n.wireframeLinewidth,a.linewidth=n.linewidth,r.isPointLight===!0&&a.isMeshDistanceMaterial===!0){let t=e.properties.get(a);t.light=r}return a}function b(n,i,a,o,s,c){if(n.visible===!1)return;if(n.layers.test(s)&&(n.isMesh||n.isLine||n.isPoints)&&(n.castShadow||n.receiveShadow&&c===3)&&(!n.frustumCulled||n.intersectsFrustum(r))){n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse,n.matrixWorld);let r=t.update(n),s=n.material;if(Array.isArray(s)){let t=r.groups;for(let l=0,u=t.length;l<u;l++){let u=t[l],d=s[u.materialIndex];if(d&&d.visible){let t=y(n,d,o,c);n.onBeforeShadow(e,n,i,a,r,t,u),e.renderBufferDirect(a,null,r,t,n,u),n.onAfterShadow(e,n,i,a,r,t,u)}}}else if(s.visible){let t=y(n,s,o,c);n.onBeforeShadow(e,n,i,a,r,t,null),e.renderBufferDirect(a,null,r,t,n,null),n.onAfterShadow(e,n,i,a,r,t,null)}}let l=n.children;for(let e=0,t=l.length;e<t;e++)b(l[e],i,a,o,s,c)}function x(e){e.target.removeEventListener(`dispose`,x);for(let t in l){let n=l[t],r=e.target.uuid;r in n&&(n[r].dispose(),delete n[r])}}}function Hh(e,t){function n(){let t=!1,n=new sc,r=null,i=new sc(0,0,0,0);return{setMask:function(n){r!==n&&!t&&(e.colorMask(n,n,n,n),r=n)},setLocked:function(e){t=e},setClear:function(t,r,a,o,s){s===!0&&(t*=o,r*=o,a*=o),n.set(t,r,a,o),i.equals(n)===!1&&(e.clearColor(t,r,a,o),i.copy(n))},reset:function(){t=!1,r=null,i.set(-1,0,0,0)}}}function r(){let n=!1,r=!1,i=null,a=null,o=null;return{setReversed:function(e){if(r!==e){let n=t.get(`EXT_clip_control`);e?n.clipControlEXT(n.LOWER_LEFT_EXT,n.ZERO_TO_ONE_EXT):n.clipControlEXT(n.LOWER_LEFT_EXT,n.NEGATIVE_ONE_TO_ONE_EXT),r=e;let i=o;o=null,this.setClear(i)}},getReversed:function(){return r},setTest:function(t){t?le(e.DEPTH_TEST):ue(e.DEPTH_TEST)},setMask:function(t){i!==t&&!n&&(e.depthMask(t),i=t)},setFunc:function(t){if(r&&(t=hs[t]),a!==t){switch(t){case 0:e.depthFunc(e.NEVER);break;case 1:e.depthFunc(e.ALWAYS);break;case 2:e.depthFunc(e.LESS);break;case 3:e.depthFunc(e.LEQUAL);break;case 4:e.depthFunc(e.EQUAL);break;case 5:e.depthFunc(e.GEQUAL);break;case 6:e.depthFunc(e.GREATER);break;case 7:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}a=t}},setLocked:function(e){n=e},setClear:function(t){o!==t&&(o=t,r&&(t=1-t),e.clearDepth(t))},reset:function(){n=!1,i=null,a=null,o=null,r=!1}}}function i(){let t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null;return{setTest:function(n){t||(n?le(e.STENCIL_TEST):ue(e.STENCIL_TEST))},setMask:function(r){n!==r&&!t&&(e.stencilMask(r),n=r)},setFunc:function(t,n,o){(r!==t||i!==n||a!==o)&&(e.stencilFunc(t,n,o),r=t,i=n,a=o)},setOp:function(t,n,r){(o!==t||s!==n||c!==r)&&(e.stencilOp(t,n,r),o=t,s=n,c=r)},setLocked:function(e){t=e},setClear:function(t){l!==t&&(e.clearStencil(t),l=t)},reset:function(){t=!1,n=null,r=null,i=null,a=null,o=null,s=null,c=null,l=null}}}let a=new n,o=new r,s=new i,c={},l=new WeakMap,u={},d={},f={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,ee=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),M=!1,te=0,ne=e.getParameter(e.VERSION);ne.indexOf(`WebGL`)===-1?ne.indexOf(`OpenGL ES`)!==-1&&(te=parseFloat(/^OpenGL ES (\d)/.exec(ne)[1]),M=te>=2):(te=parseFloat(/^WebGL (\d)/.exec(ne)[1]),M=te>=1);let re=null,ie={},ae=e.getParameter(e.SCISSOR_BOX),oe=e.getParameter(e.VIEWPORT),se=new sc().fromArray(ae),N=new sc().fromArray(oe);function ce(t,n,r,i){let a=new Uint8Array(4),o=e.createTexture();e.bindTexture(t,o),e.texParameteri(t,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(t,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let o=0;o<r;o++)t===e.TEXTURE_3D||t===e.TEXTURE_2D_ARRAY?e.texImage3D(n,0,e.RGBA,1,1,i,0,e.RGBA,e.UNSIGNED_BYTE,a):e.texImage2D(n+o,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,a);return o}let P={};P[e.TEXTURE_2D]=ce(e.TEXTURE_2D,e.TEXTURE_2D,1),P[e.TEXTURE_CUBE_MAP]=ce(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),P[e.TEXTURE_2D_ARRAY]=ce(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),P[e.TEXTURE_3D]=ce(e.TEXTURE_3D,e.TEXTURE_3D,1,1),a.setClear(0,0,0,1),o.setClear(1),s.setClear(0),le(e.DEPTH_TEST),o.setFunc(3),ve(!1),ye(1),le(e.CULL_FACE),ge(0);function le(t){u[t]!==!0&&(e.enable(t),u[t]=!0)}function ue(t){u[t]!==!1&&(e.disable(t),u[t]=!1)}function de(t,n){return f[t]!==n&&(e.bindFramebuffer(t,n),f[t]=n,t===e.DRAW_FRAMEBUFFER&&(f[e.FRAMEBUFFER]=n),t===e.FRAMEBUFFER&&(f[e.DRAW_FRAMEBUFFER]=n),!0)}function fe(t,n){let r=m,i=!1;if(t){r=p.get(n),r===void 0&&(r=[],p.set(n,r));let a=t.textures;if(r.length!==a.length||r[0]!==e.COLOR_ATTACHMENT0){for(let t=0,n=a.length;t<n;t++)r[t]=e.COLOR_ATTACHMENT0+t;r.length=a.length,i=!0}}else r[0]!==e.BACK&&(r[0]=e.BACK,i=!0);i&&e.drawBuffers(r)}function pe(t){return h!==t&&(e.useProgram(t),h=t,!0)}let me={100:e.FUNC_ADD,101:e.FUNC_SUBTRACT,102:e.FUNC_REVERSE_SUBTRACT};me[103]=e.MIN,me[104]=e.MAX;let he={200:e.ZERO,201:e.ONE,202:e.SRC_COLOR,204:e.SRC_ALPHA,210:e.SRC_ALPHA_SATURATE,208:e.DST_COLOR,206:e.DST_ALPHA,203:e.ONE_MINUS_SRC_COLOR,205:e.ONE_MINUS_SRC_ALPHA,209:e.ONE_MINUS_DST_COLOR,207:e.ONE_MINUS_DST_ALPHA,211:e.CONSTANT_COLOR,212:e.ONE_MINUS_CONSTANT_COLOR,213:e.CONSTANT_ALPHA,214:e.ONE_MINUS_CONSTANT_ALPHA};function ge(t,n,r,i,a,o,s,c,l,u){if(t===0)g===!0&&(ue(e.BLEND),g=!1);else if(g===!1&&(le(e.BLEND),g=!0),t!==5){if(t!==_||u!==E){if((v!==100||x!==100)&&(e.blendEquation(e.FUNC_ADD),v=100,x=100),u)switch(t){case 1:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFunc(e.ONE,e.ONE);break;case 3:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case 4:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:B(`WebGLState: Invalid blending: `,t)}else switch(t){case 1:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case 2:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case 3:B(`WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true`);break;case 4:B(`WebGLState: MultiplyBlending requires material.premultipliedAlpha = true`);break;default:B(`WebGLState: Invalid blending: `,t)}y=null,b=null,S=null,C=null,w.set(0,0,0),T=0,_=t,E=u}}else a||=n,o||=r,s||=i,(n!==v||a!==x)&&(e.blendEquationSeparate(me[n],me[a]),v=n,x=a),(r!==y||i!==b||o!==S||s!==C)&&(e.blendFuncSeparate(he[r],he[i],he[o],he[s]),y=r,b=i,S=o,C=s),(c.equals(w)===!1||l!==T)&&(e.blendColor(c.r,c.g,c.b,l),w.copy(c),T=l),_=t,E=!1}function _e(t,n){t.side===2?ue(e.CULL_FACE):le(e.CULL_FACE);let r=t.side===1;n&&(r=!r),ve(r),t.blending===1&&t.transparent===!1?ge(0):ge(t.blending,t.blendEquation,t.blendSrc,t.blendDst,t.blendEquationAlpha,t.blendSrcAlpha,t.blendDstAlpha,t.blendColor,t.blendAlpha,t.premultipliedAlpha),o.setFunc(t.depthFunc),o.setTest(t.depthTest),o.setMask(t.depthWrite),a.setMask(t.colorWrite);let i=t.stencilWrite;s.setTest(i),i&&(s.setMask(t.stencilWriteMask),s.setFunc(t.stencilFunc,t.stencilRef,t.stencilFuncMask),s.setOp(t.stencilFail,t.stencilZFail,t.stencilZPass)),xe(t.polygonOffset,t.polygonOffsetFactor,t.polygonOffsetUnits),t.alphaToCoverage===!0?le(e.SAMPLE_ALPHA_TO_COVERAGE):ue(e.SAMPLE_ALPHA_TO_COVERAGE)}function ve(t){D!==t&&(t?e.frontFace(e.CW):e.frontFace(e.CCW),D=t)}function ye(t){t===0?ue(e.CULL_FACE):(le(e.CULL_FACE),t!==O&&(t===1?e.cullFace(e.BACK):t===2?e.cullFace(e.FRONT):e.cullFace(e.FRONT_AND_BACK))),O=t}function be(t){t!==k&&(M&&e.lineWidth(t),k=t)}function xe(t,n,r){t?(le(e.POLYGON_OFFSET_FILL),(A!==n||j!==r)&&(A=n,j=r,o.getReversed()&&(n=-n,r=-r),e.polygonOffset(n,r))):ue(e.POLYGON_OFFSET_FILL)}function Se(t){t?le(e.SCISSOR_TEST):ue(e.SCISSOR_TEST)}function Ce(t){t===void 0&&(t=e.TEXTURE0+ee-1),re!==t&&(e.activeTexture(t),re=t)}function F(t,n,r){r===void 0&&(r=re===null?e.TEXTURE0+ee-1:re);let i=ie[r];i===void 0&&(i={type:void 0,texture:void 0},ie[r]=i),(i.type!==t||i.texture!==n)&&(re!==r&&(e.activeTexture(r),re=r),e.bindTexture(t,n||P[t]),i.type=t,i.texture=n)}function we(){let t=ie[re];t!==void 0&&t.type!==void 0&&(e.bindTexture(t.type,null),t.type=void 0,t.texture=void 0)}function Te(){try{e.compressedTexImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ee(){try{e.compressedTexImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function I(){try{e.texSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function De(){try{e.texSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function L(){try{e.compressedTexSubImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function R(){try{e.compressedTexSubImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Oe(){try{e.texStorage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function ke(){try{e.texStorage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Ae(){try{e.texImage2D(...arguments)}catch(e){B(`WebGLState:`,e)}}function je(){try{e.texImage3D(...arguments)}catch(e){B(`WebGLState:`,e)}}function Me(t){return d[t]===void 0?e.getParameter(t):d[t]}function Ne(t,n){d[t]!==n&&(e.pixelStorei(t,n),d[t]=n)}function Pe(t){se.equals(t)===!1&&(e.scissor(t.x,t.y,t.z,t.w),se.copy(t))}function Fe(t){N.equals(t)===!1&&(e.viewport(t.x,t.y,t.z,t.w),N.copy(t))}function Ie(t,n){let r=l.get(n);r===void 0&&(r=new WeakMap,l.set(n,r));let i=r.get(t);i===void 0&&(i=e.getUniformBlockIndex(n,t.name),e.uniformBlockBinding(n,i,i),r.set(t,i))}function Le(t,n,r){let i=l.get(n).get(t);c[i]!==r&&(e.bindBufferBase(e.UNIFORM_BUFFER,i,r),c[i]=r)}function Re(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),o.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),u={},d={},re=null,ie={},f={},c={},p=new WeakMap,m=[],h=null,g=!1,_=null,v=null,y=null,b=null,x=null,S=null,C=null,w=new q(0,0,0),T=0,E=!1,D=null,O=null,k=null,A=null,j=null,se.set(0,0,e.canvas.width,e.canvas.height),N.set(0,0,e.canvas.width,e.canvas.height),a.reset(),o.reset(),s.reset()}return{buffers:{color:a,depth:o,stencil:s},enable:le,disable:ue,bindFramebuffer:de,drawBuffers:fe,useProgram:pe,setBlending:ge,setMaterial:_e,setFlipSided:ve,setCullFace:ye,setLineWidth:be,setPolygonOffset:xe,setScissorTest:Se,activeTexture:Ce,bindTexture:F,unbindTexture:we,compressedTexImage2D:Te,compressedTexImage3D:Ee,texImage2D:Ae,texImage3D:je,pixelStorei:Ne,getParameter:Me,updateUBOMapping:Ie,uniformBlockBinding:Le,texStorage2D:Oe,texStorage3D:ke,texSubImage2D:I,texSubImage3D:De,compressedTexSubImage2D:L,compressedTexSubImage3D:R,scissor:Pe,viewport:Fe,reset:Re}}function Uh(e,t,n,r,i,a,o){let s=t.has(`WEBGL_multisampled_render_to_texture`)?t.get(`WEBGL_multisampled_render_to_texture`):null,c=typeof navigator>`u`?!1:/OculusBrowser/g.test(navigator.userAgent),l=new H,u=new WeakMap,d=new Set,f,p=new WeakMap,m=new Set,h=new FinalizationRegistry(e=>m.delete(e)),g=!1;try{g=typeof OffscreenCanvas<`u`&&new OffscreenCanvas(1,1).getContext(`2d`)!==null}catch{}function _(e,t){return g?new OffscreenCanvas(e,t):cs(`canvas`)}function v(e,t,n){let r=1,i=Oe(e);if((i.width>n||i.height>n)&&(r=n/Math.max(i.width,i.height)),r<1){if(typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<`u`&&e instanceof HTMLCanvasElement||typeof ImageBitmap<`u`&&e instanceof ImageBitmap||typeof VideoFrame<`u`&&e instanceof VideoFrame){let n=Math.floor(r*i.width),a=Math.floor(r*i.height);f===void 0&&(f=_(n,a));let o=t?_(n,a):f;return o.width=n,o.height=a,o.getContext(`2d`).drawImage(e,0,0,n,a),z(`WebGLRenderer: Texture has been resized from (`+i.width+`x`+i.height+`) to (`+n+`x`+a+`).`),o}return`data`in e&&z(`WebGLRenderer: Image in DataTexture is too big (`+i.width+`x`+i.height+`).`),e}return e}function y(e){return e.generateMipmaps}function b(t){e.generateMipmap(t)}function x(t){return t.isWebGLCubeRenderTarget?e.TEXTURE_CUBE_MAP:t.isWebGL3DRenderTarget?e.TEXTURE_3D:t.isWebGLArrayRenderTarget||t.isCompressedArrayTexture?e.TEXTURE_2D_ARRAY:e.TEXTURE_2D}function S(n,r,i,a,o,s=!1){if(n!==null){if(e[n]!==void 0)return e[n];z(`WebGLRenderer: Attempt to use non-existing WebGL internal format '`+n+`'`)}let c;a&&(c=t.get(`EXT_texture_norm16`),c||z(`WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension`));let l=r;if(r===e.RED&&(i===e.FLOAT&&(l=e.R32F),i===e.HALF_FLOAT&&(l=e.R16F),i===e.UNSIGNED_BYTE&&(l=e.R8),i===e.UNSIGNED_SHORT&&c&&(l=c.R16_EXT),i===e.SHORT&&c&&(l=c.R16_SNORM_EXT)),r===e.RED_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.R8UI),i===e.UNSIGNED_SHORT&&(l=e.R16UI),i===e.UNSIGNED_INT&&(l=e.R32UI),i===e.BYTE&&(l=e.R8I),i===e.SHORT&&(l=e.R16I),i===e.INT&&(l=e.R32I)),r===e.RG&&(i===e.FLOAT&&(l=e.RG32F),i===e.HALF_FLOAT&&(l=e.RG16F),i===e.UNSIGNED_BYTE&&(l=e.RG8),i===e.UNSIGNED_SHORT&&c&&(l=c.RG16_EXT),i===e.SHORT&&c&&(l=c.RG16_SNORM_EXT)),r===e.RG_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RG8UI),i===e.UNSIGNED_SHORT&&(l=e.RG16UI),i===e.UNSIGNED_INT&&(l=e.RG32UI),i===e.BYTE&&(l=e.RG8I),i===e.SHORT&&(l=e.RG16I),i===e.INT&&(l=e.RG32I)),r===e.RGB_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGB8UI),i===e.UNSIGNED_SHORT&&(l=e.RGB16UI),i===e.UNSIGNED_INT&&(l=e.RGB32UI),i===e.BYTE&&(l=e.RGB8I),i===e.SHORT&&(l=e.RGB16I),i===e.INT&&(l=e.RGB32I)),r===e.RGBA_INTEGER&&(i===e.UNSIGNED_BYTE&&(l=e.RGBA8UI),i===e.UNSIGNED_SHORT&&(l=e.RGBA16UI),i===e.UNSIGNED_INT&&(l=e.RGBA32UI),i===e.BYTE&&(l=e.RGBA8I),i===e.SHORT&&(l=e.RGBA16I),i===e.INT&&(l=e.RGBA32I)),r===e.RGB&&(i===e.UNSIGNED_SHORT&&c&&(l=c.RGB16_EXT),i===e.SHORT&&c&&(l=c.RGB16_SNORM_EXT),i===e.UNSIGNED_INT_5_9_9_9_REV&&(l=e.RGB9_E5),i===e.UNSIGNED_INT_10F_11F_11F_REV&&(l=e.R11F_G11F_B10F)),r===e.RGBA){let t=s?ts:G.getTransfer(o);i===e.FLOAT&&(l=e.RGBA32F),i===e.HALF_FLOAT&&(l=e.RGBA16F),i===e.UNSIGNED_BYTE&&(l=t===`srgb`?e.SRGB8_ALPHA8:e.RGBA8),i===e.UNSIGNED_SHORT&&c&&(l=c.RGBA16_EXT),i===e.SHORT&&c&&(l=c.RGBA16_SNORM_EXT),i===e.UNSIGNED_SHORT_4_4_4_4&&(l=e.RGBA4),i===e.UNSIGNED_SHORT_5_5_5_1&&(l=e.RGB5_A1)}return(l===e.R16F||l===e.R32F||l===e.RG16F||l===e.RG32F||l===e.RGBA16F||l===e.RGBA32F)&&t.get(`EXT_color_buffer_float`),l}function C(t,n){let r;return t?n===null||n===1014||n===1020?r=e.DEPTH24_STENCIL8:n===1015?r=e.DEPTH32F_STENCIL8:n===1012&&(r=e.DEPTH24_STENCIL8,z(`DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.`)):n===null||n===1014||n===1020?r=e.DEPTH_COMPONENT24:n===1015?r=e.DEPTH_COMPONENT32F:n===1012&&(r=e.DEPTH_COMPONENT16),r}function w(e,t){return y(e)===!0||e.isFramebufferTexture&&e.minFilter!==1003&&e.minFilter!==1006?Math.log2(Math.max(t.width,t.height))+1:e.mipmaps.length>0?e.mipmaps.length:e.isCompressedTexture&&Array.isArray(e.image)?t.mipmaps.length:1}function T(e){let t=new WeakRef(e);r.get(e).__ref=t,m.add(t),h.register(e,t,t)}function E(e){let t=r.get(e).__ref;t!==void 0&&(m.delete(t),h.unregister(t))}function D(e){k(e.target)}function O(e){A(e.target)}function k(e){e.removeEventListener(`dispose`,D),E(e),ee(e),e.isVideoTexture&&u.delete(e),e.isHTMLTexture&&d.delete(e)}function A(e){e.removeEventListener(`dispose`,O),E(e),te(e)}function j(){for(let e of m){let t=e.deref();t!==void 0&&(t.isRenderTarget===!0?A(t):k(t))}m.clear(),d.clear()}function ee(e){let t=r.get(e);if(t.__webglInit===void 0)return;let n=e.source,i=p.get(n);if(i){let r=i[t.__cacheKey];r.usedTimes--,r.usedTimes===0&&M(e),Object.keys(i).length===0&&p.delete(n)}r.remove(e)}function M(t){let n=r.get(t);e.deleteTexture(n.__webglTexture);let i=t.source,a=p.get(i);delete a[n.__cacheKey],o.memory.textures--}function te(t){let n=r.get(t);n.__depthDisposeCallback&&n.__depthDisposeCallback();let i=t.depthTexture;if(i&&i.renderTarget===t&&k(i),t.isWebGLCubeRenderTarget)for(let t=0;t<6;t++){if(Array.isArray(n.__webglFramebuffer[t]))for(let r=0;r<n.__webglFramebuffer[t].length;r++)e.deleteFramebuffer(n.__webglFramebuffer[t][r]);else e.deleteFramebuffer(n.__webglFramebuffer[t]);n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer[t])}else{if(Array.isArray(n.__webglFramebuffer))for(let t=0;t<n.__webglFramebuffer.length;t++)e.deleteFramebuffer(n.__webglFramebuffer[t]);else e.deleteFramebuffer(n.__webglFramebuffer);if(n.__webglDepthbuffer&&e.deleteRenderbuffer(n.__webglDepthbuffer),n.__webglMultisampledFramebuffer&&e.deleteFramebuffer(n.__webglMultisampledFramebuffer),n.__webglColorRenderbuffer)for(let t=0;t<n.__webglColorRenderbuffer.length;t++)n.__webglColorRenderbuffer[t]&&e.deleteRenderbuffer(n.__webglColorRenderbuffer[t]);n.__webglDepthRenderbuffer&&e.deleteRenderbuffer(n.__webglDepthRenderbuffer)}let a=t.textures;for(let t=0,n=a.length;t<n;t++){let n=r.get(a[t]);n.__webglTexture&&(e.deleteTexture(n.__webglTexture),o.memory.textures--),r.remove(a[t])}r.remove(t)}let ne=0;function re(){ne=0}function ie(){return ne}function ae(e){ne=e}function oe(){let e=ne;return e>=i.maxTextures&&z(`WebGLTextures: Trying to use `+(e+1)+` texture units while this GPU supports only `+i.maxTextures),ne+=1,e}function se(e){let t=[];return t.push(e.wrapS),t.push(e.wrapT),t.push(e.wrapR||0),t.push(e.magFilter),t.push(e.minFilter),t.push(e.anisotropy),t.push(e.internalFormat),t.push(e.format),t.push(e.type),t.push(e.generateMipmaps),t.push(e.mipmapsAutoUpdate),t.push(e.premultiplyAlpha),t.push(e.flipY),t.push(e.unpackAlignment),t.push(e.colorSpace),t.join()}function N(t,i){let a=r.get(t);if(t.isVideoTexture&&L(t),t.isRenderTargetTexture===!1&&t.isExternalTexture!==!0&&t.version>0&&a.__version!==t.version){let e=t.image;if(e===null)z(`WebGLRenderer: Texture marked for update but no image data found.`);else if(e.complete===!1)z(`WebGLRenderer: Texture marked for update but image is incomplete`);else{_e(a,t,i);return}}else t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null);n.bindTexture(e.TEXTURE_2D,a.__webglTexture,e.TEXTURE0+i)}function ce(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):(t.isExternalTexture&&(a.__webglTexture=t.sourceTexture?t.sourceTexture:null),n.bindTexture(e.TEXTURE_2D_ARRAY,a.__webglTexture,e.TEXTURE0+i))}function P(t,i){let a=r.get(t);t.isRenderTargetTexture===!1&&t.version>0&&a.__version!==t.version?_e(a,t,i):n.bindTexture(e.TEXTURE_3D,a.__webglTexture,e.TEXTURE0+i)}function le(t,i){let a=r.get(t);t.version>0&&a.__version!==t.version?ve(a,t,i):n.bindTexture(e.TEXTURE_CUBE_MAP,a.__webglTexture,e.TEXTURE0+i)}let ue={[Aa]:e.REPEAT,[ja]:e.CLAMP_TO_EDGE,[Ma]:e.MIRRORED_REPEAT},de={[Na]:e.NEAREST,[Pa]:e.NEAREST_MIPMAP_NEAREST,[Fa]:e.NEAREST_MIPMAP_LINEAR,[Ia]:e.LINEAR,[La]:e.LINEAR_MIPMAP_NEAREST,[Ra]:e.LINEAR_MIPMAP_LINEAR},fe={512:e.NEVER,519:e.ALWAYS,513:e.LESS,515:e.LEQUAL,514:e.EQUAL,518:e.GEQUAL,516:e.GREATER,517:e.NOTEQUAL};function pe(n,a){if(a.type===1015&&t.has(`OES_texture_float_linear`)===!1&&(a.magFilter===1006||a.magFilter===1007||a.magFilter===1005||a.magFilter===1008||a.minFilter===1006||a.minFilter===1007||a.minFilter===1005||a.minFilter===1008)&&z(`WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.`),e.texParameteri(n,e.TEXTURE_WRAP_S,ue[a.wrapS]),e.texParameteri(n,e.TEXTURE_WRAP_T,ue[a.wrapT]),(n===e.TEXTURE_3D||n===e.TEXTURE_2D_ARRAY)&&e.texParameteri(n,e.TEXTURE_WRAP_R,ue[a.wrapR]),e.texParameteri(n,e.TEXTURE_MAG_FILTER,de[a.magFilter]),e.texParameteri(n,e.TEXTURE_MIN_FILTER,de[a.minFilter]),a.compareFunction&&(e.texParameteri(n,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(n,e.TEXTURE_COMPARE_FUNC,fe[a.compareFunction])),t.has(`EXT_texture_filter_anisotropic`)===!0){if(a.magFilter===1003||a.minFilter!==1005&&a.minFilter!==1008||a.type===1015&&t.has(`OES_texture_float_linear`)===!1)return;if(a.anisotropy>1||r.get(a).__currentAnisotropy){let o=t.get(`EXT_texture_filter_anisotropic`);e.texParameterf(n,o.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(a.anisotropy,i.getMaxAnisotropy())),r.get(a).__currentAnisotropy=a.anisotropy}}}function me(t,n){let r=!1;t.__webglInit===void 0&&(t.__webglInit=!0,n.addEventListener(`dispose`,D),T(n));let i=n.source,a=p.get(i);a===void 0&&(a={},p.set(i,a));let s=se(n);if(s!==t.__cacheKey){a[s]===void 0&&(a[s]={texture:e.createTexture(),usedTimes:0},o.memory.textures++,r=!0),a[s].usedTimes++;let i=a[t.__cacheKey];i!==void 0&&(a[t.__cacheKey].usedTimes--,i.usedTimes===0&&M(n)),t.__cacheKey=s,t.__webglTexture=a[s].texture}return r}function he(e,t,n){return Math.floor(Math.floor(e/n)/t)}function ge(t,r,i,a){let o=t.updateRanges;if(o.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,r.width,r.height,i,a,r.data);else{o.sort((e,t)=>e.start-t.start);let s=0;for(let e=1;e<o.length;e++){let t=o[s],n=o[e],i=t.start+t.count,a=he(n.start,r.width,4),c=he(t.start,r.width,4);n.start<=i+1&&a===c&&he(n.start+n.count-1,r.width,4)===a?t.count=Math.max(t.count,n.start+n.count-t.start):(++s,o[s]=n)}o.length=s+1;let c=n.getParameter(e.UNPACK_ROW_LENGTH),l=n.getParameter(e.UNPACK_SKIP_PIXELS),u=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,r.width);for(let t=0,s=o.length;t<s;t++){let s=o[t],c=Math.floor(s.start/4),l=Math.ceil(s.count/4),u=c%r.width,d=Math.floor(c/r.width),f=l;n.pixelStorei(e.UNPACK_SKIP_PIXELS,u),n.pixelStorei(e.UNPACK_SKIP_ROWS,d),n.texSubImage2D(e.TEXTURE_2D,0,u,d,f,1,i,a,r.data)}t.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,c),n.pixelStorei(e.UNPACK_SKIP_PIXELS,l),n.pixelStorei(e.UNPACK_SKIP_ROWS,u)}}function _e(t,o,s){let c=e.TEXTURE_2D;(o.isDataArrayTexture||o.isCompressedArrayTexture)&&(c=e.TEXTURE_2D_ARRAY),o.isData3DTexture&&(c=e.TEXTURE_3D);let l=me(t,o),u=o.source;n.bindTexture(c,t.__webglTexture,e.TEXTURE0+s);let f=r.get(u);if(u.version!==f.__version||l===!0){if(n.activeTexture(e.TEXTURE0+s),!(typeof ImageBitmap<`u`&&o.image instanceof ImageBitmap)){let t=G.getPrimaries(G.workingColorSpace),r=o.colorSpace===``?null:G.getPrimaries(o.colorSpace),i=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,i)}n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment);let t=v(o.image,!1,i.maxTextureSize);t=R(o,t);let r=a.convert(o.format,o.colorSpace),p=a.convert(o.type),m=S(o.internalFormat,r,p,o.normalized,o.colorSpace,o.isVideoTexture);pe(c,o);let h,g=o.mipmaps,_=o.isVideoTexture!==!0,x=f.__version===void 0||l===!0,T=u.dataReady,E=w(o,t);if(o.isDepthTexture)m=C(o.format===no,o.type),x&&(_?n.texStorage2D(e.TEXTURE_2D,1,m,t.width,t.height):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,null));else if(o.isDataTexture){if(g.length>0){_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data);o.generateMipmaps=!1}else _?(x&&n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height),T&&ge(o,t,r,p)):n.texImage2D(e.TEXTURE_2D,0,m,t.width,t.height,0,r,p,t.data)}else if(o.isCompressedTexture){if(o.isCompressedArrayTexture){_&&x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,g[0].width,g[0].height,t.depth);for(let i=0,a=g.length;i<a;i++)if(h=g[i],o.format!==1023){if(r!==null){if(_){if(T){if(o.layerUpdates.size>0){let t=Gf(h.width,h.height,o.format,o.type);for(let a of o.layerUpdates){let o=h.data.subarray(a*t/h.data.BYTES_PER_ELEMENT,(a+1)*t/h.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,a,h.width,h.height,1,r,o)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,h.data)}}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,h.data,0,0)}else z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`)}else _?T&&n.texSubImage3D(e.TEXTURE_2D_ARRAY,i,0,0,0,h.width,h.height,t.depth,r,p,h.data):n.texImage3D(e.TEXTURE_2D_ARRAY,i,m,h.width,h.height,t.depth,0,r,p,h.data);o.layerUpdates.size>0&&o.clearLayerUpdates()}else{_&&x&&n.texStorage2D(e.TEXTURE_2D,E,m,g[0].width,g[0].height);for(let t=0,i=g.length;t<i;t++)h=g[t],o.format===1023?_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,p,h.data):n.texImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,r,p,h.data):r===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()`):_?T&&n.compressedTexSubImage2D(e.TEXTURE_2D,t,0,0,h.width,h.height,r,h.data):n.compressedTexImage2D(e.TEXTURE_2D,t,m,h.width,h.height,0,h.data)}}else if(o.isDataArrayTexture){if(_){if(x&&n.texStorage3D(e.TEXTURE_2D_ARRAY,E,m,t.width,t.height,t.depth),T){if(o.layerUpdates.size>0){let i=Gf(t.width,t.height,o.format,o.type);for(let a of o.layerUpdates){let o=t.data.subarray(a*i/t.data.BYTES_PER_ELEMENT,(a+1)*i/t.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,a,t.width,t.height,1,r,p,o)}o.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)}}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,m,t.width,t.height,t.depth,0,r,p,t.data)}else if(o.isData3DTexture)_?(x&&n.texStorage3D(e.TEXTURE_3D,E,m,t.width,t.height,t.depth),T&&n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,t.width,t.height,t.depth,r,p,t.data)):n.texImage3D(e.TEXTURE_3D,0,m,t.width,t.height,t.depth,0,r,p,t.data);else if(o.isFramebufferTexture){if(x){if(_)n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height);else{let i=t.width,a=t.height;for(let t=0;t<E;t++)n.texImage2D(e.TEXTURE_2D,t,m,i,a,0,r,p,null),i>>=1,a>>=1}}}else if(o.isHTMLTexture){if(`texElementImage2D`in e){let n=e.canvas;if(n.hasAttribute(`layoutsubtree`)||n.setAttribute(`layoutsubtree`,`true`),t.parentNode!==n){n.appendChild(t),d.add(o),n.onpaint=e=>{let t=e.changedElements;for(let e of d)t.includes(e.image)&&(e.needsUpdate=!0)},n.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,t);else{let n=e.RGBA,r=e.RGBA,i=e.UNSIGNED_BYTE;e.texElementImage2D(e.TEXTURE_2D,0,n,r,i,t)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(g.length>0){if(_&&x){let t=Oe(g[0]);n.texStorage2D(e.TEXTURE_2D,E,m,t.width,t.height)}for(let t=0,i=g.length;t<i;t++)h=g[t],_?T&&n.texSubImage2D(e.TEXTURE_2D,t,0,0,r,p,h):n.texImage2D(e.TEXTURE_2D,t,m,r,p,h);o.generateMipmaps=!1}else if(_){if(x){let r=Oe(t);n.texStorage2D(e.TEXTURE_2D,E,m,r.width,r.height)}T&&n.texSubImage2D(e.TEXTURE_2D,0,0,0,r,p,t)}else n.texImage2D(e.TEXTURE_2D,0,m,r,p,t);y(o)&&o.mipmapsAutoUpdate===!0&&b(c),f.__version=u.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ve(t,o,s){if(o.image.length!==6)return;let c=me(t,o),l=o.source;n.bindTexture(e.TEXTURE_CUBE_MAP,t.__webglTexture,e.TEXTURE0+s);let u=r.get(l);if(l.version!==u.__version||c===!0){n.activeTexture(e.TEXTURE0+s);let t=G.getPrimaries(G.workingColorSpace),r=o.colorSpace===``?null:G.getPrimaries(o.colorSpace),d=o.colorSpace===``||t===r?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,o.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,o.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,o.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,d);let f=o.isCompressedTexture||o.image[0].isCompressedTexture,p=o.image[0]&&o.image[0].isDataTexture,m=[];for(let e=0;e<6;e++)!f&&!p?m[e]=v(o.image[e],!0,i.maxCubemapSize):m[e]=p?o.image[e].image:o.image[e],m[e]=R(o,m[e]);let h=m[0],g=a.convert(o.format,o.colorSpace),_=a.convert(o.type),x=S(o.internalFormat,g,_,o.normalized,o.colorSpace),T=o.isVideoTexture!==!0,E=u.__version===void 0||c===!0,D=l.dataReady,O=w(o,h);pe(e.TEXTURE_CUBE_MAP,o);let k;if(o.isDepthTexture){if(x=C(o.format===no,o.type),E){if(T)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,x,h.width,h.height);else for(let t=0;t<6;t++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,h.width,h.height,0,g,_,null)}}else if(f){T&&E&&n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,h.width,h.height);for(let t=0;t<6;t++){k=m[t].mipmaps;for(let r=0;r<k.length;r++){let i=k[r];o.format===1023?T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,g,_,i.data):g===null?z(`WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()`):T?D&&n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,0,0,i.width,i.height,g,i.data):n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r,x,i.width,i.height,0,i.data)}}}else{if(k=o.mipmaps,T&&E){k.length>0&&O++;let t=Oe(m[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,O,x,t.width,t.height)}for(let t=0;t<6;t++)if(p){T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,m[t].width,m[t].height,g,_,m[t].data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,m[t].width,m[t].height,0,g,_,m[t].data);for(let r=0;r<k.length;r++){let i=k[r].image[t].image;T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,i.width,i.height,g,_,i.data):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,i.width,i.height,0,g,_,i.data)}}else{T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,0,0,g,_,m[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,0,x,g,_,m[t]);for(let r=0;r<k.length;r++){let i=k[r];T?D&&n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,0,0,g,_,i.image[t]):n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+t,r+1,x,g,_,i.image[t])}}}y(o)&&o.mipmapsAutoUpdate===!0&&b(e.TEXTURE_CUBE_MAP),u.__version=l.version,o.onUpdate&&o.onUpdate(o)}t.__version=o.version}function ye(t,i,o,c,l,u){let d=a.convert(o.format,o.colorSpace),f=a.convert(o.type),p=S(o.internalFormat,d,f,o.normalized,o.colorSpace),m=r.get(i),h=r.get(o);if(h.__renderTarget=i,!m.__hasExternalTextures){let t=Math.max(1,i.width>>u),r=Math.max(1,i.height>>u);l===e.TEXTURE_3D||l===e.TEXTURE_2D_ARRAY?n.texImage3D(l,u,p,t,r,i.depth,0,d,f,null):n.texImage2D(l,u,p,t,r,0,d,f,null)}n.bindFramebuffer(e.FRAMEBUFFER,t),De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,c,l,h.__webglTexture,0,I(i)):(l===e.TEXTURE_2D||l>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&l<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&e.framebufferTexture2D(e.FRAMEBUFFER,c,l,h.__webglTexture,u),n.bindFramebuffer(e.FRAMEBUFFER,null)}function be(t,n,r){if(e.bindRenderbuffer(e.RENDERBUFFER,t),n.depthBuffer){let i=n.depthTexture,a=i&&i.isDepthTexture?i.type:null,o=C(n.stencilBuffer,a),c=n.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;De(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,I(n),o,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,I(n),o,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,o,n.width,n.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,c,e.RENDERBUFFER,t)}else{let t=n.textures;for(let i=0;i<t.length;i++){let o=t[i],c=a.convert(o.format,o.colorSpace),l=a.convert(o.type),u=S(o.internalFormat,c,l,o.normalized,o.colorSpace);De(n)?s.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,I(n),u,n.width,n.height):r?e.renderbufferStorageMultisample(e.RENDERBUFFER,I(n),u,n.width,n.height):e.renderbufferStorage(e.RENDERBUFFER,u,n.width,n.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function xe(t,i,a){let o=i.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,t),!(i.depthTexture&&i.depthTexture.isDepthTexture))throw Error(`THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.`);let c=r.get(i.depthTexture);c.__renderTarget=i;let l=o?i.depthTexture.image[0]:i.depthTexture.image;c.__webglTexture&&l.width===i.width&&l.height===i.height||(l.width=i.width,l.height=i.height,i.depthTexture.needsUpdate=!0),o?le(i.depthTexture,0):N(i.depthTexture,0);let u=c.__webglTexture,d=I(i),f=o?e.TEXTURE_CUBE_MAP_POSITIVE_X+a:e.TEXTURE_2D,p=i.depthTexture.format===1027?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(i.depthTexture.format===1026)De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else if(i.depthTexture.format===1027)De(i)?s.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,p,f,u,0,d):e.framebufferTexture2D(e.FRAMEBUFFER,p,f,u,0);else throw Error(`THREE.WebGLTextures: Unknown depthTexture format.`)}function Se(t){let i=r.get(t),a=t.isWebGLCubeRenderTarget===!0;if(i.__boundDepthTexture!==t.depthTexture){let e=t.depthTexture;if(i.__depthDisposeCallback&&i.__depthDisposeCallback(),e){let t=()=>{delete i.__boundDepthTexture,delete i.__depthDisposeCallback,e.removeEventListener(`dispose`,t)};e.addEventListener(`dispose`,t),i.__depthDisposeCallback=t}i.__boundDepthTexture=e}if(t.depthTexture&&!i.__autoAllocateDepthBuffer){if(a)for(let e=0;e<6;e++)xe(i.__webglFramebuffer[e],t,e);else t.texture.mipmaps.length>0?xe(i.__webglFramebuffer[0],t,0):xe(i.__webglFramebuffer,t,0)}else if(a){i.__webglDepthbuffer=[];for(let r=0;r<6;r++)if(n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[r]),i.__webglDepthbuffer[r]===void 0)i.__webglDepthbuffer[r]=e.createRenderbuffer(),be(i.__webglDepthbuffer[r],t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,a=i.__webglDepthbuffer[r];e.bindRenderbuffer(e.RENDERBUFFER,a),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,a)}}else if(t.texture.mipmaps.length>0?n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer[0]):n.bindFramebuffer(e.FRAMEBUFFER,i.__webglFramebuffer),i.__webglDepthbuffer===void 0)i.__webglDepthbuffer=e.createRenderbuffer(),be(i.__webglDepthbuffer,t,!1);else{let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,r=i.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,r),e.framebufferRenderbuffer(e.FRAMEBUFFER,n,e.RENDERBUFFER,r)}n.bindFramebuffer(e.FRAMEBUFFER,null)}function Ce(t,n,i){let a=r.get(t);n!==void 0&&ye(a.__webglFramebuffer,t,t.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0),i!==void 0&&Se(t)}function F(t){let i=t.texture,s=r.get(t),c=r.get(i);t.addEventListener(`dispose`,O),T(t);let l=t.textures,u=t.isWebGLCubeRenderTarget===!0,d=l.length>1;if(d||(c.__webglTexture===void 0&&(c.__webglTexture=e.createTexture()),c.__version=i.version,o.memory.textures++),u){s.__webglFramebuffer=[];for(let t=0;t<6;t++)if(i.mipmaps.length>0){s.__webglFramebuffer[t]=[];for(let n=0;n<i.mipmaps.length;n++)s.__webglFramebuffer[t][n]=e.createFramebuffer()}else s.__webglFramebuffer[t]=e.createFramebuffer()}else{if(i.mipmaps.length>0){s.__webglFramebuffer=[];for(let t=0;t<i.mipmaps.length;t++)s.__webglFramebuffer[t]=e.createFramebuffer()}else s.__webglFramebuffer=e.createFramebuffer();if(d)for(let t=0,n=l.length;t<n;t++){let n=r.get(l[t]);n.__webglTexture===void 0&&(n.__webglTexture=e.createTexture(),o.memory.textures++)}if(t.samples>0&&De(t)===!1){s.__webglMultisampledFramebuffer=e.createFramebuffer(),s.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,s.__webglMultisampledFramebuffer);for(let n=0;n<l.length;n++){let r=l[n];s.__webglColorRenderbuffer[n]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,s.__webglColorRenderbuffer[n]);let i=a.convert(r.format,r.colorSpace),o=a.convert(r.type),c=S(r.internalFormat,i,o,r.normalized,r.colorSpace,t.isXRRenderTarget===!0),u=I(t);e.renderbufferStorageMultisample(e.RENDERBUFFER,u,c,t.width,t.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+n,e.RENDERBUFFER,s.__webglColorRenderbuffer[n])}e.bindRenderbuffer(e.RENDERBUFFER,null),t.depthBuffer&&(s.__webglDepthRenderbuffer=e.createRenderbuffer(),be(s.__webglDepthRenderbuffer,t,!0)),n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(u){n.bindTexture(e.TEXTURE_CUBE_MAP,c.__webglTexture),pe(e.TEXTURE_CUBE_MAP,i);for(let n=0;n<6;n++)if(i.mipmaps.length>0)for(let r=0;r<i.mipmaps.length;r++)ye(s.__webglFramebuffer[n][r],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,r);else ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+n,0);y(i)?b(e.TEXTURE_CUBE_MAP):i.mipmaps.length>0&&e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}else if(d){for(let i=0,a=l.length;i<a;i++){let a=l[i],o=r.get(a),c=e.TEXTURE_2D;(t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(c=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(c,o.__webglTexture),pe(c,a),ye(s.__webglFramebuffer,t,a,e.COLOR_ATTACHMENT0+i,c,0),y(a)&&b(c)}n.unbindTexture()}else{let r=e.TEXTURE_2D;if((t.isWebGL3DRenderTarget||t.isWebGLArrayRenderTarget)&&(r=t.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY),n.bindTexture(r,c.__webglTexture),pe(r,i),i.mipmaps.length>0)for(let n=0;n<i.mipmaps.length;n++)ye(s.__webglFramebuffer[n],t,i,e.COLOR_ATTACHMENT0,r,n);else ye(s.__webglFramebuffer,t,i,e.COLOR_ATTACHMENT0,r,0);y(i)?b(r):i.mipmaps.length>0&&e.texParameteri(r,e.TEXTURE_MAX_LEVEL,i.mipmaps.length-1),n.unbindTexture()}t.depthBuffer&&Se(t)}function we(e){let t=e.textures;for(let i=0,a=t.length;i<a;i++){let a=t[i];if(y(a)&&a.mipmapsAutoUpdate===!0){let t=x(e),i=r.get(a).__webglTexture;n.bindTexture(t,i),b(t),n.unbindTexture()}}}let Te=[];function Ee(t){if(t.samples>0){if(De(t)===!1){let i=t.textures,a=t.width,o=t.height,s=e.COLOR_BUFFER_BIT,l=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,u=r.get(t),d=i.length>1;if(d)for(let t=0;t<i.length;t++)n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,null,0);n.bindFramebuffer(e.READ_FRAMEBUFFER,u.__webglMultisampledFramebuffer),t.texture.mipmaps.length>0?n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer[0]):n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglFramebuffer);for(let n=0;n<i.length;n++){if(t.resolveDepthBuffer&&(t.depthBuffer&&(s|=e.DEPTH_BUFFER_BIT),t.stencilBuffer&&t.resolveStencilBuffer&&(s|=e.STENCIL_BUFFER_BIT)),d){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,u.__webglColorRenderbuffer[n]);let t=r.get(i[n]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0)}e.blitFramebuffer(0,0,a,o,0,0,a,o,s,e.NEAREST),c===!0&&(Te.length=0,Te.push(e.COLOR_ATTACHMENT0+n),t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&Te.push(l),e.invalidateFramebuffer(e.READ_FRAMEBUFFER,Te))}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),d)for(let t=0;t<i.length;t++){n.bindFramebuffer(e.FRAMEBUFFER,u.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.RENDERBUFFER,u.__webglColorRenderbuffer[t]);let a=r.get(i[t]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,u.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+t,e.TEXTURE_2D,a,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,u.__webglMultisampledFramebuffer)}else if(t.depthBuffer&&t.storeMultisampledDepthBuffer===!1&&c){let n=t.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[n])}}}function I(e){return Math.min(i.maxSamples,e.samples)}function De(e){let n=r.get(e);return e.samples>0&&t.has(`WEBGL_multisampled_render_to_texture`)===!0&&n.__useRenderToTexture!==!1}function L(e){let t=o.render.frame;u.get(e)!==t&&(u.set(e,t),e.update())}function R(e,t){let n=e.colorSpace,r=e.format,i=e.type;return e.isCompressedTexture===!0||e.isVideoTexture===!0||n!==`srgb-linear`&&n!==``&&(G.getTransfer(n)===`srgb`?(r!==1023||i!==1009)&&z(`WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.`):B(`WebGLTextures: Unsupported texture color space:`,n)),t}function Oe(e){return typeof HTMLImageElement<`u`&&e instanceof HTMLImageElement?(l.width=e.naturalWidth||e.width,l.height=e.naturalHeight||e.height):typeof VideoFrame<`u`&&e instanceof VideoFrame?(l.width=e.displayWidth,l.height=e.displayHeight):(l.width=e.width,l.height=e.height),l}this.allocateTextureUnit=oe,this.resetTextureUnits=re,this.getTextureUnits=ie,this.setTextureUnits=ae,this.setTexture2D=N,this.setTexture2DArray=ce,this.setTexture3D=P,this.setTextureCube=le,this.rebindTextures=Ce,this.setupRenderTarget=F,this.updateRenderTargetMipmap=we,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=Se,this.setupFrameBufferTexture=ye,this.useMultisampledRTT=De,this.dispose=j}function Wh(e,t){function n(n,r=``){let i,a=G.getTransfer(r);if(n===1009)return e.UNSIGNED_BYTE;if(n===1017)return e.UNSIGNED_SHORT_4_4_4_4;if(n===1018)return e.UNSIGNED_SHORT_5_5_5_1;if(n===35902)return e.UNSIGNED_INT_5_9_9_9_REV;if(n===35899)return e.UNSIGNED_INT_10F_11F_11F_REV;if(n===1010)return e.BYTE;if(n===1011)return e.SHORT;if(n===1012)return e.UNSIGNED_SHORT;if(n===1013)return e.INT;if(n===1014)return e.UNSIGNED_INT;if(n===1015)return e.FLOAT;if(n===1016)return e.HALF_FLOAT;if(n===1021)return e.ALPHA;if(n===1022)return e.RGB;if(n===1023)return e.RGBA;if(n===1026)return e.DEPTH_COMPONENT;if(n===1027)return e.DEPTH_STENCIL;if(n===1028)return e.RED;if(n===1029)return e.RED_INTEGER;if(n===1030)return e.RG;if(n===1031)return e.RG_INTEGER;if(n===1033)return e.RGBA_INTEGER;if(n===33776||n===33777||n===33778||n===33779){if(a===`srgb`){if(i=t.get(`WEBGL_compressed_texture_s3tc_srgb`),i!==null){if(n===33776)return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null}else if(i=t.get(`WEBGL_compressed_texture_s3tc`),i!==null){if(n===33776)return i.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===33777)return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===33778)return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===33779)return i.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null}if(n===35840||n===35841||n===35842||n===35843){if(i=t.get(`WEBGL_compressed_texture_pvrtc`),i!==null){if(n===35840)return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===35841)return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===35842)return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===35843)return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null}if(n===36196||n===37492||n===37496||n===37488||n===37489||n===37490||n===37491){if(i=t.get(`WEBGL_compressed_texture_etc`),i!==null){if(n===36196||n===37492)return a===`srgb`?i.COMPRESSED_SRGB8_ETC2:i.COMPRESSED_RGB8_ETC2;if(n===37496)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:i.COMPRESSED_RGBA8_ETC2_EAC;if(n===37488)return i.COMPRESSED_R11_EAC;if(n===37489)return i.COMPRESSED_SIGNED_R11_EAC;if(n===37490)return i.COMPRESSED_RG11_EAC;if(n===37491)return i.COMPRESSED_SIGNED_RG11_EAC}else return null}if(n===37808||n===37809||n===37810||n===37811||n===37812||n===37813||n===37814||n===37815||n===37816||n===37817||n===37818||n===37819||n===37820||n===37821){if(i=t.get(`WEBGL_compressed_texture_astc`),i!==null){if(n===37808)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:i.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===37809)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:i.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===37810)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:i.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===37811)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:i.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===37812)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:i.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===37813)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:i.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===37814)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:i.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===37815)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:i.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===37816)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:i.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===37817)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:i.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===37818)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:i.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===37819)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:i.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===37820)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:i.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===37821)return a===`srgb`?i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:i.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null}if(n===36492||n===36494||n===36495){if(i=t.get(`EXT_texture_compression_bptc`),i!==null){if(n===36492)return a===`srgb`?i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:i.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===36494)return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===36495)return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null}if(n===36283||n===36284||n===36285||n===36286){if(i=t.get(`EXT_texture_compression_rgtc`),i!==null){if(n===36283)return i.COMPRESSED_RED_RGTC1_EXT;if(n===36284)return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===36285)return i.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===36286)return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null}return n===1020?e.UNSIGNED_INT_24_8:e[n]===void 0?null:e[n]}return{convert:n}}var Gh=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Kh=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,qh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new Uu(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Fd({vertexShader:Gh,fragmentShader:Kh,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Y(new Cd(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Jh=class extends gs{constructor(e,t){super();let n=this,r=null,i=1,a=null,o=`local-floor`,s=1,c=null,l=null,u=null,d=null,f=null,p=null,m=typeof XRWebGLBinding<`u`,h=new qh,g={},_=t.getContextAttributes(),v=null,y=null,b=[],x=[],S=new H,C=null,w=null,T=new bf;T.viewport=new sc;let E=new bf;E.viewport=new sc;let D=[T,E],O=new Af,k=null,A=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(e){let t=b[e];return t===void 0&&(t=new Vc,b[e]=t),t.getTargetRaySpace()},this.getControllerGrip=function(e){let t=b[e];return t===void 0&&(t=new Vc,b[e]=t),t.getGripSpace()},this.getHand=function(e){let t=b[e];return t===void 0&&(t=new Vc,b[e]=t),t.getHandSpace()};function j(e){let t=x.indexOf(e.inputSource);if(t===-1)return;let n=b[t];n!==void 0&&(n.update(e.inputSource,e.frame,c||a),n.dispatchEvent({type:e.type,data:e.inputSource}))}function ee(){r.removeEventListener(`select`,j),r.removeEventListener(`selectstart`,j),r.removeEventListener(`selectend`,j),r.removeEventListener(`squeeze`,j),r.removeEventListener(`squeezestart`,j),r.removeEventListener(`squeezeend`,j),r.removeEventListener(`end`,ee),r.removeEventListener(`inputsourceschange`,M);for(let e=0;e<b.length;e++){let t=x[e];t!==null&&(x[e]=null,b[e].disconnect(t))}k=null,A=null,h.reset();for(let e in g)delete g[e];if(e.setRenderTarget(v),f=null,d=null,u=null,r=null,y=null,ae.stop(),n.isPresenting=!1,e.setPixelRatio(C),e.setSize(S.width,S.height,!1),w!==null){let e=w.camera;e.fov=w.fov,e.zoom=w.zoom,e.updateProjectionMatrix(),w=null}n.dispatchEvent({type:`sessionend`})}this.setFramebufferScaleFactor=function(e){i=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change framebuffer scale while presenting.`)},this.setReferenceSpaceType=function(e){o=e,n.isPresenting===!0&&z(`WebXRManager: Cannot change reference space type while presenting.`)},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(e){c=e},this.getBaseLayer=function(){return d===null?f:d},this.getBinding=function(){return u===null&&m&&(u=new XRWebGLBinding(r,t)),u},this.getFrame=function(){return p},this.getSession=function(){return r},this.setSession=async function(l){if(r=l,r!==null){if(v=e.getRenderTarget(),r.addEventListener(`select`,j),r.addEventListener(`selectstart`,j),r.addEventListener(`selectend`,j),r.addEventListener(`squeeze`,j),r.addEventListener(`squeezestart`,j),r.addEventListener(`squeezeend`,j),r.addEventListener(`end`,ee),r.addEventListener(`inputsourceschange`,M),_.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(S),m&&`createProjectionLayer`in XRWebGLBinding.prototype){let n=null,a=null,o=null;_.depth&&(o=_.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,n=_.stencil?no:to,a=_.stencil?Ya:Wa);let s={colorFormat:t.RGBA8,depthFormat:o,scaleFactor:i};u=this.getBinding(),d=u.createProjectionLayer(s),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),y=new lc(d.textureWidth,d.textureHeight,{format:eo,type:za,depthTexture:new Vu(d.textureWidth,d.textureHeight,a,void 0,void 0,void 0,void 0,void 0,void 0,n),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let n={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:i};f=new XRWebGLLayer(r,t,n),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new lc(f.framebufferWidth,f.framebufferHeight,{format:eo,type:za,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(s),c=null,a=await r.requestReferenceSpace(o),ae.setContext(r),ae.start(),n.isPresenting=!0,n.dispatchEvent({type:`sessionstart`})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return h.getDepthTexture()};function M(e){for(let t=0;t<e.removed.length;t++){let n=e.removed[t],r=x.indexOf(n);r>=0&&(x[r]=null,b[r].disconnect(n))}for(let t=0;t<e.added.length;t++){let n=e.added[t],r=x.indexOf(n);if(r===-1){for(let e=0;e<b.length;e++)if(e>=x.length){x.push(n),r=e;break}else if(x[e]===null){x[e]=n,r=e;break}if(r===-1)break}let i=b[r];i&&i.connect(n)}}function te(e,t){t===null?e.matrixWorld.copy(e.matrix):e.matrixWorld.multiplyMatrices(t.matrixWorld,e.matrix),e.matrixWorldInverse.copy(e.matrixWorld).invert()}this.updateCamera=function(e){if(r===null)return;let t=e.near,n=e.far;h.texture!==null&&(h.depthNear>0&&(t=h.depthNear),h.depthFar>0&&(n=h.depthFar)),O.near=E.near=T.near=t,O.far=E.far=T.far=n,(k!==O.near||A!==O.far)&&(r.updateRenderState({depthNear:O.near,depthFar:O.far}),k=O.near,A=O.far),O.layers.mask=e.layers.mask|6,T.layers.mask=O.layers.mask&-5,E.layers.mask=O.layers.mask&-3;let i=e.parent,a=O.cameras;te(O,i);for(let e=0;e<a.length;e++)te(a[e],i);O.projectionMatrix.copy(T.projectionMatrix),O.projectionMatrixInverse.copy(T.projectionMatrixInverse),w===null&&e.isPerspectiveCamera&&(w={camera:e,fov:e.fov,zoom:e.zoom}),ne(e,O,i)};function ne(e,t,n){n===null?e.matrix.copy(t.matrixWorld):(e.matrix.copy(n.matrixWorld),e.matrix.invert(),e.matrix.multiply(t.matrixWorld)),e.matrix.decompose(e.position,e.quaternion,e.scale),e.updateMatrixWorld(!0),e.projectionMatrix.copy(t.projectionMatrix),e.projectionMatrixInverse.copy(t.projectionMatrixInverse),e.isPerspectiveCamera&&(e.fov=bs*2*Math.atan(1/e.projectionMatrix.elements[5]),e.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(d!==null||f!==null)return s},this.setFoveation=function(e){s=e,d!==null&&(d.fixedFoveation=e),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=e)},this.hasDepthSensing=function(){return h.texture!==null},this.getDepthSensingMesh=function(){return h.getMesh(O)},this.getCameraTexture=function(e){return g[e]};let re=null;function ie(t,i){if(l=i.getViewerPose(c||a),p=i,l!==null){let t=l.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let i=!1;t.length!==O.cameras.length&&(O.cameras.length=0,i=!0);for(let n=0;n<t.length;n++){let r=t[n],a=null;if(f!==null)a=f.getViewport(r);else{let t=u.getViewSubImage(d,r);a=t.viewport,n===0&&(e.setRenderTargetTextures(y,t.colorTexture,t.depthStencilTexture),e.setRenderTarget(y))}let o=D[n];o===void 0&&(o=new bf,o.layers.enable(n),o.viewport=new sc,D[n]=o),o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.projectionMatrix.fromArray(r.projectionMatrix),o.projectionMatrixInverse.copy(o.projectionMatrix).invert(),o.viewport.set(a.x,a.y,a.width,a.height),n===0&&(O.matrix.copy(o.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),i===!0&&O.cameras.push(o)}let a=r.enabledFeatures;if(a&&a.includes(`depth-sensing`)&&r.depthUsage==`gpu-optimized`&&m){u=n.getBinding();let e=u.getDepthInformation(t[0]);e&&e.isValid&&e.texture&&h.init(e,r.renderState)}if(a&&a.includes(`camera-access`)&&m){e.state.unbindTexture(),u=n.getBinding();for(let e=0;e<t.length;e++){let n=t[e].camera;if(n){let e=g[n];e||(e=new Uu,g[n]=e);let t=u.getCameraImage(n);e.sourceTexture=t}}}}for(let e=0;e<b.length;e++){let t=x[e],n=b[e];t!==null&&n!==void 0&&n.update(t,i,c||a)}re&&re(t,i),i.detectedPlanes&&n.dispatchEvent({type:`planesdetected`,data:i}),p=null}let ae=new qf;ae.setAnimationLoop(ie),this.setAnimationLoop=function(e){re=e},this.dispose=function(){}}},Yh=new fc,Xh=new W;Xh.set(-1,0,0,0,1,0,0,0,1);function Zh(e,t){function n(e,t){e.matrixAutoUpdate===!0&&e.updateMatrix(),t.value.copy(e.matrix)}function r(t,n){n.color.getRGB(t.fogColor.value,jd(e)),n.isFog?(t.fogNear.value=n.near,t.fogFar.value=n.far):n.isFogExp2&&(t.fogDensity.value=n.density)}function i(e,t,n,r,i){t.isNodeMaterial?t.uniformsNeedUpdate=!1:t.isMeshBasicMaterial?a(e,t):t.isMeshLambertMaterial?(a(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshToonMaterial?(a(e,t),d(e,t)):t.isMeshPhongMaterial?(a(e,t),u(e,t),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)):t.isMeshStandardMaterial?(a(e,t),f(e,t),t.isMeshPhysicalMaterial&&p(e,t,i)):t.isMeshMatcapMaterial?(a(e,t),m(e,t)):t.isMeshDepthMaterial?a(e,t):t.isMeshDistanceMaterial?(a(e,t),h(e,t)):t.isMeshNormalMaterial?a(e,t):t.isLineBasicMaterial?(o(e,t),t.isLineDashedMaterial&&s(e,t)):t.isPointsMaterial?c(e,t,n,r):t.isSpriteMaterial?l(e,t):t.isShadowMaterial?(e.color.value.copy(t.color),e.opacity.value=t.opacity):t.isShaderMaterial&&(t.uniformsNeedUpdate=!1)}function a(e,r){e.opacity.value=r.opacity,r.color&&e.diffuse.value.copy(r.color),r.emissive&&e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity),r.map&&(e.map.value=r.map,n(r.map,e.mapTransform)),r.alphaMap&&(e.alphaMap.value=r.alphaMap,n(r.alphaMap,e.alphaMapTransform)),r.bumpMap&&(e.bumpMap.value=r.bumpMap,n(r.bumpMap,e.bumpMapTransform),e.bumpScale.value=r.bumpScale,r.side===1&&(e.bumpScale.value*=-1)),r.normalMap&&(e.normalMap.value=r.normalMap,n(r.normalMap,e.normalMapTransform),e.normalScale.value.copy(r.normalScale),r.side===1&&e.normalScale.value.negate()),r.displacementMap&&(e.displacementMap.value=r.displacementMap,n(r.displacementMap,e.displacementMapTransform),e.displacementScale.value=r.displacementScale,e.displacementBias.value=r.displacementBias),r.emissiveMap&&(e.emissiveMap.value=r.emissiveMap,n(r.emissiveMap,e.emissiveMapTransform)),r.specularMap&&(e.specularMap.value=r.specularMap,n(r.specularMap,e.specularMapTransform)),r.alphaTest>0&&(e.alphaTest.value=r.alphaTest);let i=t.get(r),a=i.envMap,o=i.envMapRotation;a&&(e.envMap.value=a,e.envMapRotation.value.setFromMatrix4(Yh.makeRotationFromEuler(o)).transpose(),a.isCubeTexture&&a.isRenderTargetTexture===!1&&e.envMapRotation.value.premultiply(Xh),e.reflectivity.value=r.reflectivity,e.ior.value=r.ior,e.refractionRatio.value=r.refractionRatio),r.lightMap&&(e.lightMap.value=r.lightMap,e.lightMapIntensity.value=r.lightMapIntensity,n(r.lightMap,e.lightMapTransform)),r.aoMap&&(e.aoMap.value=r.aoMap,e.aoMapIntensity.value=r.aoMapIntensity,n(r.aoMap,e.aoMapTransform))}function o(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform))}function s(e,t){e.dashSize.value=t.dashSize,e.totalSize.value=t.dashSize+t.gapSize,e.scale.value=t.scale}function c(e,t,r,i){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.size.value=t.size*r,e.scale.value=i*.5,t.map&&(e.map.value=t.map,n(t.map,e.uvTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function l(e,t){e.diffuse.value.copy(t.color),e.opacity.value=t.opacity,e.rotation.value=t.rotation,t.map&&(e.map.value=t.map,n(t.map,e.mapTransform)),t.alphaMap&&(e.alphaMap.value=t.alphaMap,n(t.alphaMap,e.alphaMapTransform)),t.alphaTest>0&&(e.alphaTest.value=t.alphaTest)}function u(e,t){e.specular.value.copy(t.specular),e.shininess.value=Math.max(t.shininess,1e-4)}function d(e,t){t.gradientMap&&(e.gradientMap.value=t.gradientMap)}function f(e,t){e.metalness.value=t.metalness,t.metalnessMap&&(e.metalnessMap.value=t.metalnessMap,n(t.metalnessMap,e.metalnessMapTransform)),e.roughness.value=t.roughness,t.roughnessMap&&(e.roughnessMap.value=t.roughnessMap,n(t.roughnessMap,e.roughnessMapTransform)),t.envMap&&(e.envMapIntensity.value=t.envMapIntensity)}function p(e,t,r){e.ior.value=t.ior,t.diffuseRoughness>0&&(e.diffuseRoughness.value=t.diffuseRoughness,t.diffuseRoughnessMap&&(e.diffuseRoughnessMap.value=t.diffuseRoughnessMap,n(t.diffuseRoughnessMap,e.diffuseRoughnessMapTransform))),t.sheen>0&&(e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen),e.sheenRoughness.value=t.sheenRoughness,t.sheenColorMap&&(e.sheenColorMap.value=t.sheenColorMap,n(t.sheenColorMap,e.sheenColorMapTransform)),t.sheenRoughnessMap&&(e.sheenRoughnessMap.value=t.sheenRoughnessMap,n(t.sheenRoughnessMap,e.sheenRoughnessMapTransform))),t.clearcoat>0&&(e.clearcoat.value=t.clearcoat,e.clearcoatRoughness.value=t.clearcoatRoughness,t.clearcoatMap&&(e.clearcoatMap.value=t.clearcoatMap,n(t.clearcoatMap,e.clearcoatMapTransform)),t.clearcoatRoughnessMap&&(e.clearcoatRoughnessMap.value=t.clearcoatRoughnessMap,n(t.clearcoatRoughnessMap,e.clearcoatRoughnessMapTransform)),t.clearcoatNormalMap&&(e.clearcoatNormalMap.value=t.clearcoatNormalMap,n(t.clearcoatNormalMap,e.clearcoatNormalMapTransform),e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale),t.side===1&&e.clearcoatNormalScale.value.negate())),t.dispersion>0&&(e.dispersion.value=t.dispersion),t.retroreflectivity>0&&(e.retroreflectivity.value=t.retroreflectivity),t.iridescence>0&&(e.iridescence.value=t.iridescence,e.iridescenceIOR.value=t.iridescenceIOR,e.iridescenceThicknessMinimum.value=t.iridescenceThicknessMinimum,e.iridescenceThicknessMaximum.value=t.iridescenceThicknessMaximum,t.iridescenceMap&&(e.iridescenceMap.value=t.iridescenceMap,n(t.iridescenceMap,e.iridescenceMapTransform)),t.iridescenceThicknessMap&&(e.iridescenceThicknessMap.value=t.iridescenceThicknessMap,n(t.iridescenceThicknessMap,e.iridescenceThicknessMapTransform))),t.transmission>0&&(e.transmission.value=t.transmission,e.transmissionSamplerMap.value=r.texture,e.transmissionSamplerSize.value.set(r.width,r.height),t.transmissionMap&&(e.transmissionMap.value=t.transmissionMap,n(t.transmissionMap,e.transmissionMapTransform)),e.thickness.value=t.thickness,t.thicknessMap&&(e.thicknessMap.value=t.thicknessMap,n(t.thicknessMap,e.thicknessMapTransform)),e.attenuationDistance.value=t.attenuationDistance,e.attenuationColor.value.copy(t.attenuationColor)),t.anisotropy>0&&(e.anisotropyVector.value.set(t.anisotropy*Math.cos(t.anisotropyRotation),t.anisotropy*Math.sin(t.anisotropyRotation)),t.anisotropyMap&&(e.anisotropyMap.value=t.anisotropyMap,n(t.anisotropyMap,e.anisotropyMapTransform))),e.specularIntensity.value=t.specularIntensity,e.specularColor.value.copy(t.specularColor),t.specularColorMap&&(e.specularColorMap.value=t.specularColorMap,n(t.specularColorMap,e.specularColorMapTransform)),t.specularIntensityMap&&(e.specularIntensityMap.value=t.specularIntensityMap,n(t.specularIntensityMap,e.specularIntensityMapTransform))}function m(e,t){t.matcap&&(e.matcap.value=t.matcap)}function h(e,n){let r=t.get(n).light;e.referencePosition.value.setFromMatrixPosition(r.matrixWorld),e.nearDistance.value=r.shadow.camera.near,e.farDistance.value=r.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:i}}function Qh(e,t,n,r){let i={},a={};function o(e,t){let n=t.program;r.uniformBlockBinding(e,n,i[e.id])}function s(e,n){let o=i[e.id];o===void 0&&(m(e),o=c(e),i[e.id]=o,e.addEventListener(`dispose`,g));let s=n.program;r.updateUBOMapping(e,s);let u=t.render.frame;a[e.id]!==u&&(l(e),a[e.id]=u)}function c(t){let n=e.createBuffer(),r=t.__size,i=t.usage;return e.bindBuffer(e.UNIFORM_BUFFER,n),e.bufferData(e.UNIFORM_BUFFER,r,i),e.bindBuffer(e.UNIFORM_BUFFER,null),n}function l(t){let n=i[t.id],r=t.uniforms,a=t.__cache;e.bindBuffer(e.UNIFORM_BUFFER,n);for(let e=0,t=r.length;e<t;e++){let t=r[e];if(Array.isArray(t))for(let n=0,r=t.length;n<r;n++)u(t[n],e,n,a);else u(t,e,0,a)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function u(t,n,r,i){if(f(t,n,r,i)===!0){let n=t.__offset,r=t.value;if(Array.isArray(r)){let e=0;for(let n=0;n<r.length;n++){let i=r[n],a=h(i,!0);d(i,t.__data,e),e+=a.storage/Float32Array.BYTES_PER_ELEMENT}}else d(r,t.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,n,t.__data)}}function d(e,t,n){typeof e==`number`||typeof e==`boolean`?t[n]=e:e.isMatrix3?(t[n]=e.elements[0],t[n+1]=e.elements[1],t[n+2]=e.elements[2],t[n+3]=0,t[n+4]=e.elements[3],t[n+5]=e.elements[4],t[n+6]=e.elements[5],t[n+7]=0,t[n+8]=e.elements[6],t[n+9]=e.elements[7],t[n+10]=e.elements[8],t[n+11]=0):ArrayBuffer.isView(e)?t.set(e.subarray(0,t.length-n),n):e.toArray(t,n)}function f(e,t,n,r){let i=e.value,a=t+`_`+n;if(Array.isArray(i)){r[a]===void 0&&(r[a]=[]);let e=r[a],t=!1;for(let n=0;n<i.length;n++)p(i[n],e,n)===!0&&(t=!0);return t}return p(i,r,a)}function p(e,t,n){if(t[n]===void 0)return t[n]=typeof e==`number`||typeof e==`boolean`?e:ArrayBuffer.isView(e)?e.slice():e.clone(),!0;{let r=t[n];if(typeof e==`number`||typeof e==`boolean`){if(r!==e)return t[n]=e,!0}else if(ArrayBuffer.isView(e))return!0;else if(r.equals(e)===!1)return r.copy(e),!0}return!1}function m(e){let t=e.uniforms,n=0;for(let e=0,r=t.length;e<r;e++){let r=Array.isArray(t[e])?t[e]:[t[e]];for(let i=0,a=r.length;i<a;i++){let a=r[i],o=Array.isArray(a.value)?a.value:[a.value],s=Array.isArray(t[e])||Array.isArray(a.value),c=n;for(let e=0,t=o.length;e<t;e++){let t=o[e],r=h(t,s),i=n%16,a=i%r.boundary,l=i+a;n+=a,l!==0&&16-l<r.storage&&(n+=16-l),e===0&&(c=n),n+=r.storage}a.__data=new(a.type===`int`?Int32Array:a.type===`uint`?Uint32Array:Float32Array)((n-c)/Float32Array.BYTES_PER_ELEMENT),a.__offset=c}}let r=n%16;return r>0&&(n+=16-r),e.__size=n,e.__cache={},this}function h(e,t){let n={boundary:0,storage:0};return typeof e==`number`||typeof e==`boolean`?(n.boundary=4,n.storage=4):e.isVector2?(n.boundary=8,n.storage=8):e.isVector3||e.isColor?(n.boundary=16,n.storage=12):e.isVector4?(n.boundary=16,n.storage=16):e.isMatrix3?(n.boundary=16,n.storage=48):e.isMatrix4?(n.boundary=16,n.storage=64):e.isTexture?z(`WebGLRenderer: Texture samplers can not be part of an uniforms group.`):ArrayBuffer.isView(e)?(n.boundary=16,n.storage=e.byteLength):z(`WebGLRenderer: Unsupported uniform value type.`,e),t===!0&&(n.boundary=16,n.storage=Math.ceil(n.storage/16)*16),n}function g(t){let n=t.target;n.removeEventListener(`dispose`,g),e.deleteBuffer(i[n.id]),delete i[n.id],delete a[n.id]}function _(){for(let t in i)e.deleteBuffer(i[t]);i={},a={}}return{bind:o,update:s,dispose:_}}var $h=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),eg=null;function tg(){return eg===null&&(eg=new Mu($h,16,16,ao,Ka),eg.name=`DFG_LUT`,eg.minFilter=Ia,eg.magFilter=Ia,eg.wrapS=ja,eg.wrapT=ja,eg.generateMipmaps=!1,eg.needsUpdate=!0),eg}var ng=class{constructor(e={}){let{canvas:t=ls(),context:n=null,depth:r=!0,stencil:i=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:s=!0,preserveDrawingBuffer:c=!1,powerPreference:l=`default`,failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=za}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<`u`&&n instanceof WebGLRenderingContext)throw Error(`THREE.WebGLRenderer: WebGL 1 is not supported since r163.`);p=n.getContextAttributes().alpha}else p=a;let m=f,h=new Set([so,oo,io]),g=new Set([za,Wa,Ha,Ya,qa,Ja]),_=new Uint32Array(4),v=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,x=null,S=[],C=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=0,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,E=!1,D=null,O=null,k=null,A=null;this._outputColorSpace=$o;let j=0,ee=0,M=null,te=-1,ne=null,re=new sc,ie=new sc,ae=null,oe=new q(0),se=0,N=t.width,ce=t.height,P=1,le=null,ue=null,de=new sc(0,0,N,ce),fe=new sc(0,0,N,ce),pe=!1,me=new Iu,he=new Ru,ge=!1,_e=!1,ve=new fc,ye=new U,be=new sc,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Se=!1;function Ce(){return M===null?P:1}let F=n;function we(e,n){return t.getContext(e,n)}let Te,Ee,I,De,L,R,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We;try{let e={alpha:!0,depth:r,stencil:i,antialias:o,premultipliedAlpha:s,preserveDrawingBuffer:c,powerPreference:l,failIfMajorPerformanceCaveat:u};if(`setAttribute`in t&&t.setAttribute(`data-engine`,`three.js r187`),t.addEventListener(`webglcontextlost`,qe,!1),t.addEventListener(`webglcontextrestored`,Je,!1),t.addEventListener(`webglcontextcreationerror`,Ye,!1),F===null){let t=`webgl2`;if(F=we(t,e),F===null)throw we(t)?Error(`THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.`):Error(`THREE.WebGLRenderer: Error creating WebGL context.`)}Ge()}catch(e){throw t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),B(`WebGLRenderer: `+e.message),e}function Ge(){Te=new Sp(F),Te.init(),He=new Wh(F,Te),Ee=new np(F,Te,e,He),I=new Hh(F,Te),Ee.reversedDepthBuffer&&d&&I.buffers.depth.setReversed(!0),O=F.createFramebuffer(),k=F.createFramebuffer(),A=F.createFramebuffer(),De=new Tp(F),L=new Sh,R=new Uh(F,Te,I,L,Ee,He,De),Oe=new xp(T),ke=new Jf(F),Ue=new ep(F,ke),Ae=new Cp(F,ke,De,Ue),je=new Dp(F,Ae,ke,Ue,De),ze=new Ep(F,Ee,R),Ie=new rp(L),Me=new xh(T,Oe,Te,Ee,Ue,Ie),Ne=new Zh(T,L),Pe=new Eh,Fe=new Nh(Te),Re=new $f(T,Oe,I,je,p,s),Le=new Vh(T,je,Ee),We=new Qh(F,De,Ee,I),Be=new tp(F,Te,De),Ve=new wp(F,Te,De),De.programs=Me.programs,T.capabilities=Ee,T.extensions=Te,T.properties=L,T.renderLists=Pe,T.shadowMap=Le,T.state=I,T.info=De}m!==1009&&(w=new kp(m,t.width,t.height,o,r,i));let Ke=new Jh(T,F);this.xr=Ke,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.loseContext()},this.forceContextRestore=function(){let e=Te.get(`WEBGL_lose_context`);e&&e.restoreContext()},this.getPixelRatio=function(){return P},this.setPixelRatio=function(e){e!==void 0&&(P=e,this.setSize(N,ce,!1))},this.getSize=function(e){return e.set(N,ce)},this.setSize=function(e,n,r=!0){Ke.isPresenting?z(`WebGLRenderer: Can't change size while VR device is presenting.`):(N=e,ce=n,t.width=Math.floor(e*P),t.height=Math.floor(n*P),r===!0&&(t.style.width=e+`px`,t.style.height=n+`px`),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,e,n))},this.getDrawingBufferSize=function(e){return e.set(N*P,ce*P).floor()},this.setDrawingBufferSize=function(e,n,r){N=e,ce=n,P=r,t.width=Math.floor(e*r),t.height=Math.floor(n*r),this.setViewport(0,0,e,n)},this.setEffects=function(e){if(m===1009)B(`WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.`);else{if(e){for(let t=0;t<e.length;t++)if(e[t].isOutputPass===!0){z(`WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.`);break}}w.setEffects(e||[])}},this.getCurrentViewport=function(e){return e.copy(re)},this.getViewport=function(e){return e.copy(de)},this.setViewport=function(e,t,n,r){e.isVector4?de.set(e.x,e.y,e.z,e.w):de.set(e,t,n,r),I.viewport(re.copy(de).multiplyScalar(Ce()).round())},this.getScissor=function(e){return e.copy(fe)},this.setScissor=function(e,t,n,r){e.isVector4?fe.set(e.x,e.y,e.z,e.w):fe.set(e,t,n,r),I.scissor(ie.copy(fe).multiplyScalar(Ce()).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(e){I.setScissorTest(pe=e)},this.setOpaqueSort=function(e){le=e},this.setTransparentSort=function(e){ue=e},this.getClearColor=function(e){return e.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(e=!0,t=!0,n=!0){let r=0;if(e){let e=!1;if(M!==null){let t=M.texture.format;e=h.has(t)}if(e){let e=M.texture.type,t=g.has(e),n=Re.getClearColor(),r=Re.getClearAlpha(),i=n.r,a=n.g,o=n.b;t?(_[0]=i,_[1]=a,_[2]=o,_[3]=r,F.clearBufferuiv(F.COLOR,0,_)):(v[0]=i,v[1]=a,v[2]=o,v[3]=r,F.clearBufferiv(F.COLOR,0,v))}else r|=F.COLOR_BUFFER_BIT}t&&(r|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),n&&(r|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),r!==0&&F.clear(r)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(e){e.setRenderer(this),D=e},this.dispose=function(){t.removeEventListener(`webglcontextlost`,qe,!1),t.removeEventListener(`webglcontextrestored`,Je,!1),t.removeEventListener(`webglcontextcreationerror`,Ye,!1),Re.dispose(),Pe.dispose(),Fe.dispose(),R.dispose(),L.dispose(),Oe.dispose(),je.dispose(),Ae.dispose(),Ue.dispose(),We.dispose(),Me.dispose(),Ke.dispose(),Ke.removeEventListener(`sessionstart`,nt),Ke.removeEventListener(`sessionend`,rt),it.stop()};function qe(e){e.preventDefault(),ds(`WebGLRenderer: Context Lost.`),E=!0}function Je(){ds(`WebGLRenderer: Context Restored.`),E=!1;let e=De.autoReset,t=Le.enabled,n=Le.autoUpdate,r=Le.needsUpdate,i=Le.type;Ge(),De.autoReset=e,Le.enabled=t,Le.autoUpdate=n,Le.needsUpdate=r,Le.type=i}function Ye(e){B(`WebGLRenderer: A WebGL context could not be created. Reason: `,e.statusMessage)}function Xe(e){let t=e.target;t.removeEventListener(`dispose`,Xe),Ze(t)}function Ze(e){Qe(e),L.remove(e)}function Qe(e){let t=L.get(e).programs;t!==void 0&&(t.forEach(function(e){Me.releaseProgram(e)}),e.isShaderMaterial&&Me.releaseShaderCache(e))}this.renderBufferDirect=function(e,t,n,r,i,a){t===null&&(t=xe);let o=i.isMesh&&i.matrixWorld.determinantAffine()<0,s=ht(e,t,n,r,i);I.setMaterial(r,o);let c=n.index,l=1;if(r.wireframe===!0){if(c=Ae.getWireframeAttribute(n),c===void 0)return;l=2}let u=n.drawRange,d=n.attributes.position,f=u.start*l,p=(u.start+u.count)*l;a!==null&&(f=Math.max(f,a.start*l),p=Math.min(p,(a.start+a.count)*l)),c===null?d!=null&&(f=Math.max(f,0),p=Math.min(p,d.count)):(f=Math.max(f,0),p=Math.min(p,c.count));let m=p-f;if(m<0||m===1/0)return;Ue.setup(i,r,s,n,c);let h,g=Be;if(c!==null&&(h=ke.get(c),g=Ve,g.setIndex(h)),i.isMesh)r.wireframe===!0?(I.setLineWidth(r.wireframeLinewidth*Ce()),g.setMode(F.LINES)):g.setMode(F.TRIANGLES);else if(i.isLine){let e=r.linewidth;e===void 0&&(e=1),I.setLineWidth(e*Ce()),i.isLineSegments?g.setMode(F.LINES):i.isLineLoop?g.setMode(F.LINE_LOOP):g.setMode(F.LINE_STRIP)}else i.isPoints?g.setMode(F.POINTS):i.isSprite&&g.setMode(F.TRIANGLES);if(i.isBatchedMesh){if(Te.get(`WEBGL_multi_draw`))g.renderMultiDraw(i._multiDrawStarts,i._multiDrawCounts,i._multiDrawCount);else{let e=i._multiDrawStarts,t=i._multiDrawCounts,n=i._multiDrawCount,a=c?ke.get(c).bytesPerElement:1,o=L.get(r).currentProgram.getUniforms();for(let r=0;r<n;r++)o.setValue(F,`_gl_DrawID`,r),g.render(e[r]/a,t[r])}}else if(i.isInstancedMesh)g.renderInstances(f,m,i.count);else if(n.isInstancedBufferGeometry){let e=n._maxInstanceCount===void 0?1/0:n._maxInstanceCount,t=Math.min(n.instanceCount,e);g.renderInstances(f,m,t)}else g.render(f,m)};function $e(e,t,n,r){D!==null&&e.isNodeMaterial&&D.setObject(r,e),ge===!0&&Ie.setState(e,n,!1),e.transparent===!0&&e.side===2&&e.forceSinglePass===!1?(e.side=1,e.needsUpdate=!0,dt(e,t,r),e.side=0,e.needsUpdate=!0,dt(e,t,r),e.side=2):dt(e,t,r)}this.compile=function(e,t,n=null){n===null&&(n=e),D!==null&&D.renderStart(e,t,n),x=Fe.get(n),x.init(t),C.push(x),n.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),e!==n&&e.traverseVisible(function(e){e.isLight&&e.layers.test(t.layers)&&(x.pushLight(e),e.castShadow&&x.pushShadow(e))}),x.setupLights(),D!==null&&D.updateLights(x.state.lightsArray),_e=this.localClippingEnabled,ge=Ie.init(this.clippingPlanes,_e),ge===!0&&Ie.setGlobalState(this.clippingPlanes,t),D!==null&&Le.render(x.state.shadowsArray,n,t);let r=new Set;return e.traverse(function(e){if(!(e.isMesh||e.isPoints||e.isLine||e.isSprite))return;let i=e.material;if(i){if(Array.isArray(i))for(let a=0;a<i.length;a++){let o=i[a];$e(o,n,t,e),r.add(o)}else $e(i,n,t,e),r.add(i)}}),x=C.pop(),D!==null&&D.renderEnd(),r},this.compileAsync=function(e,t,n=null){let r=this.compile(e,t,n);return new Promise(t=>{function n(){r.forEach(function(e){let t=L.get(e).currentProgram;(t===void 0||t.isReady())&&r.delete(e)}),r.size===0?t(e):setTimeout(n,10)}Te.get(`KHR_parallel_shader_compile`)===null?setTimeout(n,10):n()})};let et=null;function tt(e){et&&et(e)}function nt(){it.stop()}function rt(){it.start()}let it=new qf;it.setAnimationLoop(tt),typeof self<`u`&&it.setContext(self),this.setAnimationLoop=function(e){et=e,Ke.setAnimationLoop(e),e===null?it.stop():it.start()},Ke.addEventListener(`sessionstart`,nt),Ke.addEventListener(`sessionend`,rt),this.render=function(e,t){if(t!==void 0&&t.isCamera!==!0){B(`WebGLRenderer.render: camera is not an instance of THREE.Camera.`);return}if(E===!0)return;D!==null&&D.renderStart(e,t);let n=Ke.enabled===!0&&Ke.isPresenting===!0,r=w!==null&&(M===null||n)&&w.begin(T,M);if(e.matrixWorldAutoUpdate===!0&&e.updateMatrixWorld(),t.parent===null&&t.matrixWorldAutoUpdate===!0&&t.updateMatrixWorld(),Ke.enabled===!0&&Ke.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ke.cameraAutoUpdate===!0&&Ke.updateCamera(t),t=Ke.getCamera()),e.isScene===!0&&e.onBeforeRender(T,e,t,M),x=Fe.get(e,C.length),x.init(t),x.state.textureUnits=R.getTextureUnits(),C.push(x),ve.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),t.isArrayCamera?he.setFromArrayCamera(t):me.setFromProjectionMatrix(ve,as,t.reversedDepth),_e=this.localClippingEnabled,ge=Ie.init(this.clippingPlanes,_e),b=Pe.get(e,S.length),b.init(),S.push(b),this.info.render.frame++,Ke.enabled===!0&&Ke.isPresenting===!0){let e=T.xr.getDepthSensingMesh();e!==null&&at(e,t,-1/0,T.sortObjects)}at(e,t,0,T.sortObjects),b.finish(),D!==null&&D.updateLights(x.state.lightsArray),T.sortObjects===!0&&b.sort(le,ue),Se=Ke.enabled===!1||Ke.isPresenting===!1||Ke.hasDepthSensing()===!1,Se&&Re.addToRenderList(b,e),this.info.autoReset===!0&&this.info.reset(),ge===!0&&Ie.beginShadows();let i=x.state.shadowsArray;if(Le.render(i,e,t),ge===!0&&Ie.endShadows(),(r&&w.hasRenderPass())===!1){let n=b.opaque,r=b.transmissive;if(x.setupLights(),t.isArrayCamera){let i=t.cameras;if(r.length>0)for(let t=0,a=i.length;t<a;t++){let a=i[t];st(n,r,e,a)}Se&&Re.render(e);for(let t=0,n=i.length;t<n;t++){let n=i[t];ot(b,e,n,n.viewport)}}else r.length>0&&st(n,r,e,t),Se&&Re.render(e),ot(b,e,t)}M!==null&&ee===0&&(R.updateMultisampleRenderTarget(M),R.updateRenderTargetMipmap(M)),r&&w.end(T),e.isScene===!0&&e.onAfterRender(T,e,t),Ue.resetDefaultState(),te=-1,ne=null,C.pop(),C.length>0?(x=C[C.length-1],R.setTextureUnits(x.state.textureUnits),ge===!0&&Ie.setGlobalState(T.clippingPlanes,x.state.camera)):x=null,S.pop(),b=S.length>0?S[S.length-1]:null,D!==null&&D.renderEnd()};function at(e,t,n,r){if(e.visible===!1)return;if(e.layers.test(t.layers)){if(e.isGroup)n=e.renderOrder;else if(e.isLOD)e.autoUpdate===!0&&e.update(t);else if(e.isLight)x.pushLight(e),e.castShadow&&x.pushShadow(e);else if(e.isSprite){let i=t.isArrayCamera?he:me;if(!e.frustumCulled||e.intersectsFrustum(i)){r&&be.setFromMatrixPosition(e.matrixWorld).applyMatrix4(ve);let i=je.update(e),a=e.material;a.visible&&b.push(e,i,a,n,be.z,null,t)}}else if(e.isMesh||e.isLine||e.isPoints){let i=t.isArrayCamera?he:me;if(!e.frustumCulled||e.intersectsFrustum(i)){let i=je.update(e),a=e.material;if(r&&(e.boundingSphere===void 0?(i.boundingSphere===null&&i.computeBoundingSphere(),be.copy(i.boundingSphere.center)):(e.boundingSphere===null&&e.computeBoundingSphere(),be.copy(e.boundingSphere.center)),be.applyMatrix4(e.matrixWorld).applyMatrix4(ve)),Array.isArray(a)){let r=i.groups;for(let o=0,s=r.length;o<s;o++){let s=r[o],c=a[s.materialIndex];c&&c.visible&&b.push(e,i,c,n,be.z,s,t)}}else a.visible&&b.push(e,i,a,n,be.z,null,t)}}}let i=e.children;for(let e=0,a=i.length;e<a;e++)at(i[e],t,n,r)}function ot(e,t,n,r){let{opaque:i,transmissive:a,transparent:o}=e;x.setupLightsView(n),ge===!0&&Ie.setGlobalState(T.clippingPlanes,n),r&&I.viewport(re.copy(r)),i.length>0&&ct(i,t,n),a.length>0&&ct(a,t,n),o.length>0&&ct(o,t,n),I.buffers.depth.setTest(!0),I.buffers.depth.setMask(!0),I.buffers.color.setMask(!0),I.setPolygonOffset(!1)}function st(e,t,n,r){if((n.isScene===!0?n.overrideMaterial:null)!==null)return;if(x.state.transmissionRenderTarget[r.id]===void 0){let e=Te.has(`EXT_color_buffer_half_float`)||Te.has(`EXT_color_buffer_float`);x.state.transmissionRenderTarget[r.id]=new lc(1,1,{generateMipmaps:!0,type:e?Ka:za,minFilter:Ra,samples:Math.max(4,Ee.samples),stencilBuffer:i,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:G.workingColorSpace})}let a=x.state.transmissionRenderTarget[r.id],o=r.viewport||re;a.setSize(o.z*T.transmissionResolutionScale,o.w*T.transmissionResolutionScale);let s=T.getRenderTarget(),c=T.getActiveCubeFace(),l=T.getActiveMipmapLevel();T.setRenderTarget(a),T.getClearColor(oe),se=T.getClearAlpha(),se<1&&T.setClearColor(16777215,.5),T.clear(),Se&&Re.render(n);let u=T.toneMapping;T.toneMapping=0;let d=r.viewport;if(r.viewport!==void 0&&(r.viewport=void 0),x.setupLightsView(r),ge===!0&&Ie.setGlobalState(T.clippingPlanes,r),ct(e,n,r),R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a),Te.has(`WEBGL_multisampled_render_to_texture`)===!1){let e=!1;for(let i=0,a=t.length;i<a;i++){let{object:a,geometry:o,material:s,group:c}=t[i];if(s.side===2&&a.layers.test(r.layers)){let t=s.side;s.side=1,s.needsUpdate=!0,lt(a,n,r,o,s,c),s.side=t,s.needsUpdate=!0,e=!0}}e===!0&&(R.updateMultisampleRenderTarget(a),R.updateRenderTargetMipmap(a))}T.setRenderTarget(s,c,l),T.setClearColor(oe,se),d!==void 0&&(r.viewport=d),T.toneMapping=u}function ct(e,t,n){let r=t.isScene===!0?t.overrideMaterial:null;for(let i=0,a=e.length;i<a;i++){let a=e[i],{object:o,geometry:s,group:c}=a,l=a.material;l.allowOverride===!0&&r!==null&&(l=r),o.layers.test(n.layers)&&lt(o,t,n,s,l,c)}}function lt(e,t,n,r,i,a){D!==null&&i.isNodeMaterial&&D.setObject(e,i),e.onBeforeRender(T,t,n,r,i,a),e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse,e.matrixWorld),e.normalMatrix.getNormalMatrix(e.modelViewMatrix),i.onBeforeRender(T,t,n,r,e,a),i.transparent===!0&&i.side===2&&i.forceSinglePass===!1?(i.side=1,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=0,i.needsUpdate=!0,T.renderBufferDirect(n,t,r,i,e,a),i.side=2):T.renderBufferDirect(n,t,r,i,e,a),e.onAfterRender(T,t,n,r,i,a)}function ut(e){let t=0;for(let n of e)n.texture!==null&&t++;return t}function dt(e,t,n){t.isScene!==!0&&(t=xe);let r=L.get(e),i=x.state.lights,a=x.state.shadowsArray,o=i.state.version,s=Me.getParameters(e,i.state,a,t,n,x.state.lightProbeGridArray),c=Me.getProgramCacheKey(s),l=r.programs;r.environment=e.isMeshStandardMaterial||e.isMeshLambertMaterial||e.isMeshPhongMaterial?t.environment:null,r.fog=t.fog;let u=e.isMeshStandardMaterial||e.isMeshLambertMaterial&&!e.envMap||e.isMeshPhongMaterial&&!e.envMap;r.envMap=Oe.get(e.envMap||r.environment,u),r.envMapRotation=r.environment!==null&&e.envMap===null?t.environmentRotation:e.envMapRotation,l===void 0&&(e.addEventListener(`dispose`,Xe),l=new Map,r.programs=l,r.programVariants=new Map);let d=l.get(c);if(d!==void 0){if(r.currentProgram===d&&r.lightsStateVersion===o)return mt(e,s),d}else s.uniforms=Me.getUniforms(e),D!==null&&e.isNodeMaterial&&D.build(e,n,s),e.onBeforeCompile(s,T),d=Me.acquireProgram(s,c),l.set(c,d),r.uniforms=s.uniforms;let f=r.uniforms;return(!e.isShaderMaterial&&!e.isRawShaderMaterial||e.clipping===!0)&&(f.clippingPlanes=Ie.uniform),mt(e,s),r.needsLights=_t(e),r.lightsStateVersion=o,r.needsLights&&(f.ambientLightColor.value=i.state.ambient,f.lightProbe.value=i.state.probe,f.sunLights.value=i.state.sun,f.sunLightShadows.value=i.state.sunShadow,f.directionalLights.value=i.state.directional,f.directionalLightShadows.value=i.state.directionalShadow,f.spotLights.value=i.state.spot,f.spotLightShadows.value=i.state.spotShadow,f.rectAreaLights.value=i.state.rectArea,f.ltc_1.value=i.state.rectAreaLTC1,f.ltc_2.value=i.state.rectAreaLTC2,f.pointLights.value=i.state.point,f.pointLightShadows.value=i.state.pointShadow,f.hemisphereLights.value=i.state.hemi,f.sunShadowMatrix.value=i.state.sunShadowMatrix,f.sunShadowCascade.value=i.state.sunShadowCascade,f.directionalShadowMatrix.value=i.state.directionalShadowMatrix,f.spotLightMatrix.value=i.state.spotLightMatrix,f.spotLightMap.value=i.state.spotLightMap,f.pointShadowMatrix.value=i.state.pointShadowMatrix),r.numLightProbeGrids=ut(x.state.lightProbeGridArray),r.currentProgram=d,r.uniformsList=null,d}function ft(e,t,n,r,i){let a=L.get(e),o=a.currentProgram.id+`,`+r+`,`+i,s=a.programVariants.get(o);return s===void 0?(s=dt(e,t,n),a.programVariants.set(o,s)):(a.currentProgram=s,a.uniformsList=null,a.outputColorSpace=r,a.toneMapping=i),s}function pt(e){if(e.uniformsList===null){let t=e.currentProgram.getUniforms();e.uniformsList=Rm.seqWithValue(t.seq,e.uniforms)}return e.uniformsList}function mt(e,t){let n=L.get(e);n.outputColorSpace=t.outputColorSpace,n.batching=t.batching,n.batchingColor=t.batchingColor,n.instancing=t.instancing,n.instancingColor=t.instancingColor,n.instancingMorph=t.instancingMorph,n.skinning=t.skinning,n.morphTargets=t.morphTargets,n.morphNormals=t.morphNormals,n.morphColors=t.morphColors,n.morphTargetsCount=t.morphTargetsCount,n.numClippingPlanes=t.numClippingPlanes,n.numIntersection=t.numClipIntersection,n.vertexAlphas=t.vertexAlphas,n.vertexTangents=t.vertexTangents,n.toneMapping=t.toneMapping}function ht(e,t,n,r,i){t.isScene!==!0&&(t=xe),R.resetTextureUnits();let a=t.fog,o=r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial?t.environment:null,s=M===null?T.outputColorSpace:M.isXRRenderTarget===!0?M.texture.colorSpace:G.workingColorSpace,c=r.isMeshStandardMaterial||r.isMeshLambertMaterial&&!r.envMap||r.isMeshPhongMaterial&&!r.envMap,l=Oe.get(r.envMap||o,c),u=r.vertexColors===!0&&!!n.attributes.color&&n.attributes.color.itemSize===4,d=!!n.attributes.tangent&&(!!r.normalMap||r.anisotropy>0),f=!!n.morphAttributes.position,p=!!n.morphAttributes.normal,m=!!n.morphAttributes.color,h=0;r.toneMapped&&(M===null||M.isXRRenderTarget===!0)&&(h=T.toneMapping);let g=n.morphAttributes.position||n.morphAttributes.normal||n.morphAttributes.color,_=g===void 0?0:g.length,v=L.get(r),b=x.state.lights;if(ge===!0&&(_e===!0||e!==ne)){let t=e===ne&&r.id===te;Ie.setState(r,e,t)}let S=!1,C=!1;r.version===v.__version?v.needsLights&&v.lightsStateVersion!==b.state.version||i.isBatchedMesh&&v.batching===!1||!i.isBatchedMesh&&v.batching===!0||i.isBatchedMesh&&v.batchingColor===!0&&i._colorsTexture===null||i.isBatchedMesh&&v.batchingColor===!1&&i._colorsTexture!==null||i.isInstancedMesh&&v.instancing===!1||!i.isInstancedMesh&&v.instancing===!0||i.isSkinnedMesh&&v.skinning===!1||!i.isSkinnedMesh&&v.skinning===!0||i.isInstancedMesh&&v.instancingColor===!0&&i.instanceColor===null||i.isInstancedMesh&&v.instancingColor===!1&&i.instanceColor!==null||i.isInstancedMesh&&v.instancingMorph===!0&&i.morphTexture===null||i.isInstancedMesh&&v.instancingMorph===!1&&i.morphTexture!==null?S=!0:v.envMap===l?r.fog===!0&&v.fog!==a||v.numClippingPlanes!==void 0&&(v.numClippingPlanes!==Ie.numPlanes||v.numIntersection!==Ie.numIntersection)?S=!0:v.vertexAlphas===u&&v.vertexTangents===d&&v.morphTargets===f&&v.morphNormals===p&&v.morphColors===m&&v.morphTargetsCount===_&&v.numLightProbeGrids===ut(x.state.lightProbeGridArray)?(v.outputColorSpace!==s||v.toneMapping!==h)&&(C=!0):S=!0:S=!0:(S=!0,v.__version=r.version);let w=v.currentProgram;(S===!0||C===!0)&&(w=C===!0?ft(r,t,i,s,h):dt(r,t,i),D&&r.isNodeMaterial&&D.onUpdateProgram(r,w,v));let E=!1,O=!1,k=!1,A=w.getUniforms(),j=v.uniforms;if(I.useProgram(w.program)&&(E=!0,O=!0,k=!0),r.id!==te&&(te=r.id,O=!0),E||ne!==e){I.buffers.depth.getReversed()&&e.reversedDepth!==!0&&(e._reversedDepth=!0,e.updateProjectionMatrix()),A.setValue(F,`projectionMatrix`,e.projectionMatrix),A.setValue(F,`viewMatrix`,e.matrixWorldInverse);let t=A.map.cameraPosition;t!==void 0&&t.setValue(F,ye.setFromMatrixPosition(e.matrixWorld)),Ee.logarithmicDepthBuffer&&A.setValue(F,`logDepthBufFC`,2/(Math.log(e.far+1)/Math.LN2)),(r.isMeshPhongMaterial||r.isMeshToonMaterial||r.isMeshLambertMaterial||r.isMeshBasicMaterial||r.isMeshStandardMaterial||r.isShaderMaterial)&&A.setValue(F,`isOrthographic`,e.isOrthographicCamera===!0),ne!==e&&(ne=e,O=!0,k=!0)}if(v.needsLights&&(b.state.sunShadowMap.length>0&&A.setValue(F,`sunShadowMap`,b.state.sunShadowMap,R),b.state.directionalShadowMap.length>0&&A.setValue(F,`directionalShadowMap`,b.state.directionalShadowMap,R),b.state.spotShadowMap.length>0&&A.setValue(F,`spotShadowMap`,b.state.spotShadowMap,R),b.state.pointShadowMap.length>0&&A.setValue(F,`pointShadowMap`,b.state.pointShadowMap,R)),i.isSkinnedMesh){A.setOptional(F,i,`bindMatrix`),A.setOptional(F,i,`bindMatrixInverse`);let e=i.skeleton;e&&(e.boneTexture===null&&e.computeBoneTexture(),A.setValue(F,`boneTexture`,e.boneTexture,R))}i.isBatchedMesh&&(A.setOptional(F,i,`batchingTexture`),A.setValue(F,`batchingTexture`,i._matricesTexture,R),A.setOptional(F,i,`batchingIdTexture`),A.setValue(F,`batchingIdTexture`,i._indirectTexture,R),A.setOptional(F,i,`batchingColorTexture`),i._colorsTexture!==null&&A.setValue(F,`batchingColorTexture`,i._colorsTexture,R));let ee=n.morphAttributes;if((ee.position!==void 0||ee.normal!==void 0||ee.color!==void 0)&&ze.update(i,n,w),(O||v.receiveShadow!==i.receiveShadow)&&(v.receiveShadow=i.receiveShadow,A.setValue(F,`receiveShadow`,i.receiveShadow)),(r.isMeshStandardMaterial||r.isMeshLambertMaterial||r.isMeshPhongMaterial)&&r.envMap===null&&t.environment!==null&&(j.envMapIntensity.value=t.environmentIntensity),j.dfgLUT!==void 0&&(j.dfgLUT.value=tg()),O){if(A.setValue(F,`toneMappingExposure`,T.toneMappingExposure),v.needsLights&&gt(j,k),a&&r.fog===!0&&Ne.refreshFogUniforms(j,a),Ne.refreshMaterialUniforms(j,r,P,ce,x.state.transmissionRenderTarget[e.id]),v.needsLights&&v.numLightProbeGrids>0){let e=y,t=0;for(let n of x.state.lightProbeGridArray)n.texture!==null&&(e.textures[t]=n.texture,e.min[t]=n.boundingBox.min,e.max[t]=n.boundingBox.max,e.resolution[t]=n.resolution,t++);for(let n in e)e[n].length=t;j.probesSH.value=e.textures,j.probesMin.value=e.min,j.probesMax.value=e.max,j.probesResolution.value=e.resolution}Rm.upload(F,pt(v),j,R)}if(r.isShaderMaterial&&r.uniformsNeedUpdate===!0&&(Rm.upload(F,pt(v),j,R),r.uniformsNeedUpdate=!1),r.isSpriteMaterial&&A.setValue(F,`center`,i.center),A.setValue(F,`modelViewMatrix`,i.modelViewMatrix),A.setValue(F,`normalMatrix`,i.normalMatrix),A.setValue(F,`modelMatrix`,i.matrixWorld),r.uniformsGroups!==void 0){let e=r.uniformsGroups;for(let t=0,n=e.length;t<n;t++){let n=e[t];We.update(n,w),We.bind(n,w)}}return w}function gt(e,t){e.ambientLightColor.needsUpdate=t,e.lightProbe.needsUpdate=t,e.sunLights.needsUpdate=t,e.sunLightShadows.needsUpdate=t,e.directionalLights.needsUpdate=t,e.directionalLightShadows.needsUpdate=t,e.pointLights.needsUpdate=t,e.pointLightShadows.needsUpdate=t,e.spotLights.needsUpdate=t,e.spotLightShadows.needsUpdate=t,e.rectAreaLights.needsUpdate=t,e.hemisphereLights.needsUpdate=t}function _t(e){return e.isMeshLambertMaterial||e.isMeshToonMaterial||e.isMeshPhongMaterial||e.isMeshStandardMaterial||e.isShadowMaterial||e.isShaderMaterial&&e.lights===!0}this.getActiveCubeFace=function(){return j},this.getActiveMipmapLevel=function(){return ee},this.getRenderTarget=function(){return M},this.setRenderTargetTextures=function(e,t,n){let r=L.get(e);r.__autoAllocateDepthBuffer=e.resolveDepthBuffer===!1,r.__autoAllocateDepthBuffer===!1&&(r.__useRenderToTexture=!1),L.get(e.texture).__webglTexture=t,L.get(e.depthTexture).__webglTexture=r.__autoAllocateDepthBuffer?void 0:n,r.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(e,t){let n=L.get(e);n.__webglFramebuffer=t,n.__useDefaultFramebuffer=t===void 0},this.setRenderTarget=function(e,t=0,n=0){M=e,j=t,ee=n;let r=null,i=!1,a=!1;if(e){let o=L.get(e);if(o.__useDefaultFramebuffer!==void 0){I.bindFramebuffer(F.FRAMEBUFFER,o.__webglFramebuffer),re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest,I.viewport(re),I.scissor(ie),I.setScissorTest(ae),te=-1;return}if(o.__webglFramebuffer===void 0)R.setupRenderTarget(e);else if(o.__hasExternalTextures)R.rebindTextures(e,L.get(e.texture).__webglTexture,L.get(e.depthTexture).__webglTexture);else if(e.depthBuffer){let t=e.depthTexture;if(o.__boundDepthTexture!==t){if(t!==null&&L.has(t)&&(e.width!==t.image.width||e.height!==t.image.height))throw Error(`THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.`);R.setupDepthRenderbuffer(e)}}let s=e.texture;(s.isData3DTexture||s.isDataArrayTexture||s.isCompressedArrayTexture)&&(a=!0);let c=L.get(e).__webglFramebuffer;e.isWebGLCubeRenderTarget?(r=Array.isArray(c[t])?c[t][n]:c[t],i=!0):r=e.samples>0&&R.useMultisampledRTT(e)===!1?L.get(e).__webglMultisampledFramebuffer:Array.isArray(c)?c[n]:c,re.copy(e.viewport),ie.copy(e.scissor),ae=e.scissorTest}else re.copy(de).multiplyScalar(P).floor(),ie.copy(fe).multiplyScalar(P).floor(),ae=pe;if(n!==0&&(r=O),I.bindFramebuffer(F.FRAMEBUFFER,r)&&I.drawBuffers(e,r),I.viewport(re),I.scissor(ie),I.setScissorTest(ae),i){let r=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+t,r.__webglTexture,n)}else if(a){let r=t;for(let t=0;t<e.textures.length;t++){let i=L.get(e.textures[t]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+t,i.__webglTexture,n,r)}}else if(e!==null&&n!==0){let t=L.get(e.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,t.__webglTexture,n)}te=-1};function vt(e){let t=L.get(e);return(t.__readFormat!==e.format||t.__readType!==e.type)&&(t.__readFormat=e.format,t.__readType=e.type,t.__formatReadable=Ee.textureFormatReadable(e.format),t.__typeReadable=Ee.textureTypeReadable(e.type)),t}this.readRenderTargetPixels=function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget)){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);return}let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){I.bindFramebuffer(F.FRAMEBUFFER,c);try{let o=e.textures[s],c=o.format,l=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let u=vt(o);if(u.__formatReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.`);return}if(u.__typeReadable===!1){B(`WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.`);return}t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i&&F.readPixels(t,n,r,i,He.convert(c),He.convert(l),a)}finally{let e=M===null?null:L.get(M).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,e)}}},this.readRenderTargetPixelsAsync=async function(e,t,n,r,i,a,o,s=0){if(!(e&&e.isWebGLRenderTarget))throw Error(`THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.`);let c=L.get(e).__webglFramebuffer;if(e.isWebGLCubeRenderTarget&&o!==void 0&&(c=c[o],Array.isArray(c)&&(c=c[0])),c){if(t>=0&&t<=e.width-r&&n>=0&&n<=e.height-i){I.bindFramebuffer(F.FRAMEBUFFER,c);let o=e.textures[s],l=o.format,u=o.type;e.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+s);let d=vt(o);if(d.__formatReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.`);if(d.__typeReadable===!1)throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.`);let f=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.bufferData(F.PIXEL_PACK_BUFFER,a.byteLength,F.STREAM_READ),F.readPixels(t,n,r,i,He.convert(l),He.convert(u),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let p=M===null?null:L.get(M).__webglFramebuffer;I.bindFramebuffer(F.FRAMEBUFFER,p);let m=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await ms(F,m,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,f),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,a),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(f),F.deleteSync(m),a}throw Error(`THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.`)}},this.copyFramebufferToTexture=function(e,t=null,n=0){let r=2**-n,i=Math.floor(e.image.width*r),a=Math.floor(e.image.height*r),o=t===null?0:t.x,s=t===null?0:t.y;R.setTexture2D(e,0),F.copyTexSubImage2D(F.TEXTURE_2D,n,0,0,o,s,i,a),I.unbindTexture()},this.copyTextureToTexture=function(e,t,n=null,r=null,i=0,a=0){let o,s,c,l,u,d,f,p,m,h=e.isCompressedTexture?e.mipmaps[a]:e.image;if(n!==null)o=n.max.x-n.min.x,s=n.max.y-n.min.y,c=n.isBox3?n.max.z-n.min.z:1,l=n.min.x,u=n.min.y,d=n.isBox3?n.min.z:0;else{let t=2**-i;o=Math.floor(h.width*t),s=Math.floor(h.height*t),c=e.isDataArrayTexture?h.depth:e.isData3DTexture?Math.floor(h.depth*t):1,l=0,u=0,d=0}r===null?(f=0,p=0,m=0):(f=r.x,p=r.y,m=r.z);let g=He.convert(t.format),_=He.convert(t.type),v;t.isData3DTexture?(R.setTexture3D(t,0),v=F.TEXTURE_3D):t.isDataArrayTexture||t.isCompressedArrayTexture?(R.setTexture2DArray(t,0),v=F.TEXTURE_2D_ARRAY):(R.setTexture2D(t,0),v=F.TEXTURE_2D),I.activeTexture(F.TEXTURE0),I.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,t.flipY),I.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,t.premultiplyAlpha),I.pixelStorei(F.UNPACK_ALIGNMENT,t.unpackAlignment);let y=I.getParameter(F.UNPACK_ROW_LENGTH),b=I.getParameter(F.UNPACK_IMAGE_HEIGHT),x=I.getParameter(F.UNPACK_SKIP_PIXELS),S=I.getParameter(F.UNPACK_SKIP_ROWS),C=I.getParameter(F.UNPACK_SKIP_IMAGES);I.pixelStorei(F.UNPACK_ROW_LENGTH,h.width),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,h.height),I.pixelStorei(F.UNPACK_SKIP_PIXELS,l),I.pixelStorei(F.UNPACK_SKIP_ROWS,u),I.pixelStorei(F.UNPACK_SKIP_IMAGES,d);let w=e.isDataArrayTexture||e.isData3DTexture,T=t.isDataArrayTexture||t.isData3DTexture;if(e.isDepthTexture){let n=L.get(e),r=L.get(t),h=L.get(n.__renderTarget),g=L.get(r.__renderTarget);I.bindFramebuffer(F.READ_FRAMEBUFFER,h.__webglFramebuffer),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,g.__webglFramebuffer);for(let n=0;n<c;n++)w&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(e).__webglTexture,i,d+n),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(t).__webglTexture,a,m+n)),F.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,F.DEPTH_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(i!==0||e.isRenderTargetTexture||L.has(e)){let n=L.get(e),r=L.get(t);I.bindFramebuffer(F.READ_FRAMEBUFFER,k),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,A);for(let e=0;e<c;e++)w?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,n.__webglTexture,i,d+e):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,n.__webglTexture,i),T?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,r.__webglTexture,a,m+e):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,r.__webglTexture,a),i===0?T?F.copyTexSubImage3D(v,a,f,p,m+e,l,u,o,s):F.copyTexSubImage2D(v,a,f,p,l,u,o,s):F.blitFramebuffer(l,u,l+o,u+s,f,p,f+o,p+s,F.COLOR_BUFFER_BIT,F.NEAREST);I.bindFramebuffer(F.READ_FRAMEBUFFER,null),I.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else T?e.isDataTexture||e.isData3DTexture?F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h.data):t.isCompressedArrayTexture?F.compressedTexSubImage3D(v,a,f,p,m,o,s,c,g,h.data):F.texSubImage3D(v,a,f,p,m,o,s,c,g,_,h):e.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h.data):e.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,a,f,p,h.width,h.height,g,h.data):F.texSubImage2D(F.TEXTURE_2D,a,f,p,o,s,g,_,h);I.pixelStorei(F.UNPACK_ROW_LENGTH,y),I.pixelStorei(F.UNPACK_IMAGE_HEIGHT,b),I.pixelStorei(F.UNPACK_SKIP_PIXELS,x),I.pixelStorei(F.UNPACK_SKIP_ROWS,S),I.pixelStorei(F.UNPACK_SKIP_IMAGES,C),a===0&&t.generateMipmaps===!0&&t.mipmapsAutoUpdate===!0&&F.generateMipmap(v),I.unbindTexture()},this.initRenderTarget=function(e){L.get(e).__webglFramebuffer===void 0&&R.setupRenderTarget(e)},this.initTexture=function(e){e.isCubeTexture?R.setTextureCube(e,0):e.isData3DTexture?R.setTexture3D(e,0):e.isDataArrayTexture||e.isCompressedArrayTexture?R.setTexture2DArray(e,0):R.setTexture2D(e,0),I.unbindTexture()},this.resetState=function(){j=0,ee=0,M=null,I.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<`u`&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent(`observe`,{detail:this}))}get coordinateSystem(){return as}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=G._getDrawingBufferColorSpace(e),t.unpackColorSpace=G._getUnpackColorSpace()}};function rg(e,t=10,n=new U){switch(e){case`2d`:return{fov:1.5,frameHeight:t,yaw:0,pitch:0,roll:0,target:n};case`2.5d`:return{fov:20,frameHeight:t,yaw:0,pitch:8,roll:0,target:n};case`iso`:return{fov:1.5,frameHeight:t,yaw:45,pitch:35.26,roll:0,target:n};case`3d`:case`split`:case`4d`:return{fov:60,frameHeight:t,yaw:0,pitch:14,roll:0,target:n};case`fpv`:return{fov:75,frameHeight:t,yaw:0,pitch:4,roll:0,target:n}}}var ig=(e,t,n)=>e+(t-e)*n,ag=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2;function og(e,t,n){let r=Math.tan(Us.degToRad(e.fov/2)),i=Math.tan(Us.degToRad(t.fov/2)),a=Math.exp(ig(Math.log(r),Math.log(i),n));return{fov:Us.radToDeg(2*Math.atan(a)),frameHeight:ig(e.frameHeight,t.frameHeight,n),yaw:ig(e.yaw,t.yaw,n),pitch:ig(e.pitch,t.pitch,n),roll:ig(e.roll,t.roll,n),target:e.target.clone().lerp(t.target,n)}}var sg=class{camera=new bf(60,1,.1,5e3);pose=rg(`2d`);extraRoll=0;from=null;to=null;t0=0;dur=0;transition(e,t,n){this.from={...this.pose,target:this.pose.target.clone()},this.to=e,this.t0=n,this.dur=t}get transitioning(){return this.to!==null}progress(e){return this.to?Math.min(1,(e-this.t0)/Math.max(1,this.dur)):1}follow(e,t=1){this.to?this.to.target.copy(e):this.pose.target.lerp(e,t)}setPose(e){this.pose=e,this.from=this.to=null}update(e,t){if(this.from&&this.to){let t=this.progress(e);this.pose=og(this.from,this.to,ag(t)),t>=1&&(this.pose=this.to,this.from=this.to=null)}let n=this.pose,r=this.camera,i=Us.degToRad(n.fov/2),a=n.frameHeight/2/Math.tan(i),o=Us.degToRad(n.yaw),s=Us.degToRad(n.pitch),c=new U(Math.sin(o)*Math.cos(s),Math.sin(s),Math.cos(o)*Math.cos(s));r.position.copy(n.target).addScaledVector(c,a),r.up.set(0,1,0),r.lookAt(n.target),r.rotateZ(Us.degToRad(n.roll+this.extraRoll)),r.fov=n.fov,r.aspect=t,r.near=Math.max(.05,a-n.frameHeight*6),r.far=a+Math.max(n.frameHeight*12,n.fov>10?250:0),r.updateProjectionMatrix()}},cg=e=>e/se,lg=class{parent;make;map=new Map;constructor(e,t){this.parent=e,this.make=t}sync(e){let t=new Set(e);for(let[e,n]of this.map)t.has(e)||(this.parent.remove(n),this.map.delete(e));for(let t of e)if(!this.map.has(t)){let e=this.make(t);this.parent.add(e),this.map.set(t,e)}return this.map}},ug={"\b":`⌫`,"\n":`⏎`,"	":`⇥`},dg=e=>ug[e]??e,fg=e=>e.replace(/[\b\n\t]/g,e=>ug[e]),pg=new Map,mg=`␣`;function hg(e,t=`#ffffff`,n=`rgba(0,0,0,0.55)`,r=`600 64px "Atkinson Hyperlegible", system-ui, sans-serif`){e=fg(e);let i=`${e}|${t}|${n}|${r}`,a=pg.get(i);if(a)return a;let o=document.createElement(`canvas`),s=o.getContext(`2d`);s.font=r;let c=Number(/(\d+)px/.exec(r)?.[1]??64),l=Math.round(c*.42),u=e.split(/(␣)/).filter(Boolean),d=c*1.5,f=0;for(let e of u)f+=e===mg?d+c*.15:s.measureText(e).width;let p=u.filter(e=>e!==mg).join(``)||`x`,m=s.measureText(p),h=m.actualBoundingBoxAscent||c*.72,g=m.actualBoundingBoxDescent||c*.2,_=Math.max(h+g,c*.72),v=Math.ceil(_+l*2),y=Math.max(v,Math.ceil(f+l*2));o.width=y,o.height=v,s.font=r,n!==`transparent`&&(s.fillStyle=n,s.beginPath(),s.roundRect(0,0,y,v,Math.min(v/2,c*.45)),s.fill()),s.fillStyle=t,s.textAlign=`left`,s.textBaseline=`alphabetic`;let b=v/2+(h-g)/2,x=(y-f)/2;for(let e of u)if(e===mg){let e=c*.34;s.lineWidth=Math.max(3,c*.09),s.strokeStyle=t,s.beginPath(),s.roundRect(x+c*.075,v/2-e/2,d,e,e/2),s.stroke(),x+=d+c*.15}else s.fillText(e,x,b),x+=s.measureText(e).width;let S=new Bu(o);if(S.colorSpace=$o,S.anisotropy=4,pg.set(i,S),pg.size>400){let e=pg.keys().next().value;pg.get(e).dispose(),pg.delete(e)}return S}function gg(e,t=.6,n,r,i=!1){let a=hg(e,n,r),o=new Zl({map:a,transparent:!0,depthWrite:!1,color:14277081});i&&(o.depthTest=!1);let s=new du(o);i&&(s.renderOrder=10);let c=a.image;return s.scale.set(t*c.width/c.height,t,1),s}function _g(e,t,n=.6,r,i){let a=hg(t,r,i),o=e.material;if(o.map!==a){o.map=a,o.needsUpdate=!0;let t=a.image;e.scale.set(n*t.width/t.height,n,1)}}var vg=1.5,yg=.7,bg=16;function xg(e,t){let n=Math.floor(e/8);return new U((e%8-7/2)*vg,3.6-(n-t)*yg*1.25,0)}var Sg={id:`template.brick-breaker`,rules:[{icon:`🧱`,text:`The next letters are written on the bricks.`},{icon:`⚪`,text:`Every right key sends the ball to its brick — pop!`},{icon:`🎉`,text:`Clear a row and the wall slides up. Nothing can go wrong — just keep typing.`}],create({root:e,style:t,avatar:n}){let r=new Y(new Cd(8*vg+2,11),t.material(`sky`));r.position.set(0,0,-1),e.add(r);let i=new Y(new X(2.2,.3,.6),t.material(`accent`));i.position.set(0,-4,0),e.add(i);let a=new Y(new Td(.22,16,12),t.material(`glow`));e.add(a),n.root.scale.setScalar(.6),n.root.position.set(-8*vg*.5-.6,-4.3,.3),e.add(n.root);let o=new K;e.add(o);let s=new lg(o,e=>{let n=new K,r=new Y(new X(vg*.92,yg*.9,.5),t.material(e%3==0?`prop`:e%3==1?`ground`:`hazard`));r.name=`brick`;let i=gg(` `,yg*.8);return i.name=`label`,i.position.z=.4,n.add(r,i),n}),c=new K;e.add(c);let l=Array.from({length:10},(e,n)=>{let r=new Y(new Cd(.16,.16),t.material(n%2?`accent`:`glow`));return c.add(r),r}),u=0,d=-1e9,f=new U,p=-1;return{pose:()=>rg(`2d`,11.5,new U(0,-.2,0)),update(e,t,r){let o=e.state.tpl,m=e.state.prompt,h=Math.floor(o.popped/8);u+=(h-u)*.08;let g=Array.from({length:bg},(e,t)=>o.popped+t),_=s.sync(g);for(let[t,n]of _){let r=t-o.popped;n.position.copy(xg(t,u));let i=m.text[m.pos+r],a=n.getObjectByName(`label`);a.visible=i!==void 0&&e.state.phase===`play`;let s=r===0;i!==void 0&&_g(a,i===` `?`␣`:i,yg*(s?.95:.75),s?`#1a1a1a`:`#ffffff`,s?`rgba(255,209,102,0.97)`:`rgba(0,0,0,0.55)`),n.scale.setScalar(s?1.08:1)}let v=xg(o.popped,u);i.position.x+=(v.x-i.position.x)*.15,o.lastHit!==p&&(p=o.lastHit,d=r,f=xg(o.popped-1,u),n.play(`celebrate`,r));let y=Math.min(1,(r-d)/260),b=new U(i.position.x,-3.6,.2),x=e.state.frame-o.stumble<20?Math.sin(r/30)*.15:0;y<1?a.position.lerpVectors(f,b,y):a.position.set(b.x+x,b.y+Math.abs(Math.sin(r/300))*.25,.2);let S=(r-d)/600;c.visible=S<1,l.forEach((e,t)=>{let n=t/l.length*Math.PI*2;e.position.set(f.x+Math.cos(n)*S*1.6,f.y+Math.sin(n)*S*1.6-S*S,.3),e.rotation.z=S*6+t}),n.update(r,0)},dispose(){}}}},Cg=[-7.2,-2.4,2.4,7.2],wg=-4.5,Tg=9,Eg=18.5,Dg=-2.2800000000000002,Og=1.2,kg=7,Ag={id:`template.bubble-popper`,rules:[{icon:`🫧`,text:`Bubbles carry words up from the sea floor.`},{icon:`⌨️`,text:`Type a bubble's word, then Space, to pop it.`},{icon:`✨`,text:`Pop them all for stars — bubbles never hurt anyone.`}],create({root:e,style:t,avatar:n}){let r=new Y(new Cd(48,30),t.material(`sky`));r.position.set(0,-2.5,-1),e.add(r);let i=new Y(new X(48,Tg,1),t.material(`ground`));i.position.set(0,wg-Tg/2,0),e.add(i);for(let n=0;n<5;n++){let r=new Y(new qu(.25,1.2+n%3*.4,6),t.material(`prop`));r.position.set(-9.6+n*4.8,-4,-.5),e.add(r)}n.root.scale.setScalar(.7),n.root.position.set(0,wg,.3),e.add(n.root);let a=new K;e.add(a);let o=new lg(a,()=>{let e=new K,n=new Y(new Td(.75,20,14),t.material(`ice`));n.name=`ball`;let r=new Y(new Gu(.16,12),t.material(`glow`));r.position.set(-.3,.3,.75);let i=gg(` `,Og,void 0,void 0,!0);i.name=`label`,i.position.y=1.15;let a=new Y(new wd(.7,.8,24),t.material(`glow`));return a.name=`ring`,e.add(n,r,i,a),e}),s=0;return{pose:()=>rg(`2d`,Eg,new U(0,Dg,0)),update(e,t,r){let i=e.state.tpl,a=o.sync(i.bubbles.map(e=>e.id)),c=e.state.lockedTarget>=0,l=e.state.frame-i.stumble<20?.12:.04;for(let t of i.bubbles){let n=a.get(t.id),i=-3.7+cg(t.y)/cg(Gi)*kg;n.position.set(Cg[t.col]+Math.sin(r/500+t.id)*.25,i,0);let o=n.getObjectByName(`ball`),s=n.getObjectByName(`ring`),u=n.getObjectByName(`label`);if(t.popped>=0){let n=(e.state.frame-t.popped)/120;o.visible=!1,u.visible=!1,s.visible=!0,s.scale.setScalar(1+n*2),s.material.opacity=Math.max(0,1-n);continue}o.visible=!0,s.visible=!1,o.scale.set(1+Math.sin(r/180+t.id)*l,1-Math.sin(r/180+t.id)*l,1);let d=e.state.targets.find(e=>e.id===t.id);if(u.visible=!!d,d){let t=e.suggestedTargetId()===d.id,n=d.text.slice(d.progress).replace(/ /g,`␣`);t?_g(u,n,Og*1.35,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(u,n,Og,`#ffffff`,`rgba(0,0,0,0.65)`),u.material.opacity=t||!c?1:.45,u.renderOrder=t?12:10}}i.pops!==s&&(s=i.pops,n.play(`celebrate`,r)),n.update(r,0)},dispose(){}}}},jg=2.6,Mg=.32,Ng=.42;function Pg(e,t=2.85){let n=e*Mg;return new U(Math.sin(n)*t,e*Ng,Math.cos(n)*t)}var Fg={id:`template.climbing-tower`,rules:[{icon:`🧗`,text:`Climb the tower one handhold at a time.`},{icon:`🔤`,text:`Type the letter on the next hold to reach it.`},{icon:`🚩`,text:`Each Space plants a flag. No falling — just keep climbing!`}],create({root:e,style:t,avatar:n}){let r=new K;e.add(r);let i=new lg(r,e=>{let n=new K,r=new Y(new Ku(jg,jg,4,24),t.material(e%2?`ground`:`prop`));n.add(r);for(let r=0;r<6;r++){let i=new Y(new X(.4,.6,.1),t.material(`sky`)),a=r/6*Math.PI*2+e;i.position.set(Math.sin(a)*2.62,.6,Math.cos(a)*2.62),i.rotation.y=a,n.add(i)}return n.position.y=e*4+2,n}),a=new K;e.add(a);let o=new lg(a,e=>{let n=new K,r=new Y(new Td(.18,10,8),t.material(e%3==0?`accent`:e%3==1?`hazard`:`glow`)),i=new K;i.name=`flag`;let a=new Y(new X(.04,.7,.04),t.material(`prop`));a.position.y=.35;let o=new Y(new Cd(.4,.25),t.material(`accent`));return o.position.set(.2,.58,0),i.add(a,o),n.add(r,i),n.position.copy(Pg(e)),n}),s=new K;e.add(s);let c=new lg(s,()=>gg(` `,.6,void 0,void 0,!0));n.root.scale.setScalar(.7),e.add(n.root);let l=new U,u=0;return{pose:()=>{let e=rg(`3d`,9.5,l.clone().add(new U(0,-1.1,0)));return e.yaw=u*Mg*180/Math.PI,e.pitch=10,e},update(e,t,r){let a=e.state.tpl,s=e.state.prompt;u+=(a.holds-u)*.2;let d=Math.floor(a.holds*Ng/4)-2;i.sync([0,1,2,3,4,5].map(e=>d+e).filter(e=>e>=0));let f=Math.max(0,a.holds-10),p=o.sync(Array.from({length:18},(e,t)=>f+t));for(let[e,t]of p)t.getObjectByName(`flag`).visible=a.flags.includes(e);let m=c.sync(Array.from({length:6},(e,t)=>t));for(let[t,n]of m){let r=s.text[s.pos+t];n.visible=r!==void 0&&e.state.phase===`play`,r!==void 0&&(n.position.copy(Pg(a.holds+1+t,3.35)),t===0?_g(n,r===` `?`␣`:r,.8,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(n,r===` `?`␣`:r,.6,`#ffffff`,`rgba(0,0,0,0.6)`),n.material.opacity=Math.max(.4,1-t*.12))}let h=e.state.frame-a.stumble<20?.12:0;l.copy(Pg(u,3.0500000000000003-h)),n.root.position.copy(l).add(new U(0,-.3,0)),n.root.rotation.y=u*Mg,e.state.frame-a.lastHold===1&&n.play(`move`,r),n.update(r,0)},dispose(){}}}},Ig=[-4.2,-2.1,0,2.1,4.2],Lg=[2.9,3.7,2.6,3.7,2.9],Rg=1.15,zg={id:`template.crystal-gallery`,rules:[{icon:`💎`,text:`Singing crystals float toward you through the cave.`},{icon:`⌨️`,text:`Type a crystal's word, then Space, to make it chime.`},{icon:`🎶`,text:`Chime them all for stars — the crystals love to sing.`}],create({root:e,style:t}){let n=new Y(new Cd(30,40),t.material(`ground`));n.rotation.x=-Math.PI/2,n.position.z=-14,e.add(n);for(let n=0;n<14;n++){let r=new Y(new qu(.35+n%3*.15,1.5+n%4*.6,6),t.material(`prop`));r.rotation.x=Math.PI,r.position.set(-8+n*37%16,5.5,-4-n*53%24),e.add(r)}let r=new K;e.add(r);let i=new lg(r,e=>{let n=new K,r=new Y(new Sd(.5),t.material(e%3==0?`accent`:e%3==1?`ice`:`glow`));r.name=`gem`,r.scale.set(.8,1.4,.8);let i=gg(` `,Rg,void 0,void 0,!0);return i.name=`label`,i.position.y=1.35,n.add(r,i),n});return{pose:()=>rg(`fpv`,6,new U(0,2.4,-1)),update(e,t,n){let r=e.state.tpl,a=i.sync(r.crystals.map(e=>e.id)),o=e.state.lockedTarget>=0,s=e.state.frame-r.stumble<15?.15:0;for(let t of r.crystals){let r=a.get(t.id),i=r.getObjectByName(`gem`),c=r.getObjectByName(`label`),l=-cg(t.d);if(r.position.set(Ig[t.slot],Lg[t.slot]+Math.sin(n/600+t.id)*.12,l),t.sung>=0){let n=(e.state.frame-t.sung)/90;i.rotation.y=n*12,r.position.y+=n*2.5,i.scale.set(.8*(1+n),1.4*(1+n),.8*(1+n)),c.visible=!1;continue}i.rotation.y=n/900+t.id,i.scale.set(.8,1.4+s,.8);let u=e.state.targets.find(e=>e.id===t.id);if(c.visible=!!u,u){let t=e.suggestedTargetId()===u.id,n=u.text.slice(u.progress).replace(/ /g,`␣`);t?_g(c,n,Rg*1.35,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(c,n,Rg,`#ffffff`,`rgba(0,0,0,0.7)`),c.material.opacity=t||!o?1:.45,c.renderOrder=t?12:10}}},dispose(){}}}},Bg=e=>e%2==0?new U(1,0,0):new U(0,0,-1),Vg=e=>e%2==0?new U(0,0,1):new U(1,0,0);function Hg(e){let t=new U;for(let n=0;n<e;n++)t.addScaledVector(Bg(n),6);return t}function Ug(e){let t=Math.floor(e/6);return Hg(t).addScaledVector(Bg(t),e-t*6)}var Wg={id:`template.dungeon-crawler`,rules:[{icon:`🗝️`,text:`Walk through the rooms one step at a time.`},{icon:`🔤`,text:`Type the letter on the next tile to take a step.`},{icon:`💎`,text:`Every room hides a gem — collect them all. No monsters here!`}],create({root:e,style:t,avatar:n}){let r=new K;e.add(r);let i=new lg(r,e=>{let n=new K,r=Bg(e),i=Vg(e);for(let e=0;e<6;e++)for(let a=-1;a<=1;a++){let o=new Y(new X(.96,.2,.96),t.material((e+a)%2?`ground`:`prop`));o.position.copy(r.clone().multiplyScalar(e)).addScaledVector(i,a).setY(-.1),n.add(o)}for(let e of[-.5,5.5])for(let a of[-1.6,1.6]){let o=new Y(new X(.35,1.1,.35),t.material(`hazard`));o.position.copy(r.clone().multiplyScalar(e)).addScaledVector(i,a).setY(.55);let s=new Y(new Td(.16,10,8),t.material(`glow`));s.name=`torch`,s.position.copy(o.position).setY(1.25),n.add(o,s)}let a=new Y(new Sd(.28),t.material(`accent`));return a.name=`gem`,a.position.copy(r.clone().multiplyScalar(3)).setY(.45),n.add(a),n.position.copy(Hg(e)),n}),a=new K;e.add(a);let o=new lg(a,()=>gg(` `,.75,void 0,void 0,!0));e.add(n.root);let s=new U;return{pose:()=>rg(`iso`,14,s.clone().add(new U(0,-2.6,1))),update(e,t,r){let a=e.state.tpl,c=e.state.prompt,l=Math.floor(a.steps/6),u=i.sync([l-1,l,l+1,l+2].filter(e=>e>=0));for(let[t,n]of u){let i=t*6+3<=a.steps,o=n.getObjectByName(`gem`);o.visible=!i||e.state.frame-a.lastGem<40,o.rotation.y=r/600,o.position.y=i?.45+Math.min(1.5,(e.state.frame-a.lastGem)/25):.45+Math.sin(r/300)*.08,n.traverse(e=>{e.name===`torch`&&e.scale.setScalar(i?1.4:.6)})}let d=o.sync(Array.from({length:6},(e,t)=>t));for(let[t,n]of d){let r=c.text[c.pos+t];n.visible=r!==void 0&&e.state.phase===`play`,r!==void 0&&(n.position.copy(Ug(a.steps+1+t)).setY(.6),t===0?_g(n,r===` `?`␣`:r,.95,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(n,r===` `?`␣`:r,.7,`#ffffff`,`rgba(0,0,0,0.6)`),n.material.opacity=Math.max(.35,1-t*.13))}s.lerp(Ug(a.steps),.25);let f=e.state.frame-a.stumble<15?Math.sin(r/20)*.06:0;n.root.position.copy(s).add(new U(f,0,0)),e.state.frame-a.lastGem===1&&n.play(`celebrate`,r),n.update(r,0)},dispose(){}}}},Gg=`700 80px ui-monospace, Menlo, Consolas, monospace`,Kg=class{o;group=new K;meshes=[];shown=0;lastPos=-1;popAt=-1e9;constructor(e){this.o=e;for(let t=0;t<(e.count??12);t++){let t=new Y(new Cd(1,1),new vu({transparent:!0,depthWrite:!1,color:14540253,polygonOffset:!0,polygonOffsetFactor:-2}));e.mode===`ground`&&(t.rotation.x=-Math.PI/2),t.renderOrder=5,this.group.add(t),this.meshes.push(t)}}update(e,t,n,r,i,a){Math.abs(t-this.shown)>6&&(this.shown=t),t!==this.lastPos&&(t>this.lastPos&&this.lastPos>=0&&(this.popAt=i),this.lastPos=t),this.shown+=(t-this.shown)*.25;let o=Math.min(1,(i-this.popAt)/250);for(let i=0;i<this.meshes.length;i++){let s=Math.floor(this.shown)-1+i,c=this.meshes[i],l=e[s];if(l===void 0||s<0){c.visible=!1;continue}let u=s===t,d=s<t,f=hg(l===` `?`␣`:l,u?`#1a1a1a`:`#ffffff`,u?`rgba(255,209,102,0.97)`:`rgba(0,0,0,0.6)`,Gg),p=c.material;p.map!==f&&(p.map=f,p.needsUpdate=!0);let m=f.image,h=d&&s===t-1,g=this.o.size*(u?1.25:1)*(h?1+o*.6:1);c.scale.set(g*m.width/m.height,g,1);let _=this.o.start+(s-this.shown)*this.o.gap;p.opacity=d?h?1-o:0:Math.min(1,1.2-i*.05),c.visible=p.opacity>.02,c.position.copy(n).addScaledVector(r,_),a?.(c.position,c,s)}}aheadOf(e){return this.o.start+(e-this.shown)*this.o.gap}dispose(){for(let e of this.meshes)e.geometry.dispose(),e.material.dispose()}},qg=new U(1,0,0),Jg={id:`template.garden-grower`,rules:[{icon:`🌱`,text:`Every right key waters the next seed in your garden.`},{icon:`🌷`,text:`Watered seeds sprout and bloom while you keep typing.`},{icon:`🌻`,text:`Finish a word to grow a big sunflower.`}],create({root:e,style:t,avatar:n}){let r=new Y(new X(80,.6,1),t.material(`ground`));r.position.set(0,-.3,0),e.add(r),e.add(n.root);let i=new K;e.add(i);let a=new lg(i,e=>{let n=new K,r=new Y(new Ku(.05,.06,1,6),t.material(`prop`));r.name=`stem`;let i=new Y(new Gu(.28,10),t.material(e%3==0?`accent`:e%3==1?`hazard`:`glow`));i.name=`head`;let a=new Y(new Gu(.14,6),t.material(`prop`));return a.name=`leaf`,n.add(r,i,a),n.position.set(cg(e*ra)+1,0,-.2),n}),o=new Kg({mode:`upright`,start:1,gap:cg(ra),size:.8});return e.add(o.group),{pose:e=>rg(`2d`,10,new U(cg(e.state.tpl.x)+3,-.6,0)),update(e,t,i){let s=e.state.tpl,c=cg(s.x);n.root.position.set(c,0,.3),r.position.x=c+5;let l=Math.max(0,s.planted-14),u=Array.from({length:s.planted-l},(e,t)=>l+t),d=a.sync(u);for(let[t,n]of d){let r=Math.min(1,(e.state.frame-(s.plantedAt[t%40]??e.state.frame))/90),a=s.sunflowers.includes(t),o=(a?2.2:.8)*(.15+.85*r),c=n.getObjectByName(`stem`);c.scale.y=o,c.position.y=o/2;let l=n.getObjectByName(`head`);l.position.y=o,l.scale.setScalar((a?1.8:1)*Math.max(.05,r)*(1+Math.sin(i/400+t)*.05)),n.getObjectByName(`leaf`).position.set(.12,o*.45,0)}let f=e.state.prompt;o.update(f.text,f.pos,new U(c,.55,.6),qg,i),n.update(i,Math.min(1,e.state.motion.v/4e3),!1)},dispose(){o.dispose()}}}},Yg=5,Xg=.35;function Zg(e){let t=Math.floor(e/Yg),n=e-t*Yg;return new U(((t%2==0?n:4-n)-2)*1.2,-t*Xg,-t*1.2)}function Qg(e){let t=Math.floor(e);return Zg(t).lerp(Zg(t+1),e-t)}var $g={id:`template.marble-run`,rules:[{icon:`🔮`,text:`Every right key lays the next piece of track.`},{icon:`➡️`,text:`The marble rolls along as far as the track goes.`},{icon:`🔔`,text:`Each Space hangs a bell that rings when the marble rolls by.`}],create({root:e,style:t,avatar:n}){let r=new K;e.add(r);let i=new lg(r,e=>{let n=new K,r=new Y(new X(1.15,.25,1.15),t.material(e%2?`prop`:`ground`));r.name=`tile`;let i=new Y(new qu(.2,.35,10),t.material(`glow`));return i.name=`bell`,i.position.set(0,.9,.45),n.add(r,i),n.position.copy(Zg(e)),n}),a=new K;e.add(a);let o=new lg(a,()=>gg(` `,.8,void 0,void 0,!0)),s=new Y(new Td(.35,20,14),t.material(`accent`));e.add(s),n.root.scale.setScalar(.8),e.add(n.root);let c=new U;return{pose:()=>rg(`iso`,14,c.clone().add(new U(0,-2.6,1))),update(e,t,r){let a=e.state.tpl,l=e.state.prompt,u=Math.max(0,a.laid-12),d=i.sync(Array.from({length:a.laid-u},(e,t)=>u+t));for(let[e,t]of d){let n=t.getObjectByName(`bell`);n.visible=a.bells.includes(e);let i=cg(a.pos)-e;n.rotation.z=i>0&&i<1.5?Math.sin(r/60)*.5*(1.5-i):0}let f=o.sync(Array.from({length:6},(e,t)=>t));for(let[t,n]of f){let r=l.text[l.pos+t];n.visible=r!==void 0&&e.state.phase===`play`,r!==void 0&&(n.position.copy(Zg(a.laid+t)).add(new U(0,.8,0)),t===0?_g(n,r===` `?`␣`:r,1.05,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(n,r===` `?`␣`:r,.8,`#ffffff`,`rgba(0,0,0,0.6)`),n.material.opacity=Math.max(.35,1-t*.12))}let p=cg(a.pos),m=e.state.frame-a.stumble<20?Math.sin(r/25)*.08:0;s.position.copy(Qg(p)).add(new U(m,.47,0)),s.rotation.z=-p*2,c.lerp(Qg(p),.08),n.root.position.copy(Zg(Math.max(0,Math.floor(p)-2))).add(new U(0,.12,1)),n.update(r,Math.min(1,e.state.motion.v/4e3))},dispose(){}}}},e_=8,t_=18;function n_(e){let t=Math.floor(e/t_),n=e-t*t_,r=-t*4;return n<e_?{x:n,y:r}:n===e_?{x:7,y:r-1}:n===9?{x:7,y:r-2}:n<17?{x:7-(n-e_-1),y:r-2}:{x:0,y:r-3}}var r_={id:`template.maze-snake`,rules:[{icon:`🐍`,text:`Your snake follows the path through the maze.`},{icon:`🔤`,text:`Type the letter on the next tile to move one step.`},{icon:`🍓`,text:`Eat berries to grow longer. The snake never gets hurt.`}],create({root:e,style:t}){let n=new K,r=new K,i=new K;e.add(n,r,i);let a=(e,t)=>`${e},${t}`,o=new lg(n,e=>{let n=new K,r=new Y(new Cd(.94,.94),t.material(`prop`)),i=gg(` `,.62);i.name=`label`,i.position.z=.3;let a=new Y(new Td(.16,12,8),t.material(`glow`));a.name=`berry`,a.position.set(.3,.3,.2),n.add(r,i,a);let o=n_(e);return n.position.set(o.x,o.y,0),n}),s=new lg(r,e=>{let[n,r]=e.split(`,`).map(Number),i=new Y(new X(.96,.96,.5),t.material(`ground`));return i.position.set(n,r,.1),i}),c=new lg(i,e=>new Y(new Td(e===0?.4:.32,16,12),t.material(e===0?`avatar`:`accent`))),l={x:0,y:0};return{pose:()=>rg(`2d`,13,new U(e_/2-.5,l.y-3,0)),update(e,t,n){let r=e.state.tpl,i=e.state.prompt,u=Math.max(0,r.steps-r.length-2),d=[];for(let e=u;e<=r.steps+12;e++)d.push(e);let f=new Set;for(let e=Math.max(0,r.steps-40);e<=r.steps+40;e++){let t=n_(e);f.add(a(t.x,t.y))}let p=o.sync(d);for(let[t,n]of p){let a=t-r.steps-1,o=a>=0?i.text[i.pos+a]:void 0,s=n.getObjectByName(`label`);s.visible=o!==void 0&&e.state.phase===`play`,o!==void 0&&_g(s,o===` `?`␣`:o,a===0?.8:.6,a===0?`#1a1a1a`:`#ffffff`,a===0?`rgba(255,209,102,0.97)`:`rgba(0,0,0,0.5)`),n.getObjectByName(`berry`).visible=t>r.steps&&t%5==0}let m=n_(r.steps);l.x+=(m.x-l.x)*.25,l.y+=(m.y-l.y)*.25;let h=[];for(let e=Math.floor(m.y)-7;e<=Math.floor(m.y)+4;e++)for(let t=-1;t<=e_;t++)f.has(a(t,e))||h.push(a(t,e));s.sync(h);let g=Array.from({length:r.length},(e,t)=>t),_=c.sync(g),v=e.state.frame-r.stumble<20?Math.sin(n/25)*.12:0;for(let[e,t]of _){if(e===0){t.position.set(l.x+v,l.y,.35);continue}let n=n_(Math.max(0,r.steps-e));t.position.set(n.x,n.y,.3),t.visible=r.steps-e>=0}},dispose(){}}}},i_=1.3,a_=new U(1,0,0);function o_(e,t){let n=cg(ua);for(let r of t){let t=cg(r),i=t-n,a=t+cg(ca)+n;if(e>i&&e<a)return Math.sin((e-i)/(a-i)*Math.PI)*i_}return 0}var s_={id:`template.platformer`,rules:[{icon:`🏃`,text:`Type the letters in front of you to run over them.`},{icon:`⬆️`,text:`Every Space opens a gap ahead — you hop over it.`},{icon:`🎶`,text:`Hop through the notes to collect them.`}],create({root:e,style:t,avatar:n}){let r=new K;e.add(r);let i=new K;e.add(i),e.add(n.root);let a=new lg(r,e=>{let n=new Y(new X(.98,.98,1),t.material(e%2?`ground`:`prop`));return n.position.set(e+.5,-.5,0),n}),o=new lg(i,()=>new Y(new Sd(.25),t.material(`accent`))),s=new Y(new wd(.2,.3,24),t.material(`glow`));s.visible=!1,e.add(s);let c=gg(`♪ 0`,.6);e.add(c);let l=new Kg({mode:`upright`,start:1.6,gap:1.15,size:.95});e.add(l.group);let u=-1;return{pose:e=>rg(`2d`,10,new U(cg(e.state.tpl.x)+3,-.6,0)),update(e,t,r){let i=e.state.tpl,d=cg(i.x+e.state.motion.v*t),f=i.gaps.map(e=>Math.round(cg(e))),p=[];for(let e=Math.floor(d)-6;e<Math.floor(d)+14;e++)f.includes(e)||p.push(e);a.sync(p);let m=o.sync(i.coins);for(let[e,t]of m)t.position.set(cg(e),1.75+Math.sin(r/300+e)*.08,.2),t.rotation.y=r/400;let h=o_(d,i.gaps);n.root.position.set(d,h,.3),i.lastCollect!==u&&((u!==-1||i.lastCollect>=0)&&(n.play(`powerup`,r),s.userData.t0=r),u=i.lastCollect);let g=(r-(s.userData.t0??-1e9))/400;s.visible=g<1,s.visible&&(s.position.set(d,h+1,.4),s.scale.setScalar(1+g*4),s.material.opacity=1-g),_g(c,`♪ ${i.collected}`,.6),c.position.set(d+4.5,3.4,.5);let _=e.state.prompt;l.update(_.text,_.pos,new U(d,.65,.6),a_,r),n.update(r,h>0?0:Math.min(1,e.state.motion.v/4e3))},dispose(){l.dispose()}}}},c_=new U(1,0,0),l_={id:`template.pulse-runner`,rules:[{icon:`💓`,text:`Type the letter in front of you — each one is a heartbeat that carries you forward.`},{icon:`🏮`,text:`Run past lanterns to light up the dark.`},{icon:`🎵`,text:`Keep a steady beat to run faster.`}],create({root:e,style:t,avatar:n}){let r=new Y(new X(60,.4,1),t.material(`ground`));r.position.set(0,-.2,0),e.add(r);let i=new K;e.add(i);let a=new lg(i,e=>{let n=new Y(new Gu(3+(e%3+3)%3,24,0,Math.PI),t.material(`sky`));return n.position.set(e*9,0,-6),n});e.add(n.root);let o=new Y(new wd(.9,1,48),t.material(`glow`));e.add(o);let s=new K;e.add(s);let c=new lg(s,e=>{let n=new K,r=new Y(new X(.08,1.4,.08),t.material(`prop`));r.position.y=.7;let i=new Y(new Td(.22,12,8),t.material(`accent`));return i.position.y=1.5,i.name=`lamp`,n.add(r,i),n.position.x=cg(e*fa)+1.5,n}),l=new Kg({mode:`upright`,start:1.6,gap:1.15,size:.95});e.add(l.group);let u=-1;return{pose:e=>{let t=e.state.tpl;return rg(`2d`,10,new U(cg(t.x)+3,-.6,0))},update(e,t,i){let s=e.state.tpl,d=cg(s.x+e.state.motion.v*t);n.root.position.set(d,0,.3),r.position.x=d+5;let f=Math.floor(d/9)-3;a.sync(Array.from({length:8},(e,t)=>f+t));let p=Math.max(0,Math.floor(d/cg(fa))-3),m=Array.from({length:10},(e,t)=>p+t),h=c.sync(m);for(let[e,t]of h){let n=t.getObjectByName(`lamp`),r=e<s.lit;n.scale.setScalar(r?1.2:.6),n.material.opacity=r?1:.3,n.material.transparent=!0}s.lastBeat!==u&&(u=s.lastBeat,n.play(`move`,i));let g=(e.state.frame-s.lastBeat)/30;o.position.set(d,.8,.2),o.scale.setScalar(s.lastBeat<0?.01:.5+g*2.5),o.material.opacity=Math.max(0,.7-g*.7);let _=e.state.prompt;l.update(_.text,_.pos,new U(d,.65,.6),c_,i),n.update(i,Math.min(1,e.state.motion.v/4e3),!1)},dispose(){l.dispose()}}}},u_=2.2,d_=new U(0,0,-1),f_=1.5,p_={id:`template.racer`,rules:[{icon:`🏎️`,text:`Type the letters painted on the road to drive over them.`},{icon:`🎵`,text:`A steady rhythm is faster than rushing.`},{icon:`↔️`,text:`Space turns into the next lane — just in time to pass the cone.`}],create({root:e,style:t,avatar:n}){let r=new K;e.add(r);let i=new lg(r,e=>{let n=new K,r=new Y(new X(7.6000000000000005,.2,9.8),t.material(e%2?`ground`:`sky`));n.add(r);for(let e of[-2.2/2,u_/2]){let r=new Y(new X(.12,.22,3),t.material(`glow`));r.position.x=e,n.add(r)}for(let e of[-1,1]){let r=new Y(new X(.3,1.5,.3),t.material(`prop`));r.position.set(e*4.300000000000001,.75,0),n.add(r)}return n.position.z=-e*10,n}),a=new K;e.add(a);let o=new lg(a,()=>new Y(new qu(.4,.9,12),t.material(`hazard`))),s=new Y(new X(1.4,.15,2.2),t.material(`accent`)),c=new K;s.position.y=.3,n.root.position.y=.38,n.root.scale.setScalar(.75),c.add(s,n.root),e.add(c);let l=new Kg({mode:`ground`,start:5.6,gap:2.4,size:2.1});e.add(l.group);let u=new K;e.add(u);let d=t.material(`glow`);for(let e=0;e<40;e++){let t=new Y(new X(.04,.04,4),d);t.position.set(e%8-4+e%3*.3,.5+e%5,-e*2),u.add(t)}let f=0,p=0,m=0,h=0,g=0;return{pose:()=>{let e=rg(`3d`,9,new U(f*.5,.6,-h-.5));return e.pitch=34,e.fov=60+g*10,e.follow=1,e},update(e,t,r){let a=e.state.tpl,s=cg(a.z+e.state.motion.v*t);h=s,g+=(Math.min(1,e.state.motion.v/9e3)-g)*.03;let d=Math.floor(s/10);i.sync(Array.from({length:16},(e,t)=>d-1+t)),f+=(a.lane*u_-f)*.12;let _=e.state.prompt,v=[],y=0;for(let e=0;e<_.text.length;e++)v.push(y),_.text[e]===` `&&y++;let b=e=>a.wordLanes[Math.min(v[Math.max(0,Math.min(e,v.length-1))]??0,a.wordLanes.length-1)]??a.lane;l.update(_.text,_.pos,new U(0,.12,-s),d_,r,(e,t,n)=>{e.x=b(n)*u_,t.rotation.set(-Math.PI/2,0,0)});let x=[];for(let e=Math.max(0,_.pos-2);e<Math.min(_.text.length,_.pos+16);e++)_.text[e]===` `&&x.push(e);let S=o.sync(x);for(let e of x){let t=l.aheadOf(e)+f_,n=S.get(e);n.visible=t>-6,n.position.set(b(e)*u_,.45,-s-t)}let C=m?Math.min(.25,(r-m)/1e3):0;m=r;let w=a.lane*u_;p+=(w-p)*(1-Math.exp(-C*12)),c.position.set(p,0,-s),c.rotation.set(0,0,(w-p)*-.18);let T=e.liveWpmP(),E=Math.min(1,e.state.motion.v/9e3),D=T>=De;u.visible=E>.3||D,u.position.z=-s-10;for(let e of u.children)e.position.z=(e.position.z+E*3+(D?3:0))%80-80,e.scale.z=D?4:1+E*2;n.update(r,E)},dispose(){l.dispose()}}}},m_=new U(0,0,-1),h_=2,g_={id:`template.space-tunnel`,rules:[{icon:`🚀`,text:`Fly through the tunnel of rings.`},{icon:`🔤`,text:`Type the letters floating ahead to fly through them.`},{icon:`✨`,text:`A steady rhythm makes the rings shine brighter.`}],create({root:e,style:t}){let n=new K;e.add(n);let r=cg(_a),i=new lg(n,e=>{let n=new Y(new Ed(3.2,.12,8,40),t.material(e%3==0?`accent`:`glow`));return n.position.set(0,h_,-e*r),n}),a=new K;e.add(a);let o=new lg(a,e=>{let n=new Y(new X(.05,.05,.6),t.material(`ice`)),r=e*2.399%(Math.PI*2),i=4.5+e*7%5;return n.position.set(Math.cos(r)*i,h_+Math.sin(r)*i,-e*.9),n}),s=new Kg({mode:`upright`,start:4,gap:1.6,size:.9});e.add(s.group);let c=0,l=0;return{pose:()=>{let e=rg(`fpv`,4,new U(Math.sin(l)*.05,h_,-c-3));return e.follow=1,e},update(e,t,n){let a=e.state.tpl;c=cg(a.z+e.state.motion.v*t),l=e.state.frame-a.stumble<15?n/20:0;let u=Math.floor(c/r)-1,d=i.sync(Array.from({length:14},(e,t)=>u+t)),f=Math.max(0,1-(e.state.frame-a.lastBeat)/20),p=e.steadinessP()/1e3;for(let[e,t]of d)t.scale.setScalar(1+f*.05*(1+p)),t.rotation.z=e*.3+n/3e3;let m=Math.floor(c/.9)-2;o.sync(Array.from({length:50},(e,t)=>m+t));let h=e.state.prompt;s.update(h.text,h.pos,new U(0,h_,-c),m_,n,(e,t,n)=>{let r=(s.aheadOf(n)-4)*.6;e.x+=Math.sin(r)*1.3,e.y+=Math.cos(r)*1})},dispose(){s.dispose()}}}},__=[new U(-6,0,-5),new U(-2,0,-5),new U(-2,0,0),new U(3,0,0),new U(3,0,4),new U(6,0,4)],v_=new bd;for(let e=1;e<__.length;e++)v_.add(new vd(__[e-1],__[e]));var y_=1.2,b_=1.25;function x_(e){let t=new K,n=(n,r,i,a)=>{let o=new Y(new Cd(n,r),e);o.rotation.x=-Math.PI/2,o.position.set(i,.05,a),t.add(o)};for(let e of __)n(y_,y_,e.x,e.z);for(let e=1;e<__.length;e++){let t=__[e-1],r=__[e],i=t.distanceTo(r)-y_;if(i<=0)continue;let a=Math.abs(r.x-t.x)>Math.abs(r.z-t.z);n(a?i:y_,a?y_:i,(t.x+r.x)/2,(t.z+r.z)/2)}return t}var S_={id:`template.tower-defence`,rules:[{icon:`🫧`,text:`Friendly blobs carry letters to the crystal tower.`},{icon:`⌨️`,text:`Type a blob's letters, then press Space to freeze it into an ice cube.`},{icon:`🛡️`,text:`Nothing can hurt you — but freeze them all for stars!`}],create({root:e,style:t,avatar:n}){let r=new Y(new X(16,.4,14),t.material(`ground`));r.position.y=-.2,e.add(r),e.add(x_(t.material(`prop`)));let i=new K,a=new Y(new Sd(1),t.material(`accent`));a.scale.set(.8,1.6,.8),a.position.y=1.8,i.add(a),i.position.copy(__[__.length-1]).add(new U(1.2,0,0)),e.add(i),n.root.position.set(4.5,0,6),e.add(n.root);let o=new K;e.add(o);let s=new lg(o,()=>{let e=new K,n=new Y(new Td(.45,16,12),t.material(`hazard`));n.name=`blob`,n.position.y=.45;let r=new Y(new X(1.1,1.1,1.1),t.material(`ice`));r.name=`ice`,r.position.y=.55;let i=gg(` `,b_,void 0,void 0,!0);return i.name=`label`,i.position.y=1.9,e.add(n,r,i),e}),c=0,l=-1;return{pose:()=>rg(`iso`,21,new U(0,-2.6,0)),update(e,t,r){let i=e.state.tpl,o=e.state.targets,u=s.sync(i.creatures.map(e=>e.id));for(let t of i.creatures){let n=u.get(t.id),i=Math.min(1,cg(t.pos)/cg(ya)),a=v_.getPointAt(i);n.position.set(a.x+(t.lane-1)*.3,0,a.z+(t.lane-1)*.3);let s=n.getObjectByName(`ice`),c=n.getObjectByName(`blob`),l=n.getObjectByName(`label`),d=o.find(e=>e.id===t.id);if(t.frozen>=0){s.visible=!0;let r=(e.state.frame-t.frozen)/600;n.scale.setScalar(Math.max(.01,1-r)),c.scale.setScalar(.8),l.visible=!1}else if(s.visible=!1,n.scale.setScalar(1),c.scale.set(1+Math.sin(r/200+t.id)*.06,1-Math.sin(r/200+t.id)*.06,1),l.visible=!!d,d){let t=e.state.lockedTarget>=0,n=e.suggestedTargetId()===d.id,r=d.text.slice(d.progress).replace(/ /g,`␣`);n?_g(l,r,b_*1.4,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(l,r,b_,`#ffffff`,`rgba(0,0,0,0.7)`);let i=l.material;i.opacity=n||!t?1:.45,l.renderOrder=n?12:10,l.position.y=n?2.2:1.9}}i.frozenCount!==c&&(c=i.frozenCount,n.play(`celebrate`,r)),i.lastBonk!==l&&(l=i.lastBonk,a.scale.set(.9,1.5,.9)),a.scale.lerp(new U(.8,1.6,.8),.05),a.rotation.y=r/1500,n.update(r,0)},dispose(){}}}},C_=new U(0,0,-1),w_=4,T_={id:`template.wave-surfing`,rules:[{icon:`🏄`,text:`Type the letters floating on the water to paddle over them.`},{icon:`🌊`,text:`Every right key builds the wave under your board.`},{icon:`🎵`,text:`Keep a steady beat and the wave stays big!`}],create({root:e,style:t,avatar:n}){let r=new Y(new Cd(60,140),t.material(`sky`));r.rotation.x=-Math.PI/2,r.position.y=-.05,e.add(r);let i=new K;e.add(i);let a=new lg(i,e=>{let n=new K;for(let r of[-1,1]){let i=new Y(new Ku(.35,.5,8,10,1,!1,0,Math.PI),t.material(e%2?`ice`:`glow`));i.rotation.z=Math.PI/2,i.position.x=r*6,n.add(i)}return n.position.z=-e*w_,n}),o=new Y(new Gu(4,32),t.material(`accent`));e.add(o);let s=new Y(new X(.9,.12,2.4),t.material(`accent`)),c=new K;s.position.y=.2,n.root.position.y=.26,n.root.scale.setScalar(.75),c.add(s,n.root),e.add(c);let l=new Kg({mode:`ground`,start:5.4,gap:2.3,size:2});e.add(l.group);let u=0;return{pose:()=>{let e=rg(`3d`,9,new U(0,.7,-u-.5));return e.follow=1,e},update(e,t,i){let s=e.state.tpl;u=cg(s.z+e.state.motion.v*t);let d=s.energy/1e3,f=Math.floor(u/w_)-1,p=a.sync(Array.from({length:24},(e,t)=>f+t));for(let[e,t]of p){let n=.4+d*1.6;for(let e of t.children)e.scale.set(1,1,n);t.position.y=Math.sin(i/500+e)*.15*(.5+d)}r.position.z=-u-40,o.position.set(6,6,-u-70);let m=e.state.frame-s.stumble<20?Math.sin(i/30)*.2:0;c.position.set(Math.sin(i/900)*.6,.2+d*.9+Math.sin(i/250)*.08*d,-u),c.rotation.z=m+Math.sin(i/700)*.12*d,c.rotation.x=-.15*d;let h=e.state.prompt;l.update(h.text,h.pos,new U(0,.06,-u),C_,i),e.state.frame-s.lastBeat===1&&n.play(`move`,i),n.update(i,Math.min(1,e.state.motion.v/9e3))},dispose(){l.dispose()}}}},E_=2.6,D_=.95,O_=e=>new U((e%4-1.5)*E_,0,(Math.floor(e/4)-1.5)*E_),k_={id:`template.word-city`,rules:[{icon:`🏗️`,text:`Empty plots wait for a word.`},{icon:`⌨️`,text:`Type a plot's word, then Space, to build a house there.`},{icon:`🏙️`,text:`Longer words make taller buildings — fill the whole city!`}],create({root:e,style:t,avatar:n}){let r=new Y(new X(11.4,.4,11.4),t.material(`ground`));r.position.y=-.2,e.add(r);let i=new K;e.add(i);let a=new X(1.7,.5,1.7),o=new lg(i,e=>{let n=new K,r=new Y(new X(2.1,.08,2.1),t.material(`prop`));r.position.y=.04;let i=new K;i.name=`tower`;for(let e=0;e<9;e++){let n=new Y(a,t.material(e%2?`accent`:`ice`));n.position.y=.25+e*.52,n.visible=!1,i.add(n)}let o=gg(` `,D_,void 0,void 0,!0);return o.name=`label`,n.add(r,i,o),n.position.copy(O_(e)),n});o.sync(Array.from({length:16},(e,t)=>t));let s=new K,c=new Y(new X(.2,6,.2),t.material(`hazard`));c.position.y=3;let l=new Y(new X(4,.18,.18),t.material(`hazard`));l.position.set(1.6,6,0),s.add(c,l),s.position.set(E_*2.3,0,-2.6*2.3),e.add(s),n.root.position.set(-2.6*2.3,0,E_*2.3),e.add(n.root);let u=0;return{pose:()=>rg(`iso`,21,new U(0,-2.4,0)),update(e,t,r){let i=e.state.tpl,a=o.sync(Array.from({length:16},(e,t)=>t)),c=e.state.lockedTarget>=0;for(let[t,n]of a){let r=i.plots[t],a=r.id>=0?e.state.targets.find(e=>e.id===r.id):void 0,o=n.getObjectByName(`tower`),s=r.builtAt>=0?Math.min(1,(e.state.frame-r.builtAt)/40):1,l=a?a.progress:0;o.children.forEach((e,t)=>{e.visible=t<r.height+l,e.scale.set(1,t>=r.height?.6:t===r.height-1?s:1,1)});let u=n.getObjectByName(`label`);if(u.visible=!!a,u.position.y=1.5+(r.height+l)*.52,a){let t=e.suggestedTargetId()===a.id,n=a.text.slice(a.progress).replace(/ /g,`␣`);t?_g(u,n,D_*1.35,`#1a1a1a`,`rgba(255,209,102,0.97)`):_g(u,n,D_,`#ffffff`,`rgba(0,0,0,0.7)`),u.material.opacity=t||!c?1:.45,u.renderOrder=t?12:10}}let l=e.state.frame-i.stumble<20?Math.sin(r/30)*.1:0;s.rotation.y=Math.sin(cg(i.crane)/6)*.8+l,i.built!==u&&(u=i.built,n.play(`celebrate`,r)),n.update(r,0)},dispose(){a.dispose()}}}},A_={id:`style.flat`,build(e){let t=e.colors,n={ground:t.ground??t.fg,avatar:t.accent,accent:t.accent,hazard:t.negative,prop:t.positive,glow:t.accent,sky:t.sky??t.bg,ice:`#cfefff`},r=[];return{id:`style.flat`,background:new q(t.bg),material(e,t){let i=new Rd({color:new q(t??n[e]),transparent:e===`ice`||e===`glow`,opacity:e===`ice`?.6:e===`glow`?.5:1});return e===`glow`&&(i.emissive=new q(t??n[e])),r.push(i),i},dispose(){for(let e of r)e.dispose()}}}},j_={name:`CopyShader`,uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`},M_=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error(`THREE.Pass: .render() must be implemented in derived pass.`)}dispose(){}},N_=new Cf(-1,1,1,-1,0,1),P_=new class extends Bl{constructor(){super(),this.setAttribute(`position`,new J([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute(`uv`,new J([0,2,0,0,2,0],2))}},F_=class{constructor(e){this._mesh=new Y(P_,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,N_)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}},I_=class extends M_{constructor(e,t=`tDiffuse`){super(),this.textureID=t,this.uniforms=null,this.material=null,e instanceof Fd?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Md.clone(e.uniforms),this.material=new Fd({name:e.name===void 0?`unspecified`:e.name,defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new F_(this.material)}render(e,t,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},L_=class extends M_{constructor(e,t){super(),this.scene=e,this.camera=t,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,t,n){let r=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),i.buffers.stencil.setFunc(r.ALWAYS,a,4294967295),i.buffers.stencil.setClear(o),i.buffers.stencil.setLocked(!0),e.setRenderTarget(n),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(t),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(r.EQUAL,1,4294967295),i.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),i.buffers.stencil.setLocked(!0)}},R_=class extends M_{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}},z_=class{constructor(e,t){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),t===void 0){let n=e.getSize(new H);this._width=n.width,this._height=n.height,t=new lc(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ka}),t.texture.name=`EffectComposer.rt1`}else this._width=t.width,this._height=t.height;this.renderTarget1=t,this.renderTarget2=t.clone(),this.renderTarget2.texture.name=`EffectComposer.rt2`,this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new I_(j_),this.copyPass.material.blending=0,this.timer=new jf}swapBuffers(){let e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,t){this.passes.splice(t,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){let t=this.passes.indexOf(e);t!==-1&&this.passes.splice(t,1)}isLastEnabledPass(e){for(let t=e+1;t<this.passes.length;t++)if(this.passes[t].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());let t=this.renderer.getRenderTarget(),n=!1;for(let t=0,r=this.passes.length;t<r;t++){let r=this.passes[t];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(t),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,n),r.needsSwap){if(n){let t=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(t.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(t.EQUAL,1,4294967295)}this.swapBuffers()}L_!==void 0&&(r instanceof L_?n=!0:r instanceof R_&&(n=!1))}}this.renderer.setRenderTarget(t)}reset(e){if(e===void 0){let t=this.renderer.getSize(new H);this._pixelRatio=this.renderer.getPixelRatio(),this._width=t.width,this._height=t.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,t){this._width=e,this._height=t;let n=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(n,r),this.renderTarget2.setSize(n,r);for(let e=0;e<this.passes.length;e++)this.passes[e].setSize(n,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}},B_=class extends M_{constructor(e,t,n=null,r=null,i=null){super(),this.scene=e,this.camera=t,this.overrideMaterial=n,this.clearColor=r,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new q}render(e,t,n){let r=e.autoClear;e.autoClear=!1;let i,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==1&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),e.autoClear=r}},V_={name:`LuminosityHighPassShader`,uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new q(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`},H_=class e extends M_{constructor(e,t=1,n,r){super(),this.strength=t,this.radius=n,this.threshold=r,this.resolution=e===void 0?new H(256,256):new H(e.x,e.y),this.clearColor=new q(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new lc(i,a,{type:Ka,depthBuffer:!1}),this.renderTargetBright.texture.name=`UnrealBloomPass.bright`,this.renderTargetBright.texture.generateMipmaps=!1;for(let e=0;e<this.nMips;e++){let t=new lc(i,a,{type:Ka,depthBuffer:!1});t.texture.name=`UnrealBloomPass.h`+e,t.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(t);let n=new lc(i,a,{type:Ka,depthBuffer:!1});n.texture.name=`UnrealBloomPass.v`+e,n.texture.generateMipmaps=!1,this.renderTargetsVertical.push(n),i=Math.round(i/2),a=Math.round(a/2)}let o=V_;this.highPassUniforms=Md.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Fd({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];let s=[6,10,14,18,22];i=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let e=0;e<this.nMips;e++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])),this.separableBlurMaterials[e].uniforms.invSize.value=new H(1/i,1/a),i=Math.round(i/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=t,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1),new U(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Md.clone(j_.uniforms),this.blendMaterial=new Fd({uniforms:this.copyUniforms,vertexShader:j_.vertexShader,fragmentShader:j_.fragmentShader,premultipliedAlpha:!0,blending:2,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new q,this._oldClearAlpha=1,this._basic=new vu,this._fsQuad=new F_(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,t){let n=Math.round(e/2),r=Math.round(t/2);this.renderTargetBright.setSize(n,r);for(let e=0;e<this.nMips;e++)this.renderTargetsHorizontal[e].setSize(n,r),this.renderTargetsVertical[e].setSize(n,r),this.separableBlurMaterials[e].uniforms.invSize.value=new H(1/n,1/r),n=Math.round(n/2),r=Math.round(r/2)}render(t,n,r,i,a){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),a&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=r.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=r.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[n]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=e.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[n]),t.clear(),this._fsQuad.render(t),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(r),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(e){let t=[],n=e/3;for(let r=0;r<e;r++)t.push(.39894*Math.exp(-.5*r*r/(n*n))/n);let r=[],i=[];for(let n=1;n<e;n+=2){let a=t[n],o=n+1<e?t[n+1]:0,s=a+o;r.push((n*a+(n+1)*o)/s),i.push(s)}return new Fd({defines:{KERNEL_PAIRS:r.length},uniforms:{colorTexture:{value:null},invSize:{value:new H(.5,.5)},direction:{value:new H(.5,.5)},centerWeight:{value:t[0]},gaussianOffsets:{value:r},gaussianWeights:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new Fd({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};H_.BlurDirectionX=new H(1,0),H_.BlurDirectionY=new H(0,1);var U_={name:`OutputShader`,uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`},W_=class extends M_{constructor(){super(),this.isOutputPass=!0,this.uniforms=Md.clone(U_.uniforms),this.material=new Id({name:U_.name,uniforms:this.uniforms,vertexShader:U_.vertexShader,fragmentShader:U_.fragmentShader}),this._fsQuad=new F_(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,t,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},G.getTransfer(this._outputColorSpace)===`srgb`&&(this.material.defines.SRGB_TRANSFER=``),this._toneMapping===1?this.material.defines.LINEAR_TONE_MAPPING=``:this._toneMapping===2?this.material.defines.REINHARD_TONE_MAPPING=``:this._toneMapping===3?this.material.defines.CINEON_TONE_MAPPING=``:this._toneMapping===4?this.material.defines.ACES_FILMIC_TONE_MAPPING=``:this._toneMapping===6?this.material.defines.AGX_TONE_MAPPING=``:this._toneMapping===7?this.material.defines.NEUTRAL_TONE_MAPPING=``:this._toneMapping===5&&(this.material.defines.CUSTOM_TONE_MAPPING=``),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(t),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}},G_={id:`style.neon`,build(e,{lite:t}){let n=e.colors,r={ground:n.ground??n.fg,avatar:n.accent,accent:n.accent,hazard:n.negative,prop:n.positive,glow:n.accent,sky:n.sky??n.bg,ice:`#9ff3ff`},i=[],a=null,o=null,s={w:1,h:1,pr:1};return{id:`style.neon`,background:new q(n.bg).multiplyScalar(.6),material(e,t){let n=new q(t??r[e]),a=e===`ground`?.25:e===`sky`?.1:e===`prop`?.5:1.1,o=new Ld({color:n.clone().multiplyScalar(.4),emissive:n,emissiveIntensity:a,roughness:.4,metalness:.2,transparent:e===`ice`||e===`glow`,opacity:e===`ice`?.55:e===`glow`?.6:1});return i.push(o),o},render(e,n,r){return!t&&(a&&o&&o.scene===n&&o.camera===r||(a?.dispose(),a=new z_(e),a.addPass(new B_(n,r)),a.addPass(new H_(new H(s.w,s.h),.6,.4,.9)),a.addPass(new W_),a.setPixelRatio(s.pr),a.setSize(s.w,s.h),o={scene:n,camera:r}),a.render(),!0)},setSize(e,t,n){s={w:e,h:t,pr:n},a?.setPixelRatio(n),a?.setSize(e,t)},dispose(){for(let e of i)e.dispose();a?.dispose()}}}},K_={id:`havoc.gravity-tilt`,apply({rig:e,intensityP:t,time:n,reducedMotion:r}){let i=t/1e3*12;e.extraRoll=r?i*.3:Math.sin(n/2600)*i},reset({rig:e}){e.extraRoll=0}},q_={id:`havoc.map-rotate`,apply({world:e,rig:t,intensityP:n,time:r,reducedMotion:i}){let a=i?0:n/1e3*(Math.PI/2)*Math.sin(r/9e3),o=e.rotation.y+(a-e.rotation.y)*.05;e.rotation.y=o;let s=t.pose.target,c=Math.cos(o),l=Math.sin(o);e.position.set(s.x-(s.x*c+s.z*l),0,s.z-(-s.x*l+s.z*c))},reset({world:e}){e.rotation.y=0,e.position.set(0,0,0)}},J_=e=>{let t={};for(let n of Object.values(e))t[n.id]=n;return t},Y_=J_(Object.assign({"../../content/templates/brick-breaker/view.ts":Sg,"../../content/templates/bubble-popper/view.ts":Ag,"../../content/templates/climbing-tower/view.ts":Fg,"../../content/templates/crystal-gallery/view.ts":zg,"../../content/templates/dungeon-crawler/view.ts":Wg,"../../content/templates/garden-grower/view.ts":Jg,"../../content/templates/marble-run/view.ts":$g,"../../content/templates/maze-snake/view.ts":r_,"../../content/templates/platformer/view.ts":s_,"../../content/templates/pulse-runner/view.ts":l_,"../../content/templates/racer/view.ts":p_,"../../content/templates/space-tunnel/view.ts":g_,"../../content/templates/tower-defence/view.ts":S_,"../../content/templates/wave-surfing/view.ts":T_,"../../content/templates/word-city/view.ts":k_})),X_=J_(Object.assign({"../../content/styles/flat/style.ts":A_,"../../content/styles/neon/style.ts":G_})),Z_=J_(Object.assign({"../../content/havocs/gravity-tilt/havoc.ts":K_,"../../content/havocs/map-rotate/havoc.ts":q_})),Q_=class{renderer;pixelRatio;override=null;lite=!1;last=0;ema=16;sinceChange=0;blockUpUntil=0;constructor(e){this.renderer=e,this.pixelRatio=Math.min(devicePixelRatio||1,1),e.setPixelRatio(this.pixelRatio)}setOverride(e){this.override=e,this.apply(e??this.pixelRatio)}apply(e){this.pixelRatio=e,this.renderer.setPixelRatio(e);let t=this.renderer.domElement;this.renderer.setSize(t.clientWidth||innerWidth,t.clientHeight||innerHeight,!1)}tick(e){if(this.last){let t=e-this.last;t>0&&t<250&&(this.ema=this.ema*.95+t*.05)}if(this.last=e,this.override!==null||++this.sinceChange<90)return;let t=devicePixelRatio||1;this.ema>22&&this.pixelRatio>.5?(this.apply(Math.max(.5,this.pixelRatio-.25)),this.sinceChange=0,this.blockUpUntil=e+1e4):this.ema<17.5&&e>this.blockUpUntil&&this.pixelRatio<t&&(this.apply(this.pixelRatio+.25),this.sinceChange=0),this.lite=this.pixelRatio<=.75}get fps(){return 1e3/Math.max(1,this.ema)}get frameMs(){return this.ema}},$_=2400,ev=.42,tv=.12,nv=class{canvas;renderer;webgl;scene=new qc;world=new K;rig=new sg;quality;reducedMotion=!1;tDur=$_;current=null;outgoing=null;pending=null;tStart=-1;bgFrom=new q(`#000`);bgTo=new q(`#000`);bg=new q(`#000`);lastNow=0;constructor(e){this.canvas=e;let t,n=!0;try{t=new ng({canvas:e,antialias:!0,alpha:!0,premultipliedAlpha:!1,powerPreference:`high-performance`,preserveDrawingBuffer:!0,logarithmicDepthBuffer:!0}),t.setClearColor(0,0),t.outputColorSpace=$o}catch(r){console.warn(`WebGL unavailable, running without 3D graphics:`,r),n=!1,t=rv(e)}this.renderer=t,this.webgl=n,this.quality=new Q_(this.renderer),this.scene.add(this.world),this.scene.add(new Ef(16777215,1.2));let r=new Tf(16777215,1.6);r.position.set(4,10,6),this.scene.add(r),this.scene.background=null,this.applyBg(),this.resize(),addEventListener(`resize`,()=>this.resize())}applyBg(){document.documentElement.style.setProperty(`--world-bg`,`#${this.bg.getHexString($o)}`)}resize(){let e=this.canvas.clientWidth||innerWidth,t=this.canvas.clientHeight||innerHeight;this.renderer.setSize(e,t,!1),this.current?.kit.setSize?.(e,t,this.renderer.getPixelRatio())}get transitioning(){return this.tStart>=0}mount(e,t,n){let r=Y_[e.templateId];if(!r)throw Error(`No view for ${e.templateId}`);let i=(X_[e.styleId]??X_[`style.flat`]).build(e.palette,{lite:this.quality.lite}),a=new K,o=r.create({root:a,style:i,palette:e.palette,avatar:t,view:e.view});o.update(n,0,this.lastNow),this.world.add(a);let s=this.canvas.clientWidth||innerWidth,c=this.canvas.clientHeight||innerHeight;return i.setSize?.(s,c,this.renderer.getPixelRatio()),{look:e,root:a,inst:o,kit:i,avatar:t}}unmount(e){for(let t of e.look.havocIds)Z_[t]?.reset({world:this.world,rig:this.rig});this.world.remove(e.root),e.inst.dispose(),e.kit.dispose(),e.root.traverse(e=>{e instanceof Y&&e.geometry.dispose()})}setLevel(e,t,n,r,i){if(!i||!this.current){this.current&&this.unmount(this.current),this.outgoing&&this.unmount(this.outgoing),this.outgoing=null,this.pending=null,this.tStart=-1,this.canvas.style.opacity=``,this.current=this.mount(e,t,n),this.rig.setPose(this.current.inst.pose(n)),this.bg.copy(this.current.kit.background),this.applyBg();return}this.outgoing=this.current,this.current=null,this.pending={look:e,avatar:t},this.tStart=r,this.bgFrom=this.bg.clone();let a=this.mount(e,t,n);a.root.visible=!1,this.current=a,this.bgTo=a.kit.background.clone();let o=a.inst.pose(n);this.tDur=this.reducedMotion?$_*1.5:$_,this.rig.transition(o,this.tDur,r)}render(e,t,n){this.lastNow=n,this.quality.tick(n);let r=this.current;if(this.tStart>=0){let e=Math.min(1,(n-this.tStart)/this.tDur);this.bg.copy(this.bgFrom).lerp(this.bgTo,ag(e)),this.applyBg();let t=Math.min(1,Math.abs(e-ev)/tv);if(this.canvas.style.opacity=e>=1?``:String(ag(t)),this.outgoing){let t=Math.min(1,e/ev);this.reducedMotion||this.outgoing.root.scale.set(1,1-.6*ag(t),Math.max(.02,1-ag(t))),e>=ev&&(this.unmount(this.outgoing),this.outgoing=null)}if(r&&e>=ev){let t=(e-ev)/.5800000000000001;r.root.visible=!0,this.reducedMotion||r.root.scale.set(1,.4+.6*ag(t),Math.max(.02,ag(t)))}e>=1&&(this.tStart=-1,this.pending=null,r&&r.root.scale.set(1,1,1))}if(r&&e&&e.setup.templateId===r.look.templateId){if(r.root.visible&&r.inst.update(e,t,n),this.rig.transitioning)this.rig.follow(r.inst.pose(e).target);else{let t=r.inst.pose(e);this.rig.pose.fov+=(t.fov-this.rig.pose.fov)*.08,this.rig.pose.frameHeight+=(t.frameHeight-this.rig.pose.frameHeight)*.05,this.rig.pose.yaw=t.yaw,this.rig.pose.pitch=t.pitch,this.rig.follow(t.target,t.follow??.12)}let i=e.setup.stageLengths.length>1?Math.min(e.state.stage,e.setup.stageLengths.length-1)/(e.setup.stageLengths.length-1):1,a=Math.round(r.look.havocMaxP*i);for(let e of r.look.havocIds)Z_[e]?.apply({world:this.world,rig:this.rig,intensityP:a,time:n,reducedMotion:this.reducedMotion})}let i=this.canvas.clientWidth||innerWidth,a=this.canvas.clientHeight||innerHeight;this.rig.update(n,i/Math.max(1,a));let o=r??this.outgoing;this.webgl&&(o?.kit.render?.(this.renderer,this.scene,this.rig.camera)||this.renderer.render(this.scene,this.rig.camera))}static pose(e){return rg(e)}};function rv(e){let t=1;return{domElement:e,outputColorSpace:$o,setSize:()=>{},setPixelRatio:e=>void(t=e),getPixelRatio:()=>t,render:()=>{},dispose:()=>{}}}var iv={"primary-color":`primary`,"secondary-color":`secondary`,pattern:`pattern`,size:`size`,accessory:`accessory`,trail:`trail`,aura:`aura`,"idle-style":`idle`},av={primary:3,secondary:7,size:5,pattern:1,accessory:1,trail:1,aura:1,idle:1};function ov(e){let t={...av};for(let n of Object.keys(t)){let r=e?.[n];typeof r==`number`&&Number.isFinite(r)&&(t[n]=Math.min(10,Math.max(1,Math.round(r))))}return t}function sv(e,t,n){let r=iv[t];return r&&av[r]===n?0:e.customization.find(e=>e.slot===t)?.unlocks.find(e=>n>=e.range[0]&&n<=e.range[1])?.stars??0}function cv(e,t,n){let r={...t};for(let[t,i]of Object.entries(iv))sv(e,t,r[i])>n&&(r[i]=av[i]);return r}var lv=e=>new q().setHSL((e-1)%10/10,.7,.6),$=(e,t=.15)=>new Ld({color:e,emissive:e,emissiveIntensity:t,roughness:.5}),uv={robot(e,t,n){let r=new K,i=new Y(new X(.7,.8,.5),$(t));i.position.y=.5,r.add(i);let a=new Y(new X(.5,.4,.45),$(n));a.position.y=1.15,r.add(a);let o=new Y(new X(.3,.08,.05),$(new q(`#ffffff`),1));o.position.set(0,1.18,.24),r.add(o);for(let i=0;i<Math.min(e,6);i++){let e=new Y(new X(.15,.15+i*.05,.15),$(i%2?t:n)),a=i%2?1:-1;e.position.set(a*(.45+dv(i)*.12),.5+dv(i)*.15,0),r.add(e)}if(e>=7){let e=new Y(new X(1.8,.1,.4),$(n,.5));e.position.y=.8,r.add(e)}return r},human(e,t,n){let r=new K,i=new Y(new Wu(.25,.5,4,12),$(t));i.position.y=.55,r.add(i);let a=new Y(new Td(.22+(7-e)*.02,16,12),$(new q(`#f1c27d`),.05));if(a.position.y=1.2,r.add(a),e>=4){let e=new Y(new Ed(.22,.03,6,16),$(n,.4));e.position.y=1.28,e.rotation.x=Math.PI/2,r.add(e)}if(e>=6){let e=new Y(new qu(.12,.35,8),$(new q(`#eeeeee`),.1));e.position.set(0,.95,.15),e.rotation.x=Math.PI,r.add(e)}return r},flowers(e,t,n){let r=new K,i=new Y(new Ku(.04,.05,.3+e*.12,6),$(new q(`#4caf50`)));i.position.y=(.3+e*.12)/2,r.add(i);let a=.3+e*.12;if(e===1){let e=new Y(new Td(.2,12,8),$(new q(`#8d6e63`)));return e.position.y=.15,r.add(e),r}let o=e>=6?3:1;for(let i=0;i<o;i++){let s=new K;s.position.set((i-(o-1)/2)*.35,a-Math.abs(i-1)*.15*(o>1),0),s.add(new Y(new Td(.1,10,8),$(n,.4)));let c=3+e;for(let e=0;e<c;e++){let n=new Y(new Td(.1,8,6),$(t,.3));n.scale.set(1.6,.6,.6);let r=e/c*Math.PI*2;n.position.set(Math.cos(r)*.17,Math.sin(r)*.17,0),n.rotation.z=r,s.add(n)}r.add(s)}return r},dragon(e,t,n){let r=new K;if(e===1){let e=new Y(new Td(.35,16,12),$(t,.2));return e.scale.y=1.3,e.position.y=.45,r.add(e),r}let i=.5+e*.08,a=new Y(new Td(.35*i,14,10),$(t));a.scale.set(1.4,1,1),a.position.y=.5,r.add(a);let o=new Y(new Td(.2*i,12,8),$(t));if(o.position.set(.45*i,.8,0),r.add(o),e>=3)for(let e of[-1,1]){let t=new Y(new qu(.3*i,.7*i,3),$(n,.3));t.position.set(-.05,.85,e*.3),t.rotation.x=e*1.1,r.add(t)}if(e>=7){let e=new Y(new Ed(.6,.03,6,32),$(new q(`#fff176`),1));e.position.y=.6,r.add(e)}return r},vehicles(e,t,n){let r=new K,i=e<=1?3:e<=3?2:4,a=.5+e*.12,o=new Y(e>=6?new qu(.25,a,12):new X(a,.25+e*.03,.4),$(t));if(e>=6&&(o.rotation.z=-Math.PI/2),o.position.y=e>=6?.7:.45,r.add(o),e<6)for(let e=0;e<i;e++){let t=new Y(new Ed(.12,.05,6,14),$(n,.2));t.position.set((e%2?1:-1)*a*.35,.18,i>2?e<2?.22:-.22:0),r.add(t)}else for(let e of[-1,1]){let t=new Y(new X(.3,.04,.6),$(n,.3));t.position.set(-.05,.7,e*.3),r.add(t)}if(e>=7){let e=new Y(new qu(.12,.35,8),$(new q(`#ffb703`),1));e.rotation.z=Math.PI/2,e.position.set(-a*.6,.7,0),r.add(e)}return r},ocean(e,t,n){let r=new K,i=.2+e*.09,a=new Y(new Td(i,14,10),$(t,.25));if(a.scale.set(e<=1?1:1.8,1,1),a.position.y=.6,r.add(a),e>=2){let e=new Y(new qu(i*.6,i*.9,4),$(n,.3));e.rotation.z=Math.PI/2,e.position.set(-i*2,.6,0),r.add(e)}if(e>=4){let e=new Y(new qu(i*.3,i*.8,4),$(n,.3));e.position.set(0,.6+i,0),r.add(e)}if(e>=7)for(let e=0;e<6;e++){let t=new Y(new Ku(.03,.06,.7,6),$(n,.3)),i=e/6*Math.PI*2;t.position.set(Math.cos(i)*.3,.25,Math.sin(i)*.3),t.rotation.z=Math.cos(i)*.6,r.add(t)}let o=new Y(new Td(Math.max(.03,i*.15),8,6),$(new q(`#ffffff`),1));return o.position.set(i*1.2,.65,i*.5),r.add(o),r},light(e,t,n){let r=new K;if(e>=2&&e<=4){let t=new Y(new Ku(.12+e*.05,.15+e*.05,.3+e*.1,10),$(n));t.position.y=.2+e*.05,r.add(t)}let i=new Y(e>=6?new xd(.25+e*.06,1):new qu(.1+e*.04,.25+e*.08,10),$(t,1));i.position.y=.55+e*.08,r.add(i);for(let t=0;t<Math.max(0,e-3)*2;t++){let a=new Y(new X(.03,.25,.03),$(n,1)),o=t/((e-3)*2)*Math.PI*2;a.position.set(Math.cos(o)*.5,i.position.y+Math.sin(o)*.5,0),a.rotation.z=o-Math.PI/2,r.add(a)}return r},buildings(e,t,n){let r=new K,i=[1,1,2,3,5,4,3][e-1];if(e===1){let e=new Y(new qu(.4,.7,4),$(t));return e.position.y=.35,r.add(e),r}for(let a=0;a<i;a++){let i=e>=5?.45:.65,o=new Y(new X(i,.32,i),$(a%2?n:t));o.position.y=.16+a*.33+(e>=6?.3:0),r.add(o)}let a=new Y(e===4?new Ku(.1,.1,.4,8):new qu(.45,.35,4),$(n,.2));if(a.position.y=i*.33+.18+(e>=6?.3:0),r.add(a),e>=6){let e=new Y(new Ed(.45,.04,6,24),$(n,.6));e.rotation.x=Math.PI/2,e.position.y=.2,r.add(e)}return r},cats(e,t,n){let r=new K,i=.55+e*.07,a=new Y(new Td(.3*i,14,10),$(t));a.scale.set(1.5,1,1),a.position.y=.38*i,r.add(a);let o=new Y(new Td(.2*i,12,10),$(t));o.position.set(.42*i,.6*i,0),r.add(o);for(let e of[-1,1]){let t=new Y(new qu(.06*i,.14*i,4),$(n));t.position.set(.42*i,.82*i,e*.1*i),r.add(t)}let s=new Y(new Ku(.03*i,.03*i,.5*i,6),$(n));if(s.position.set(-.5*i,.6*i,0),s.rotation.z=.6,r.add(s),e>=5){let e=new Y(new Ed(.2*i,.07*i,8,16),$(n,.2));e.position.set(.4*i,.6*i,0),e.rotation.y=Math.PI/2,r.add(e)}if(e>=7){let e=new Y(new Ku(.12*i,.15*i,.12*i,6),$(new q(`#ffd166`),.8));e.position.set(.42*i,.86*i,0),r.add(e)}return r},music(e,t,n){let r=new K,i=[1,1,1,3,5,7,9][e-1];for(let a=0;a<i;a++){let o=new K,s=new Y(e===2?new Ku(.2,.2,.22,14):new Td(.12,10,8),$(a%2?n:t,.3));if(s.scale.set(1.2,e===2?1:.85,1),o.add(s),e!==2){let e=new Y(new X(.03,.4,.03),$(n));e.position.set(.12,.2,0),o.add(e)}let c=a/i*Math.PI*2;o.position.set(i>1?Math.cos(c)*.4:0,.55+(i>1?Math.sin(c)*.25:0),i>1?Math.sin(c)*.2:0),r.add(o)}if(e>=6){let e=new Y(new Ed(.6,.02,6,32),$(n,.8));e.position.y=.55,r.add(e)}return r},ships(e,t,n){let r=new K,i=.5+e*.1,a=new Y(new X(i,.18,.35),$(e===1?new q(`#a1887f`):t));a.position.y=e>=7?.6:.15,r.add(a);let o=e>=5?3:+(e>=3);for(let e=0;e<o;e++){let t=(e-(o-1)/2)*i*.3,s=new Y(new Ku(.02,.02,.6,6),$(new q(`#8d6e63`)));s.position.set(t,a.position.y+.35,0);let c=new Y(new Cd(.28,.4),$(n,.2));c.position.set(t+.02,a.position.y+.38,.02),r.add(s,c)}if(e>=7){let e=new Y(new Td(.35,14,10),$(n,.3));e.scale.set(1.6,.9,.9),e.position.y=1.2,r.add(e)}return r},weather(e,t,n){let r=new K;if(e<=2){let n=new Y(new Td(.18+e*.04,12,10),$(t,.4));return n.scale.y=1.3,n.position.y=.4,r.add(n),r}let i=3+e;for(let a=0;a<i;a++){let o=new Y(new Td(.18+a%3*.05,10,8),$(e>=5?n:t,.25));o.position.set((a-i/2)*.13,.8+Math.sin(a)*.08,Math.cos(a*2)*.1),r.add(o)}if(e>=4)for(let n=0;n<e;n++){let i=new Y(e>=5&&n===0?new X(.06,.35,.02):new Td(.04,6,4),$(e>=5&&n===0?new q(`#ffd166`):t,.8));i.position.set((n-e/2)*.12,.45-n%2*.12,0),r.add(i)}if(e>=7){let e=new Y(new Ed(.55,.04,6,32,Math.PI),$(n,1));e.position.y=.9,r.add(e)}return r},cosmos(e,t,n){let r=new K,i=new Y(new xd(.2+e*.05,e>=3?2:0),$(t,e>=5?.9:.2));i.position.y=.6,r.add(i);for(let t=0;t<e-2;t++){let i=new Y(new Td(.06,8,6),$(n,.6)),a=t/Math.max(1,e-2)*Math.PI*2;i.position.set(Math.cos(a)*.6,.6+Math.sin(a*2)*.1,Math.sin(a)*.6),r.add(i)}if(e>=4){let e=new Y(new Ed(.45,.02,6,32),$(n,.6));e.position.y=.6,e.rotation.x=1.2,r.add(e)}return r}};function dv(e){return Math.floor(e/2)}var fv=class{scale;tier;root=new K;body;anims=[];glow;trail;aura=null;scaleId;custom;constructor(e,t,n){this.scale=e,this.tier=t,this.custom=ov(n);let r=this.custom;this.scaleId=e.id.replace(/^scale\./,``);let i=uv[this.scaleId]??uv.robot;this.body=i(Math.max(1,Math.min(7,t)),lv(r.primary),lv(r.secondary)),pv(this.body,r);let a=.7+r.size*.06;this.body.scale.setScalar(a),this.root.add(this.body),this.glow=new Sf(lv(r.primary),0,3),this.glow.position.y=.8,this.root.add(this.glow),this.aura=mv(r.aura,lv(r.secondary)),this.aura&&this.root.add(this.aura),this.trail=hv(r.trail),this.root.add(this.trail)}static hasBuilder(e){return e.replace(/^scale\./,``)in uv}resolveHook(e,t){return e.startsWith(`ability:`)?this.scale.rigHooks[e]?e:t&&this.scale.rigHooks[t]?t:`ability-pulse`:e}play(e,t,n){let r=this.resolveHook(e,n),i=r===`celebrate`?900:r===`jump`||r.startsWith(`ability:`)?600:r===`powerup`||r===`ability-pulse`?700:260;this.anims=this.anims.filter(e=>e.hook!==r),this.anims.push({hook:r,start:t,dur:i})}update(e,t,n=!1){let r=this.body,i=0,a=1,o=1,s=0,c=0,l=0,u=1-t;if(!n){let t=e/1e3;switch(this.custom.idle){case 2:c+=Math.sin(t*1.6)*.08*u;break;case 3:s+=t*.8*u;break;case 4:i+=Math.abs(Math.sin(t*3))*.12*u;break;case 5:c+=Math.sin(t*6)*.05*u;break;case 6:a*=1+Math.sin(t*3)*.05*u,o=a;break;case 7:i+=(.15+Math.sin(t*1.5)*.06)*u;break;case 8:c+=Math.sin(t*1.2)*.15*u;break;case 9:s+=Math.sin(t*1.4)*.9*u;break;case 10:i+=Math.abs(Math.sin(t*5))*.08*u,o*=1+Math.abs(Math.sin(t*5))*.06*u;break;default:i+=Math.sin(e/400)*.04*u}}c-=t*.15,this.trail.visible=t>.05,this.trail.children.forEach((n,r)=>{n.position.set(-.35-r*.22,.4+Math.sin(e/150+r)*.08,0),n.scale.setScalar(Math.max(.2,1-r*.15)*Math.min(1,t*2))}),this.aura&&!n&&(this.aura.rotation.y=e/1500),this.scaleId===`flowers`&&!n&&(c+=Math.sin(e/700)*.05),this.anims=this.anims.filter(t=>e-t.start<t.dur);for(let t of this.anims){let r=(e-t.start)/t.dur;switch(t.hook){case`jump`:case`ability:ability.jump`:i+=Math.sin(r*Math.PI)*(t.hook===`jump`?1.2:1.6),o*=1+Math.sin(r*Math.PI)*.15,t.hook!==`jump`&&(a*=1-Math.sin(r*Math.PI)*.2);break;case`land`:case`stumble`:o*=1-Math.sin(r*Math.PI)*.25,a*=1+Math.sin(r*Math.PI)*.2,t.hook===`stumble`&&!n&&(c+=Math.sin(r*Math.PI*4)*.15);break;case`celebrate`:s+=r*Math.PI*2,i+=Math.sin(r*Math.PI)*.5,l=Math.max(l,Math.sin(r*Math.PI)*2);break;case`powerup`:case`ability-pulse`:l=Math.max(l,Math.sin(r*Math.PI)*3),a*=1+Math.sin(r*Math.PI)*.1,o*=1+Math.sin(r*Math.PI)*.1}}r.position.y=i,r.rotation.set(0,s,c);let d=.7+this.custom.size*.06;r.scale.set(d*a,d*o,d*a),this.glow.intensity=l}dispose(){this.root.traverse(e=>{e instanceof Y&&(e.geometry.dispose(),e.material.dispose())})}};function pv(e,t){let n=new cl().setFromObject(e),r=n.getSize(new U),i=n.getCenter(new U),a=n.max.y,o=lv(t.secondary);if(t.pattern>1){let n=(t.pattern-2)%4,a=3+(t.pattern-2)*2;for(let t=0;t<a;t++){let s=new Y(n===0?new Td(.05,6,4):n===1?new Ed(.06,.015,4,10):n===2?new Sd(.06):new X(.07,.07,.07),$(o,.5)),c=t/a*Math.PI*2;s.position.set(i.x+Math.cos(c)*r.x*.45,i.y+Math.sin(c*1.7)*r.y*.3,i.z+Math.sin(c)*Math.max(.12,r.z*.5)),e.add(s)}}if(t.accessory>1){let n=new K,r=new q(`#ffd166`);switch(t.accessory){case 2:{let e=new Y(new qu(.16,.3,12),$(o,.3));e.position.y=.15,n.add(e);break}case 3:for(let e=0;e<5;e++){let t=new Y(new qu(.035,.12,4),$(r,.6)),i=e/5*Math.PI*2;t.position.set(Math.cos(i)*.12,.06,Math.sin(i)*.12),n.add(t)}break;case 4:for(let e of[-1,1]){let t=new Y(new qu(.08,.16,4),$(o,.3));t.rotation.z=e*Math.PI/2,t.position.x=e*.09,n.add(t)}break;case 5:for(let e of[-1,1]){let t=new Y(new Ed(.06,.012,4,14),$(new q(`#222222`),.1));t.position.set(e*.08,-.12,.2),n.add(t)}break;case 6:{let e=new Y(new Ed(.2,.04,6,18),$(o,.3));e.rotation.x=Math.PI/2,e.position.y=-.25,n.add(e);break}case 7:{let e=new Y(new Ku(.01,.01,.25,4),$(o));e.position.y=.12;let t=new Y(new Td(.05,8,6),$(r,.8));t.position.y=.26,n.add(e,t);break}case 8:for(let e=0;e<5;e++){let t=new Y(new Td(.05,6,4),$(o,.4)),r=e/5*Math.PI*2;t.position.set(Math.cos(r)*.07,.05,Math.sin(r)*.07),n.add(t)}break;case 9:{let e=new Y(new Ed(.16,.02,6,24),$(r,1));e.rotation.x=Math.PI/2,e.position.y=.12,n.add(e);break}default:{let e=new Y(new Sd(.1),$(r,1));e.position.y=.12,n.add(e)}}n.position.set(i.x,a,i.z),n.name=`accessory`,e.add(n)}}function mv(e,t){if(e<=1)return null;let n=new K,r=new vu({color:t,transparent:!0,opacity:.45,depthWrite:!1});if(e<=4){let t=new Y(new Ed(.45+(e-2)*.1,.03,6,32),r);t.rotation.x=Math.PI/2,t.position.y=.05,n.add(t)}else if(e<=7){let r=new Y(new Td(.6+(e-5)*.08,16,12),new vu({color:t,transparent:!0,opacity:.15,depthWrite:!1}));r.position.y=.6,n.add(r)}else for(let t=0;t<2;t++){let i=new Y(new Ed(.5+t*.15,.025,6,32),r);i.position.y=.5+t*.25,i.rotation.x=Math.PI/2+(t?.4:-.4)*(e-7)*.3,n.add(i)}return n.name=`aura`,n}function hv(e){let t=new K;t.name=`trail`;for(let n=0;n<(e<=1?0:Math.min(6,e-1));n++)t.add(new Y(new Sd(.06),$(lv(e+n),.9)));return t}function gv(e,t,n,r=!1){let i=e.root.children[0],a=.7+e.custom.size*.06,o=r?.35:1,s=0,c=1,l=1,u=0,d=0;switch(t){case`shake`:d=Math.sin(n*18*o)*.1,s=Math.abs(Math.sin(n*9*o))*.08;break;case`roll`:u=Math.sin(n*2)*.7*o,d=Math.cos(n*2)*.12*o;break;case`reach`:l=1+.28*(.5+.5*Math.sin(n*1.6)),c=1-.1*(.5+.5*Math.sin(n*1.6)),s=.15*(.5+.5*Math.sin(n*1.6));break;case`look`:u=Math.sin(n*.7)*1.1*o;break;case`wiggle`:c=1+Math.sin(n*14*o)*.07,l=1-Math.sin(n*14*o)*.07;break;case`breathe`:c=l=1+.12*Math.sin(n*1.1)}i.position.y=s,i.rotation.set(0,u,d),i.scale.set(a*c,a*l,a*c)}function _v(e,t={},...n){let r=document.createElement(e);for(let[e,n]of Object.entries(t))n!=null&&n!==!1&&(e===`class`?r.className=n:e===`style`&&typeof n==`object`?Object.assign(r.style,n):e.startsWith(`on`)&&typeof n==`function`?r.addEventListener(e.slice(2).toLowerCase(),n):e===`html`?r.innerHTML=n:r.setAttribute(e,String(n)));for(let e of n)e!=null&&e!==!1&&r.append(e);return r}function vv(e,t){let n=_v(`div`,{class:`toast`,role:`status`},t);e.append(n),setTimeout(()=>n.remove(),2500)}var yv={lp:`left little finger`,lr:`left ring finger`,lm:`left middle finger`,li:`left pointer finger`,lt:`left thumb`,rt:`right thumb`,ri:`right pointer finger`,rm:`right middle finger`,rr:`right ring finger`,rp:`right little finger`},bv=`tbtge`,xv=1,Sv=[`profiles`,`segments`,`settings`,`proofs`],Cv=null;function wv(){return Cv??=new Promise((e,t)=>{let n=indexedDB.open(bv,xv);n.onupgradeneeded=()=>{let e=n.result;for(let t of Sv)e.objectStoreNames.contains(t)||e.createObjectStore(t)},n.onsuccess=()=>e(n.result),n.onerror=()=>t(n.error)})}function Tv(e,t,n){return wv().then(r=>new Promise((i,a)=>{let o=n(r.transaction(e,t).objectStore(e));o.onsuccess=()=>i(o.result),o.onerror=()=>a(o.error)}))}var Ev={get:(e,t)=>Tv(e,`readonly`,e=>e.get(t)),put:(e,t,n)=>Tv(e,`readwrite`,e=>e.put(n,t)).then(()=>void 0),del:(e,t)=>Tv(e,`readwrite`,e=>e.delete(t)).then(()=>void 0),keys:e=>Tv(e,`readonly`,e=>e.getAllKeys()).then(e=>e.map(String)),all:e=>Tv(e,`readonly`,e=>e.getAll())},Dv=e=>e.font??(e.dyslexicFont?`dyslexic`:`legible`),Ov={reducedMotion:typeof matchMedia<`u`&&matchMedia(`(prefers-reduced-motion: reduce)`).matches,musicVolume:.35,sfxVolume:.6,voice:!0,keyboard:`auto`,quality:`auto`,textScale:1,dyslexicFont:!1,highContrast:!1,colorBlindPatterns:!1,breakMinutes:20,breakSeconds:120,showFps:!0,voiceVolume:1,font:`legible`,sessionMinutes:0},kv=`current`,Av=`currentProfile`;function jv(e,t,n,r,i=`en`){return{schemaVersion:2,profileId:r,name:e,avatar:{scale:t,customization:{...av}},tier:n,tierHistory:[],starsByTier:{},results:[],campaign:{language:i,seed:r,level:1},collected:[],perKey:{},settings:{...Ov},createdAt:Date.now()}}async function Mv(){let e=await Ev.get(`profiles`,kv);if(!e)return;let t={...e,schemaVersion:2};await Ev.put(`profiles`,t.profileId,t),await Ev.put(`settings`,Av,t.profileId),await Ev.del(`profiles`,kv)}async function Nv(){return(await Ev.all(`profiles`)).filter(e=>e&&e.profileId).sort((e,t)=>(t.lastPlayed??t.createdAt)-(e.lastPlayed??e.createdAt))}var Pv=()=>Ev.get(`settings`,Av),Fv=e=>Ev.get(`profiles`,e);async function Iv(e){e.schemaVersion=2,await Ev.put(`profiles`,e.profileId,e),await Ev.put(`settings`,Av,e.profileId)}function Lv(e){let t=0;for(let n of Object.values(e.starsByTier??{}))for(let e of Object.values(n))t+=e;return t}var Rv=e=>[...new Set([e.campaign.seed,...e.pastSeeds??[]])];async function zv(e){let t=Rv(e);for(let e of await Ev.all(`segments`))t.includes(e.campaignSeed)&&await Ev.del(`segments`,e.key);await Ev.del(`profiles`,e.profileId),await Pv()===e.profileId&&await Ev.del(`settings`,Av)}function Bv(e,t,n,r=e.campaign.language){return{...e,pastSeeds:Rv(e),campaign:{language:r,seed:t,level:1},tier:n,drillOfferedAt:void 0}}var Vv=(e,t)=>`${e}:${String(t).padStart(3,`0`)}`,Hv=e=>Ev.get(`segments`,e),Uv=e=>Ev.put(`segments`,e.key,e);async function Wv(e){return(await Ev.all(`segments`)).filter(t=>t.campaignSeed===e).sort((e,t)=>e.level-t.level)}async function Gv(){return Ev.all(`segments`)}function Kv(){let e=new Uint8Array(12);return crypto.getRandomValues(e),Array.from(e,e=>e.toString(16).padStart(2,`0`)).join(``)}function qv(e){let t=0,n=0,r=[];for(let[,[i,a,o]]of Object.entries(e))t+=i+a,n+=a,i&&r.push(o/i);if(!t)return[];let i=n/t;r.sort((e,t)=>e-t);let a=r[Math.floor(r.length/2)]??0;return Object.entries(e).filter(([e,[t,n,r]])=>e.trim()&&t+n>=20&&(n/(t+n)>2*i||t&&r/t>1.5*a)).map(([e])=>e).sort()}var Jv=[`number`,`top`,`home`,`bottom`,`space`],Yv=[`Backspace`,`Enter`,`Tab`,`Backquote`,`Backslash`,`BracketLeft`,`BracketRight`,`Equal`,`Minus`,`Quote`],Xv={Backspace:`wide`,Enter:`wide`,Tab:`wide`,ShiftLeft:`shift`,ShiftRight:`shift`},Zv=class{lang;opts;el;keys={};nextCodes=[];full=!1;constructor(e,t={}){this.lang=e,this.opts=t,this.el=_v(`div`,{class:`kbd`,"aria-hidden":`true`}),this.build(!!t.full)}build(e){this.full=e,this.keys={},this.nextCodes=[],this.el.replaceChildren(),this.el.classList.toggle(`full`,e);let{lang:t,opts:n}=this;for(let r of Jv){if(r===`number`&&!n.showNumbers&&!e)continue;let i=_v(`div`,{class:`row ${r}`}),a=Object.entries(t.layout).filter(([t,n])=>n.row===r&&(e||!Yv.includes(t)||/\p{L}/u.test(n.char))).sort((e,t)=>e[1].col-t[1].col),o=(e,t,n,r=``)=>{let i=_v(`div`,{class:`key f-${t} ${Xv[e]??``} ${r}`.trim()},n);return this.keys[e]=i,i};e&&r===`bottom`&&i.append(o(`ShiftLeft`,`lp`,`⇧`));for(let[e,t]of a){let a=e===`Space`?_v(`span`,{class:`spacebar`}):dg(t.char).toUpperCase(),s=o(e,t.finger,a,`${t.homeBump?`bump`:``}${e===`Space`?` space`:``}`);n.fingers&&r===`home`&&[`KeyA`,`KeyS`,`KeyD`,`KeyF`,`KeyJ`,`KeyK`,`KeyL`,`Semicolon`].includes(e)&&s.append(_v(`div`,{class:`finger`,style:{background:`var(--f-${t.finger})`}})),i.append(s)}e&&r===`bottom`&&i.append(o(`ShiftRight`,`rp`,`⇧`)),this.el.append(i)}}keyEl(e){return this.keys[e]}setKnown(e,t=[]){let n=!!this.opts.full||e.some(e=>{let t=this.lang.codeOf[e];if(!t)return!1;if(this.lang.needsShift[e])return!0;let n=this.lang.layout[t].row;return/\p{L}/u.test(e)?n===`number`:Yv.includes(t)||n===`number`});n!==this.full&&this.build(n);let r=e.some(e=>this.lang.needsShift[e]),i=t.some(e=>this.lang.needsShift[e]);for(let[n,a]of Object.entries(this.keys)){if(n===`ShiftLeft`||n===`ShiftRight`){a.classList.toggle(`known`,r),a.classList.toggle(`new`,i);continue}let o=this.lang.layout[n].char;a.classList.toggle(`known`,e.includes(o)||n===`Space`),a.classList.toggle(`new`,t.includes(o)&&o!==` `)}}setNext(e,t=!1){let n=e===void 0?``:this.lang.codeOf[e]??``,r=n?[n]:[];if(n&&e!==void 0&&this.lang.needsShift[e]&&r.push(this.lang.layout[n].finger.startsWith(`l`)?`ShiftRight`:`ShiftLeft`),r.join()!==this.nextCodes.join()){for(let e of this.nextCodes)this.keys[e]?.classList.remove(`next`,`hint`);this.nextCodes=r;for(let e of r)this.keys[e]?.classList.add(`next`)}for(let e of r)this.keys[e]?.classList.toggle(`hint`,t)}setOpacity(e){this.el.style.opacity=String(e)}},Qv=Object.values(Object.assign({"../generated/build-info.json":{build:`sha256-RO8a0vKlgm_bnEFD49YRHUWZIXfyQBdia4Duu1Lupt0`,id:`RO8a0vKlgm_bnEFD`,commit:`3a02aa76463b6adc18125fb476463706897c6ca7`,items:{"ability.home-row-secret@1":`sha256-x_u9aOZD3R-vRhRG9kVHA2HU7ABPXnNp84NmA40pNyU`,"ability.jump@1":`sha256-gtqzP2eivoFBWnnUpOqhl5wAWeR6OK8lHDt-mnCMMzI`,"ability.shield-word@1":`sha256-hdZEjqELnjDYKUiF0my-84OXBRJkgsGCLeJ75-N4ROA`,"ability.slow-word@1":`sha256-Uh-vIArqDh-PFKyJH2DIjLz9vQbI6WHlT33GkdoftKo`,"ability.voice-chipmunk@1":`sha256-H86BAKAgbdXv_b3MzHFl8HKAlm0TB6SDVTRmv2cS_xI`,"ability.voice-giant@1":`sha256-LMx6g-bkIOf1A4joJm4blkxfAoCtpGcvzz9XG_wTX5k`,"ability.voice-robot@1":`sha256-8I4oG-q2ZgO0xrbEbYa63Va6CASY6gXvC3j_34CwTzc`,"ability.voice-sleepy@1":`sha256--3TSS-FqUNpjHWwK5M0tV40YuSa_xF1PyhjoUnecHV0`,"ability.voice-speedy@1":`sha256-Rpbt_rg5xU2if7hnqkdtM93RFnzdAlYdNTAjuiQtJNg`,"campaign.en@1":`sha256-T1zyTLLHGoTqlABoDPmcHWgAxLZQMARTTUx9VDEvakU`,"campaign.ru@1":`sha256-OKxQcj7AU_wVzBsBQQofrcNsN4yMzvIyyO3-CU6CQO0`,"havoc.gravity-tilt@1":`sha256-tU7P1nxThw4bL9VnFODibJWAR34MjJ4iXyrbFqV_mDM`,"havoc.map-rotate@1":`sha256-2E3A22phlernfzdIcWD1dplRke6_yBfz03zxkzfmT88`,"illustration.apple@1":`sha256-ZfLaL1uYB5x55GS1GEjviNkJXZ9PWDqbJZq57ZLGTJ4`,"illustration.ball@1":`sha256-I35qWSdZ9kjuOzyE6mt5-BemYniRlTBy-O57rr1MxD4`,"illustration.bike@1":`sha256-z-0-UIu1Zz8d2XDfINQUMV4N_C2Hi7u5rQ1eCYOrw6s`,"illustration.bird@1":`sha256-IlXKuWvxZ8XNVjRuxgXKHoosJxbdMpUVnWvOSZlDd9M`,"illustration.boat@1":`sha256-LMFpRJP3grsG_m_hIp64ox97tX-tJMxDK-MXktz1yuY`,"illustration.book@1":`sha256-Ml1t6kd50ZUgbe2pUUAiXF4Mh8-0EMKLfC8qsPiBUjk`,"illustration.box@1":`sha256-5HhJl44XGSxF0NvAnycZofqX67YFuyxm3WG2OxDCybk`,"illustration.cake@1":`sha256-6Y3FnnrtLLUUlJRkQmqD_-pp8imGFv1Ekgcp-rgLn00`,"illustration.cat@1":`sha256-yYWcZ3gfFPeSSmFeinRZG9ucjBx3DnwbeaLrVGSvtwE`,"illustration.clock@1":`sha256-Mwke2Up9X8zN6cKSB1QNgBSrYhjSPmuk6OJeSIdlEzY`,"illustration.cloud@1":`sha256-sFnswJ46rWfwQMhB8xJMY-_zfuexlRt4ZJUrBdCt4AQ`,"illustration.dad@1":`sha256-PCwpU49fN5PU11jI3BT7JbYCmbxzwmWhRxSxkVbiALQ`,"illustration.deer@1":`sha256-PHuJvTOlTYj-4k2BLAWT4YCzsINXKwEBBaMr9tQQYBg`,"illustration.desk@1":`sha256-CCJk9vnAyuwuBFPN4vr3z8NkFypE5X61aTD1GwMy3Ew`,"illustration.dog@1":`sha256-zevaWvNhx0JuJAZfkCSXPtqcrohTGhddM814qMSH8fU`,"illustration.dress@1":`sha256-N6NEZezr6jp-oNVtkuD7slNngoPnztp6d0La6O8dJnA`,"illustration.easel@1":`sha256-RMumZNunGs6Xqy-FloQV2SeY69opVM0GmIJhq4WiqF8`,"illustration.eel@1":`sha256-3l2XkDxep-GWxBGFfxb8CZ9wRzi4rNkv5Vcucy9O91c`,"illustration.egg@1":`sha256-vm7Pe1a_hnHK17FjyC94onzCYs5SDr0Nz5dPvQaAQ_Q`,"illustration.elf@1":`sha256-qGm4K7iN-Kxc3lLcEYD7e_sgZKwS8AfgemowlDUO3zc`,"illustration.fire@1":`sha256-v7bY6MT4tkQKnJiDO0IwWg-zhcjPn4wUo1DhaXQBJvg`,"illustration.fish@1":`sha256-KzjuJx3ljomgl31670Kg1dBSUbxOdEGV-4LA5c-1Udk`,"illustration.flag@1":`sha256-SfblLn2nPXRJGliPbs99-Rm_Yq8Cs7kvFcMmfRq1sqw`,"illustration.flask@1":`sha256-eWJvLhVWoRNAzKpFvvv2yatN7cb_Zi9YIbtNVHVvSEM`,"illustration.flower@1":`sha256-9a5N2jhNnFoFI1yy6AjnmMsec7ZuXXe85EFHt_kPx3M`,"illustration.fox@1":`sha256-tYwTCsTFxD2qqEDoa7aK15hyGKGXETN3J3tDj9mjRdM`,"illustration.frog@1":`sha256-J1w52AffxAY33cvXHQA4oxI6hNAPUFL1jrlzb2P2eOY`,"illustration.ghost@1":`sha256-tyTixVD5hf6W-90s61uJRlPdAR5ndPOknM53q41hUkg`,"illustration.gift@1":`sha256-nPSfvm9q7QrDOF0bqloUqxJYXMnfE9UFx8LHD-Z_1EI`,"illustration.giraffe@1":`sha256-KwSyKabmqBdQz20fmpLQvIgRw4BFddAGH4cMlcbOA5g`,"illustration.goat@1":`sha256-iy4UGdV7jRecmrWFEaOCzlJh7X3K4e8jLyIj28rwQkA`,"illustration.grass@1":`sha256-WKCmTQvtZrsFmLDtk-tHD61-FnJ49E99y0CQd_hQ4OY`,"illustration.heart@1":`sha256-i6ntscw-LCdeOnUfeb95SJ8r-HaGZw5ewfy7a0VyFOs`,"illustration.hill@1":`sha256-O7tINvyxkHuAzIX0m9g3yq5crUjNGs1CJdN1vHH22eE`,"illustration.house@1":`sha256-wkXRXGhX_jT-C8xjOZkLP3kDU2WUP4ICTx5BXUCW2io`,"illustration.ice@1":`sha256-aS6YittXA-6cyfkDYzanMVSYrK_2s-N8IcfmOyoXO7o`,"illustration.key@1":`sha256-laBE1g4i2U4b0QtKbLGkM01V6QwsFM_WkwcU92Sl3Po`,"illustration.kid@1":`sha256-YtTmckoUoVG5CbxF7nBI_NTBI6xAE5bvUJKYPxGYXJ0`,"illustration.lake@1":`sha256-7k73-kxSQR2zUVcA9xscBqbXT5x4bEuEF6fypOFDPK8`,"illustration.leaf@1":`sha256-VXja49Aoe3Hxg8nFx5XwgQ1Ba84avJqeAfGNUL8WjAE`,"illustration.moon@1":`sha256-jmGoVJzV0gZg2kxa-NdWTRRtWkoV4PWF57eOfItfwWk`,"illustration.nest@1":`sha256-wRl4fLdTR_YUXulHzLCPZbIRrWLRZzhlzQMiWQMZ3fM`,"illustration.pizza@1":`sha256-YepEeq_Hda7VhdLubjSWtaVTT9jzlqnuhPmZZnwYXGc`,"illustration.queen@1":`sha256-Y8_1ugJ6Mf7t2WcrkhrFHBl2GObPTVh2aZFdm64tCvw`,"illustration.rake@1":`sha256-xU-YUhfCld0Phbk1kNI2-xH72OK355icgpLhkZqlyBU`,"illustration.robot@1":`sha256-L9A1yid5lWIhHzDgusScU9taRfGrRZHE0xDTBpR8cM8`,"illustration.rocket@1":`sha256-q2Yk2uVyie1fEsuX6a2jiB_MKZ66QTzNIC0fsRJWpmo`,"illustration.sail@1":`sha256-1_4pUdoBnPMzvibsMq8N90KrIFm0WoBj4K1fzwVmo3E`,"illustration.salad@1":`sha256-W8Q5kGjc8yBi3HsHJ9KvtTFWkN_VmMs9CiBlcSWt3Bc`,"illustration.sea@1":`sha256-OnD_BmV_-CF0a-5EDnxTgMTOY9JvNMdpwCu5p45nkuQ`,"illustration.seal@1":`sha256-qdkDgYs2oYDhaWpQpGVl8NlE3cmcGgLlnm7sQFaBcNA`,"illustration.seed@1":`sha256-Nosd34nvSP42FztWf-moMLh2-7Ib1_zp3H_ri1vw2X8`,"illustration.shark@1":`sha256-LH4fkVEPUKbxaspqGv9RiqkBVf2BPPntWLTCJehUmrE`,"illustration.shell@1":`sha256-UZrdsg--mR07rjSduFIGqnwCN9KvhELoMCBb65-1nNU`,"illustration.ski@1":`sha256-ieBkrpLf4mMjKtLFKaSNqZebzYo7PKtHGVAnAxcoZRs`,"illustration.sled@1":`sha256-3u1ygl3-psTAga_kMpGyus9m9FI-1NP8tOGqL1uhxIc`,"illustration.snake@1":`sha256-SlHsYaSl17P7KLUauJEsGuvynXA3J6bKUDf6N8E-zw8`,"illustration.snow@1":`sha256-1C6vT166Ow6YrpkGi1i4uj_yHP4_7pdM48WpyquehHk`,"illustration.star@1":`sha256-4liGNxNxwgaWQFTkNCCSW0a_HXQGn_1AbPuBn6KWCnA`,"illustration.sun@1":`sha256-9JflAD6Klto-8874aXwkuKTKGrF_9hGkS9wkomcPaWs`,"illustration.tea@1":`sha256-8CCmo3RDkW4mJ6oc_2UuAzouSUzTmszDQ7wQAVF7Qc0`,"illustration.tiger@1":`sha256-jDe-WU7a1m-woWcoB6GeIfrN_gLUtmpKXrG-9nltD6w`,"illustration.tree@1":`sha256-bjlQdpCcpCCgxV4dD6XISQgJ2BkOZVpg_QM2aOw-wFM`,"illustration.truck@1":`sha256-Zj2j5hf5oTUHgkxTaG7QeJdGFj9OWmU2jrV5R1GobvQ`,"illustration.turtle@1":`sha256-dQ5pC6fIx8rZPjZiYW_eScDUvatIBNVVLycrd8xmOgk`,"illustration.wave@1":`sha256-3hLli98o3iceNFs8Rq0cpSthw2yUp2bYIdiky14z9pc`,"illustration.zebra@1":`sha256-HLq8ENXAS97rPC0ZGqlPZHtaeGLSr0cH7qWed0UpO-4`,"lang.en@1":`sha256-Xoxv9mePojMWQKkoXs-sRpz0Fnvmsm7eWwqYJOdn_oo`,"lang.ru@1":`sha256-I4zqxIbGIaSvVE9W-21jvHqAkxEsvbCyYHtW-9dBooA`,"palette.dusk@1":`sha256-4iAuWxXjMec8CaTYubjqjqXP7ue2oJf25ix0DxVNANY`,"palette.meadow@1":`sha256-2A6sBj57vHBSNd6eFJY-n3mVUWXxAbL37FFBCFMMSmI`,"palette.synth@1":`sha256-qASK0SToB9T--guT74PxXecBHd7zZyDM0ZNs0yQVZyY`,"powerup.reveal@1":`sha256-EaiG3lTke0QT4EZ9RHUo2uGE4mvq4fbxMNPi-ywzBHc`,"powerup.shield@1":`sha256-8gw5s_1n4JZ1JZ6IWxQgPI1xwGrrqGe_ugOOy9lloCA`,"powerup.slow-mo@1":`sha256-sud1WbzT3Jsi-iOHwjkem4JK8eaU2EBblxujfYso0gA`,"scale.buildings@1":`sha256-IHj-yqAYiH6McFOWMxR3x-iVX857Kxf2WZb_1R8UVKA`,"scale.cats@1":`sha256-K_MsUZGHGqiDVakg8SukZR4VFHk3NwmTCRWymA-NlqA`,"scale.cosmos@1":`sha256-uBtKvWLfdUeZiiGAugduyZjUYRJBCIFZGKb9i3O4oaM`,"scale.dragon@1":`sha256-w14Q1chlbbST4ur7aj9l-93c6C89JVe6SW2sKRgSuRA`,"scale.flowers@1":`sha256-NNS1k8_H3Og948Zd9DiKuE4dq0bpEc2d62tng6mGb54`,"scale.human@1":`sha256-utm-YVF9IFL9qn82EFacaQjMg5SpAsb1V_NnDupjH6c`,"scale.light@1":`sha256-N1z37KM6SXPClDGnB9AYp4gxGsz5mhHorc3jW5v2vbA`,"scale.music@1":`sha256-mthm2-CTwmklsZB-oIMDaWBaLqbtezkcc3fPO9SP_t8`,"scale.ocean@1":`sha256-7c79hQ1r2FpI5MAmFKI5GG_rTvyY9z_EyTyrl8C389M`,"scale.robot@1":`sha256-RznMAxlKQQ4g5fK0PNuBGLjZYjIMpVFkb6xbajmk-5E`,"scale.ships@1":`sha256-rkZ3D6E-ZDSKvcGZTilVM7J28zkC6PwogH6SfD6Myaw`,"scale.vehicles@1":`sha256-ng9sn-Pr97cYbELxRFZSpt4kIu4YhN7b8xM7ponCbKk`,"scale.weather@1":`sha256-6dh9GmHS_smzJRe97NAAxHXx1yBJXdR2ZU1lEcSDaDw`,"style.flat@1":`sha256-xbWjmfYTXxOqkNlc80SPgCQHgK61NEUpQXlZD7qnF2I`,"style.neon@1":`sha256-dbiDIRCXwseBVI1wczZqkKy6bakzBpYFqrCd-eVnuPQ`,"template.brick-breaker@1":`sha256-LT1VoglPDQEa9XjD62s5lKjJijVKHLtkBVu6T6Hp3u0`,"template.bubble-popper@1":`sha256-7xSiksCImH57xxMSIpCRAKc3fPNQv_rTEArGlWSUdRg`,"template.climbing-tower@1":`sha256-gO142FNQDXWtXqeYznaoUr-ai_UZzMKBeEyspXkC9Wc`,"template.crystal-gallery@1":`sha256-p-hbSZW6aEstdi9T1sb6aEL-nfl4fuy6qHPtsZydFO0`,"template.dungeon-crawler@1":`sha256-DTPh8fPan7OMm6rcPVXsAZCIR2H1Fej0LqpV1zUxqMc`,"template.garden-grower@1":`sha256-eshC0t-mk4vK4dCqdeiVheaU2g7fqzQf0ND60dx-Mvo`,"template.marble-run@1":`sha256-R4mBN0nvIMl2YV08EWmHHjyY9FjIq1mto01qOxRp5-c`,"template.maze-snake@1":`sha256-PjhWXc_qv8d0fS5mZO2iphLqOnDgXswHRgRkJWF0Hms`,"template.platformer@1":`sha256-_XQ0XHwOi3N-O8OCNyLr0BRi7j6oNRMSYEb3KL3kCfc`,"template.pulse-runner@1":`sha256-6AEbdU3JB-N0uCAN7zT6kA4wIyFfv1tWl1c--UpzMkk`,"template.racer@1":`sha256-8sjwVgz4-DwonDlEklJ9bNIHzNMtD6TNwGvw7oF9Ii4`,"template.space-tunnel@1":`sha256--iXniUTjaiaucEPIGkwjhD8If_ml19JenMMQJt-127c`,"template.tower-defence@1":`sha256-mISb5FWUEETgCaeZ_ahQGmJMmOqFHRVvOmtL5Him5Hk`,"template.wave-surfing@1":`sha256-2HuipOwDaezXkLtHMN3scwqkezMhmnAmiYrT2RvdQWY`,"template.word-city@1":`sha256-F5GRi-0yGDQDLfaH9wuK-MtNBl8A-E5pWg_iUnB5LIM`,"voice.chipmunk@1":`sha256-FwZLfimO8iq7JsF9K6DrFECXkAhWI672QKvZ6CDwzj8`,"voice.giant@1":`sha256-KPFwPACUDP5eAL-bdpJFqRk8_S54wI7ebguZjqQLBSk`,"voice.robot@1":`sha256-5K2300u0QFbXaIVbcht4J5lDAGNiZswqOZwpRINct5g`,"voice.sleepy@1":`sha256-DQgK5sc3eF7pIe0uh1Tn7w9hFrCOBMp-PRhgLb6AvCg`,"voice.speedy@1":`sha256-yrJjMLZE-SITspTfuvQToQTlGiDKsmyrukGuiYiJU_Y`},builtAt:`2026-11-14T21:23:10.488Z`}}))[0],$v=Qv?.build??`dev`,ey=Qv?.id??`dev`,ty=Qv?.commit??`dev`,ny=`https://github.com/life2do/the-best-typing-game-ever`;function ry(){let e=ty===`dev`||ty===`unknown`?ty:ty.slice(0,7),t=document.createElement(e===`dev`?`span`:`a`);return t.className=`version`,t.textContent=`commit ${e} · build ${ey.slice(0,8)}`,t.title=`Build ${$v}\nCommit ${ty}`,t instanceof HTMLAnchorElement&&(t.href=`${ny}/commit/${ty}`,t.target=`_blank`,t.rel=`noopener`),t}var iy={"powerup.shield":`🛡️`,"powerup.slow-mo":`🐢`,"powerup.reveal":`🔦`},ay=class{settings;el;keyboard;vignette=_v(`div`,{class:`vignette`});dim=_v(`div`,{class:`dim`});fps=_v(`div`,{class:`fps hidden`,"aria-hidden":`true`});cache={};glow=_v(`div`,{class:`rhythm-glow`});pulse=_v(`div`,{class:`rhythm-pulse`});prompt=_v(`div`,{class:`prompt`,"aria-live":`off`});stages=_v(`div`,{class:`stages`});stars=_v(`div`,{class:`stars`});powerups=_v(`div`,{class:`powerups`});stats=_v(`div`,{class:`stats`});lastErrFrame=-1;lastPromptKey=``;constructor(e,t){this.settings=t,this.keyboard=new Zv(e);let n=_v(`div`,{class:`topbar`},_v(`div`,{},this.stages,this.stats,ry()),this.stars,this.powerups);this.el=_v(`div`,{class:`hud`},this.dim,this.vignette,this.glow,this.pulse,n,this.prompt,this.keyboard.el,this.fps)}flash(e){let t=this.pulse;t.classList.remove(`ok`,`bad`),t.offsetWidth,t.classList.add(e?`ok`:`bad`)}set(e,t,n){this.cache[e]!==t&&(this.cache[e]=t,n(t))}setFps(e){this.set(`fps`,e??``,e=>{this.fps.textContent=e,this.fps.classList.toggle(`hidden`,!e)})}update(e,t){let n=e.state,r=e.visibility()/1e3;this.set(`vig`,(Math.max(0,1-r)*.95).toFixed(2),e=>this.vignette.style.opacity=e),this.set(`dim`,(Math.max(0,1-r)*.45).toFixed(2),e=>this.dim.style.opacity=e);let i=e.steadinessP(),a=this.settings.reducedMotion,o=Math.round(i/1e3*22);this.set(`glow`,String(o),()=>{this.glow.style.setProperty(`--glow-size`,`${o}px`),this.glow.style.setProperty(`--glow-blur`,`${o*2}px`)}),this.set(`glowmax`,String(i>=950&&!a),e=>this.glow.classList.toggle(`max`,e===`true`));let s=e.setup.stageLengths.length;this.set(`stages`,`${n.stage}|${n.phase}`,()=>this.stages.replaceChildren(...Array.from({length:s},(e,t)=>_v(`span`,{class:t<Math.min(n.stage,s-1)||n.phase!==`play`&&n.phase!==`intro`?`done`:t===Math.min(n.stage,s-1)?`now`:``})))),this.set(`stars`,`★`.repeat(n.bestStars)+`☆`.repeat(Math.max(0,3-n.bestStars)),e=>this.stars.textContent=e);let c=n.frame,l=[];c<n.slowUntil&&l.push(iy[`powerup.slow-mo`]),c<n.shieldUntil&&n.shieldCharges>0&&l.push(`${iy[`powerup.shield`]}×${n.shieldCharges}`),c<n.revealUntil&&l.push(iy[`powerup.reveal`]),this.set(`pu`,l.join(`  `),e=>this.powerups.textContent=e);let u=n.sm,d=u.correct+u.errors?Math.floor(u.correct*100/(u.correct+u.errors)):100;this.set(`stats`,`${(e.liveWpmP()/1e3).toFixed(0)} wpm · ${d}% · goal ${(e.targetWpmP/1e3).toFixed(0)} wpm`,e=>this.stats.textContent=e);let f=this.settings.keyboard;this.set(`kbmode`,f,e=>this.keyboard.el.classList.toggle(`hidden`,e===`off`)),this.set(`kbop`,(f===`always`?1:e.keyboardOpacity()/1e3).toFixed(2),e=>this.keyboard.setOpacity(Number(e)));let p=n.phase===`play`?e.expectedChars():[];this.keyboard.setNext(p[0],e.idleHint());let m=c-this.lastErrFrame<20,h=`${n.prompt.pos}|${n.prompt.text.length}|${n.targets.map(e=>e.id+`:`+e.progress).join(`,`)}|${m}|${n.phase}`;h!==this.lastPromptKey&&(this.lastPromptKey=h,this.renderPrompt(e,m))}markError(e){this.lastErrFrame=e}renderPrompt(e,t){let n=e.state;if(this.prompt.classList.toggle(`hidden`,n.phase!==`play`),e.setup.inputMode===`targeting`){let t=n.targets.map(t=>{let n=e.suggestedTargetId()===t.id,r=e=>e.split(/( )/).filter(Boolean).map(e=>e===` `?_v(`span`,{class:`spacebar`}):fg(e));return _v(`span`,{class:`target${n?` locked`:``}`},_v(`span`,{class:`typed`},...r(t.text.slice(0,t.progress))),...r(t.text.slice(t.progress)))});this.prompt.replaceChildren(...t);return}let r=n.prompt,i=Math.max(0,r.pos-8),a=Math.min(r.text.length,r.pos+24),o=[];for(let e=i;e<a;e++){let n=r.text[e],i=r.spans.some(t=>e>=t.start&&e<t.end),a=[e<r.pos?`typed`:``,e===r.pos?t?`cur err`:`cur`:``,i?`special`:``,n===` `?`space`:``].filter(Boolean).join(` `);o.push(_v(`span`,{class:a},n===` `?`·`:dg(n)))}this.prompt.replaceChildren(...o)}};export{Ci as $,sv as A,qc as B,yv as C,iv as D,fv as E,dg as F,Vi as G,Ui as H,ng as I,Oi as J,Si as K,Ef as L,nv as M,$_ as N,cv as O,Y_ as P,vi as Q,Tf as R,qv as S,vv as T,Bi as U,ka as V,zi as W,bi as X,Ni as Y,Ti as Z,Uv as _,Ov as a,P as at,Bv as b,Dv as c,oe as ct,Fv as d,ee as dt,Ne as et,Hv as f,te as ft,Iv as g,Rv as h,Zv as i,le as it,gv as j,ov as k,Kv as l,j as lt,jv as m,D as mt,$v as n,Oe as nt,Gv as o,N as ot,Mv as p,ne as pt,ki as q,ry as r,R as rt,zv as s,ue as st,ay as t,Ee as tt,Nv as u,ie as ut,Vv as v,_v as w,Lv as x,Wv as y,bf as z};