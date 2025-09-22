const CreateDepart = ({showCreateForm, setShowCreateForm, newDeptName, setNewDeptName, handleCreateDepartment, creating, createError}) =>{
    return(
        <>
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
        </>
    )
}
export default CreateDepart;