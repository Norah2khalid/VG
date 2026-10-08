import { useMemo, useState } from 'react';
import {
  Plane,
  Plus,
  CalendarDays,
  Clock,
  CheckCircle2,
  RotateCcw,
  History,
  Bot,
  Thermometer,
  Sparkles,
  AlertTriangle,
  Repeat,
} from 'lucide-react';

type FlightSource = 'يدوية' | 'جدولة ذكية AI' | 'مسح ذكي AI';
type Recurrence = 'أسبوعية' | 'يومية' | 'شهرية';
type DroneFlight = {
  id: string;
  drone: string;
  location: string;
  inspector: string;
  date: string;
  launchTime: string;
  returnTime: string;
  source: FlightSource;
  recurrence?: Recurrence;
  status: 'مجدولة' | 'انطلقت' | 'في المهمة' | 'عادت' | 'هبطت' | 'ملغاة';
  launchActual?: string;
  returnActual?: string;
  duration?: string;
  result?: string;
  notes?: string;
};

const DRONES = ['DRONE-01', 'DRONE-02', 'DRONE-03'];
const LOCATIONS = [
  'مصفاة رأس تنورة',
  'منطقة الخزانات',
  'منطقة المعالجة',
  'منطقة الخدمات',
];
const INSPECTORS = [
  'خالد العتيبي',
  'أحمد الشمري',
  'سارة القحطاني',
  'محمد الغامدي',
];

export default function DroneSchedule() {
  const [flights, setFlights] = useState<DroneFlight[]>([
    {
      id: 'DR-001',
      drone: 'DRONE-01',
      location: 'مصفاة رأس تنورة',
      inspector: 'خالد العتيبي',
      date: '2026-10-08',
      launchTime: '08:00',
      returnTime: '09:00',
      source: 'يدوية',
      status: 'هبطت',
      launchActual: '08:03',
      returnActual: '08:56',
      duration: '53 دقيقة',
      result: 'اكتملت المهمة بنجاح',
      notes: 'تمت تغطية منطقة التفتيش المحددة.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [drone, setDrone] = useState(DRONES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [inspector, setInspector] = useState(INSPECTORS[0]);
  const [date, setDate] = useState('');
  const [launchTime, setLaunchTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [notes, setNotes] = useState('');

  // الجدولة الذكية: يتم حفظ أول جدولة يدوية كنمط للتفتيش الدوري.
  const [smartSchedule, setSmartSchedule] = useState<{
    drone: string;
    location: string;
    inspector: string;
    date: string;
    launchTime: string;
    returnTime: string;
    recurrence: Recurrence;
  } | null>(null);
  const [smartRecurrence, setSmartRecurrence] = useState<Recurrence>('أسبوعية');
  const [smartEnabled, setSmartEnabled] = useState(false);

  // المسح الذكي: محاكاة استقبال تنبيه حراري ثم إصدار مهمة للدرون.
  const [thermalAlert, setThermalAlert] = useState(false);
  const [smartScanStatus, setSmartScanStatus] = useState<'جاهز' | 'تم إنشاء المهمة' | 'قيد المسح'>('جاهز');

  const totalLaunches = flights.filter((f) =>
    ['انطلقت', 'في المهمة', 'عادت', 'هبطت'].includes(f.status)
  ).length;
  const completedFlights = flights.filter((f) => f.status === 'هبطت').length;
  const scheduledFlights = flights.filter((f) => f.status === 'مجدولة').length;
  const activeFlights = flights.filter((f) =>
    ['انطلقت', 'في المهمة', 'عادت'].includes(f.status)
  ).length;

  const stats = useMemo(
    () => [
      { title: 'إجمالي الرحلات', value: flights.length, icon: Plane },
      { title: 'مرات الانطلاق', value: totalLaunches, icon: Plus },
      { title: 'رحلات مجدولة', value: scheduledFlights, icon: CalendarDays },
      { title: 'رحلات مكتملة', value: completedFlights, icon: CheckCircle2 },
    ],
    [flights.length, totalLaunches, scheduledFlights, completedFlights]
  );

  const addFlight = () => {
    if (!date || !launchTime || !returnTime) return;

    const newFlight: DroneFlight = {
      id: `DR-${String(flights.length + 1).padStart(3, '0')}`,
      drone,
      location,
      inspector,
      date,
      launchTime,
      returnTime,
      source: 'يدوية',
      status: 'مجدولة',
      notes,
    };

    setFlights((prev) => [newFlight, ...prev]);

    // أول جدولة يدوية تصبح أساس الجدولة الذكية الدورية.
    if (!smartSchedule) {
      setSmartSchedule({
        drone,
        location,
        inspector,
        date,
        launchTime,
        returnTime,
        recurrence: smartRecurrence,
      });
    }

    setDate('');
    setLaunchTime('');
    setReturnTime('');
    setNotes('');
    setShowForm(false);
  };

  const activateSmartSchedule = () => {
    if (!smartSchedule) return;
    setSmartEnabled(true);
  };

  const createSmartRecurringFlight = () => {
    if (!smartSchedule) return;

    const newFlight: DroneFlight = {
      id: `DR-${String(flights.length + 1).padStart(3, '0')}`,
      drone: smartSchedule.drone,
      location: smartSchedule.location,
      inspector: smartSchedule.inspector,
      date: smartSchedule.date,
      launchTime: smartSchedule.launchTime,
      returnTime: smartSchedule.returnTime,
      source: 'جدولة ذكية AI',
      recurrence: smartSchedule.recurrence,
      status: 'مجدولة',
      notes: `مهمة دورية مولدة تلقائيًا — ${smartSchedule.recurrence}`,
    };

    setFlights((prev) => [newFlight, ...prev]);
  };

  const createSmartScan = () => {
    setThermalAlert(true);
    setSmartScanStatus('تم إنشاء المهمة');

    const newFlight: DroneFlight = {
      id: `DR-${String(flights.length + 1).padStart(3, '0')}`,
      drone: DRONES[0],
      location: 'منطقة الخزانات',
      inspector: INSPECTORS[0],
      date: new Date().toISOString().slice(0, 10),
      launchTime: new Date().toTimeString().slice(0, 5),
      returnTime: '—',
      source: 'مسح ذكي AI',
      status: 'مجدولة',
      result: 'تم إنشاء مهمة استجابة لتنبيه حراري غير طبيعي',
      notes: 'أمر مسح ذكي للمنطقة المرصودة حراريًا.',
    };

    setFlights((prev) => [newFlight, ...prev]);
  };

  const updateStatus = (id: string, status: DroneFlight['status']) => {
    setFlights((prev) =>
      prev.map((flight) => {
        if (flight.id !== id) return flight;

        if (status === 'انطلقت') {
          return {
            ...flight,
            status,
            launchActual: new Date().toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }

        if (status === 'عادت') {
          return {
            ...flight,
            status,
            returnActual: new Date().toLocaleTimeString('ar-SA', {
              hour: '2-digit',
              minute: '2-digit',
            }),
          };
        }

        if (status === 'هبطت') {
          return {
            ...flight,
            status,
            result: flight.result || 'اكتملت المهمة بنجاح',
          };
        }

        return { ...flight, status };
      })
    );

    if (status === 'في المهمة') setSmartScanStatus('قيد المسح');
    if (status === 'هبطت') setSmartScanStatus('جاهز');
  };

  return (
    <div className="space-y-5">
      <section className="card">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10">
            <Plane className="text-cyan-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">جدولة الدرون</h1>
            <p className="text-sm text-slate-400 mt-1">
              إدارة الجدولة الذكية والمسح الذكي والجدولة اليدوية ومتابعة الرحلات
            </p>
          </div>
        </div>
        <div className="mt-3 text-xs text-amber-300 border border-amber-700/40 rounded-lg p-2">
          وضع المحاكاة — بيانات الدرون تجريبية وغير مرتبطة بتحكم فعلي.
        </div>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div className="card" key={stat.title}>
              <Icon className="text-cyan-400" size={20} />
              <div className="text-3xl font-bold mt-2">{stat.value}</div>
              <div className="text-sm text-slate-300">{stat.title}</div>
            </div>
          );
        })}
      </section>

      {/* 1 — الجدولة الذكية */}
      <section className="card border border-cyan-800/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Sparkles className="text-cyan-300" size={22} />
            </div>
            <div>
              <h2 className="font-bold text-lg">الجدولة الذكية AI</h2>
              <p className="text-sm text-slate-400 mt-1">
                تعتمد على أول جدولة يدوية وتكرر نمط التفتيش الدوري تلقائيًا.
              </p>
            </div>
          </div>
          <span className="text-xs border border-cyan-700/50 rounded-full px-3 py-1 text-cyan-300">
            AI
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">النمط الأساسي</div>
            <div className="font-semibold mt-1">
              {smartSchedule ? 'تم حفظ أول جدولة يدوية' : 'بانتظار أول جدولة'}
            </div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">التكرار</div>
            <select
              className="inp w-full mt-2"
              value={smartRecurrence}
              onChange={(e) => {
                const value = e.target.value as Recurrence;
                setSmartRecurrence(value);
                if (smartSchedule) {
                  setSmartSchedule({ ...smartSchedule, recurrence: value });
                }
              }}
            >
              <option>أسبوعية</option>
              <option>يومية</option>
              <option>شهرية</option>
            </select>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">حالة الذكاء</div>
            <div className={`font-semibold mt-1 ${smartEnabled ? 'text-emerald-400' : 'text-slate-300'}`}>
              {smartEnabled ? 'مفعلة' : 'غير مفعلة'}
            </div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4 flex items-end gap-2">
            <button className="btn flex-1" onClick={activateSmartSchedule} disabled={!smartSchedule}>
              تفعيل الجدولة الذكية
            </button>
            <button className="btn2" onClick={createSmartRecurringFlight} disabled={!smartEnabled}>
              إنشاء الرحلة القادمة
            </button>
          </div>
        </div>

        {smartSchedule && (
          <div className="mt-4 border border-cyan-900/50 rounded-xl p-4 text-sm">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div><span className="text-slate-500">الدرون</span><div>{smartSchedule.drone}</div></div>
              <div><span className="text-slate-500">الموقع</span><div>{smartSchedule.location}</div></div>
              <div><span className="text-slate-500">المفتش</span><div>{smartSchedule.inspector}</div></div>
              <div><span className="text-slate-500">وقت الإقلاع</span><div dir="ltr">{smartSchedule.launchTime}</div></div>
              <div><span className="text-slate-500">النمط</span><div>{smartSchedule.recurrence}</div></div>
            </div>
          </div>
        )}
      </section>

      {/* 2 — المسح الذكي */}
      <section className="card border border-amber-800/60">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Thermometer className="text-amber-300" size={22} />
            </div>
            <div>
              <h2 className="font-bold text-lg">المسح الذكي AI</h2>
              <p className="text-sm text-slate-400 mt-1">
                عند وصول تنبيه حرارة غير طبيعية، تنشئ المنصة أمر مسح للدرون تلقائيًا.
              </p>
            </div>
          </div>
          <span className="text-xs border border-amber-700/50 rounded-full px-3 py-1 text-amber-300">
            استجابة تلقائية
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">مصدر المهمة</div>
            <div className="font-semibold mt-1">تنبيه حراري</div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">المنطقة</div>
            <div className="font-semibold mt-1">منطقة الخزانات</div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-xs text-slate-500">حالة المسح</div>
            <div className="font-semibold mt-1 text-cyan-300">{smartScanStatus}</div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4 flex items-end">
            <button className="btn w-full flex items-center justify-center gap-2" onClick={createSmartScan}>
              <Bot size={17} /> محاكاة تنبيه حراري وإنشاء مسح
            </button>
          </div>
        </div>

        {thermalAlert && (
          <div className="mt-4 flex items-start gap-3 border border-amber-700/50 bg-amber-500/5 rounded-xl p-4">
            <AlertTriangle className="text-amber-300 mt-0.5" size={20} />
            <div className="text-sm">
              <div className="font-semibold text-amber-200">تم رصد حرارة غير طبيعية</div>
              <div className="text-slate-400 mt-1">
                تم إنشاء مهمة مسح ذكي للدرون وربطها بمنطقة الخزانات.
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3 — الجدولة العادية */}
      <section className="card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-lg">الجدولة العادية</h2>
            <p className="text-sm text-slate-400 mt-1">
              إنشاء مهمة يدوية يحدد فيها موظف العمليات جميع تفاصيل الرحلة.
            </p>
          </div>
          <button className="btn flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> جدولة رحلة
          </button>
        </div>

        {showForm && (
          <div className="mt-5 border-t border-cyan-900/40 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <label className="text-sm">
                الدرون
                <select className="inp w-full mt-1" value={drone} onChange={(e) => setDrone(e.target.value)}>
                  {DRONES.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm">
                موقع المهمة
                <select className="inp w-full mt-1" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {LOCATIONS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm">
                المفتش
                <select className="inp w-full mt-1" value={inspector} onChange={(e) => setInspector(e.target.value)}>
                  {INSPECTORS.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label className="text-sm">
                تاريخ الرحلة
                <input type="date" dir="ltr" className="inp w-full mt-1" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>
              <label className="text-sm">
                وقت الانطلاق
                <input type="time" dir="ltr" className="inp w-full mt-1" value={launchTime} onChange={(e) => setLaunchTime(e.target.value)} />
              </label>
              <label className="text-sm">
                وقت العودة المتوقع
                <input type="time" dir="ltr" className="inp w-full mt-1" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
              </label>
            </div>

            <label className="text-sm block">
              ملاحظات الرحلة
              <textarea
                className="inp w-full mt-1 min-h-20"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ملاحظات أو متطلبات المهمة..."
              />
            </label>

            <div className="flex gap-2">
              <button className="btn" onClick={addFlight}>حفظ الجدولة</button>
              <button className="btn2" onClick={() => setShowForm(false)}>إلغاء</button>
            </div>
          </div>
        )}
      </section>

      {/* سجل الرحلات */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2">
          <History className="text-cyan-400" />
          <h2 className="font-bold text-lg">سجل رحلات الدرون</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th>الرحلة</th>
                <th>المصدر</th>
                <th>الدرون</th>
                <th>الموقع</th>
                <th>التاريخ</th>
                <th>الانطلاق</th>
                <th>العودة</th>
                <th>الحالة</th>
                <th>الإجراء</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.id}</td>
                  <td>
                    <span className={flight.source === 'يدوية' ? 'text-slate-300' : 'text-cyan-300'}>
                      {flight.source}
                    </span>
                  </td>
                  <td>{flight.drone}</td>
                  <td>{flight.location}</td>
                  <td dir="ltr">{flight.date}</td>
                  <td dir="ltr">{flight.launchTime}</td>
                  <td dir="ltr">{flight.returnTime}</td>
                  <td><span className="text-cyan-300">{flight.status}</span></td>
                  <td>
                    {flight.status === 'مجدولة' && (
                      <button className="btn2" onClick={() => updateStatus(flight.id, 'انطلقت')}>إطلاق</button>
                    )}
                    {flight.status === 'انطلقت' && (
                      <button className="btn2" onClick={() => updateStatus(flight.id, 'في المهمة')}>بدء المهمة</button>
                    )}
                    {flight.status === 'في المهمة' && (
                      <button className="btn2" onClick={() => updateStatus(flight.id, 'عادت')}>تسجيل العودة</button>
                    )}
                    {flight.status === 'عادت' && (
                      <button className="btn2" onClick={() => updateStatus(flight.id, 'هبطت')}>تسجيل الهبوط</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* تقرير الرحلات */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2">
          <RotateCcw className="text-cyan-400" />
          <h2 className="font-bold text-lg">تقرير عمل الإطلاق والعودة</h2>
        </div>

        {flights.map((flight) => (
          <div key={flight.id} className="border border-slate-700 rounded-xl p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="font-bold">{flight.id} — {flight.drone}</div>
                <div className="text-sm text-slate-400 mt-1">
                  {flight.location} · {flight.source}
                </div>
              </div>
              <div className="text-sm text-cyan-300">{flight.status}</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div><div className="text-slate-500">وقت الإطلاق</div><div>{flight.launchActual || 'لم يتم الإطلاق'}</div></div>
              <div><div className="text-slate-500">وقت العودة</div><div>{flight.returnActual || 'لم تتم العودة'}</div></div>
              <div><div className="text-slate-500">مدة الرحلة</div><div>{flight.duration || 'غير محسوبة'}</div></div>
              <div><div className="text-slate-500">نتيجة المهمة</div><div>{flight.result || 'قيد المتابعة'}</div></div>
            </div>
            {flight.recurrence && (
              <div className="text-sm text-cyan-300 mt-3 flex items-center gap-2">
                <Repeat size={15} /> تكرار: {flight.recurrence}
              </div>
            )}
            {flight.notes && (
              <div className="text-sm text-slate-400 mt-3 border-t border-slate-700 pt-3">
                الملاحظات: {flight.notes}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* حالة التشغيل */}
      <section className="card">
        <div className="flex items-center gap-2">
          <Clock className="text-cyan-400" />
          <h2 className="font-bold">ملخص التشغيل</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">الرحلات النشطة</div>
            <div className="text-2xl font-bold mt-1">{activeFlights}</div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">إجمالي مرات الإطلاق</div>
            <div className="text-2xl font-bold mt-1">{totalLaunches}</div>
          </div>
          <div className="border border-slate-700 rounded-xl p-4">
            <div className="text-sm text-slate-400">الرحلات المكتملة</div>
            <div className="text-2xl font-bold mt-1">{completedFlights}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
