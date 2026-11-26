(() => {
  'use strict';
  const $ = id => document.getElementById(id), W=320,H=240;
  const inputs={camera:$('camera-rate'),soft:$('soft-rate'),hard:$('hard-rate')};
  const canvases={source:$('feed-source'),soft:$('feed-soft'),hard:$('feed-hard')};
  const mode=$('feed-mode');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let running=!reduced, simTime=0, realPrev=null, nextCapture=0, frameID=0, latest=null;
  // The camera ceiling is project-specific. Decoder capacities are bounded scenarios, not benchmark claims.
  const limits={camera:[5,15],soft:[1,30],hard:[1,30]};
  const rates=()=>Object.fromEntries(Object.entries(inputs).map(([k,v])=>[k,Math.max(limits[k][0],Math.min(limits[k][1],Number(v.value)||limits[k][0]))]));
  const scratch=()=>{const c=document.createElement('canvas');c.width=W;c.height=H;return c;};
  const lanes=Object.fromEntries(['soft','hard'].map(k=>[k,{k,front:scratch(),work:scratch(),completed:null,job:null,pending:null,done:[],dropped:0,paintID:null}]));
  // Deterministic synthetic optical target: time and frame ID are part of each image.
  function drawScene(ctx, frame){
    const t=frame.t/1000, angle=t*2.25;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#e8e7de';ctx.fillRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,148);sky.addColorStop(0,'#d3dfd9');sky.addColorStop(1,'#b2c4be');ctx.fillStyle=sky;ctx.fillRect(0,0,W,150);
    ctx.fillStyle='#96a59d';ctx.fillRect(0,150,W,90);
    ctx.strokeStyle='#84968e';ctx.lineWidth=1;for(let x=-40;x<370;x+=32){ctx.beginPath();ctx.moveTo(x,240);ctx.lineTo(160+(x-160)*.4,150);ctx.stroke();}for(let y of [160,176,199,228]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
    // Optical test chart / ruler on the wall.
    ctx.fillStyle='#f7f6ee';ctx.fillRect(16,38,92,84);ctx.strokeStyle='#75877f';ctx.strokeRect(16,38,92,84);
    for(let y=0;y<6;y++)for(let x=0;x<8;x++){ctx.fillStyle=(x+y)%2?'#283d37':'#f9f8ef';ctx.fillRect(22+x*10,45+y*10,10,10);}
    ctx.fillStyle='#46584f';ctx.font='8px monospace';ctx.fillText('TEST TARGET',25,116);
    // Large rotating colored wheel makes lag evident.
    ctx.save();ctx.translate(230,92);ctx.fillStyle='#203d34';ctx.beginPath();ctx.arc(0,0,58,0,Math.PI*2);ctx.fill();ctx.rotate(angle);
    const colors=['#d6a54d','#f5ead1','#c35e47','#f5ead1','#467d85','#f5ead1','#47765e','#f5ead1'];
    for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,52,i*Math.PI/4,(i+1)*Math.PI/4);ctx.closePath();ctx.fillStyle=colors[i];ctx.fill();}
    ctx.fillStyle='#2e4139';ctx.fillRect(-3,-49,6,49);ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();ctx.restore();
    // moving high-contrast card spanning many rows; seam clearly visible during progressive updates.
    const x=30+130*(1+Math.sin(t*2.2))/2;
    ctx.fillStyle='rgba(33,48,43,.22)';ctx.beginPath();ctx.ellipse(x+11,208,22,5,0,0,2*Math.PI);ctx.fill();
    ctx.fillStyle='#ba5442';ctx.fillRect(x-8,80,26,124);ctx.fillStyle='#efbd77';ctx.fillRect(x-4,84,18,116);
    ctx.fillStyle='#9e4939';for(let y=92;y<200;y+=17)ctx.fillRect(x-4,y,18,6);
    ctx.strokeStyle='#783e31';ctx.strokeRect(x-8,80,26,124);
    // actual capture stamp, not browser wall clock
    ctx.fillStyle='rgba(20,43,35,.93)';ctx.fillRect(0,0,W,26);ctx.fillStyle='#eef4ef';ctx.font='bold 11px monospace';ctx.fillText('FRAME '+String(frame.id).padStart(4,'0'),10,16);ctx.textAlign='right';ctx.fillText(t.toFixed(2)+' s',W-10,16);ctx.textAlign='left';
    ctx.fillStyle='rgba(20,43,35,.82)';ctx.fillRect(0,220,W,20);ctx.fillStyle='#eef4ef';ctx.font='9px monospace';ctx.fillText('SYNTHETIC CAMERA  •  320 × 240',10,233);
  }
  function blank(ctx){ctx.fillStyle='#172e26';ctx.fillRect(0,0,W,H);ctx.fillStyle='#a6c2b3';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('WAITING FOR FRAME',W/2,H/2);ctx.textAlign='left';}
  function begin(l,frame,now){l.job={frame,start:now,end:now+1000/rates()[l.k]};l.paintID=null;}
  function offer(l,frame,now){if(!l.job){begin(l,frame,now);}else{if(l.pending)l.dropped++;l.pending=frame;}}
  function finish(l,now){drawScene(l.front.getContext('2d'),l.job.frame);l.completed=l.job.frame;l.done.push(now);l.job=null;l.paintID=null;if(l.pending){const f=l.pending;l.pending=null;begin(l,f,now);}}
  function advance(target){
    // Frame arrival and decode completion are discrete events on the same simulation clock.
    while(true){let next=Math.min(nextCapture,...Object.values(lanes).map(l=>l.job?.end??Infinity));if(next>target+1e-7)break;
      for(const l of Object.values(lanes))if(l.job&&l.job.end<=next+1e-7)finish(l,next);
      if(nextCapture<=next+1e-7){latest={id:frameID++,t:nextCapture};for(const l of Object.values(lanes))offer(l,latest,next);nextCapture+=1000/rates().camera;}
    }
    simTime=target;
  }
  const progressive=k=>mode.value==='progressive'||(mode.value==='mixed'&&k==='soft');
  function display(l){
    const ctx=canvases[l.k].getContext('2d'), progress=l.job?Math.min(1,Math.max(0,(simTime-l.job.start)/(l.job.end-l.job.start))):0;
    ctx.drawImage(l.front,0,0);
    const isProgressive=progressive(l.k);
    if(l.job&&isProgressive){
      if(l.paintID!==l.job.frame.id){drawScene(l.work.getContext('2d'),l.job.frame);l.paintID=l.job.frame.id;}
      // Update whole 8-pixel bands, a schematic raster-ordered output policy.
      const row=Math.min(H,Math.floor(progress*H/8)*8);
      if(row>0){ctx.drawImage(l.work,0,0,W,row,0,0,W,row);if(row<H){ctx.fillStyle=l.k==='soft'?'#ffd285':'#a9f6c7';ctx.fillRect(0,row-1,W,2);}}
    }
    l.done=l.done.filter(x=>x>simTime-2000);
    // Count complete frames, not display paints. A short counting window can straddle a
    // completion at either end; cap the rounded throughput estimate at the input/service limit.
    const r=rates(), observed=l.done.length/(Math.min(simTime,2000)/1000);
    $(l.k+'-fps').textContent=simTime<1000?'—':Math.min(r.camera,r[l.k],observed).toFixed(1);
    $(l.k+'-age').textContent=l.completed?Math.round(Math.max(0,simTime-l.completed.t))+' ms':'—';
    $(l.k+'-mode').textContent=isProgressive?'Direct framebuffer writes':'Double-buffered display';
    $(l.k+'-progress').style.width=progress*100+'%';
    $(l.k+'-status').textContent=(l.job?'Decoding #'+l.job.frame.id+' · '+Math.floor(progress*100)+'%':'Waiting for next frame')+' · '+l.dropped+' dropped';
  }
  function render(){if(latest)drawScene(canvases.source.getContext('2d'),latest);$('source-id').textContent=latest?'#'+latest.id:'—';$('source-fps').textContent=rates().camera;for(const l of Object.values(lanes))display(l);}
  function reset(){simTime=0;nextCapture=0;frameID=0;latest=null;realPrev=null;for(const l of Object.values(lanes)){Object.assign(l,{completed:null,job:null,pending:null,done:[],dropped:0,paintID:null});blank(l.front.getContext('2d'));}advance(0);render();}
  function explain(){const r=rates(), overloaded=r.soft<r.camera, hardwareOver=r.hard<r.camera;
    $('feed-observation').textContent=overloaded? (progressive('soft')?'Look for the moving seam in the software output.':'The software output is clean, but updates more slowly.'):'The software decoder can now keep up with the camera.';
    $('feed-explain-text').textContent=(overloaded?(progressive('soft')?'New image bands overwrite the old frame as decoding progresses; the seam shows their boundary. ':'Double buffering hides partial writes, but cannot recover dropped frames or decoding delay. '):'At sufficient decode capacity the decoder need not drop incoming frames. ')+(hardwareOver?'The hardware decoder is overloaded too at these settings. ':'The hardware path can keep up with the input at these settings. ')+'Both paths use the same latest-frame queue policy; changing decoder capacity changes the rate at which frames finish.';
  }
  function updateLabels(){for(const [k,v] of Object.entries(inputs))$(k+'-rate-label').textContent=v.value+' FPS';explain();}
  function syncPlay(){ $('feed-play').textContent=running?'Pause':'Play'; $('feed-play').setAttribute('aria-pressed',String(running)); }
  for(const v of Object.values(inputs))v.addEventListener('input',()=>{updateLabels();reset();});
  mode.addEventListener('change',()=>{explain();render();});
  $('feed-play').addEventListener('click',()=>{running=!running;realPrev=null;syncPlay();});
  $('feed-reset').addEventListener('click',reset);
  function tick(ts){if(!canvases.source.isConnected)return;if(running){if(realPrev!==null)advance(simTime+Math.min(100,Math.max(0,ts-realPrev)));render();}realPrev=running?ts:null;requestAnimationFrame(tick);}
  updateLabels();syncPlay();reset();requestAnimationFrame(tick);
})();
