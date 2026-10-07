import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ManagerDashboard from './ManagerDashboard';
import {
  MapPin,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ZoomIn,
  ZoomOut,
  Upload,
  Bot,
} from 'lucide-react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

import {
  LOCATIONS,
  DEVICES,
  RISK_TREND,
} from '../data/demoData';

import { useApp } from '../store';

import {
  RiskBadge,
  Sim,
  Tag,
} from '../components/ui/Badge';

import {
  RISK_AR,
  RISK_ORDER,
} from '../utils/risk';

import { aiService } from '../services/ai/aiService';

import type { InspectionLocation } from '../types';

const MC = {
  NORMAL: 'bg-emerald-500',
  WARNING: 'bg-amber-400',
  CRITICAL: 'bg-red-500 animate-pulse',
  INSPECTED: 'bg-cyan-400',
};

const ML = {
  NORMAL: 'طبيعي',
  WARNING: 'تحذير',
  CRITICAL: 'حرج',
  INSPECTED: 'تم التفتيش',
};

const PIE = [
  '#34d399',
  '#fbbf24',
  '#fb923c',
  '#f87171',
];

const ACTIONS = [
  'اعتماد',
  'رفض',
  'طلب فحص إضافي',
  'تحويل للصيانة',
  'إضافة ملاحظة',
];

export default function Dashboard() {
  const {
    role,
    tasks,
    findings,
    addFinding,
    decisions,
    review,
    notify,
  } = useApp();

  const [q, setQ] = useState('');
  const [rf, setRf] = useState('');
  const [sf, setSf] = useState('');
  const [zoom, setZoom] = useState(1);

  const [sel, setSel] =
    useState<InspectionLocation | null>(null);

  const [imgs, setImgs] = useState([
    'IMG-T04-A',
    'IMG-T04-B',
    'IMG-T04-C',
  ]);

  const [pv, setPv] = useState(1);
  const [cmp, setCmp] = useState(false);

  const [fid, setFid] = useState(findings[0]?.id);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const locs = useMemo(
    () =>
      LOCATIONS.filter(
        (l) =>
          (!rf || l.risk === rf) &&
          (!sf || l.state === sf) &&
          (!q ||
            (
              l.equipment +
              l.zone +
              l.id
            )
              .toLowerCase()
              .includes(q.toLowerCase()))
      ),
    [q, rf, sf]
  );

  const active = tasks.filter((t) =>
    [
      'جديدة',
      'مجدولة',
      'قيد التنفيذ',
    ].includes(t.status)
  ).length;

  const alerts = LOCATIONS.filter(
    (l) =>
      l.risk === 'critical' ||
      l.risk === 'high'
  ).length;

  const kpi = [
    {
      l: 'إجمالي مواقع التفتيش',
      v: LOCATIONS.length,
      i: MapPin,
      s: '+2 هذا الشهر',
      to: '/tasks?tab=locations',
    },
    {
      l: 'المهام النشطة',
      v: active,
      i: ListChecks,
      s: 'تتطلب متابعة',
      to: '/tasks?filter=active',
    },
    {
      l: 'عمليات التفتيش المكتملة',
      v:
        tasks.filter(
          (t) => t.status === 'مكتملة'
        ).length + 14,
      i: CheckCircle2,
      s: 'ثابت',
      to: '/history',
    },
    {
      l: 'التنبيهات والمخاطر',
      v: alerts,
      i: AlertTriangle,
      s: 'حالات مرتفعة وحرجة',
      to: '/tasks?tab=locations',
    },
    {
      l: 'الأجهزة والدرون',
      v: DEVICES.length,
      i: Radio,
      s: 'محاكاة (SIMULATION)',
      to: '/',
    },
  ];

  const dist = RISK_ORDER.map(
    (r, i) => ({
      name: RISK_AR[r],
      value: LOCATIONS.filter(
        (l) => l.risk === r
      ).length,
      c: PIE[i],
    })
  );

  if (role === 'manager') {
  return <ManagerDashboard />;
}



  const cat = Object.entries(
    findings.reduce<Record<string, number>>(
      (a, f) => ({
        ...a,
        [f.kind]:
          (a[f.kind] || 0) + 1,
      }),
      {}
    )
  ).map(([k, v]) => ({
    k: k.slice(0, 10),
    v,
  }));

  const f = findings.find(
    (x) => x.id === fid
  );

  const canReview =
    role !== 'collector';

  const run = async () => {
    setBusy(true);

    try {
      const r =
        await aiService.analyze(
          imgs[pv],
          'T-04',
          'مجمع الواحة للتخزين'
        );

      addFinding(r);
      setFid(r.id);
      notify(
        'تم إنتاج نتيجة تحليل تجريبي'
      );
    } catch {
      notify('فشل التحليل');
    }

    setBusy(false);
  };

  return (
    <>
      {role === 'inspector' && (
        <div className="card text-sm border-cyan-600">
          منظور المفتش: لديك{' '}
          {
            tasks.filter(
              (t) =>
                t.inspector ===
                  'خالد العتيبي' &&
                t.status !== 'مكتملة'
            ).length
          }{' '}
          مهام مسندة. ابدأ من{' '}
          <Link
            className="text-cyan-300 underline"
            to="/tasks"
          >
            المهام ومواقع التفتيش
          </Link>
          .
        </div>
      )}

      {/* KPIs */}
      <section
        aria-label="ملخص تشغيلي"
        className="grid grid-cols-2 lg:grid-cols-5 gap-3"
      >
        {kpi.map((k) => (
          <Link
            key={k.l}
            to={k.to}
            className="card hover:border-cyan-500"
          >
            <k.i
              className="text-cyan-400"
              size={20}
            />

            <div className="text-3xl font-bold mt-1">
              {k.v}
            </div>

            <div className="text-sm">
              {k.l}
            </div>

            <div className="text-xs text-slate-400">
              {k.s}
            </div>
          </Link>
        ))}
      </section>

      {/* MAP */}
      <section className="card space-y-3">
        <div className="flex flex-wrap gap-2 items-center">
          <h2 className="font-bold text-lg">
            منصة الخريطة الجوية
          </h2>

          <Sim>
            محاكاة الموقع
          </Sim>

          <input
            className="inp ms-auto"
            placeholder="بحث بالمعدة أو المنطقة"
            aria-label="بحث"
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
          />

          <div
  className="inp flex items-center"
  aria-label="المنشأة"
>
  مصفاة رأس تنورة
</div>

          <button
            className="btn2"
            aria-label="تكبير"
            onClick={() =>
              setZoom(
                Math.min(
                  2,
                  zoom + 0.25
                )
              )
            }
          >
            <ZoomIn size={16} />
          </button>

          <button
            className="btn2"
            aria-label="تصغير"
            onClick={() =>
              setZoom(
                Math.max(
                  1,
                  zoom - 0.25
                )
              )
            }
          >
            <ZoomOut size={16} />
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-3">

          {/* Industrial Map */}
          <div className="lg:col-span-3 relative h-[520px] overflow-hidden rounded-xl border border-cyan-800 bg-slate-950">

            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: `scale(${zoom})`,
                backgroundColor:
                  '#172033',
                backgroundImage: `
                  linear-gradient(
                    rgba(34,211,238,.08) 1px,
                    transparent 1px
                  ),
                  linear-gradient(
                    90deg,
                    rgba(34,211,238,.08) 1px,
                    transparent 1px
                  )
                `,
                backgroundSize:
                  '40px 40px',
              }}
            >

              <div className="absolute inset-8">

                {/* Tanks */}
                <div className="absolute left-[8%] top-[12%] grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map(
                    (x) => (
                      <div
                        key={x}
                        className="w-16 h-16 rounded-full border-2 border-slate-400/70 bg-slate-600/50 shadow-inner"
                        title={`خزان ${x}`}
                      />
                    )
                  )}
                </div>

                {/* Pipe Rack */}
                <div className="absolute left-[42%] top-[15%] w-[42%] h-28 border border-cyan-700/60 rounded bg-cyan-950/30">

                  <div className="absolute top-5 left-4 right-4 h-2 bg-slate-500 rounded" />

                  <div className="absolute top-12 left-8 right-10 h-2 bg-slate-400 rounded" />

                  <div className="absolute top-20 left-3 right-16 h-2 bg-slate-600 rounded" />

                  <div className="absolute inset-0 flex items-center justify-center text-xs text-cyan-300">
                    PIPE RACK — منطقة المعدات
                  </div>
                </div>

                {/* Processing Unit */}
                <div className="absolute left-[18%] top-[52%] w-[55%] h-36 border border-slate-500 rounded bg-slate-800/70">

                  <div className="absolute left-8 top-8 w-10 h-20 bg-slate-500 rounded-t-full" />

                  <div className="absolute left-24 top-5 w-8 h-28 bg-slate-400 rounded" />

                  <div className="absolute left-40 top-12 w-14 h-16 bg-slate-600 rounded" />

                  <div className="absolute right-10 top-6 w-12 h-24 bg-slate-500 rounded-t-full" />

                  <div className="absolute bottom-2 left-3 text-xs text-slate-300">
                    PROCESS UNIT — منطقة المعالجة
                  </div>
                </div>

                {/* Road */}
                <div className="absolute left-0 right-0 top-[82%] h-10 bg-slate-700/80 border-y border-slate-500/40">

                  <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 tracking-widest">
                    INDUSTRIAL ACCESS ROAD
                  </div>
                </div>

                {/* Equipment */}
                {locs.map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      setSel(l)
                    }
                    aria-label={`${l.equipment} ${ML[l.state]}`}
                    style={{
                      left: `${l.x}%`,
                      top: `${l.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                  >
                    <span
                      className={`
                        block w-5 h-5 rounded-full
                        border-2 border-white shadow-lg
                        ${MC[l.state]}
                      `}
                    />

                    <span className="mt-1 block whitespace-nowrap text-[10px] bg-slate-950/90 px-2 py-1 rounded border border-cyan-900">
                      {l.equipment}
                    </span>
                  </button>
                ))}

                {/* Drone */}
                <div className="absolute left-[65%] top-[38%] z-30 -translate-x-1/2 -translate-y-1/2">

                  <div className="relative">

                    <div className="absolute -inset-5 rounded-full border border-cyan-400/30 animate-ping" />

                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Radio
                        size={22}
                        className="text-cyan-300"
                      />
                    </div>

                    <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-950/95 border border-cyan-700 px-2 py-1 text-[10px] text-cyan-300">
                      DRONE CAM-01
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Map Header */}
            <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">

              <div className="bg-slate-950/90 border border-cyan-800 rounded-lg px-3 py-2 text-xs">
                <div className="text-cyan-300 font-semibold">
                  INDUSTRIAL SITE VIEW
                </div>

                <div className="text-slate-400">
                  وضع المحاكاة — بيانات غير تشغيلية
                </div>
              </div>

              <div className="bg-slate-950/90 border border-cyan-800 rounded-lg px-3 py-2 text-xs">
                <div className="text-emerald-400">
                  ● النظام يعمل
                </div>

                <div className="text-slate-400">
                  CAM-01 · LIVE SIM
                </div>
              </div>

            </div>

            {/* Drone Information */}
            <div className="absolute bottom-3 left-3 bg-slate-950/95 border border-cyan-800 rounded-lg p-3 text-xs w-48">

              <div className="font-semibold text-cyan-300 mb-2">
                بيانات الدرون
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  الكاميرا
                </span>

                <span>
                  CAM-01
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  الارتفاع
                </span>

                <span>
                  85 m
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  الاتجاه
                </span>

                <span>
                  142°
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">
                  الوضع
                </span>

                <span className="text-emerald-400">
                  محاكاة
                </span>
              </div>

            </div>
          </div>

          {/* Details */}
          <div className="card text-sm h-fit">

            <div className="flex items-center gap-2 mb-3">
              <MapPin
                size={18}
                className="text-cyan-400"
              />

              <h3 className="font-bold">
                تفاصيل المنطقة
              </h3>
            </div>

            {sel ? (
              <div className="space-y-2">

                <div className="text-lg font-bold">
                  {sel.equipment}
                </div>

                <Tag>
                  {sel.equipmentType}
                </Tag>

                <div>
                  المنشأة:
                  <span className="text-slate-300 ms-1">
                    {sel.facility}
                  </span>
                </div>

                <div>
                  المنطقة:
                  <span className="text-slate-300 ms-1">
                    {sel.zone}
                  </span>
                </div>

                <div>
                  الحالة:
                  <span className="ms-1">
                    {ML[sel.state]}
                  </span>
                </div>

                <div>
                  آخر تفتيش:
                  <span className="text-slate-300 ms-1">
                    {sel.last}
                  </span>
                </div>

                <div>
                  الخطورة:
                  <span className="ms-1">
                    <RiskBadge
                      risk={sel.risk}
                    />
                  </span>
                </div>

                <div className="border-t border-cyan-900/40 pt-2 mt-2">

                  <div className="text-slate-400 text-xs">
                    آخر ملاحظة
                  </div>

                  <div className="mt-1">
                    {sel.note}
                  </div>
                </div>

                <button
                  className="btn2 w-full mt-3"
                  onClick={() =>
                    notify(
                      `تم تحديد ${sel.equipment} للتفتيش`
                    )
                  }
                >
                  بدء فحص المنطقة
                </button>

              </div>
            ) : (
              <div className="text-slate-400 space-y-3">

                <p>
                  اختر معدة من المشهد لعرض بياناتها.
                </p>

                <div className="text-xs border-t border-cyan-900/40 pt-3">
                  يمكنك تكبير المشهد واختيار مناطق المعدات
                  لمتابعة عملية التفتيش التجريبية.
                </div>

              </div>
            )}

          </div>
        </div>
      </section>

      {/* Imaging */}
      <section className="card space-y-3">

        <div className="flex gap-2 items-center">
          <h2 className="font-bold">
            التصوير والمتابعة
          </h2>

          <Sim>
            بيانات تصوير تجريبية
          </Sim>
        </div>

        <div className="grid md:grid-cols-3 gap-3">

          <div className="md:col-span-2">

            {cmp ? (
              <div className="grid grid-cols-2 gap-2">

                {[imgs[0], imgs[pv]].map(
                  (x, i) => (
                    <div
                      key={i}
                      className="h-48 rounded bg-gradient-to-br from-slate-700 to-cyan-900 grid place-items-center text-sm"
                    >
                      {i ? 'بعد' : 'قبل'}: {x}
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="h-48 rounded bg-gradient-to-br from-slate-700 to-cyan-900 grid place-items-center overflow-hidden">

                <span
                  style={{
                    transform:
                      'scale(1.3)',
                  }}
                >
                  {imgs[pv]} (معاينة)
                </span>

              </div>
            )}

            <div className="text-xs text-slate-400 mt-1">
              معرف المعدة: T-04 · رقم التفتيش:
              INS-2041 · 2026-10-02 09:14
            </div>

          </div>

          <div className="space-y-2">

            <div className="grid grid-cols-3 gap-1">

              {imgs.map((x, i) => (
                <button
                  key={x + i}
                  onClick={() =>
                    setPv(i)
                  }
                  className={`h-14 rounded text-[10px] bg-navy-700 border ${
                    pv === i
                      ? 'border-cyan-400'
                      : 'border-transparent'
                  }`}
                >
                  {x}
                </button>
              ))}

            </div>

            <button
              className="btn2 w-full"
              onClick={() =>
                setCmp(!cmp)
              }
            >
              {cmp
                ? 'عرض صورة واحدة'
                : 'مقارنة قبل/بعد'}
            </button>

            <label className="btn2 w-full flex gap-1 justify-center cursor-pointer">

              <Upload size={14} />

              رفع صورة وإرفاقها بالتفتيش

              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const n =
                    e.target.files?.[0]
                      ?.name;

                  if (n) {
                    setImgs([
                      ...imgs,
                      n,
                    ]);

                    notify(
                      'تم إرفاق الصورة بالتفتيش INS-2041'
                    );
                  }
                }}
              />

            </label>

          </div>
        </div>
      </section>

      {/* AI */}
      <section className="space-y-3">

        <div className="flex gap-2 items-center">

          <h2 className="font-bold text-lg">
            تحليل الذكاء الاصطناعي
          </h2>

          <Sim>
            تحليل تجريبي
          </Sim>

          <button
            className="btn ms-auto flex gap-1 items-center"
            disabled={busy}
            onClick={run}
          >
            <Bot size={14} />

            {busy
              ? 'جارٍ التحليل...'
              : 'تحليل الصورة المحددة'}
          </button>

        </div>

        <div className="grid lg:grid-cols-2 gap-3">

          <div className="card overflow-x-auto">

            <h3 className="font-semibold mb-2">
              الكشف
            </h3>

            <table className="w-full text-sm">

              <thead>
                <tr>
                  <th>الحالة</th>
                  <th>النوع</th>
                  <th>المعدة</th>
                  <th>الخطورة</th>
                  <th>الثقة</th>
                  <th>الوقت</th>
                  <th>الوضع</th>
                </tr>
              </thead>

              <tbody>
                {findings.map((x) => (
                  <tr
                    key={x.id}
                    onClick={() =>
                      setFid(x.id)
                    }
                    className={`cursor-pointer ${
                      x.id === fid
                        ? 'bg-cyan-900/30'
                        : ''
                    }`}
                  >
                    <td>{x.id}</td>
                    <td>{x.kind}</td>
                    <td>{x.equipment}</td>
                    <td>
                      <RiskBadge
                        risk={x.risk}
                      />
                    </td>
                    <td>
                      {x.confidence}%
                    </td>
                    <td className="text-xs">
                      {x.time}
                    </td>
                    <td className="text-xs">
                      {x.status}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>

          <div className="card">

            <h3 className="font-semibold mb-2">
              التنبؤ بالمخاطر{' '}
              <span className="text-xs text-slate-400">
                (اتجاه مؤشر الخطورة)
              </span>
            </h3>

            <ResponsiveContainer
              width="100%"
              height={180}
            >
              <LineChart
                data={RISK_TREND}
              >
                <XAxis
                  dataKey="m"
                  stroke="#94a3b8"
                />

                <YAxis
                  stroke="#94a3b8"
                />

                <Tooltip />

                <Line
                  dataKey="v"
                  stroke="#22d3ee"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          <div className="card">

            <h3 className="font-semibold mb-2">
              نتائج التحليل
            </h3>

            <div className="grid grid-cols-2 gap-2">

              <ResponsiveContainer
                width="100%"
                height={150}
              >
                <PieChart>

                  <Pie
                    data={dist}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={55}
                  >
                    {dist.map((d) => (
                      <Cell
                        key={d.name}
                        fill={d.c}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                </PieChart>
              </ResponsiveContainer>

              <ResponsiveContainer
                width="100%"
                height={150}
              >
                <BarChart
                  data={cat}
                >
                  <XAxis
                    dataKey="k"
                    hide
                  />

                  <YAxis
                    stroke="#94a3b8"
                    allowDecimals={false}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="v"
                    fill="#22d3ee"
                  />
                </BarChart>
              </ResponsiveContainer>

            </div>

            <div className="text-xs text-slate-400">
              توزيع الخطورة (يسار) · الحالات حسب الفئة.
              أولوية التفتيش: PIPE-12 ثم T-04 ثم VLV-07.
            </div>

          </div>

          <div className="grid gap-3">

           <div className="card border-amber-700 space-y-3">
  <div className="flex items-center gap-2">
    <Bot size={18} className="text-cyan-300" />

    <h3 className="font-semibold">
      اتخاذ القرارات من خلال الذكاء الاصطناعي
    </h3>

    <Sim>تجريبي</Sim>
  </div>

  {f ? (
    <>
      <div className="grid grid-cols-2 gap-2 text-sm">

        <div className="bg-navy-900 rounded p-3">
          <div className="text-xs text-slate-400">
            الحالة المكتشفة
          </div>
          <div className="font-semibold mt-1">
            {f.kind}
          </div>
        </div>

        <div className="bg-navy-900 rounded p-3">
          <div className="text-xs text-slate-400">
            مستوى الخطورة
          </div>
          <div className="mt-1">
            <RiskBadge risk={f.risk} />
          </div>
        </div>

        <div className="bg-navy-900 rounded p-3">
          <div className="text-xs text-slate-400">
            درجة ثقة الذكاء الاصطناعي
          </div>
          <div className="font-semibold text-cyan-300 mt-1">
            {f.confidence}%
          </div>
        </div>

        <div className="bg-navy-900 rounded p-3">
          <div className="text-xs text-slate-400">
            القرار المقترح
          </div>

          <div className="font-semibold text-amber-300 mt-1">
            {f.risk === 'critical' || f.risk === 'high'
              ? 'طلب فحص إضافي'
              : f.risk === 'medium'
              ? 'إعادة التفتيش والمتابعة'
              : 'اعتماد'}
          </div>
        </div>

      </div>

      <div className="border-t border-cyan-900/40 pt-3">
        <div className="text-xs text-slate-400 mb-1">
          توصية الذكاء الاصطناعي
        </div>

        <p className="text-sm leading-6">
          بناءً على نتيجة تحليل الصورة ومستوى الخطورة ودرجة
          الثقة، يقترح النظام الإجراء المناسب للمفتش للمراجعة
          والاعتماد.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">

        <button
          className="btn"
          onClick={() => {
            const decision =
              f.risk === 'critical' || f.risk === 'high'
                ? 'طلب فحص إضافي'
                : f.risk === 'medium'
                ? 'إعادة التفتيش والمتابعة'
                : 'اعتماد';

            review(
              f.id,
              decision,
              'قرار مقترح من الذكاء الاصطناعي'
            );

            notify('تم تسجيل القرار المقترح');
          }}
        >
          اعتماد القرار المقترح
        </button>

        <button
          className="btn2"
          onClick={() =>
            notify('تم رفض القرار المقترح')
          }
        >
          رفض القرار
        </button>

        <button
          className="btn2"
          onClick={() =>
            notify('تم طلب فحص إضافي')
          }
        >
          فحص إضافي
        </button>

      </div>

      <div className="text-xs text-amber-300 border-t border-amber-900/40 pt-2">
        القرار المقترح مساعد للمفتش فقط، والاعتماد النهائي بيد المفتش.
      </div>
    </>
  ) : (
    <p className="text-slate-400 text-sm">
      شغّل تحليل الصورة أولًا لإظهار القرار المقترح.
    </p>
  )}
</div>

            <div className="card border-emerald-700">

              <h3 className="font-semibold mb-2">
                المراجعة البشرية (القرار البشري)
              </h3>

              {canReview && f ? (
                <>
                  <input
                    className="inp w-full mb-2"
                    placeholder="ملاحظات المراجع"
                    aria-label="ملاحظات المراجع"
                    value={note}
                    onChange={(e) =>
                      setNote(e.target.value)
                    }
                  />

                  <div className="flex flex-wrap gap-1">

                    {ACTIONS.map((a) => (
                      <button
                        key={a}
                        className="btn2"
                        onClick={() => {
                          if (
                            a ===
                              'إضافة ملاحظة' &&
                            !note.trim()
                          ) {
                            notify(
                              'اكتب الملاحظة أولاً'
                            );
                            return;
                          }

                          review(
                            f.id,
                            a,
                            note
                          );

                          setNote('');
                        }}
                      >
                        {a}
                      </button>
                    ))}

                  </div>
                </>
              ) : (
                <p className="text-xs text-slate-400">
                  غير متاح لهذا الدور.
                </p>
              )}

              <ul className="mt-2 text-xs space-y-1">

                {decisions
                  .filter(
                    (d) =>
                      d.findingId === fid
                  )
                  .map((d, i) => (
                    <li
                      key={i}
                      className="border-t border-cyan-900/30 pt-1"
                    >
                      {d.decision} —{' '}
                      {d.reviewer} —{' '}
                      {d.time}
                      {d.note &&
                        ` — ${d.note}`}
                    </li>
                  ))}

              </ul>

            </div>

          </div>
        </div>
      </section>
    </>
  );
}