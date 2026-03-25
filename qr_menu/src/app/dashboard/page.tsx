export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 text-right">نظرة عامة</h1>
      
      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="الأقسام" value="5" color="border-blue-500" />
        <StatCard title="المنتجات" value="24" color="border-green-500" />
        <StatCard title="مشاهدات اليوم" value="120" color="border-purple-500" />
      </div>

      {/* روابط سريعة */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="font-bold mb-4">إجراءات سريعة</h3>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
            + إضافة منتج جديد
          </button>
          <button className="border border-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition">
            تعديل قائمة الطعام
          </button>
        </div>
      </div>
    </div>
  );
}

// مكون صغير للبطاقات
function StatCard({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-t-4 ${color}`}>
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}