import { useState } from 'react';
import {
  ClipboardList,
  Users,
  Brain,
  Camera,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import { LOCATIONS } from '../data/demoData';
import { useApp } from '../store';

const INSPECTORS = [
  'خالد العتيبي',
  'أحمد الشمري',
  'سارة القحطاني',
  'فاطمة الغامدي',
];

export default function ManagerDashboard() {
  const { tasks, findings, notify } = useApp();

  const [inspector, setInspector] = useState(INSPECTORS[0]);
  const [location, setLocation] = useState(LOCATIONS[0]?.id ?? '');
  const [taskType, setTaskType] = useState('تفتيش دوري');
  const [priority, setPriority] = useState('متوسطة');
  const [notes, setNotes] = useState('');

  const [assignedTasks, setAssignedTasks] = useState<
    {
      id: string;
      inspector: string;
      location: string;
      type: string;
      priority: string;
      status: string;
    }[]
  >([]);

  const assignTask = () => {
    if (!location || !inspector) return;

    const newTask = {
      id: `M-${Date.now().toString().slice(-5)}`,
      inspector,
      location,
      type: taskType,
      priority,
      status: 'مسندة',
    };

    setAssignedTasks((prev) => [newTask, ...prev]);
    setNotes('');
    notify?.(`تم إسناد المهمة إلى ${inspector}`);
  };

  const activeTasks = tasks.filter(
    (t) =>
      t.status === 'جديدة' ||
      t.status === 'مجدولة' ||
      t.status === 'قيد التنفيذ'
  ).length;

  return (
    <div className="space-y-5">

      {/* العنوان */}
      <section className="card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10">
            <Users className="text-cyan-400" size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              واجهة المدير 
            </h1>

            <p className="text-sm text-slate-400 mt-1">
              إسناد مهام التفتيش ومتابعة نتائج المفتشين
            </p>
          </div>
        </div>
      </section>

      {/* 1 — إسناد المهام */}
      <section className="card space-y-4">

        <div className="flex items-center gap-2">
          <ClipboardList className="text-cyan-400" />
          <h2 className="text-lg font-bold">
            إسناد مهام التفتيش
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          <label className="space-y-1">
            <span className="text-sm text-slate-400">
              المفتش
            </span>

            <select
              className="inp w-full"
              value={inspector}
              onChange={(e) => setInspector(e.target.value)}
            >
              {INSPECTORS.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-400">
              موقع التفتيش
            </span>

            <select
              className="inp w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.id} — {loc.zone}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-400">
              نوع التفتيش
            </span>

            <select
              className="inp w-full"
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
            >
              <option>تفتيش روتيني</option>
              <option>تفتيش متابعة</option>
              <option>تفتيش بسبب تنبيه</option>
              <option>تفتيش إضافي</option>
            </select>
          </label>

          <label className="space-y-1">
            <span className="text-sm text-slate-400">
              الأولوية
            </span>

            <select
              className="inp w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>منخفضة</option>
              <option>متوسطة</option>
              <option>عالية</option>
              <option>حرجة</option>
            </select>
          </label>

        </div>

        <label className="block space-y-1">
          <span className="text-sm text-slate-400">
            ملاحظات المهمة
          </span>

          <textarea
            className="inp w-full min-h-24"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="أدخل متطلبات أو ملاحظات التفتيش..."
          />
        </label>

        <button
          className="btn"
          onClick={assignTask}
        >
          <ClipboardList size={18} />
          إسناد المهمة للمفتش
        </button>
      </section>

      {/* المهام المسندة */}
      <section className="card space-y-3">

        <div className="flex items-center justify-between">
          <h2 className="font-bold">
            المهام المسندة
          </h2>

          <span className="text-sm text-slate-400">
            {assignedTasks.length} مهام جديدة
          </span>
        </div>

        {assignedTasks.length === 0 ? (
          <div className="text-sm text-slate-400 py-6 text-center">
            لم يتم إسناد مهام جديدة من هذه الواجهة.
          </div>
        ) : (
          <div className="space-y-2">
            {assignedTasks.map((task) => (
              <div
                key={task.id}
                className="border border-slate-700 rounded-xl p-3"
              >
                <div className="flex flex-wrap justify-between gap-2">

                  <div>
                    <div className="font-semibold">
                      {task.id} — {task.type}
                    </div>

                    <div className="text-sm text-slate-400 mt-1">
                      المفتش: {task.inspector}
                      {' · '}
                      الموقع: {task.location}
                    </div>
                  </div>

                  <div className="text-sm">
                    الأولوية: {task.priority}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ملخص */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="card">
          <ClipboardList className="text-cyan-400" size={20} />
          <div className="text-3xl font-bold mt-2">
            {activeTasks}
          </div>
          <div className="text-sm">
            المهام النشطة
          </div>
        </div>

        <div className="card">
          <Brain className="text-cyan-400" size={20} />
          <div className="text-3xl font-bold mt-2">
            {findings.length}
          </div>
          <div className="text-sm">
            نتائج التحليل
          </div>
        </div>

        <div className="card">
          <Camera className="text-cyan-400" size={20} />
          <div className="text-3xl font-bold mt-2">
            {findings.length}
          </div>
          <div className="text-sm">
            نتائج التصوير والمتابعة
          </div>
        </div>

        <div className="card">
          <FileText className="text-cyan-400" size={20} />
          <div className="text-3xl font-bold mt-2">
            {tasks.length}
          </div>
          <div className="text-sm">
            التقارير والمهام
          </div>
        </div>

      </section>

      {/* 2 — نتائج التحليل */}
      <section className="card space-y-3">

        <div className="flex items-center gap-2">
          <Brain className="text-cyan-400" />
          <h2 className="text-lg font-bold">
            نتائج التحليل
          </h2>
        </div>

        {findings.length === 0 ? (
          <p className="text-sm text-slate-400">
            لا توجد نتائج تحليل حالياً.
          </p>
        ) : (
          findings.slice(0, 6).map((finding: any) => (
            <div
              key={finding.id}
              className="border border-slate-700 rounded-xl p-3"
            >
              <div className="font-semibold">
                {finding.kind || 'نتيجة تحليل'}
              </div>

              <div className="text-sm text-slate-400 mt-1">
                {finding.label ||
                  finding.description ||
                  'نتيجة تحليل آلي مسجلة'}
              </div>
            </div>
          ))
        )}
      </section>

      {/* 3 — التصوير والمتابعة */}
      <section className="card space-y-3">

        <div className="flex items-center gap-2">
          <Camera className="text-cyan-400" />
          <h2 className="text-lg font-bold">
            نتائج التصوير والمتابعة
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">
              آخر متابعة
            </div>
            <div className="font-semibold mt-1">
              متابعة ميدانية
            </div>
            <div className="text-xs text-slate-500 mt-2">
              مرتبطة بآخر مهمة تفتيش
            </div>
          </div>

          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">
              حالة التصوير
            </div>
            <div className="font-semibold mt-1">
              متاحة للمراجعة
            </div>
            <div className="text-xs text-slate-500 mt-2">
              صور التفتيش المسجلة
            </div>
          </div>

          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">
              حالة المتابعة
            </div>
            <div className="font-semibold mt-1">
              قيد المتابعة
            </div>
            <div className="text-xs text-slate-500 mt-2">
              تحتاج مراجعة المدير
            </div>
          </div>

        </div>
      </section>

      {/* القرارات */}
      <section className="card">

        <div className="flex items-center gap-2">
          <CheckCircle2 className="text-cyan-400" />
          <h2 className="font-bold">
            القرارات والمتابعة
          </h2>
        </div>

        <p className="text-sm text-slate-400 mt-2">
          مراجعة نتائج المفتشين واتخاذ القرار المناسب بعد اكتمال التحليل والتصوير والمتابعة.
        </p>

      </section>

    </div>
  );
}