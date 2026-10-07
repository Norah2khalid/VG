import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  FileText,
  Archive,
  Menu,
  X,
  Activity,
  Plane,
} from 'lucide-react';

import { useApp, ROLE_AR } from '../store';
import type { Role } from '../types';

const NAV = [
  { to: '/', l: 'لوحة التحكم', i: LayoutDashboard },
  { to: '/tasks', l: 'المهام ومواقع التفتيش', i: ClipboardList },
  { to: '/drone-schedule', l: 'جدولة الدرون', i: Plane },
  { to: '/reports', l: 'التقارير', i: FileText },
  { to: '/history', l: 'سجل التفتيش', i: Archive },
];

export default function AppLayout() {
  const { role, setRole, toast } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <aside
        className={`fixed md:static inset-y-0 start-0 z-40 w-64 bg-navy-800 border-e border-cyan-900/40 p-4 flex flex-col gap-2 transition-transform ${
          open ? '' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <img
            src="/FISCB_logo_transparent.png"
            alt="FISCB"
            className="w-10 h-10 object-contain"
          />

          <div>
            <div className="font-bold tracking-widest">VISIONGUARD</div>
            <div className="text-xs text-slate-400">FISCB</div>
          </div>
        </div>

        <nav
          aria-label="القائمة الرئيسية"
          className="flex flex-col gap-1"
        >
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                  isActive
                    ? 'bg-cyan-700/40 text-cyan-200 border border-cyan-700'
                    : 'hover:bg-navy-700'
                }`
              }
            >
              <n.i size={18} />
              {n.l}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto card text-xs space-y-1">
          <div className="flex items-center gap-1">
            <Activity size={14} className="text-emerald-400" />
            حالة النظام: يعمل
          </div>
          <div className="text-amber-300">وضع المحاكاة</div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-navy-900/95 border-b border-cyan-900/40 px-4 py-2 flex items-center gap-3">
          <button
            className="md:hidden btn2"
            aria-label="القائمة"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="text-xs text-amber-300 border border-amber-700 rounded px-2 py-1">
            وضع المحاكاة — بيانات تجريبية
          </div>

          <label className="ms-auto text-xs text-slate-400 flex items-center gap-2">
  الدور
  <select
    className="inp"
    value={role}
    onChange={(e) => setRole(e.target.value as Role)}
  >
    {(Object.keys(ROLE_AR) as Role[])
      .filter((r) => ROLE_AR[r] !== 'جامع التقارير')
      .map((r) => (
        <option key={r} value={r}>
          {ROLE_AR[r] === 'المدير' ? 'مدير المفتشين' : ROLE_AR[r]}
        </option>
      ))}
  </select>
</label>
        </header>

        <main className="p-4 space-y-4">
          <Outlet />
        </main>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-4 start-4 z-50 bg-emerald-800 border border-emerald-500 rounded px-4 py-2 text-sm"
        >
          {toast}
        </div>
      )}
    </div>
  );
}