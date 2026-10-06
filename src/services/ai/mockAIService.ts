import type {AIService} from './types';import type {Risk} from '../../types';
const KINDS=['تسرب محتمل','تآكل','ارتفاع غير طبيعي في الحرارة','خلل في المعدات','تغير بصري غير طبيعي','مؤشر يحتاج إلى فحص إضافي'];const RISKS:Risk[]=['low','medium','high','critical'];
let n=100;
export const mockAIService:AIService={provider:'mock',label:'تحليل تجريبي',analyze:async(image,equipment,facility)=>{await new Promise(r=>setTimeout(r,700));n++;return{id:`AI-${n}`,kind:KINDS[n%KINDS.length],facility,equipment,time:new Date().toLocaleString('ar-SA'),risk:RISKS[n%4],confidence:60+(n*7)%38,image,status:'بانتظار المراجعة البشرية'}}};
