const tasks = [
  {id:1,title:'Michael schedules a meeting to plan a meeting about fewer meetings',status:'In Progress',priority:'P0',points:8,assignee:'MS',sprint:'Season 4',labels:['Office','Chaos'],due:'Jul 08',epic:'Conference Room Meltdown',project:'Chewawa',progress:72,comments:12,files:3,severity:'High',environment:'Scranton'},
  {id:2,title:'Leslie files emergency waffle permit before breakfast becomes legislation',status:'Todo',priority:'P0',points:13,assignee:'LK',sprint:'Season 4',labels:['Parks','Waffles'],due:'Jul 12',epic:'Pawnee Procedure',project:'Chewawa',progress:18,comments:5,files:1,severity:'Critical',environment:'Pawnee'},
  {id:3,title:'Chandler names the sprint something sarcastic and accidentally inspires everyone',status:'Review',priority:'P1',points:5,assignee:'CB',sprint:'Season 4',labels:['Friends','Naming'],due:'Jul 15',epic:'Apartment Standup',project:'Chewawa',progress:88,comments:8,files:2,severity:'Medium',environment:'Central Perk'},
  {id:4,title:'Jake opens a case to find who stole the kanban sticky notes',status:'Done',priority:'P1',points:3,assignee:'JP',sprint:'Season 3',labels:['Brooklyn','Mystery'],due:'Jun 28',epic:'Precinct Productivity',project:'Chewawa',progress:100,comments:4,files:0,severity:'Low',environment:'Nine Nine'},
  {id:5,title:'George blocks the release because the task title sounds too successful',status:'Blocked',priority:'P2',points:8,assignee:'GC',sprint:'Season 4',labels:['Seinfeld','Risk'],due:'Jul 10',epic:'Nothing Happens',project:'Chewawa',progress:41,comments:16,files:5,severity:'High',environment:'Diner'},
  {id:6,title:'Phil turns onboarding into a magic show and loses the acceptance criteria',status:'Todo',priority:'P3',points:5,assignee:'PD',sprint:'Season 5',labels:['Family','Magic'],due:'Jul 22',epic:'Suburban Sprint',project:'Chewawa',progress:8,comments:2,files:0,severity:'Medium',environment:'Dunphy House'},
  {id:7,title:'Abbott teachers triage the copier because it smells like burnt ambition',status:'In Progress',priority:'P2',points:3,assignee:'JT',sprint:'Season 4',labels:['School','Ops'],due:'Jul 18',epic:'Teacher Lounge Ops',project:'Chewawa',progress:55,comments:9,files:1,severity:'Medium',environment:'Teacher Lounge'}
];

const statuses = ['Todo','In Progress','Blocked','Review','Done'];
const priorities = ['P0','P1','P2','P3','No Priority'];
let draggedTaskId = null;
let dragMoved = false;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function chipPriority(priority){return `<span class="priority ${priority.toLowerCase().replace(' ','-')}">${priority}</span>`}
function labels(task){return `<span class="labels">${task.labels.map(label=>`<span class="label">${label}</span>`).join('')}</span>`}
function findTask(id){return tasks.find(task => task.id === Number(id));}

function renderAll(){
  renderBacklog();
  renderKanban('#kanban');
  renderKanban('#iterationBoard', true);
  renderRoadmap();
  renderBugs();
  renderMine();
}

function renderBacklog(){
  $('#backlogRows').innerHTML = priorities.map(group => {
    const rows = tasks.filter(task => task.priority === group || (group === 'No Priority' && !task.priority));
    const empty = rows.length ? '' : '<div class="drop-empty">Drop a sitcom emergency here</div>';
    return `<section class="priority-group" data-priority="${group}">
      <div class="table-row table-head"><span>${group}</span><span>${rows.length} items</span><span>Drop tasks here</span></div>
      ${rows.map(task => `<button class="table-row task-row" draggable="true" data-id="${task.id}" role="row"><span>${task.title}</span><span>${task.status}</span><span>${chipPriority(task.priority)}</span><span>${task.points}</span><span class="avatar">${task.assignee}</span><span>${task.sprint}</span>${labels(task)}<span>${task.due}</span></button>`).join('')}
      ${empty}
    </section>`;
  }).join('');
}

function card(task){
  return `<button class="card" draggable="true" data-id="${task.id}"><h3>${task.title}</h3>${labels(task)}<div class="progress"><span style="width:${task.progress}%"></span></div><div class="card-meta"><span class="avatar">${task.assignee}</span><span>${task.points} pts | 💬 ${task.comments} | 📎 ${task.files}</span></div></button>`;
}

function renderKanban(target, onlySprint=false){
  const source = onlySprint ? tasks.filter(task=>task.sprint==='Season 4') : tasks;
  $(target).innerHTML = statuses.map(status => {
    const items = source.filter(task=>task.status===status);
    const limit = status==='In Progress'?3:status==='Review'?2:5;
    return `<section class="column" data-status="${status}"><div class="column-header"><strong>${status}<span>${items.length}/${limit}</span></strong><div class="progress"><span style="width:${Math.min(100,items.length/limit*100)}%"></span></div></div><div class="column-dropzone">${items.map(card).join('') || '<div class="drop-empty">Drop a task here</div>'}</div></section>`;
  }).join('');
}

function renderRoadmap(){
  $('#timeline').innerHTML = `<div class="road-row"><strong></strong><div class="road-track"><span class="today"></span></div></div>` + tasks.slice(0,6).map((task,index)=>`<div class="road-row"><span>${task.epic}</span><div class="road-track"><span class="bar" style="left:${8+index*10}%;width:${20+index*4}%"></span></div></div>`).join('');
}

function renderBugs(){
  $('#bugList').innerHTML = `<div class="bug table-head"><span>Issue</span><span>Severity</span><span>Location</span><span>Expected / Actual</span><span>Priority</span></div>` + tasks.filter(task=>['P0','P1','P2'].includes(task.priority)).map(task=>`<button class="bug task-row" draggable="true" data-id="${task.id}"><span>${task.title}</span><span>${task.severity}</span><span>${task.environment}</span><span>Everyone acts normal / Nobody acts normal</span><span>${chipPriority(task.priority)}</span></button>`).join('');
}

function renderMine(){
  const groups = ['Today','Overdue','This Week','Next Week','Completed Recently'];
  $('#myItems').innerHTML = groups.map((group,index)=>`<section class="my-section"><h3>${group}</h3>${tasks.filter((_,taskIndex)=>taskIndex%5===index).map(card).join('') || '<p class="muted">Nothing here. Enjoy the laugh track.</p>'}</section>`).join('');
}

function openDrawer(id){
  const task = findTask(id); if(!task) return;
  $('#drawerContent').innerHTML = `<p class="eyebrow">${task.project} / ${task.epic}</p><h2 contenteditable>${task.title}</h2><div class="drawer-grid"><div class="field">Status<br><strong>${task.status}</strong></div><div class="field">Priority<br><strong>${task.priority}</strong></div><div class="field">Sprint<br><strong>${task.sprint}</strong></div><div class="field">Estimate<br><strong>${task.points} points</strong></div></div><h3>Description</h3><div class="field editor" contenteditable>Write the plan, tag the culprit, and do not let the subplot become the roadmap.</div><h3>Checklist</h3><div class="field">☑ Identify the sitcom problem<br>☑ Assign the person least likely to make it worse<br>☐ Drag it to the correct status<br>☐ Celebrate with snacks</div><h3>Activity</h3><div class="comment">${task.assignee} moved this to <strong>${task.status}</strong> after a suspiciously long cutaway.</div>`;
  $('#taskDrawer').classList.add('open'); $('#taskDrawer').setAttribute('aria-hidden','false');
}

function openPalette(){
  const commands = ['Create Task','Create Sprint','Open Status Board','Move selected task to Review','Filter priority:p0','Assign to me','Open Roadmap','Order emergency waffles'];
  $('#commandList').innerHTML = commands.map((command,index)=>`<button class="command ${index===0?'active':''}"><span>${command}</span><kbd>↵</kbd></button>`).join('');
  $('#palette').classList.add('open'); $('#palette').setAttribute('aria-hidden','false'); $('#paletteInput').focus();
}

function enableDragAndDrop(){
  document.body.addEventListener('dragstart', event => {
    const draggable = event.target.closest('[data-id]');
    if(!draggable) return;
    draggedTaskId = draggable.dataset.id;
    dragMoved = true;
    draggable.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedTaskId);
  });

  document.body.addEventListener('dragend', event => {
    event.target.closest('[data-id]')?.classList.remove('dragging');
    $$('.drag-over').forEach(item => item.classList.remove('drag-over'));
    setTimeout(() => { dragMoved = false; draggedTaskId = null; }, 0);
  });

  document.body.addEventListener('dragover', event => {
    const target = event.target.closest('[data-status], [data-priority]');
    if(!target || !draggedTaskId) return;
    event.preventDefault();
    target.classList.add('drag-over');
  });

  document.body.addEventListener('dragleave', event => {
    const target = event.target.closest('[data-status], [data-priority]');
    if(target && !target.contains(event.relatedTarget)) target.classList.remove('drag-over');
  });

  document.body.addEventListener('drop', event => {
    const dropTarget = event.target.closest('[data-status], [data-priority]');
    if(!dropTarget || !draggedTaskId) return;
    event.preventDefault();
    const task = findTask(draggedTaskId);
    if(!task) return;
    if(dropTarget.dataset.status) task.status = dropTarget.dataset.status;
    if(dropTarget.dataset.priority) task.priority = dropTarget.dataset.priority === 'No Priority' ? '' : dropTarget.dataset.priority;
    $$('.drag-over').forEach(item => item.classList.remove('drag-over'));
    renderAll();
  });
}

function init(){
  renderAll();
  enableDragAndDrop();
  $$('.tab').forEach(tab=>tab.addEventListener('click',()=>{$$('.tab,.view').forEach(item=>item.classList.remove('active'));tab.classList.add('active');$('#'+tab.dataset.view).classList.add('active')}));
  document.body.addEventListener('click',event=>{const row=event.target.closest('[data-id]'); if(row && !dragMoved) openDrawer(row.dataset.id)});
  $('#closeDrawer').onclick=()=>$('#taskDrawer').classList.remove('open');
  $('#openPalette').onclick=openPalette; $('#openSearch').onclick=openPalette; $('#quickAdd').onclick=openPalette;
  $('#sidebarToggle').onclick=()=>$('#sidebar').classList.toggle('collapsed');
  $('#palette').addEventListener('click',event=>{if(event.target.id==='palette') $('#palette').classList.remove('open')});
  document.addEventListener('keydown',event=>{ if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openPalette()} if(event.key==='/'){event.preventDefault();openPalette()} if(event.key==='Escape'){$('#palette').classList.remove('open');$('#taskDrawer').classList.remove('open')} if(event.key.toLowerCase()==='c'&&!event.metaKey&&!event.ctrlKey) openPalette(); });
}

document.addEventListener('DOMContentLoaded', init);
