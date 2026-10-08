import { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Gauge,
  MessageSquarePlus,
  Radio,
  ScanSearch,
  Send,
  Thermometer,
  Wrench,
} from 'lucide-react';
import { useApp } from '../store';

export default function Inspection() {
  const { notify } = useApp();

  const [guided, setGuided] = useState(false);
  const [decision, setDecision] = useState('');
  const [note, setNote] = useState('');

  const handleGuide = () => {
    setGuided(true);
    notify('تم إرسال توجيه الفحص إلى النظارة');
  };

  const handleDecision = (value: string) => {
    setDecision(value);
    notify(`تم تسجيل القرار: ${value}`);
  };

  const handleNote = () => {
    if (!note.trim()) {
      notify('اكتب الملاحظة أولاً');
      return;
    }

    notify('تمت إضافة الملاحظة');
    setNote('');
  };

  return (
    <div className="space-y-5" dir="rtl">

      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ScanSearch size={24} />
            <h1 className="text-2xl font-bold">التفتيش الميداني</h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            RealWear — تنفيذ ومتابعة الفحص الميداني
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <Radio size={17} />
          <span>النظام متصل</span>
        </div>
      </div>

      {/* Device Status */}
      <div className="grid gap-4 md:grid-cols-2">

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <Radio size={21} />
              </div>

              <div>
                <div className="font-semibold">RealWear</div>
                <div className="text-sm text-slate-500">
                  نظارة التفتيش الميداني
                </div>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              متصلة
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <Camera size={21} />
              </div>

              <div>
                <div className="font-semibold">
                  Thermal Imaging Sensor / IR Camera
                </div>

                <div className="text-sm text-slate-500">
                  الكاميرا الحرارية
                </div>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              جاهزة
            </span>
          </div>
        </div>

      </div>

      {/* Thermal Inspection */}
      <div className="grid gap-5 xl:grid-cols-2">

        {/* Thermal Image */}
        <div className="card overflow-hidden">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold">الصورة الحرارية</h2>

              <p className="text-sm text-slate-500">
                العرض الحراري من الكاميرا
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs">
              <Camera size={15} />
              IR
            </div>
          </div>

          <div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-red-900 to-orange-500">

            <div className="absolute inset-0 opacity-30">
              <div className="absolute left-[18%] top-[22%] h-28 w-28 rounded-full bg-yellow-300 blur-3xl" />
              <div className="absolute right-[20%] top-[35%] h-36 w-36 rounded-full bg-red-500 blur-3xl" />
              <div className="absolute bottom-[15%] left-[40%] h-24 w-24 rounded-full bg-orange-300 blur-3xl" />
            </div>

            <div className="relative z-10 text-center text-white">
              <Thermometer size={46} className="mx-auto mb-3" />

              <div className="text-lg font-semibold">
                Hot Spot Detected
              </div>

              <div className="mt-1 text-sm opacity-90">
                نقطة حرارة غير طبيعية
              </div>
            </div>

            <div className="absolute bottom-4 left-4 rounded-lg bg-black/50 px-3 py-2 text-xs text-white">
              Pump P-04
            </div>

            <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-2 text-xs text-white">
              78.4°C
            </div>

          </div>
        </div>

        {/* Measurements */}
        <div className="card">

          <div className="mb-4">
            <h2 className="font-bold">قراءات الفحص</h2>

            <p className="text-sm text-slate-500">
              القراءات الحالية من الكاميرا الحرارية
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">

            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Thermometer size={16} />
                درجة الحرارة الحالية
              </div>

              <div className="text-2xl font-bold">
                78.4°C
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Gauge size={16} />
                أعلى قراءة
              </div>

              <div className="text-2xl font-bold">
                91.2°C
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <Thermometer size={16} />
                أقل قراءة
              </div>

              <div className="text-2xl font-bold">
                64.7°C
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <ScanSearch size={16} />
                نقطة القياس
              </div>

              <div className="text-lg font-bold">
                Pump P-04
              </div>
            </div>

          </div>

          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 font-semibold text-red-700">
              <Thermometer size={18} />
              Hot Spot
            </div>

            <div className="mt-1 text-sm text-red-600">
              تم رصد نقطة حرارة تحتاج إلى فحص إضافي.
            </div>
          </div>

          <button
            type="button"
            onClick={handleGuide}
            className="btn btn-primary mt-4 w-full"
          >
            <Send size={17} />

            {guided
              ? 'تم توجيه النظارة للفحص'
              : 'توجيه النظارة للفحص'}
          </button>

        </div>

      </div>

      {/* AI Analysis */}
      <div className="card">

        <div className="mb-4">
          <h2 className="font-bold">
            تحليل الذكاء الاصطناعي
          </h2>

          <p className="text-sm text-slate-500">
            تحليل آلي للقراءات الحرارية — بيانات افتراضية
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-4">

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-500">
              القراءة الحالية
            </div>

            <div className="mt-2 text-2xl font-bold">
              78.4°C
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-500">
              الحد الطبيعي
            </div>

            <div className="mt-2 text-2xl font-bold">
              70°C
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-500">
              الفرق عن الحد
            </div>

            <div className="mt-2 text-2xl font-bold text-red-600">
              +8.4°C
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="text-sm text-slate-500">
              ثقة التحليل
            </div>

            <div className="mt-2 text-2xl font-bold">
              94%
            </div>
          </div>

        </div>

        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">

          <div className="text-sm font-medium text-red-600">
            مستوى الخطورة
          </div>

          <div className="mt-1 text-xl font-bold text-red-700">
            مرتفع
          </div>

        </div>

        <div className="mt-4 rounded-xl border p-4">

          <div className="font-semibold">
            قرار AI
          </div>

          <div className="mt-2 text-lg font-bold text-red-700">
            حرارة غير طبيعية — يوصى بفحص إضافي
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            تم اكتشاف ارتفاع في درجة الحرارة يتجاوز الحد الطبيعي،
            مع وجود Hot Spot في نقطة القياس Pump P-04.
            بناءً على القراءات الافتراضية، يوصي النظام بإجراء
            فحص إضافي.
          </p>

        </div>

      </div>

      {/* Inspector Decision */}
      <div className="card">

        <div className="mb-4">
          <h2 className="font-bold">
            قرار المفتش
          </h2>

          <p className="text-sm text-slate-500">
            القرار النهائي يعتمد على المفتش بعد مراجعة الحالة.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

          <button
            type="button"
            onClick={() => handleDecision('اعتماد الحالة')}
            className="btn btn-outline"
          >
            <CheckCircle2 size={17} />
            اعتماد الحالة
          </button>

          <button
            type="button"
            onClick={() => handleDecision('فحص إضافي')}
            className="btn btn-outline"
          >
            <ScanSearch size={17} />
            فحص إضافي
          </button>

          <button
            type="button"
            onClick={() => handleDecision('تحويل للصيانة')}
            className="btn btn-outline"
          >
            <Wrench size={17} />
            تحويل للصيانة
          </button>

          <button
            type="button"
            onClick={() => handleDecision('إضافة ملاحظة')}
            className="btn btn-outline"
          >
            <MessageSquarePlus size={17} />
            إضافة ملاحظة
          </button>

        </div>

        {decision && (
          <div className="mt-4 rounded-xl border bg-slate-50 p-4 text-sm">
            <span className="text-slate-500">
              القرار المسجل:
            </span>{' '}
            <strong>{decision}</strong>
          </div>
        )}

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">

          <input
            className="inp flex-1"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="أضف ملاحظة للمفتش..."
          />

          <button
            type="button"
            onClick={handleNote}
            className="btn btn-primary"
          >
            <MessageSquarePlus size={17} />
            حفظ الملاحظة
          </button>

        </div>

      </div>

      {/* Inspection Status */}
      <div className="card">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-slate-100 p-3">
            <ClipboardCheck size={21} />
          </div>

          <div>
            <div className="font-semibold">
              حالة الفحص
            </div>

            <div className="text-sm text-slate-500">
              {guided
                ? 'تم إرسال التوجيه إلى النظارة وجاهز لاتخاذ القرار.'
                : 'بانتظار بدء التوجيه والفحص الميداني.'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}