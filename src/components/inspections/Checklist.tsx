import {useState} from 'react';import type {ChecklistResult} from '../../types';
const ITEMS=['حالة المعدة','درجة الحرارة','الضغط','الحالة البصرية','مؤشرات التسرب','مؤشرات التآكل','الحالة الهيكلية','ملاحظات السلامة'];const OPTS:ChecklistResult[]=['اجتياز','تحذير','فشل','غير منطبق'];
export default function Checklist({onDone}:{onDone:()=>void}){const [v,setV]=useState<Record<string,ChecklistResult>>({});const [n,setN]=useState<Record<string,string>>({});
const ok=ITEMS.every(i=>v[i]);
return <div className="space-y-2">{ITEMS.map(i=><div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center border-b border-cyan-900/30 pb-2"><span className="text-sm">{i}</span>
<div role="radiogroup" aria-label={i} className="flex gap-1 flex-wrap">{OPTS.map(o=><button key={o} role="radio" aria-checked={v[i]===o} onClick={()=>setV({...v,[i]:o})} className={`text-xs px-2 py-1 rounded border ${v[i]===o?(o==='فشل'?'bg-red-800 border-red-500':o==='تحذير'?'bg-amber-800 border-amber-500':'bg-cyan-800 border-cyan-500'):'border-cyan-900'}`}>{o}</button>)}</div>
<input className="inp" placeholder="ملاحظة" aria-label={'ملاحظة '+i} value={n[i]||''} onChange={e=>setN({...n,[i]:e.target.value})}/></div>)}
<button className="btn" disabled={!ok} onClick={onDone}>إكمال قائمة الفحص وإنهاء التفتيش</button>{!ok&&<span className="text-xs text-slate-400 ms-2">أجب عن جميع البنود</span>}</div>}
