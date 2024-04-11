import { useEffect } from "react";
import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import api from "../api";
import TrashIcon from "../icons/TrashIcon";

const defaultCols = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Work in progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

const defaultTasks = [
  {
    id: "1",
    columnId: "todo",
    content: "List admin APIs for dashboard",
  },
  {
    id: "2",
    columnId: "todo",
    content:
      "Develop user registration functionality with OTP delivered on SMS after email confirmation and phone number confirmation",
  },
  {
    id: "3",
    columnId: "doing",
    content: "Conduct security testing",
  },
  {
    id: "4",
    columnId: "doing",
    content: "Analyze competitors",
  },
  {
    id: "5",
    columnId: "done",
    content: "Create UI kit documentation",
  },
  {
    id: "6",
    columnId: "done",
    content: "Dev meeting",
  },
  {
    id: "7",
    columnId: "done",
    content: "Deliver dashboard prototype",
  },
  {
    id: "8",
    columnId: "todo",
    content: "Optimize application performance",
  },
  {
    id: "9",
    columnId: "todo",
    content: "Implement data validation",
  },
  {
    id: "10",
    columnId: "todo",
    content: "Design database schema",
  },
  {
    id: "11",
    columnId: "todo",
    content: "Integrate SSL web certificates into workflow",
  },
  {
    id: "12",
    columnId: "doing",
    content: "Implement error logging and monitoring",
  },
  {
    id: "13",
    columnId: "doing",
    content: "Design and implement responsive UI",
  },
];

function KanbanBoard() {
  const [columns, setColumns] = useState(defaultCols);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState(defaultTasks);

  const [activeColumn, setActiveColumn] = useState(null);

  const [activeTask, setActiveTask] = useState(null);

  const [boards, setBoards] = useState([]);

  const [activeBoardId, setActiveBoardId] = useState(null);

  const [boardName, setBoardName] = useState("");

  const [isHovered, setIsHovered] = useState(false);

  const [editBoardId, setEditBoardId] = useState(null);
  const [editBoardName, setEditBoardName] = useState("");

  const fetchBoards = () => {
    api
      .get("/api/boards")
      .then((res) => {
        setBoards(res.data);
      })
      .catch((error) => {
        console.log("Error fetching boards: ", error);
      });
  };

  useEffect(() => {
    fetchBoards();
  }, []);

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
      fetchBoards(); // Refresh the boards
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
      fetchBoards(); // Refresh the boards
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

  return (
    <>
      <div className="flex h-screen ">
        {/* Sidebar */}
        <div className="w-64  p-4 py-28 shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Boards</h1>
          {boards.map((board) => (
            <div
              key={board.id}
              className="flex mb-2"
              onMouseEnter={() => setIsHovered(board.id)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                onClick={() => setActiveBoardId(board.id)}
                className={`w-80 text-left p-2 rounded ${
                  activeBoardId === board.id ? "bg-blue-600" : "bg-zinc-900"
                } text-white  focus:outline-none`}
              >
                <div className="flex justify-between items-center w-full">
                  {editBoardId === board.id ? (
                    <input
                      value={editBoardName}
                      onChange={(e) => setEditBoardName(e.target.value)}
                      onBlur={() => {
                        handleEditBoard(editBoardId, editBoardName); // Call the edit board API
                        setEditBoardId(null);
                      }}
                      autoFocus
                      className="bg-transparent text-white  focus:outline-none w-full"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditBoardId(board.id);
                        setEditBoardName(board.name);
                      }}
                    >
                      {board.name}
                    </span>
                  )}
                  {isHovered === board.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent setActiveBoardId from being called
                        handleDeleteBoard(board.id);
                      }}
                      className="h-5 w-5 stroke-white cursor-pointer"
                    >
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
              className="w-full p-2 bg-blue-500 flex justify-center items-center rounded hover:bg-blue-600 focus:outline-none"
            >
              <PlusIcon />
            </button>
          </form>
        </div>

        {/* Main content */}
        <div className="flex-grow p-4 overflow-auto">
          {/* Your main content goes here */}
          <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[0px]">
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                  <SortableContext items={columnsId}>
                    {columns.map((col) => (
                      <ColumnContainer
                        key={col.id}
                        column={col}
                        deleteColumn={deleteColumn}
                        updateColumn={updateColumn}
                        createTask={createTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        tasks={tasks.filter((task) => task.columnId === col.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
                <button
                  onClick={() => {
                    createNewColumn();
                  }}
                  className="
      h-[60px]
      w-[350px]
      min-w-[350px]
      cursor-pointer
      rounded-lg
      bg-mainBackgroundColor
      border-2
      border-columnBackgroundColor
      p-4
      ring-rose-500
      hover:ring-2
      flex
      gap-2
      "
                >
                  <PlusIcon />
                  Add Column
                </button>
              </div>

              {createPortal(
                <DragOverlay>
                  {activeColumn && (
                    <ColumnContainer
                      column={activeColumn}
                      deleteColumn={deleteColumn}
                      updateColumn={updateColumn}
                      createTask={createTask}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                      tasks={tasks.filter(
                        (task) => task.columnId === activeColumn.id
                      )}
                    />
                  )}
                  {activeTask && (
                    <TaskCard
                      task={activeTask}
                      deleteTask={deleteTask}
                      updateTask={updateTask}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );

  function createTask(columnId) {
    const newTask = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id, content) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id, title) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function onDragStart(event) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // I'm dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        // eslint-disable-next-line eqeqeq
        if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
          // Fix introduced after video recording
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;
        console.log("DROPPING TASK OVER COLUMN", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

function generateId() {
  /* Generate a random number between 0 and 10000 */
  return Math.floor(Math.random() * 10001);
}

export default KanbanBoard;
