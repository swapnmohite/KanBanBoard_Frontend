import create from "zustand";
import api from "./api";

const useStore = create((set, get) => ({
    boards: [],
    columns: [],
    tasks: [],
    activeBoardId: null,
    isLoading: false,

    fetchBoards: async () => {
        set({ isLoading: true });
        const response = await api.get("/api/boards");
        set({ boards: response.data, isLoading: false });
    },

    fetchColumnsAndTasks: async (boardId) => {
        try {
            set({ isLoading: true });

            const columnsResponse = await api.get(`/api/column/${boardId}`);
            console.log("columnsResponse:", columnsResponse);
            set({ columns: columnsResponse.data });

            const allTaskPromises = columnsResponse.data.map((col) =>
                api.get(`/api/tasks/${col.id}`)
            );

            const allTasksResponses = await Promise.all(allTaskPromises);
            console.log("allTasksResponses:", allTasksResponses);

            const allTasks = allTasksResponses
                .map((response) => response.data)
                .flat();
            console.log("allTasks:", allTasks);

            set({ tasks: allTasks, isLoading: false });
        } catch (error) {
            console.error("Error fetching columns and tasks:", error);
            set({ isLoading: false });
        }
    },

    setActiveBoard: (boardId) => set({ activeBoardId: boardId }),

    // Column actions
    createColumn: async (boardId, columnData) => {
        const response = await api.post(`/api/column/${boardId}`, columnData);
        set((state) => ({
            columns: [...state.columns, response.data],
        }));
    },
    updateColumn: async (columnId, updatedData) => {
        const response = await api.put(`/api/column/${columnId}`, updatedData);
        set((state) => ({
            columns: state.columns.map((col) =>
                col.id === columnId ? response.data : col
            ),
        }));
    },

    deleteColumn: async (columnId) => {
        await api.delete(`/api/column/${columnId}`);
        set((state) => ({
            columns: state.columns.filter((col) => col.id !== columnId),
            tasks: state.tasks.filter((task) => task.columnId !== columnId),
        }));
    },

    // Task actions
    createTask: async (columnId, description) => {
        const response = await api.post(`/api/tasks/${columnId}`, {
            description,
        });
        set((state) => ({
            tasks: [...state.tasks, response.data],
        }));
    },

    updateTask: async (columnId, taskId, updatedData) => {
        const response = await api.put(
            `/api/tasks/columns/${columnId}/tasks/${taskId}`,
            updatedData
        );
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === taskId
                    ? { ...task, description: response.data.description }
                    : task
            ),
        }));
    },

    deleteTask: async (columnId, taskId) => {
        await api.delete(`/api/tasks/columns/${columnId}/tasks/${taskId}`);
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
    },
}));

export default useStore;
