export type Risk='low'|'medium'|'high'|'critical';
export type Role='manager'|'inspector'|'collector';
export type MarkerState='NORMAL'|'WARNING'|'CRITICAL'|'INSPECTED';
export type DataStatus='LIVE'|'IMPORTED'|'SIMULATION'|'UNAVAILABLE';
export const TASK_STATUSES=['جديدة','مجدولة','قيد التنفيذ','بانتظار المراجعة','مكتملة','متأخرة','ملغاة'] as const;
export const PRIORITIES=['منخفضة','متوسطة','عالية','حرجة'] as const;
export type TaskStatus=typeof TASK_STATUSES[number];export type Priority=typeof PRIORITIES[number];
export interface InspectionLocation{id:string;facility:string;zone:string;equipment:string;equipmentType:string;x:number;y:number;lat:number;lng:number;risk:Risk;state:MarkerState;last:string;next:string;note:string}
export interface InspectionTask{id:string;title:string;facility:string;locationId:string;equipment:string;inspector:string;priority:Priority;due:string;status:TaskStatus}
export interface AIFinding{id:string;kind:string;facility:string;equipment:string;time:string;risk:Risk;confidence:number;image:string;status:string}
export interface HumanDecision{findingId:string;decision:string;reviewer:string;time:string;note:string}
export type ChecklistResult='اجتياز'|'تحذير'|'فشل'|'غير منطبق';
export interface Inspection{id:string;date:string;time:string;facility:string;location:string;equipment:string;inspector:string;result:string;risk:Risk;notes:number;report:string;review:string;temp:number;openFindings:number}
export interface Report{id:string;title:string;facility:string;location:string;inspector:string;date:string;risk:Risk;status:'جديد'|'قيد المراجعة'|'مكتمل'|'يحتاج استكمال'|'مؤرشف'}
export interface Device{id:string;type:string;status:DataStatus;facility:string;battery:number;lat:number;lng:number;temp:number;alt:number;speed:number;lastComm:string}
