import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import ColumnContainer from "./ColumnContainer";
import useStore from "../store";
import api from "../api";
import PlusIcon from "../icons/PlusIcon";
import TrashIcon from "../icons/TrashIcon";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    const [activeTask, setActiveTask] = useState(null);
    // const [activeBoardId, setActiveBoardId] = useState(null);
    const [boardName, setBoardName] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [editBoardId, setEditBoardId] = useState(null);
    const [editBoardName, setEditBoardName] = useState("");
    const [newColumnName, setNewColumnName] = useState("");
    const [hoveredColumnId, setHoveredColumnId] = useState(null);
    const [showNewColumnInput, setShowNewColumnInput] = useState(false);
    const {
        boards,
        columns,
        tasks,
        isLoading,
        fetchBoards,
        activeBoardId,
        fetchColumnsAndTasks,
        setActiveBoard,
        createColumn,
        updateTask,
        deleteTask,
        updateColumn,
        deleteColumn,
        createTask,
    } = useStore();

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards]);

    useEffect(() => {
        if (boards.length > 0 && !activeBoardId) {
            setActiveBoard(boards[0].id);
        }
    }, [boards, activeBoardId, setActiveBoard, fetchColumnsAndTasks]);

    useEffect(() => {
        if (activeBoardId) {
            fetchColumnsAndTasks(activeBoardId);
        }
    }, [activeBoardId, fetchColumnsAndTasks]);

    const handleAddBoard = async (event) => {
        event.preventDefault();
        try {
            await api.post("/api/boards", { name: boardName });
            setBoardName("");
            fetchBoards();
        } catch (error) {
            console.log("Error creating board: ", error);
        }
    };

    const handleDeleteBoard = async (id) => {
        try {
            await api.delete(`/api/boards/${id}`);
            fetchBoards();
        } catch (error) {
            console.error("Failed to delete board:", error);
        }
    };

    const handleEditBoard = async (id, name) => {
        if (!name) {
            alert("Board name cannot be empty. Please enter a valid name.");
            return;
        }
        try {
            await api.put(`/api/boards/update`, { id, name });
            fetchBoards();
        } catch (error) {
            console.error("Failed to edit board:", error);
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragStart(event) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    async function onDragEnd(event) {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;
        const activeId = active.id;
        const overId = over.id;
        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            // Move task to a different column
            const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
            const updatedTask = { ...tasks[activeTaskIndex], columnId: overId };
            await updateTask(overId, activeId, updatedTask);
            const updatedTasks = [...tasks];
            updatedTasks[activeTaskIndex] = updatedTask;
            setActiveTask(updatedTask);
        }
        if (activeBoardId) {
            fetchColumnsAndTasks(activeBoardId);
        }
    }

    const onDragOver = (event) => {
        const { over } = event;
        if (over && over.data.current?.type === 'Column') {
            setHoveredColumnId(over.id);
        } else {
            setHoveredColumnId(null);
        }
    };


    return (
        <div className="flex">
            {/* Sidebar */}
            <div className="w-64 p-4 py-28 shadow-lg">
                <h1 className="text-2xl font-bold mb-4">Boards</h1>
                {boards && boards.map((board) => (
                    <div
                        key={board.id}
                        className="flex mb-2"
                        onMouseEnter={() => setIsHovered(board.id)}
                        onMouseLeave={() => setIsHovered(false)}>
                        <div
                            onClick={() => setActiveBoard(board.id)}
                            className={`w-80 text-left p-2 rounded ${activeBoardId === board.id
                                ? "bg-blue-600"
                                : "bg-zinc-900"
                                } text-white focus:outline-none`}>
                            <div className="flex justify-between items-center w-full">
                                {editBoardId === board.id ? (
                                    <input
                                        value={editBoardName}
                                        onChange={(e) =>
                                            setEditBoardName(e.target.value)
                                        }
                                        onBlur={() => {
                                            handleEditBoard(
                                                editBoardId,
                                                editBoardName
                                            );
                                            setEditBoardId(null);
                                        }}
                                        autoFocus
                                        className="bg-transparent text-white focus:outline-none w-full"
                                    />
                                ) : (
                                    <span
                                        onDoubleClick={() => {
                                            setEditBoardId(board.id);
                                            setEditBoardName(board.name);
                                        }}>
                                        {board.name}
                                    </span>
                                )}
                                {isHovered === board.id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteBoard(board.id);
                                        }}
                                        className="h-5 w-5 stroke-white cursor-pointer">
                                        <TrashIcon />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <form onSubmit={handleAddBoard} className="mt-4">
                    <input
                        type="text"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        className="w-full p-2 border rounded mb-2 bg-transparent"
                        placeholder="New board name"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-500 flex justify-center items-center rounded hover:bg-blue-600 focus:outline-none">
                        <PlusIcon />
                    </button>
                </form>
            </div>

            {/* Main content */}
            <div className="flex-grow p-4 overflow-auto">
                <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[0px]">
                    <DndContext
                        sensors={sensors}
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDragOver={onDragOver}
                    >
                        <div className="m-auto flex gap-4">
                            <div className="flex gap-4">
                                {columns &&
                                    columns.map((col) => (
                                        <ColumnContainer
                                            key={col.id}
                                            column={col}
                                            deleteColumn={deleteColumn}
                                            updateColumn={updateColumn}
                                            createTask={createTask}
                                            tasks={tasks.filter((task) => task?.columnId === col.id)}
                                            deleteTask={deleteTask}
                                            updateTask={updateTask}
                                        />
                                    ))}
                                {columns.length < 3 && (
                                    <>
                                        {!showNewColumnInput ? (
                                            <button
                                                onClick={() => setShowNewColumnInput(true)}
                                                className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2 items-center justify-center"
                                            >
                                                <PlusIcon />
                                                Add Column
                                            </button>
                                        ) : (
                                            <input
                                                type="text"
                                                value={newColumnName}
                                                onChange={(e) => setNewColumnName(e.target.value)}
                                                placeholder="Enter column name"
                                                className="h-[60px] w-[350px] min-w-[350px] rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 focus:ring-2 outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && newColumnName.trim() !== '') {
                                                        createColumn(activeBoardId, { name: newColumnName });
                                                        setNewColumnName('');
                                                        setShowNewColumnInput(false);
                                                    } else if (e.key === 'Escape') {
                                                        setNewColumnName('');
                                                        setShowNewColumnInput(false);
                                                    }
                                                }}
                                                autoFocus
                                            />
                                        )}
                                    </>
                                )

                                }

                            </div>
                        </div>
                        {createPortal(
                            <DragOverlay>
                                {hoveredColumnId && (
                                    <div className="bg-rose-500 bg-opacity-50 rounded p-4">
                                        Drop here to move to {columns.find((col) => col.id === hoveredColumnId)?.name || 'Unknown Column'}
                                    </div>
                                )}
                                {activeTask && (
                                    <TaskCard
                                        task={activeTask}
                                        deleteTask={() => deleteTask(activeTask.columnId, activeTask.id)}
                                        updateTask={(updatedData) =>
                                            updateTask(activeTask.columnId, activeTask.id, updatedData)
                                        }
                                    />
                                )}
                            </DragOverlay>
                            ,
                            document.body
                        )}
                    </DndContext>
                </div>
            </div>
        </div >
    );
}

export default KanbanBoard;
