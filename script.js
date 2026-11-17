'use strict';
document.documentElement.classList.add('js');
const menu = document.getElementById('main-navigation');
const menuToggle = document.querySelector('.menu-toggle');
const smallScreen = matchMedia('(max-width: 900px)');
function closeMenu(){
  if (!menu || !menuToggle) return;
  menu.hidden = smallScreen.matches;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.querySelector('.menu-label').textContent = 'Menu';
}
closeMenu();
smallScreen.addEventListener('change',closeMenu);
menuToggle?.addEventListener('click',()=>{
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menu.hidden = !open;
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{
  if(event.key === 'Escape' && menuToggle?.getAttribute('aria-expanded') === 'true'){
    closeMenu(); menuToggle.focus();
  }
});
const tabs = [...document.querySelectorAll('[data-stage]')];
function selectStage(tab,focus=false){
  tabs.forEach(item=>{
    const active=item===tab;
    item.setAttribute('aria-selected',String(active)); item.tabIndex=active?0:-1;
    const panel=document.getElementById('stage-'+item.dataset.stage);
    if(panel) panel.hidden=!active;
  });
  const tree=document.querySelector('.tree-visual');
  if(tree)tree.dataset.growth=tab.dataset.stage;
  if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectStage(tab));
  tab.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;
    if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=tabs.length-1;
    if(next===undefined)return;
    event.preventDefault();selectStage(tabs[next],true);
  });
});
if(tabs.length)selectStage(tabs[0]);
const words={book:['kitāb — book','A place for words, ideas, and stories.'],writer:['kātib — writer','A person who gives ideas a written voice.'],library:['maktaba — library / bookshop','A place for books. The meaning depends on context.']};
document.querySelectorAll('[data-word]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-word]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  const result=document.getElementById('word-result');
  const [title,description]=words[button.dataset.word];
  result.replaceChildren();
  const strong=document.createElement('strong');strong.textContent=title;
  const span=document.createElement('span');span.textContent=description;
  result.append(strong,span);
}));
const year=document.getElementById('copyright-year');
if(year)year.textContent=new Date().getFullYear();
