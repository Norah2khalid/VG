import type {InspectionLocation,InspectionTask,AIFinding,Inspection,Report,Device} from '../types';

// SIMULATED fictional demo data. Replace with API calls when a backend exists.

export const LOCATIONS:InspectionLocation[]=[
{id:'LOC-T04',facility:'مصفاة رأس تنورة',zone:'ZONE-B',equipment:'T-04',equipmentType:'خزان',x:30,y:35,lat:24.7101,lng:46.6753,risk:'high',state:'WARNING',last:'2026-10-02',next:'2026-10-16',note:'بقعة تآكل على الجدار الشرقي'},
{id:'LOC-T05',facility:'مصفاة رأس تنورة',zone:'ZONE-B',equipment:'T-05',equipmentType:'خزان',x:42,y:30,lat:24.7105,lng:46.676,risk:'low',state:'INSPECTED',last:'2026-10-01',next:'2026-11-01',note:'لا ملاحظات'},
{id:'LOC-P12',facility:'مصفاة رأس تنورة',zone:'ZONE-A',equipment:'PIPE-12',equipmentType:'أنبوب',x:62,y:22,lat:24.7201,lng:46.6902,risk:'critical',state:'CRITICAL',last:'2026-09-28',next:'2026-10-08',note:'مؤشر تسرب محتمل عند الوصلة'},
{id:'LOC-V07',facility:'مصفاة رأس تنورة',zone:'ZONE-A',equipment:'VLV-07',equipmentType:'صمام',x:72,y:45,lat:24.719,lng:46.6915,risk:'medium',state:'WARNING',last:'2026-09-30',next:'2026-10-20',note:'ارتفاع حرارة طفيف'},
{id:'LOC-PM3',facility:'مصفاة رأس تنورة',zone:'ZONE-C',equipment:'PMP-03',equipmentType:'مضخة',x:55,y:68,lat:24.717,lng:46.689,risk:'low',state:'NORMAL',last:'2026-09-25',next:'2026-10-25',note:'—'},
{id:'LOC-TW1',facility:'مصفاة رأس تنورة',zone:'ZONE-D',equipment:'TWR-01',equipmentType:'برج',x:20,y:72,lat:24.695,lng:46.66,risk:'medium',state:'INSPECTED',last:'2026-10-03',next:'2026-11-03',note:'اهتزاز ضمن الحد'},
{id:'LOC-DR1',facility:'مصفاة رأس تنورة',zone:'ZONE-D',equipment:'VG-DRONE-01',equipmentType:'نقطة درون',x:82,y:78,lat:24.696,lng:46.662,risk:'low',state:'NORMAL',last:'2026-10-04',next:'2026-10-18',note:'نقطة تحليق محاكاة'}
];

export const TASKS:InspectionTask[]=[
{id:'TSK-301',title:'فحص جدار الخزان T-04',facility:'مصفاة رأس تنورة',locationId:'LOC-T04',equipment:'T-04',inspector:'خالد العتيبي',priority:'عالية',due:'2026-10-10',status:'قيد التنفيذ'},
{id:'TSK-302',title:'فحص تسرب الأنبوب PIPE-12',facility:'مصفاة رأس تنورة',locationId:'LOC-P12',equipment:'PIPE-12',inspector:'سارة الحربي',priority:'حرجة',due:'2026-10-08',status:'جديدة'},
{id:'TSK-303',title:'فحص حرارة الصمام VLV-07',facility:'مصفاة رأس تنورة',locationId:'LOC-V07',equipment:'VLV-07',inspector:'خالد العتيبي',priority:'متوسطة',due:'2026-10-20',status:'مجدولة'},
{id:'TSK-304',title:'تحليق VG-DRONE-01 فوق ZONE-D',facility:'مصفاة رأس تنورة',locationId:'LOC-DR1',equipment:'VG-DRONE-01',inspector:'ماجد الشهري',priority:'منخفضة',due:'2026-10-18',status:'بانتظار المراجعة'},
{id:'TSK-305',title:'فحص المضخة PMP-03',facility:'مصفاة رأس تنورة',locationId:'LOC-PM3',equipment:'PMP-03',inspector:'سارة الحربي',priority:'منخفضة',due:'2026-10-01',status:'متأخرة'},
{id:'TSK-306',title:'فحص البرج TWR-01',facility:'مصفاة رأس تنورة',locationId:'LOC-TW1',equipment:'TWR-01',inspector:'ماجد الشهري',priority:'عالية',due:'2026-10-03',status:'مكتملة'}
];

export const INSPECTORS=['خالد العتيبي','سارة الحربي','ماجد الشهري'];

export const FINDINGS:AIFinding[]=[
{id:'AI-001',kind:'تآكل',facility:'مصفاة رأس تنورة',equipment:'T-04',time:'2026-10-02 09:14',risk:'high',confidence:87,image:'IMG-T04-B',status:'بانتظار المراجعة البشرية'},
{id:'AI-002',kind:'تسرب محتمل',facility:'مصفاة رأس تنورة',equipment:'PIPE-12',time:'2026-09-28 14:40',risk:'critical',confidence:91,image:'IMG-P12-A',status:'بانتظار المراجعة البشرية'},
{id:'AI-003',kind:'ارتفاع غير طبيعي في الحرارة',facility:'مصفاة رأس تنورة',equipment:'VLV-07',time:'2026-09-30 11:05',risk:'medium',confidence:74,image:'IMG-V07-A',status:'بانتظار المراجعة البشرية'},
{id:'AI-004',kind:'تغير بصري غير طبيعي',facility:'مصفاة رأس تنورة',equipment:'TWR-01',time:'2026-10-03 16:22',risk:'low',confidence:62,image:'IMG-TW1-A',status:'بانتظار المراجعة البشرية'}
];

export const INSPECTIONS:Inspection[]=[
{id:'INS-2041',date:'2026-10-02',time:'09:00',facility:'مصفاة رأس تنورة',location:'ZONE-B',equipment:'T-04',inspector:'خالد العتيبي',result:'ملاحظات تحتاج متابعة',risk:'high',notes:3,report:'RPT-511',review:'قيد المراجعة',temp:58,openFindings:2},
{id:'INS-2040',date:'2026-09-18',time:'10:30',facility:'مصفاة رأس تنورة',location:'ZONE-B',equipment:'T-04',inspector:'خالد العتيبي',result:'اجتياز مع تحذير',risk:'medium',notes:2,report:'RPT-504',review:'معتمد',temp:51,openFindings:1},
{id:'INS-2039',date:'2026-09-04',time:'08:45',facility:'مصفاة رأس تنورة',location:'ZONE-B',equipment:'T-04',inspector:'سارة الحربي',result:'اجتياز',risk:'low',notes:1,report:'RPT-498',review:'معتمد',temp:47,openFindings:0},
{id:'INS-2038',date:'2026-09-28',time:'14:00',facility:'مصفاة رأس تنورة',location:'ZONE-A',equipment:'PIPE-12',inspector:'سارة الحربي',result:'فشل - مؤشر تسرب',risk:'critical',notes:4,report:'RPT-509',review:'محوّل للصيانة',temp:63,openFindings:2}
];

export const REPORTS:Report[]=[
{id:'RPT-511',title:'تقرير فحص الخزان T-04',facility:'مصفاة رأس تنورة',location:'ZONE-B',inspector:'خالد العتيبي',date:'2026-10-02',risk:'high',status:'قيد المراجعة'},
{id:'RPT-509',title:'تقرير فحص الأنبوب PIPE-12',facility:'مصفاة رأس تنورة',location:'ZONE-A',inspector:'سارة الحربي',date:'2026-09-28',risk:'critical',status:'يحتاج استكمال'},
{id:'RPT-504',title:'تقرير فحص الخزان T-04',facility:'مصفاة رأس تنورة',location:'ZONE-B',inspector:'خالد العتيبي',date:'2026-09-18',risk:'medium',status:'مكتمل'},
{id:'RPT-498',title:'تقرير فحص الخزان T-04',facility:'مصفاة رأس تنورة',location:'ZONE-B',inspector:'سارة الحربي',date:'2026-09-04',risk:'low',status:'مكتمل'},
{id:'RPT-512',title:'تقرير تحليق VG-DRONE-01',facility:'مصفاة رأس تنورة',location:'ZONE-D',inspector:'ماجد الشهري',date:'2026-10-04',risk:'low',status:'جديد'}
];

export const DEVICES:Device[]=[
{id:'VG-DRONE-01',type:'Drone',status:'SIMULATION',facility:'مصفاة رأس تنورة',battery:76,lat:24.696,lng:46.662,temp:41,alt:35,speed:8,lastComm:'محاكاة'},
{id:'VG-DRONE-02',type:'Drone',status:'SIMULATION',facility:'مصفاة رأس تنورة',battery:54,lat:24.71,lng:46.675,temp:39,alt:22,speed:5,lastComm:'محاكاة'},
{id:'VG-GAS-07',type:'Gas Sensor',status:'SIMULATION',facility:'مصفاة رأس تنورة',battery:90,lat:24.72,lng:46.69,temp:44,alt:0,speed:0,lastComm:'محاكاة'},
{id:'VG-CAM-03',type:'Camera',status:'UNAVAILABLE',facility:'مصفاة رأس تنورة',battery:0,lat:24.718,lng:46.689,temp:0,alt:0,speed:0,lastComm:'—'}
];

export const RISK_TREND=[
{m:'مايو',v:32},
{m:'يونيو',v:38},
{m:'يوليو',v:35},
{m:'أغسطس',v:44},
{m:'سبتمبر',v:52},
{m:'أكتوبر',v:58}
];