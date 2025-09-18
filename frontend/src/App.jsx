import { useState, useEffect, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 

// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-quartz.css';
ModuleRegistry.registerModules([AllCommunityModule]);

export default function App() {

const [allEmployees, setAllEmployees] = useState([]);
const [loadingAll, setLoadingAll] = useState(false);
  // Состояние для отделов
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errorDepartments, setErrorDepartments] = useState(null);
  
  // Состояние для сотрудников
  const [selectedDeptId, setSelectedDeptId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  // 🆕 Состояние: показывать ли форму создания отдела
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  // 🆕 Состояния для сотрудников (CRUD)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null); // null = создание, объект = редактирование
  const [employeeForm, setEmployeeForm] = useState({
    full_name: '',
    salary: '',
    hire_date: '',
    age: '',
  });
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // 🆕 Состояние для переключения вкладок
  const [activeTab, setActiveTab] = useState('cards'); // 'cards' или 'grid'

  // 🚀 Загрузка отделов
  const loadDepartments = async () => {
    setLoadingDepartments(true);
    setErrorDepartments(null);

    try {
      const res = await fetch("http://localhost:3000/api/departments");

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка сервера: ${res.status}`);
      }

      const data = await res.json();

      if (!data.result || !Array.isArray(data.result)) {
        throw new Error("Некорректный формат ответа: ожидается { result: [...] }");
      }

      setDepartments(data.result);
    } catch (err) {
      setErrorDepartments(err.message || "Ошибка загрузки отделов");
      console.error(err);
    } finally {
      setLoadingDepartments(false);
    }
  };
const loadAllEmployees = async () => {
  setLoadingAll(true);

  try {
    const res = await fetch("http://localhost:3000/api/employees");

    if (!res.ok) {
      throw new Error(`Ошибка загрузки всех сотрудников: ${res.status}`);
    }

    const rawData = await res.json();
    console.log("Ответ сервера:", rawData);

    // ✅ Проверяем, что employees существует и это массив
    if (!rawData.employees || !Array.isArray(rawData.employees)) {
      throw new Error("Некорректный формат ответа: ожидается { employees: [...] }");
    }

    // 🚀 Преобразуем данные
    const employeesList = rawData.employees.map(emp => ({
      ...emp,
      salary: parseFloat(emp.salary), // Превращаем строку в число
    }));

    setAllEmployees(employeesList);
    setEmployees(employeesList); // Синхронизируем с основным списком
    setSelectedDeptId(null);     // Сбрасываем выбранный отдел
  } catch (err) {
    console.error("Ошибка загрузки всех сотрудников:", err);
    setAllEmployees([]);
  } finally {
    setLoadingAll(false);
  }
};
  // 🧭 Загрузка сотрудников
const handleDepartmentSelect = async (deptId) => {
  setSelectedDeptId(Number(deptId));
  setLoadingEmployees(true);
  console.log("Выбран отдел ID:", deptId);

  try {
    const res = await fetch(`http://localhost:3000/api/employees/${deptId}`);

    if (!res.ok) {
      throw new Error(`Ошибка загрузки сотрудников: ${res.status}`);
    }

    const employeesArray = await res.json(); // ← Получаем МАССИВ напрямую
    console.log("Ответ сервера:", employeesArray);

    // ✅ Проверяем, что это массив
    if (!Array.isArray(employeesArray)) {
      throw new Error("Некорректный формат ответа: ожидается массив сотрудников");
    }

    // 🚀 Преобразуем данные
    const employeesList = employeesArray.map(emp => ({
      ...emp,
      salary: parseFloat(emp.salary), // Превращаем строку в число
    }));

    setEmployees(employeesList);
  } catch (err) {
    console.error("Ошибка загрузки сотрудников:", err);
    setEmployees([]);
  } finally {
    setLoadingEmployees(false);
  }
};

  // 🆕 Создание нового отдела
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    setCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("http://localhost:3000/api/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          department_name: newDeptName.trim(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Не удалось создать отдел");
      }

      await loadDepartments();
      setNewDeptName('');
      setShowCreateForm(false);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // 🆕 Создание или обновление сотрудника
  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);

    if (!selectedDeptId) {
      setFormError("Выберите отдел!");
      setFormLoading(false);
      return;
    }

    const payload = {
      full_name: employeeForm.full_name.trim(),
      salary: parseFloat(employeeForm.salary),
      hire_date: employeeForm.hire_date,
      age: parseInt(employeeForm.age, 10),
      department_id: selectedDeptId, // 🔗 foreign key
    };

    if (!payload.full_name || !payload.salary || !payload.hire_date || !payload.age) {
      setFormError("Заполните все поля");
      setFormLoading(false);
      return;
    }

    try {
      const url = editingEmployee 
        ? `http://localhost:3000/api/employees/${editingEmployee.employee_id}` 
        : `http://localhost:3000/api/employees`;

      const method = editingEmployee ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Ошибка сохранения");
      }

      await handleDepartmentSelect(selectedDeptId);
      setShowEmployeeForm(false);
      setEditingEmployee(null);
      setEmployeeForm({ full_name: '', salary: '', hire_date: '', age: '' });
      setSelectedDeptId(Number(selectedDeptId));
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // 🆕 Удаление сотрудника
  const handleDeleteEmployee = async (employee_id) => {
    if (!window.confirm("Вы уверены, что хотите удалить сотрудника?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/employees/${employee_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Не удалось удалить сотрудника");
      }

      await handleDepartmentSelect(selectedDeptId);
    } catch (err) {
      alert("Ошибка: " + err.message);
    }
  };

  // 🆕 Начать редактирование
  const handleEditEmployee = (emp) => {
    setEditingEmployee(emp);
    setEmployeeForm({
      full_name: emp.full_name,
      salary: emp.salary.toString(),
      hire_date: emp.hire_date,
      age: emp.age.toString(),
    });
    setShowEmployeeForm(true);
  };

  // 🆕 Определение колонок для Ag Grid
  const gridColumnDefs = useMemo(() => [
    { field: 'employee_id', headerName: 'ID', width: 80, sortable: true },
    { field: 'full_name', headerName: 'ФИО', flex: 1, sortable: true, filter: true },
    {
      field: 'salary',
      headerName: 'Зарплата (₽)',
      valueFormatter: params => `${params.value.toLocaleString('ru-RU')} ₽`,
      width: 140,
      sortable: true,
      filter: true
    },
    { field: 'age', headerName: 'Возраст', width: 100, sortable: true },
    { field: 'hire_date', headerName: 'Дата найма', width: 140, sortable: true },
    {
      headerName: 'Действия',
      width: 180,
      cellRenderer: (params) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditEmployee(params.data)}
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            title="Редактировать"
          >
            ✏️ Изменить
          </button>
          <button
            onClick={() => handleDeleteEmployee(params.data.employee_id)}
            className="text-red-600 hover:text-red-800 text-xs font-medium"
            title="Удалить"
          >
            🗑️ Удалить
          </button>
        </div>
      ),
    },
  ], [handleEditEmployee, handleDeleteEmployee]);

 
  // 🧩 Загружаем отделы 1 раз при монтировании
  useEffect(() => {
      loadDepartments();
    loadAllEmployees(); 
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        departments={departments}
        loading={loadingDepartments}
        error={errorDepartments}
        onRefresh={loadDepartments}
        setShowCreateForm={setShowCreateForm}
        showCreateForm={showCreateForm}
        onCreate={() => setShowCreateForm(true)}
        onSelectDepartment={handleDepartmentSelect}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* 🆕 Форма создания отдела */}
        {showCreateForm && (
          <div className="mb-8 p-6 bg-white rounded-lg shadow-md max-w-md">
            <h2 className="text-xl font-bold mb-4">Создать новый отдел</h2>
            <form onSubmit={handleCreateDepartment}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Название отдела</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="Введите название отдела"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {createError && (
                <p className="text-red-500 text-sm mb-3">{createError}</p>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {creating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Создание...
                    </span>
                  ) : (
                    "Создать"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 📌 Основной контент: сотрудники */}
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

        {/* 🆕 Форма сотрудника */}
        {showEmployeeForm && (
          <div className="mb-6 p-5 bg-white rounded-lg shadow-md max-w-2xl">
            <h2 className="text-xl font-bold mb-4">
              {editingEmployee ? "Редактировать сотрудника" : "Добавить сотрудника"}
            </h2>

            <form onSubmit={handleSaveEmployee} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">ФИО</label>
                <input
                  type="text"
                  value={employeeForm.full_name}
                  onChange={(e) => setEmployeeForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">Зарплата (₽)</label>
                  <input
                    type="number"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, salary: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Возраст</label>
                  <input
                    type="number"
                    value={employeeForm.age}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-1">Дата найма</label>
                  <input
                    type="date"
                    value={employeeForm.hire_date}
                    onChange={(e) => setEmployeeForm(prev => ({ ...prev, hire_date: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {formError && <p className="text-red-500 text-sm">{formError}</p>}

              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {formLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmployeeForm(false);
                    setEditingEmployee(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 📋 Список сотрудников — с переключением вкладок */}
        {loadingEmployees || loadingAll ? (
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Загрузка сотрудников...</span>
          </div>
        ) : activeTab === 'all' ? (
          allEmployees.length > 0 ? (
            activeTab === 'cards' ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allEmployees.map((emp) => (
                  <div key={emp.employee_id + emp.hire_date} className="bg-white p-4 rounded-lg shadow-sm border relative">
                    {showCreateForm && (
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button
                          onClick={() => handleEditEmployee(emp)}
                          className="text-blue-600 hover:text-blue-800 text-xs p-1"
                          title="Редактировать"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteEmployee(emp.employee_id)}
                          className="text-red-600 hover:text-red-800 text-xs p-1"
                          title="Удалить"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    <h3 className="font-bold text-gray-800 mt-4">{emp.full_name}</h3>
                    <p className="text-gray-600">Зарплата: <span className="font-medium">{emp.salary.toLocaleString('ru-RU')} ₽</span></p>
                    <p className="text-gray-600">Возраст: {emp.age} лет</p>
                    <p className="text-gray-600">Принят: {emp.hire_date}</p>
                    {emp.Department?.department_name && (
                      <p className="text-xs text-gray-500 mt-1">Отдел: {emp.Department.department_name}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                  rowData={allEmployees}
                  columnDefs={gridColumnDefs}
                  pagination={true}
                  paginationPageSize={10}
                  domLayout="autoHeight"
                  animateRows={true}
                />
              </div>
            )
          ) : (
            <p className="text-gray-500">Сотрудники не найдены.</p>
          )
        ) : employees.length > 0 ? (
          activeTab === 'cards' ? (
            // 🃏 Карточки
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {employees.map((emp) => (
                <div key={emp.employee_id} className="bg-white p-4 rounded-lg shadow-sm border relative">
                  {showCreateForm ? (
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleEditEmployee(emp)}
                        className="text-blue-600 hover:text-blue-800 text-xs p-1"
                        title="Редактировать"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.employee_id)}
                        className="text-red-600 hover:text-red-800 text-xs p-1"
                        title="Удалить"
                      >
                        🗑️
                      </button>
                    </div>
                  ) : null}

                  <h3 className="font-bold text-gray-800 mt-4">{emp.full_name}</h3>
                  <p className="text-gray-600">Зарплата: <span className="font-medium">{emp.salary.toLocaleString('ru-RU')} ₽</span></p>
                  <p className="text-gray-600">Возраст: {emp.age} лет</p>
                  <p className="text-gray-600">Принят: {emp.hire_date}</p>
                  {emp.Department?.department_name && (
                    <p className="text-xs text-gray-500 mt-1">Отдел: {emp.Department.department_name}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 📊 Ag Grid таблица
            <div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>
              <AgGridReact
                rowData={employees}
                columnDefs={gridColumnDefs}
                pagination={true}
                paginationPageSize={10}
                domLayout="autoHeight"
                animateRows={true}
              />
            </div>
          )
        ) : selectedDeptId ? (
          <p className="text-gray-500">В этом отделе нет сотрудников.</p>
        ) : (
          <p className="text-gray-500">Выберите отдел в меню слева или перейдите на вкладку "Все сотрудники".</p>
        )}
      </main>
    </div>
  );
}

// 🧩 Sidebar — вынесен как компонент внутри того же файла
function Sidebar({ departments, loading, error, onRefresh, onCreate, onSelectDepartment, showCreateForm, setShowCreateForm }) {
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