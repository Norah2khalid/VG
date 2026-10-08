import {createContext,useContext,useState,ReactNode} from 'react';
import type {Role,InspectionTask,AIFinding,HumanDecision,Report,Inspection} from './types';
import {TASKS,FINDINGS,REPORTS,INSPECTIONS} from './data/demoData';
export const ROLE_AR:Record<Role,string>={manager:'المدير',inspector:'المفتش',collector:'جامع التقارير'};
interface S{role:Role;setRole:(r:Role)=>void;tasks:InspectionTask[];saveTask:(t:InspectionTask)=>void;findings:AIFinding[];addFinding:(f:AIFinding)=>void;
decisions:HumanDecision[];review:(id:string,decision:string,note:string)=>void;reports:Report[];setReportStatus:(id:string,s:Report['status'])=>void;
inspections:Inspection[];completeInspection:(taskId:string)=>void;toast:string;notify:(m:string)=>void}
const Ctx=createContext<S>(null as unknown as S);export const useApp=()=>useContext(Ctx);
export function AppProvider({children}:{children:ReactNode}){
const [role,setRole]=useState<Role>('inspector');const [tasks,setTasks]=useState(TASKS);const [findings,setFindings]=useState(FINDINGS);
const [decisions,setDecisions]=useState<HumanDecision[]>([]);const [reports,setReports]=useState(REPORTS);const [inspections,setInsp]=useState(INSPECTIONS);const [toast,setToast]=useState('');
const notify=(m:string)=>{setToast(m);setTimeout(()=>setToast(''),3000)};
const saveTask=(t:InspectionTask)=>{setTasks(p=>p.some(x=>x.id===t.id)?p.map(x=>x.id===t.id?t:x):[t,...p]);notify('تم حفظ المهمة')};
const addFinding=(f:AIFinding)=>setFindings(p=>[f,...p]);
const review=(id:string,decision:string,note:string)=>{setDecisions(p=>[{findingId:id,decision,reviewer:ROLE_AR[role],time:new Date().toLocaleString('ar-SA'),note},...p]);
setFindings(p=>p.map(f=>f.id===id?{...f,status:decision==='إضافة ملاحظة'?f.status:'تمت المراجعة: '+decision}:f));notify('تم تسجيل القرار البشري: '+decision)};
const setReportStatus=(id:string,s:Report['status'])=>{setReports(p=>p.map(r=>r.id===id?{...r,status:s}:r));notify('تم تحديث حالة التقرير')};
const completeInspection=(taskId:string)=>{const t=tasks.find(x=>x.id===taskId);if(!t)return;const n=2100+inspections.length;const d=new Date().toISOString().slice(0,10);
setTasks(p=>p.map(x=>x.id===taskId?{...x,status:'بانتظار المراجعة'}:x));
setInsp(p=>[{id:'INS-'+n,date:d,time:new Date().toTimeString().slice(0,5),facility:t.facility,location:'—',equipment:t.equipment,inspector:t.inspector,result:'مكتمل - بانتظار المراجعة',risk:'medium',notes:0,report:'RPT-'+n,review:'قيد المراجعة',temp:50,openFindings:0},...p]);
setReports(p=>[{id:'RPT-'+n,title:'تقرير '+t.title,facility:t.facility,location:'—',inspector:t.inspector,date:d,risk:'medium',status:'جديد'},...p]);notify('اكتمل التفتيش وتم إنشاء التقرير وحفظه في السجل')};
return <Ctx.Provider value={{role,setRole,tasks,saveTask,findings,addFinding,decisions,review,reports,setReportStatus,inspections,completeInspection,toast,notify}}>{children}</Ctx.Provider>}
