import "../index.css"

export default function Sidebar({ departments, loading, error, onRefresh, onCreate, onSelectDepartment, showCreateForm, setShowCreateForm  }) {
  const CreatePDF = () =>{

  }
  const SkeletonLoader = () => (
    <div className="w-64 bg-gray-50 h-screen p-4 border-r border-gray-200">
      <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
      <ul className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <li key={i} className="flex justify-between items-center">
            <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-8 animate-pulse"></div>
          </li>
        ))}
      </ul>
    </div>
  );

  if (loading) return <SkeletonLoader />;

  if (error) return (
    <div className="w-64 bg-gray-50 h-screen p-4 border-r border-gray-200 flex flex-col items-center justify-center text-red-500 text-center">
      <p className="font-medium mb-2">{error}</p>
      <button
        onClick={onRefresh}
        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition flex items-center"
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Обновить
      </button>
    </div>
  );

  return (
    <div className="w-64 bg-gray-50 h-screen p-4 border-r border-gray-200 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Отделы</h2>
        <button
          onClick={onRefresh}
          title="Обновить список"
          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <ul className="space-y-2 flex-1">
        {departments.map(dept => (
          <li key={dept.department_id}>
            <button
              onClick={() => onSelectDepartment(dept.department_id)}
              className="w-full bg-blue-500 text-left text-white px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition font-medium"
            >
              {dept.department_name}
            </button>
          </li>
        ))}
      </ul>
         <button
          onClick={CreatePDF}
          className="mt-4 w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
        >
          <span> PDF Выписка</span>
        </button>
      {!showCreateForm ? (
        <button
          onClick={onCreate}
          className="mt-4 w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
        >
          <span> Настройки</span>
        </button>
      ) : (
        <button
          onClick={() => setShowCreateForm(false)}
          className="mt-4 w-full py-2 bg-blue-600 text-black font-medium rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2"
        >
          <span>Отмена</span>
        </button>
      )}
    </div>
  );
}
 