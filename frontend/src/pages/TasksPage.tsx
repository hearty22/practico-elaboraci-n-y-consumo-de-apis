import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { Loading } from "../components/Loading";
import {
  logout,
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../api/api";
import { TaskFormModal } from "../components/TaskFormModal";

interface Task {
  _id: string;
  title: string;
  description?: string;
  is_complete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TasksPage = () => {
  const { user, isAuth, isLoading, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tasks, searchTerm]);

  const fetchTasks = useCallback(async () => {
    if (isAuth) {
      try {
        setTasksLoading(true);
        const response = await getTasks();
        if (response.ok) {
          setTasks(response.data.lists);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setTasksLoading(false);
      }
    }
  }, [isAuth]);

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate("/login");
    }
  }, [isAuth, isLoading, navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      await checkAuthStatus();
    } catch (error) {
      console.error("Failed to logout:", error);
      await checkAuthStatus();
    }
  }, [checkAuthStatus]);

  const handleOpenCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      try {
        await deleteTask(id);
        await fetchTasks();
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  }, [fetchTasks]);

  const handleToggleComplete = useCallback(async (task: Task) => {
    try {
      await updateTask(task._id, { is_complete: !task.is_complete });
      await fetchTasks();
    } catch (error) {
      console.error("Failed to toggle task completion:", error);
    }
  }, [fetchTasks]);

  const currentTaskAction = useCallback(
    (data: { title: string; description?: string }) => {
      if (editingTask) {
        return updateTask(editingTask._id, data);
      }
      return createTask(data);
    },
    [editingTask],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <TaskFormModal
        key={editingTask?._id || "create-task"}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        taskAction={currentTaskAction}
        onTaskAction={fetchTasks}
        initialData={editingTask || undefined}
        isUpdate={!!editingTask}
      />
      <div className="min-h-screen bg-[#080C14] text-white">
        <header className="bg-white/[0.05] shadow-md">
          <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-slate-100">
              Tareas de {user?.username}
            </h1>
            <div>
              <input
                placeholder="busqueda de tareas..."
                className="bg-white/[0.05] border border-white/[0.1] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></input>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenCreateModal}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Crear Tarea
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </nav>
        </header>
        <main className="container mx-auto px-6 py-8">
          {tasksLoading ? (
            <Loading />
          ) : filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white/[0.06] p-6 rounded-lg shadow-lg border border-white/[0.1] flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                      <h2
                        className={`text-lg font-bold text-slate-200 ${
                          task.is_complete ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {task.title}
                      </h2>
                      <input
                        type="checkbox"
                        checked={task.is_complete}
                        onChange={() => handleToggleComplete(task)}
                        className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                      />
                    </div>
                    {task.description && (
                      <p
                        className={`text-slate-400 text-sm mb-4 ${
                          task.is_complete ? "line-through text-slate-500" : ""
                        }`}
                      >
                        {task.description}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-slate-500">
                      <p>
                        Creado: {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleOpenEditModal(task)}
                        className="text-slate-400 hover:text-blue-400 transition-colors"
                        aria-label="Editar tarea"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        aria-label="Eliminar tarea"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-slate-400 mb-4">
                {searchTerm
                  ? "No se encontraron tareas"
                  : "No tienes tareas pendientes"}
              </h2>
              <p className="text-slate-500">
                {searchTerm
                  ? "Probá con otro término de búsqueda"
                  : "¡Crea tu primera tarea para empezar!"}
              </p>
              {!searchTerm && (
                <button
                  onClick={handleOpenCreateModal}
                  className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Crear mi primera tarea
                </button>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};
