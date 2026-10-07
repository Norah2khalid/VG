import {useState,FormEvent} from 'react';import {useSearchParams} from 'react-router-dom';import {useApp} from '../store';import {LOCATIONS,INSPECTORS} from '../data/demoData';import {RiskBadge,Tag} from '../components/ui/Badge';import Checklist from '../components/inspections/Checklist';
import {TASK_STATUSES,PRIORITIES,InspectionTask} from '../types';
const empty:InspectionTask={id:'',title:'',facility:LOCATIONS[0].facility,locationId:LOCATIONS[0].id,equipment:LOCATIONS[0].equipment,inspector:INSPECTORS[0],priority:'متوسطة',due:'',status:'جديدة'};
const STEPS=['إنشاء المهمة','إسناد','بدء التفتيش','قائمة الفحص','جمع الصور','تحليل AI','مراجعة بشرية','إكمال','تقرير','حفظ في السجل'];
export default function TasksAndLocations(){const {role,tasks,saveTask,completeInspection,notify}=useApp();const [sp,setSp]=useSearchParams();
const [edit,setEdit]=useState<InspectionTask|null>(null);const [err,setErr]=useState('');const [sel,setSel]=useState<string>('');const [conf,setConf]=useState(false);
const filter=sp.get('filter');const list=tasks.filter(t=>filter==='active'?['جديدة','مجدولة','قيد التنفيذ'].includes(t.status):true);const cur=tasks.find(t=>t.id===sel);
const submit=(e:FormEvent)=>{e.preventDefault();if(!edit)return;if(edit.title.trim().length<3||!edit.due){setErr('أدخل عنواناً (3 أحرف على الأقل) وتاريخ استحقاق');return}
const l=LOCATIONS.find(x=>x.id===edit.locationId)!;saveTask({...edit,id:edit.id||'TSK-'+(307+tasks.length-6),facility:l.facility,equipment:l.equipment});setEdit(null);setErr('')};
const step=!cur?0:cur.status==='جديدة'?1:cur.status==='مجدولة'?2:cur.status==='قيد التنفيذ'?3:cur.status==='بانتظار المراجعة'?8:9;
return <>
<section className="card"><div className="flex flex-wrap gap-2 items-center mb-3"><h2 className="font-bold">المهام</h2>{filter&&<button className="btn2" onClick={()=>setSp({})}>إلغاء التصفية (نشطة)</button>}
<button className="btn ms-auto" disabled={role!=='manager'} title={role!=='manager'?'متاح للمدير فقط':''} onClick={()=>{setEdit(empty);setErr('')}}>مهمة جديدة</button></div>
<div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th>الرقم</th><th>العنوان</th><th>المنشأة</th><th>المعدة</th><th>المفتش</th><th>الأولوية</th><th>الاستحقاق</th><th>الحالة</th><th/></tr></thead><tbody>
{list.map(t=><tr key={t.id}><td>{t.id}</td><td>{t.title}</td><td>{t.facility}</td><td>{t.equipment}</td><td>{t.inspector}</td><td><Tag>{t.priority}</Tag></td><td>{t.due}</td>
<td><select className="inp" aria-label="الحالة" value={t.status} disabled={role==='collector'} onChange={e=>saveTask({...t,status:e.target.value as InspectionTask['status']})}>{TASK_STATUSES.map(s=><option key={s}>{s}</option>)}</select></td>
<td className="whitespace-nowrap"><button className="btn2" onClick={()=>setSel(t.id)}>تفاصيل</button> <button className="btn2" disabled={role==='collector'} onClick={()=>{setEdit(t);setErr('')}}>تعديل</button></td></tr>)}</tbody></table>{!list.length&&<p className="text-slate-400 p-4">لا توجد مهام</p>}</div></section>
{cur&&<section className="card space-y-3"><h3 className="font-bold">{cur.id} — {cur.title}</h3>
<ol className="flex flex-wrap gap-1 text-xs">{STEPS.map((s,i)=><li key={s} className={`px-2 py-1 rounded border ${i<=step?'border-cyan-500 text-cyan-200':'border-cyan-900 text-slate-500'}`}>{i+1}. {s}</li>)}</ol>
<div className="flex gap-2">{cur.status==='جديدة'&&<button className="btn" disabled={role==='collector'} onClick={()=>{saveTask({...cur,status:'مجدولة'});notify('تم إسناد المهمة إلى '+cur.inspector)}}>تأكيد الإسناد</button>}
{cur.status==='مجدولة'&&<button className="btn" disabled={role==='collector'} onClick={()=>saveTask({...cur,status:'قيد التنفيذ'})}>بدء التفتيش</button>}</div>
{cur.status==='قيد التنفيذ'&&role!=='collector'&&<Checklist onDone={()=>setConf(true)}/>}
{cur.status==='بانتظار المراجعة'&&<p className="text-sm text-amber-300">بانتظار المراجعة البشرية — راجع النتائج من لوحة التحكم.</p>}</section>}
<section className="card"><h2 className="font-bold mb-2">مواقع التفتيش <span className="text-xs text-slate-400">منشأة ← منطقة ← معدات ← موقع تفتيش</span></h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr><th>المعرف</th><th>المنشأة</th><th>المنطقة</th><th>المعدة</th><th>الإحداثيات</th><th>الخطورة</th><th>الحالة</th><th>آخر تفتيش</th><th>القادم</th></tr></thead><tbody>
{LOCATIONS.map(l=><tr key={l.id}><td>{l.id}</td><td>{l.facility}</td><td>{l.zone}</td><td>{l.equipmentType} {l.equipment}</td><td dir="ltr">{l.lat}, {l.lng}</td><td><RiskBadge risk={l.risk}/></td><td>{l.state}</td><td>{l.last}</td><td>{l.next}</td></tr>)}</tbody></table></div></section>
{edit&&<div role="dialog" aria-modal="true" aria-label="مهمة" className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4"><form onSubmit={submit} className="card w-full max-w-lg space-y-2">
<h3 className="font-bold">{edit.id?'تعديل المهمة':'مهمة جديدة'}</h3>
<label className="block text-sm">العنوان<input className="inp w-full" value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})}/></label>
<label className="block text-sm">موقع التفتيش<select className="inp w-full" value={edit.locationId} onChange={e=>setEdit({...edit,locationId:e.target.value})}>{LOCATIONS.map(l=><option key={l.id} value={l.id}>{l.equipment} — {l.facility}</option>)}</select></label>
<div className="grid grid-cols-2 gap-2"><label className="text-sm">المفتش<select className="inp w-full" value={edit.inspector} onChange={e=>setEdit({...edit,inspector:e.target.value})}>{INSPECTORS.map(i=><option key={i}>{i}</option>)}</select></label>
<label className="text-sm">الأولوية<select className="inp w-full" value={edit.priority} onChange={e=>setEdit({...edit,priority:e.target.value as InspectionTask['priority']})}>{PRIORITIES.map(p=><option key={p}>{p}</option>)}</select></label>
<label className="text-sm">الاستحقاق<input
  type="date"
  dir="ltr"
  className="inp w-full"
  value={edit.due}
  onChange={e => setEdit({...edit, due:e.target.value})}
/></label>
<label className="text-sm">الحالة<select className="inp w-full" value={edit.status} onChange={e=>setEdit({...edit,status:e.target.value as InspectionTask['status']})}>{TASK_STATUSES.map(s=><option key={s}>{s}</option>)}</select></label></div>
{err&&<p role="alert" className="text-red-300 text-sm">{err}</p>}<div className="flex gap-2"><button className="btn">حفظ</button><button type="button" className="btn2" onClick={()=>setEdit(null)}>إلغاء</button></div></form></div>}
{conf&&cur&&<div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 bg-black/60 grid place-items-center"><div className="card space-y-3"><p>تأكيد إكمال التفتيش وإنشاء التقرير وحفظه في السجل？</p><div className="flex gap-2"><button className="btn" onClick={()=>{completeInspection(cur.id);setConf(false)}}>تأكيد</button><button className="btn2" onClick={()=>setConf(false)}>رجوع</button></div></div></div>}</>}