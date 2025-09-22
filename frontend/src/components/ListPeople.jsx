import { AgGridReact } from "ag-grid-react";
const ListPeople = ({loadingEmployees, loadingAll, allEmployees, employees, activeTab, showCreateForm, handleEditEmployee, handleDeleteEmployee, gridColumnDefs, selectedDeptId}) =>{
    return(
        <>
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
        </>
    )
}
export default ListPeople;