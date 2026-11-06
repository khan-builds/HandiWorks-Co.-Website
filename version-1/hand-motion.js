const originalSvg=`<svg viewBox="24 0 680 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stylized concept illustration of HelpingHand's modular scissor-linkage fingers"><defs><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#f7f9ff"/><stop offset=".45" stop-color="#c5cedd"/><stop offset="1" stop-color="#69788f"/></linearGradient><linearGradient id="side"><stop stop-color="#343d4e"/><stop offset="1" stop-color="#141a25"/></linearGradient></defs><ellipse cx="360" cy="467" rx="245" ry="26" fill="#172235" opacity=".08"/><path d="M160 290L460 260 570 380 245 431Z" fill="url(#metal)" stroke="#64738b"/><path d="M245 431L570 380 570 423 245 476Z" fill="url(#side)"/><path d="M160 290L245 431 245 476 160 335Z" fill="#8492a8"/><path d="M210 292L438 278 495 345 264 371Z" fill="#202a3e"/><path d="M227 296L429 285 470 332 270 353Z" fill="#9bb6f0"/><g id="palm-readout" transform="rotate(-5 349 316)"><text id="palm-phase" x="349" y="308" text-anchor="middle" font-family="Share Tech Mono, ui-monospace, monospace" font-size="15" font-weight="700" fill="#182439">Open hand</text><rect x="286" y="320" width="126" height="6" rx="3" fill="#182439" fill-opacity=".22"/><rect id="palm-meter" x="286" y="320" width="0" height="6" rx="3" fill="#182439"/></g>${[0,1,2,3].map((v)=>{let x=155+v*77,y=145-v*12;return `<g class="finger"><path d="M${x} ${y+170}L${x-25} ${y+70}L${x-10} ${y-55}L${x+24} ${y-60}L${x+12} ${y+60}L${x+39} ${y+158}Z" fill="url(#metal)" stroke="#52637e" stroke-width="2"/><path d="M${x+7} ${y+155}L${x+35} ${y+74}L${x+4} ${y-38}M${x+27} ${y+151}L${x-10} ${y+73}L${x+17} ${y-40}" fill="none" stroke="#7396e2" stroke-width="10"/>${[[x+7,y+155],[x+35,y+74],[x+4,y-38],[x+27,y+151],[x-10,y+73],[x+17,y-40]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="6" fill="#253653" stroke="#e5edff" stroke-width="2"/>`).join('')}<path d="M${x-13} ${y-54}l38 -5 -2 -18 -36 5Z" fill="#283751"/></g>`}).join('')}<path class="thumb" d="M467 330l77 -98 53 12 -76 111Z" fill="url(#metal)" stroke="#60718d"/><path class="thumb" d="M480 330l95 -84" stroke="#9bb6f0" stroke-width="10"/><circle class="thumb" cx="485" cy="327" r="8" fill="#22324f"/></svg>`;
const clampMotion=v=>Math.max(0,Math.min(1,v));
const easeMotion=v=>{v=clampMotion(v);return v*v*(3-2*v)};
let motionScene=null,motionFrame=0;
function addHandGlint(svg){
 const ns='http://www.w3.org/2000/svg';
 const hand=document.createElementNS(ns,'g');
 hand.id='hand-art';
 [...svg.children].forEach((el)=>{ if(el.tagName.toLowerCase()!=='defs') hand.append(el); });
 svg.append(hand);
 const defs=svg.querySelector('defs');
 const mask=document.createElementNS(ns,'mask');
 mask.id='hand-glint-mask';
 mask.setAttribute('maskUnits','userSpaceOnUse');
 mask.setAttribute('x','0'); mask.setAttribute('y','0'); mask.setAttribute('width','720'); mask.setAttribute('height','530');
 const maskShape=document.createElementNS(ns,'g');
 maskShape.setAttribute('filter','brightness(0) invert(1)');
 const use=document.createElementNS(ns,'use');
 use.setAttribute('href','#hand-art');
 maskShape.append(use); mask.append(maskShape); defs.append(mask);
 const grad=document.createElementNS(ns,'linearGradient');
 grad.id='hand-glint-grad'; grad.setAttribute('x1','0'); grad.setAttribute('x2','1');
 [['0','0'],['.5','.7'],['1','0']].forEach(([offset,opacity])=>{
  const stop=document.createElementNS(ns,'stop');
  stop.setAttribute('offset',offset); stop.setAttribute('stop-color','#fff'); stop.setAttribute('stop-opacity',opacity);
  grad.append(stop);
 });
 defs.append(grad);
 const glint=document.createElementNS(ns,'g');
 glint.setAttribute('class','hand-glint');
 glint.setAttribute('mask','url(#hand-glint-mask)');
 const bar=document.createElementNS(ns,'rect');
 bar.setAttribute('class','hand-glint-bar');
 bar.setAttribute('x','-280'); bar.setAttribute('y','-40'); bar.setAttribute('width','160'); bar.setAttribute('height','620');
 bar.setAttribute('fill','url(#hand-glint-grad)');
 glint.append(bar); svg.append(glint);
 return hand;
}
function pinHeader(){
 const header=document.querySelector('header.site-header');
 if(header) document.documentElement.style.setProperty('--hand-stick', `${header.getBoundingClientRect().height}px`);
}
function setupMotion(){
 pinHeader();
 const hero=document.querySelector('.home');
 let track=hero.closest('.motion-track');
 if(!track){ track=document.createElement('div'); track.className='motion-track'; hero.before(track); track.append(hero); }
 const art=hero.querySelector('.home-visual');
 const frame=art.querySelector('.hand-frame')||art.appendChild(document.createElement('div'));
 frame.classList.add('hand-frame');
 frame.innerHTML=originalSvg.replaceAll('id="metal"','id="motion-metal"').replaceAll('id="side"','id="motion-side"').replaceAll('url(#metal)','url(#motion-metal)').replaceAll('url(#side)','url(#motion-side)');
 const svg=frame.querySelector('svg');
 const hand=addHandGlint(svg);
 const fingers=[...hand.querySelectorAll('.finger')];
 const thumb=[...hand.querySelectorAll('.thumb')];
 const thumbGroup=document.createElementNS('http://www.w3.org/2000/svg','g');
 hand.append(thumbGroup); thumb.forEach((el)=>thumbGroup.append(el));
 hero.querySelector('.motion-label')?.remove();
 motionScene={track,hero,art,fingers,thumbGroup,phase:svg.querySelector('#palm-phase'),meter:svg.querySelector('#palm-meter')};drawMotion();
}
function fingerShape(i,c){
 const x=155+i*77,y=145-i*12;
 // Project three linked phalanges toward the palm. Each joint bends farther than the preceding one.
 const points=[[x+18,y+158]];
 const lengths=[83,68,62];
 const angles=[c*1.32,c*2.5,c*3.05];
 lengths.forEach((len,k)=>{
  const prev=points[k],a=angles[k];
  points.push([prev[0]+(k===0?-20:5)*(1-c)+Math.sin(a)*len*.42,prev[1]-Math.cos(a)*len]);
 });
 const widths=[34,32,29,34];
 let result='';
 for(let j=0;j<3;j++){
  const a=points[j],b=points[j+1],wa=widths[j]/2,wb=widths[j+1]/2;
  result+=`<path d="M${a[0]-wa} ${a[1]} L${b[0]-wb} ${b[1]} L${b[0]+wb} ${b[1]} L${a[0]+wa} ${a[1]}Z" fill="url(#motion-metal)" stroke="#52637e" stroke-width="2"/>`;
  result+=`<path d="M${a[0]-wa+5} ${a[1]} L${b[0]+wb-5} ${b[1]} M${a[0]+wa-5} ${a[1]} L${b[0]-wb+5} ${b[1]}" fill="none" stroke="#7396e2" stroke-width="6" stroke-linecap="round"/>`;
  result+=`<circle cx="${a[0]}" cy="${a[1]}" r="6" fill="#253653" stroke="#e5edff" stroke-width="2"/>`;
 }
 const tip=points[3];result+=`<rect x="${tip[0]-18}" y="${tip[1]-8}" width="36" height="16" rx="4" fill="#283751"/><circle cx="${points[1][0]}" cy="${points[1][1]}" r="4" fill="#9bb6f0"/>`;
 return result;
}
function drawMotion(){
 motionFrame=0;
 if(!motionScene||!motionScene.track.isConnected)return;
 const m=motionScene,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const top=parseFloat(getComputedStyle(m.hero).top)||0;
 const p=reduce?0:clampMotion((top-m.track.getBoundingClientRect().top)/(m.track.offsetHeight-m.hero.offsetHeight));
 const curl=easeMotion(p);
 m.fingers.forEach((f,i)=>f.innerHTML=fingerShape(i,easeMotion((p-i*.05)/.82)));
 m.thumbGroup.setAttribute('transform',`rotate(${-curl*125} 485 327)`);
 m.art.style.transform=`translateY(${-curl*12}px) rotate(${-13+curl*17}deg) scale(${1+curl*.06})`;
 m.meter.setAttribute('width',String(126*p));
 m.phase.textContent=p<.12?'Open hand':p<.88?'In motion':'Closed hand';
}
function queueMotion(){if(!motionFrame)motionFrame=requestAnimationFrame(drawMotion)}
window.addEventListener('scroll',queueMotion,{passive:true});
window.addEventListener('resize',()=>{pinHeader();queueMotion()});
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',queueMotion);


setupMotion();
