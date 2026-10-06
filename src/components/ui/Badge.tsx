import type {ReactNode} from 'react';import type {Risk} from '../../types';import {RISK_AR,RISK_CLS,RISK_ICON} from '../../utils/risk';
export const RiskBadge=({risk}:{risk:Risk})=><span className={`inline-flex gap-1 items-center border rounded px-2 py-0.5 text-xs ${RISK_CLS[risk]}`}><span aria-hidden>{RISK_ICON[risk]}</span>{RISK_AR[risk]}</span>;
export const Tag=({children}:{children:ReactNode})=><span className="border border-cyan-800 text-cyan-300 rounded px-2 py-0.5 text-xs">{children}</span>;
export const Sim=({children='بيانات محاكاة'}:{children?:string})=><span className="border border-amber-700 text-amber-300 bg-amber-950/50 rounded px-2 py-0.5 text-xs">{children}</span>;
