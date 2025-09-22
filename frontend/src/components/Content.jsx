const Content = ({selectedDeptId, departments, showCreateForm , activeTab, setActiveTab,setEditingEmployee, setEmployeeForm, setShowEmployeeForm, setSelectedDeptId}) => {
    return (
         <div className="mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {selectedDeptId
                ? (() => {
                    const dept = departments.find(d => d.department_id === selectedDeptId);
                    return dept ? `Сотрудники отдела: ${dept.department_name}` : `Сотрудники отдела #${selectedDeptId}`;
                  })()
                : "Выберите отдел"}
            </h1>

            {selectedDeptId && showCreateForm && (
              <button
                onClick={() => {
                  setEditingEmployee(null);
                  setEmployeeForm({ full_name: '', salary: '', hire_date: '', age: '' });
                  setShowEmployeeForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm whitespace-nowrap"
              >
                 Добавить сотрудника
              </button>
            )}
          </div>
             {/* 🆕 Табы переключения */}
          {selectedDeptId && (
            <div className="border-b border-gray-300 mb-4">
              <nav className="-mb-px flex space-x-6">
                <button
                  onClick={() => setActiveTab('cards')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'cards'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Карточки
                </button>
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'grid'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Таблица (Ag Grid)
                </button>
                 <button
                onClick={() => {
                  setActiveTab('all');
                  setSelectedDeptId(null); // Сбрасываем отдел
                }}
                className={`py-2 px-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 Все сотрудники
              </button>
              </nav>
            </div>
          )}
        
        </div>
    );
};

export default Content;