const tasks = [
  {id:1,title:'Design instant command palette with task actions',status:'In Progress',priority:'P0',points:8,assignee:'BV',sprint:'Nova 24',labels:['UX','Speed'],due:'Jul 08',epic:'Keyboard OS',project:'Astra',progress:72,comments:12,files:3,severity:'High',environment:'Web'},
  {id:2,title:'Virtualize 10,000 item backlog with preserved selection',status:'Todo',priority:'P0',points:13,assignee:'AK',sprint:'Nova 24',labels:['Perf','Table'],due:'Jul 12',epic:'Scale',project:'Astra',progress:18,comments:5,files:1,severity:'Critical',environment:'Chrome'},
  {id:3,title:'Roadmap dependency handles and milestone hover previews',status:'Review',priority:'P1',points:5,assignee:'NS',sprint:'Nova 24',labels:['Roadmap'],due:'Jul 15',epic:'Planning',project:'Astra',progress:88,comments:8,files:2,severity:'Medium',environment:'Safari'},
  {id:4,title:'Independent column scrolling with sticky WIP headers',status:'Done',priority:'P1',points:3,assignee:'BV',sprint:'Nova 23',labels:['Kanban','A11y'],due:'Jun 28',epic:'Boards',project:'Astra',progress:100,comments:4,files:0,severity:'Low',environment:'Firefox'},
  {id:5,title:'Right-side task drawer with markdown, checklist, and timeline',status:'Blocked',priority:'P2',points:8,assignee:'MR',sprint:'Nova 24',labels:['Editor','Detail'],due:'Jul 10',epic:'Context',project:'Astra',progress:41,comments:16,files:5,severity:'High',environment:'Edge'},
  {id:6,title:'Natural language filter chips and saved view presets',status:'Todo',priority:'P3',points:5,assignee:'BV',sprint:'Nova 25',labels:['Search'],due:'Jul 22',epic:'Clarity',project:'Astra',progress:8,comments:2,files:0,severity:'Medium',environment:'Web'}
];
const statuses = ['Todo','In Progress','Blocked','Review','Done'];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
function chipPriority(p){return `<span class="priority ${p.toLowerCase()}">${p}</span>`}
function labels(task){return `<span class="labels">${task.labels.map(l=>`<span class="label">${l}</span>`).join('')}</span>`}
function renderBacklog(){
  $('#backlogRows').innerHTML = ['P0','P1','P2','P3','No Priority'].map(group => {
    const rows = tasks.filter(t => t.priority === group || (group==='No Priority'&&!t.priority));
    if(!rows.length) return '';
    return `<div class="table-row table-head"><span>${group}</span><span>${rows.length} items</span><span>Drag between groups</span></div>` + rows.map(t => `<button class="table-row task-row" data-id="${t.id}" role="row"><span>${t.title}</span><span>${t.status}</span><span>${chipPriority(t.priority)}</span><span>${t.points}</span><span class="avatar">${t.assignee}</span><span>${t.sprint}</span>${labels(t)}<span>${t.due}</span></button>`).join('');
  }).join('');
}
function card(t){return `<button class="card" draggable="true" data-id="${t.id}"><h3>${t.title}</h3>${labels(t)}<div class="progress"><span style="width:${t.progress}%"></span></div><div class="card-meta"><span class="avatar">${t.assignee}</span><span>${t.points} pts · 💬 ${t.comments} · 📎 ${t.files}</span></div></button>`}
function renderKanban(target, onlySprint=false){
  const source = onlySprint ? tasks.filter(t=>t.sprint==='Nova 24') : tasks;
  $(target).innerHTML = statuses.map(status => {
    const items = source.filter(t=>t.status===status); const limit = status==='In Progress'?3:status==='Review'?2:5;
    return `<section class="column"><div class="column-header"><strong>${status}<span>${items.length}/${limit}</span></strong><div class="progress"><span style="width:${Math.min(100,items.length/limit*100)}%"></span></div></div>${items.map(card).join('')}</section>`;
  }).join('');
}
function renderRoadmap(){
  $('#timeline').innerHTML = `<div class="road-row"><strong></strong><div class="road-track"><span class="today"></span></div></div>` + tasks.slice(0,5).map((t,i)=>`<div class="road-row"><span>${t.epic}</span><div class="road-track"><span class="bar" style="left:${8+i*11}%;width:${24+i*5}%"></span></div></div>`).join('');
}
function renderBugs(){
  $('#bugList').innerHTML = `<div class="bug table-head"><span>Issue</span><span>Severity</span><span>Browser</span><span>Expected / Actual</span><span>Priority</span></div>` + tasks.filter(t=>['P0','P1','P2'].includes(t.priority)).map(t=>`<button class="bug task-row" data-id="${t.id}"><span>${t.title}</span><span>${t.severity}</span><span>${t.environment}</span><span>Flow stays fast / friction found</span><span>${chipPriority(t.priority)}</span></button>`).join('');
}
function renderMine(){
  const groups = ['Today','Overdue','This Week','Next Week','Completed Recently'];
  $('#myItems').innerHTML = groups.map((g,i)=>`<section class="my-section"><h3>${g}</h3>${tasks.filter((_,idx)=>idx%5===i).map(card).join('') || '<p class="muted">Nothing here. Enjoy the calm.</p>'}</section>`).join('');
}
function openDrawer(id){
  const t = tasks.find(x=>x.id==id); if(!t) return;
  $('#drawerContent').innerHTML = `<p class="eyebrow">${t.project} / ${t.epic}</p><h2 contenteditable>${t.title}</h2><div class="drawer-grid"><div class="field">Status<br><strong>${t.status}</strong></div><div class="field">Priority<br><strong>${t.priority}</strong></div><div class="field">Sprint<br><strong>${t.sprint}</strong></div><div class="field">Estimate<br><strong>${t.points} points</strong></div></div><h3>Description</h3><div class="field editor" contenteditable>Use slash commands, markdown, mentions, callouts, tables, images, and inline math. Autosaves optimistically.</div><h3>Checklist</h3><div class="field">☑ Research patterns<br>☑ Define tradeoffs<br>☐ Validate keyboard flow<br>☐ Link pull request</div><h3>Activity</h3><div class="comment">BV moved this to <strong>${t.status}</strong> and linked design notes.</div>`;
  $('#taskDrawer').classList.add('open'); $('#taskDrawer').setAttribute('aria-hidden','false');
}
function openPalette(){
  const commands = ['Create Task','Create Sprint','Open Status Board','Move selected task to Review','Filter priority:p0','Assign to me','Open Roadmap','Toggle dark calm mode'];
  $('#commandList').innerHTML = commands.map((c,i)=>`<button class="command ${i===0?'active':''}"><span>${c}</span><kbd>↵</kbd></button>`).join('');
  $('#palette').classList.add('open'); $('#palette').setAttribute('aria-hidden','false'); $('#paletteInput').focus();
}
function init(){
  renderBacklog(); renderKanban('#kanban'); renderKanban('#iterationBoard',true); renderRoadmap(); renderBugs(); renderMine();
  $$('.tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.tab,.view').forEach(x=>x.classList.remove('active'));tab.classList.add('active');$('#'+tab.dataset.view).classList.add('active')}));
  document.body.addEventListener('click',e=>{const row=e.target.closest('[data-id]'); if(row) openDrawer(row.dataset.id)});
  $('#closeDrawer').onclick=()=>$('#taskDrawer').classList.remove('open');
  $('#openPalette').onclick=openPalette; $('#openSearch').onclick=openPalette; $('#quickAdd').onclick=openPalette;
  $('#sidebarToggle').onclick=()=>$('#sidebar').classList.toggle('collapsed');
  $('#palette').addEventListener('click',e=>{if(e.target.id==='palette') $('#palette').classList.remove('open')});
  document.addEventListener('keydown',e=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPalette()} if(e.key==='/'){e.preventDefault();openPalette()} if(e.key==='Escape'){$('#palette').classList.remove('open');$('#taskDrawer').classList.remove('open')} if(e.key.toLowerCase()==='c'&&!e.metaKey&&!e.ctrlKey) openPalette(); });
}
document.addEventListener('DOMContentLoaded', init);
