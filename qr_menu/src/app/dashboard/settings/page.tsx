export default function SettingsPage() {
  return (
    <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">إعدادات المطعم</h1>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">اسم المطعم</label>
          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="مطعم الصخرة" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">رقم الواتساب (للطلبات)</label>
          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="966..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">رابط المنيو (Slug)</label>
          <input type="text" className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 font-mono text-sm" value="rock-restaurant" disabled />
          <p className="text-xs text-gray-400 mt-1 italic">* لا يمكن تغيير الرابط بعد إنشائه</p>
        </div>
        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer">
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
}