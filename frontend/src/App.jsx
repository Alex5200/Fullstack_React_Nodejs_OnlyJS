import { useState, useEffect, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
import FromsPeople from './components/FormsPeople';
import ListPeople from './components/ListPeople';
import CreateDepart from './components/CreateDepart';
import Content from './components/Content';
import Sidebar from './components/Sidebar';
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
  const handleDeleteEmployee = useCallback(async (employee_id) => {
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
  }, [selectedDeptId]);

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
        newDeptName={newDeptName}
        setNewDeptName={setNewDeptName}
        handleCreateDepartment={handleCreateDepartment}
        creating={creating}
        createError={createError}
        onCreate={() => setShowCreateForm(true)}
        onSelectDepartment={handleDepartmentSelect}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        <CreateDepart
        showCreateForm = {showCreateForm}
        newDeptName = {newDeptName}
        setNewDeptName = {setNewDeptName}
        handleCreateDepartment = {handleCreateDepartment}
        creating = {creating}
        createError = {createError}
        />

       <Content
        selectedDeptId = {selectedDeptId}
        departments = {departments}
        showCreateForm = {showCreateForm}
        activeTab = {activeTab}
        setActiveTab = {setActiveTab}
        setEditingEmployee = {setEditingEmployee}
        setEmployeeForm = {setEmployeeForm}
        setShowEmployeeForm = {setShowEmployeeForm}
        setSelectedDeptId = {setSelectedDeptId}
       />

       <FromsPeople
        showEmployeeForm = { showEmployeeForm}
        editingEmployee = {editingEmployee}
        employeeForm = {employeeForm}
        setEmployeeForm = {setEmployeeForm}
        handleSaveEmployee = {handleSaveEmployee}
        setEditingEmployee = {setEditingEmployee}
        formError = {formError}
        formLoading = {formLoading}
        setShowEmployeeForm = {setShowEmployeeForm}
        />
      

       <ListPeople
        loadingEmployees={loadingEmployees}
        loadingAll={loadingAll}
        allEmployees={allEmployees}
        employees={employees}
        activeTab={activeTab}
        showCreateForm={showCreateForm}
        handleEditEmployee={handleEditEmployee}
        handleDeleteEmployee={handleDeleteEmployee}
        gridColumnDefs={gridColumnDefs}
        selectedDeptId={selectedDeptId}
       />
      </main>
    </div>
  );
}
