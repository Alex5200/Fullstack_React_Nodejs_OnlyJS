import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

export default function App() {
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

  // Изменение сотрудников 
  const handleEditDepartmentEmploymend = async (employee_id, full_name,salary, hire_date, age, department_id ){
    try{
      fetch(`http://localhost:3000/api/employees/${employee_id}`)
    }catch(err){
      console.log(err)
    }
  }
  // 🧭 Загрузка сотрудников
  const handleDepartmentSelect = async (deptId) => {
    setSelectedDeptId(deptId);
    setLoadingEmployees(true);

    try {
      const res = await fetch(`http://localhost:3000/api/employees?dept_id=${deptId}`);

      if (!res.ok) {
        throw new Error(`Ошибка загрузки сотрудников: ${res.status}`);
      }

      const rawData = await res.json();

      if (!rawData.data || !Array.isArray(rawData.data)) {
        throw new Error("Некорректный формат ответа: ожидается {  [...] }");
      }

      const employeesList = rawData.data
        .filter(emp => emp.department_id === deptId)
        .map(emp => ({
          ...emp,
          salary: parseFloat(emp.salary),
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
          // Можно добавить budget, established_date, если нужно
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Не удалось создать отдел");
      }

      // ✅ Успешно создан — обновляем список отделов
      await loadDepartments();
      setNewDeptName(''); // очищаем поле
      setShowCreateForm(false); // скрываем форму (опционально)
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  // 🧩 Загружаем отделы 1 раз при монтировании
  useEffect(() => {
    loadDepartments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        departments={departments}
        loading={loadingDepartments}
        error={errorDepartments}
        onRefresh={loadDepartments}
        setShowCreateForm={setShowCreateForm}
        ShowCreateForms={showCreateForm}
        onCreate={() => setShowCreateForm(true)} // 🆕 показать форму
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
                  className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {creating ? (
                    <span className="flex items-center ">
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
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {selectedDeptId
            ? (() => {
                const dept = departments.find(d => d.department_id === selectedDeptId);
                return dept ? `Сотрудники отдела: ${dept.department_name}` : `Сотрудники отдела #${selectedDeptId}`;
              })()
            : "Выберите отдел"}
        </h1>

        {loadingEmployees ? (
          <div className="flex items-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span>Загрузка сотрудников...</span>
          </div>
        ) : employees.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((emp) => (
              <>
             
                <div key={emp.employee_id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className='w-10 h-10 my-2'>
                    <button >
                        edit
                    </button>
                  </div>
                  <h3 className="font-bold text-gray-800">{emp.full_name}</h3>
                  <p className="text-gray-600">Зарплата: <span className="font-medium">{emp.salary.toLocaleString('ru-RU')} ₽</span></p>
                  <p className="text-gray-600">Возраст: {emp.age} лет</p>
                  <p className="text-gray-600">Принят: {emp.hire_date}</p>
                  {emp.department_name && (
                    <p className="text-xs text-gray-500 mt-1">Отдел: {emp.department_name}</p>
                  )}
                  
                </div>
              </>
            ))}
          </div>
        ) : selectedDeptId ? (
          <p className="text-gray-500">В этом отделе нет сотрудников.</p>
        ) : (
          <p className="text-gray-500">Выберите отдел в меню слева.</p>
        )}
      </main>
    </div>
  );
}