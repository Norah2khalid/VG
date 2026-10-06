import type {Risk} from '../types';
export const RISK_AR:Record<Risk,string>={low:'منخفض',medium:'متوسط',high:'مرتفع',critical:'حرج'};
export const RISK_CLS:Record<Risk,string>={low:'bg-emerald-900/60 text-emerald-300 border-emerald-700',medium:'bg-amber-900/60 text-amber-300 border-amber-700',high:'bg-orange-900/60 text-orange-300 border-orange-700',critical:'bg-red-900/60 text-red-300 border-red-600'};
export const RISK_ICON:Record<Risk,string>={low:'●',medium:'▲',high:'◆',critical:'■'};
export const RISK_ORDER:Risk[]=['low','medium','high','critical'];
