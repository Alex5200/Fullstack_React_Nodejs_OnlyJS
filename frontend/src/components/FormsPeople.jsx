
const FromsPeople = ({showEmployeeForm, editingEmployee, employeeForm, setEmployeeForm, handleSaveEmployee, setEditingEmployee, formError, formLoading, setShowEmployeeForm}) =>{
    return(
        <>{showEmployeeForm && (
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
        </> 
    )
}

export default FromsPeople;