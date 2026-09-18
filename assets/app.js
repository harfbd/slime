(() => {
  'use strict';
  const body = document.body;
  const select = document.querySelector('#language');
  function setLanguage(value) {
    const mode = ['bi','zh','en'].includes(value) ? value : 'bi';
    body.classList.remove('lang-bi','lang-zh','lang-en'); body.classList.add(`lang-${mode}`);
    document.documentElement.lang = mode === 'en' ? 'en' : 'zh-Hant';
    if (select) select.value = mode;
    try { localStorage.setItem('slime-atlas-language', mode); } catch {}
  }
  let language = 'bi'; try { language = localStorage.getItem('slime-atlas-language') || 'bi'; } catch {}
  setLanguage(language);
  select?.addEventListener('change', e => setLanguage(e.target.value));
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('#main-nav');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus(); } });
  const motion = document.querySelector('#motion-setting');
  const preferredReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let reduce = preferredReduced; try { const saved = localStorage.getItem('slime-atlas-motion'); if (saved) reduce = saved === 'reduce'; } catch {}
  function applyMotion() { body.classList.toggle('reduce-motion', reduce);motion?.setAttribute('aria-pressed', String(reduce)); }
  applyMotion();
  motion?.addEventListener('click', () => { reduce = !reduce;applyMotion();try {localStorage.setItem('slime-atlas-motion', reduce ? 'reduce' : 'normal');}catch{} });
  if ('IntersectionObserver' in window && !preferredReduced) {
    body.classList.add('js-ready');
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) {e.target.classList.add('visible');observer.unobserve(e.target);} }), {threshold:.08});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  let scheduled = false;
  const progress = document.querySelector('.reading-bar');
  function updateProgress() { const max = document.documentElement.scrollHeight - innerHeight; if(progress) progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;scheduled=false; }
  addEventListener('scroll', () => { if(!scheduled){scheduled=true;requestAnimationFrame(updateProgress);} }, {passive:true}); updateProgress();
  document.querySelectorAll('[data-motion-toggle]').forEach(button => button.addEventListener('click', () => {
    const diagram = button.closest('.diagram');const paused = diagram.classList.toggle('motion-paused');button.setAttribute('aria-pressed',String(paused));
    button.querySelector('.bi-zh').textContent=paused ? '播放動畫' : '暫停動畫';button.querySelector('.bi-en').textContent=paused?'Play':'Pause';
  }));
  const stageButtons = [...document.querySelectorAll('[data-stage]')];
  const stagePanels = [...document.querySelectorAll('[data-stage-panel]')];
  let activeStage = 0;
  function showStage(index) { activeStage=index;stageButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));stagePanels.forEach((p,i)=>p.hidden=i!==index); }
  stageButtons.forEach((button,i)=>button.addEventListener('click',()=>showStage(i)));
  document.querySelector('#next-stage')?.addEventListener('click',()=>showStage((activeStage+1)%stageButtons.length));
  const net = document.querySelector('#network-diagram');
  document.querySelectorAll('[data-network]').forEach(button=>button.addEventListener('click',()=>{
    const simplified=button.dataset.network==='refine';net?.classList.toggle('simplified',simplified);
    document.querySelectorAll('[data-network]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelectorAll('[data-network-copy]').forEach(p=>p.hidden=p.dataset.networkCopy!==(simplified?'refine':'explore'));
  }));
})();
