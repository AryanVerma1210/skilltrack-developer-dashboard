import React, {useEffect, useMemo, useState} from "react";
import {createRoot} from "react-dom/client";
import {CheckCircle2, Circle, Plus, Trash2, Code2, Target, Flame, BookOpen, Github, X} from "lucide-react";
import "./style.css";

const starter = [
  {id:1,title:"Build a REST API",skill:"Backend",done:true},
  {id:2,title:"Practice binary search",skill:"DSA",done:false},
  {id:3,title:"Learn React hooks",skill:"Frontend",done:false},
  {id:4,title:"Build a Python mini project",skill:"Python",done:true},
  {id:5,title:"Create a GitHub README",skill:"Tools",done:false}
];

function App(){
  const [tasks,setTasks]=useState(()=>JSON.parse(localStorage.getItem("skilltrack_tasks")||"null")||starter);
  const [filter,setFilter]=useState("All");
  const [open,setOpen]=useState(false);
  const [form,setForm]=useState({title:"",skill:"DSA"});
  useEffect(()=>localStorage.setItem("skilltrack_tasks",JSON.stringify(tasks)),[tasks]);

  const completed=tasks.filter(t=>t.done).length;
  const progress=tasks.length?Math.round(completed/tasks.length*100):0;
  const visible=useMemo(()=>filter==="All"?tasks:tasks.filter(t=>t.skill===filter),[tasks,filter]);
  const skills=["All","DSA","Frontend","Backend","Python","Tools"];

  function addTask(e){
    e.preventDefault(); if(!form.title.trim()) return;
    setTasks([...tasks,{id:Date.now(),title:form.title.trim(),skill:form.skill,done:false}]);
    setForm({title:"",skill:"DSA"}); setOpen(false);
  }
  function toggle(id){setTasks(tasks.map(t=>t.id===id?{...t,done:!t.done}:t))}
  function remove(id){setTasks(tasks.filter(t=>t.id!==id))}

  return <div className="app">
    <header><div className="brand"><div className="logo"><Code2 size={22}/></div><div><b>SkillTrack</b><span>Developer Progress Dashboard</span></div></div>
      <a href="https://github.com/" target="_blank" rel="noreferrer" className="github"><Github size={18}/> GitHub</a>
    </header>

    <main>
      <section className="hero"><div><p className="eyebrow">YOUR DEVELOPMENT OS</p><h1>Build skills.<br/><em>Track progress.</em></h1>
      <p className="sub">A lightweight productivity dashboard for developers to organize learning goals, track completion, and stay consistent.</p></div>
      <div className="progress-card"><div className="ring"><strong>{progress}%</strong></div><div><b>Overall progress</b><p>{completed} of {tasks.length} goals completed</p></div></div></section>

      <section className="stats">
        <div><Target/><span><b>{tasks.length}</b> Total goals</span></div>
        <div><CheckCircle2/><span><b>{completed}</b> Completed</span></div>
        <div><Flame/><span><b>{Math.max(1,completed*3)}</b> Day streak</span></div>
        <div><BookOpen/><span><b>{new Set(tasks.map(t=>t.skill)).size}</b> Skill areas</span></div>
      </section>

      <section className="workspace">
        <div className="toolbar"><div><h2>Learning goals</h2><p>Turn your roadmap into actionable tasks.</p></div><button onClick={()=>setOpen(true)}><Plus size={18}/> Add goal</button></div>
        <div className="filters">{skills.map(s=><button key={s} className={filter===s?"active":""} onClick={()=>setFilter(s)}>{s}</button>)}</div>
        <div className="tasks">{visible.length?visible.map(t=><article className={"task "+(t.done?"done":"")} key={t.id}>
          <button className="check" onClick={()=>toggle(t.id)}>{t.done?<CheckCircle2/>:<Circle/>}</button>
          <div className="taskbody"><b>{t.title}</b><span>{t.skill}</span></div>
          <button className="delete" onClick={()=>remove(t.id)} aria-label="Delete"><Trash2 size={17}/></button>
        </article>):<div className="empty">No goals in this category.</div>}</div>
      </section>
    </main>

    {open&&<div className="modal-bg" onClick={()=>setOpen(false)}><form className="modal" onSubmit={addTask} onClick={e=>e.stopPropagation()}>
      <div className="modalhead"><h3>Add learning goal</h3><button type="button" onClick={()=>setOpen(false)}><X/></button></div>
      <label>Goal<input autoFocus value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="e.g. Build a weather app"/></label>
      <label>Skill area<select value={form.skill} onChange={e=>setForm({...form,skill:e.target.value})}>{skills.slice(1).map(s=><option key={s}>{s}</option>)}</select></label>
      <button className="submit">Add goal</button>
    </form></div>}
    <footer>SkillTrack • React + Vite • Local-first productivity app</footer>
  </div>
}
createRoot(document.getElementById("root")).render(<App/>);