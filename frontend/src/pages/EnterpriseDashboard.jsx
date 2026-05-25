export default function EnterpriseDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Enterprise Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-800">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Spend</h3>
            <p className="text-3xl font-bold text-gray-800">$0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-semibold">Delivery Rate</h3>
            <p className="text-3xl font-bold text-gray-800">0%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
