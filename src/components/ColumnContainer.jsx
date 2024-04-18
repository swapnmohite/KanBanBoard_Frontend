import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState, useEffect } from "react";
import useStore from '../store';
import TrashIcon from "../icons/TrashIcon";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


function ColumnContainer({ column }) {

    const [editMode, setEditMode] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);

    const { tasks, createTask, updateColumn, deleteColumn, updatedColumnId, taskAdded, resetTaskAdded } = useStore();
    const [isHovered, setIsHovered] = useState(false);
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [editingColumnName, setEditingColumnName] = useState(column.name);


    const tasksIds = useMemo(
        () => tasks.filter((task) => task.columnId === column.id).map((task) => task.id),
        [tasks, column.id]
    );

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
        // over,
        // overId,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
        disabled: editMode,
    });

    const toggleNewTaskInput = () => {
        setShowNewTaskInput(!showNewTaskInput);
        if (!showNewTaskInput) {
            setNewTaskDescription('');
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsHovered(event.overId === column.id);
    };

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isHovered ? 'rgba(245, 101, 101, 0.3)' : '',
        border: isHovered ? '2px dashed #f56565' : '',
    };
    const updateColumnName = () => {
        if (editingColumnName.trim() !== '') {
            updateColumn(column.id, editingColumnName);
        }
    };

    useEffect(() => {
        if (taskAdded) {
            resetTaskAdded(); // Reset taskAdded after re-render
        }

    }, [updatedColumnId, taskAdded, resetTaskAdded]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onDragOver={handleDragOver}
            className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            {/* Column title */}
            <div
                // {...attributes}
                // {...listeners}
                onClick={() => {
                    setEditMode(true);
                    setEditingColumnId(column.id);
                    setEditingColumnName(column.name);
                }}
                className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
                <div className="flex gap-2">
                    {!editMode && column.name}
                    {editMode && editingColumnId === column.id && (
                        <input
                            className="bg-transparent focus:outline-none w-full"
                            value={editingColumnName}
                            onChange={(e) => setEditingColumnName(e.target.value)}
                            onBlur={updateColumnName}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateColumnName();
                                }
                            }}
                        />
                    )}
                </div>
                <button
                    onClick={() => {
                        deleteColumn(column.id);
                    }}
                    className="stroke-gray-500 hover:stroke-white hover:bg-columnBackgroundColor rounded px-1 py-2">
                    <TrashIcon />
                </button>
            </div>

            {/* Column task container */}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                <SortableContext items={tasksIds}>
                    {tasks
                        .filter((task) => task.columnId === column.id)
                        .map((task) => (
                            <TaskCard
                                key={task.id}
                                columnId={column.id}
                                task={task}


                            />
                        ))}
                </SortableContext>
            </div>
            {/* Column footer */}
            {showNewTaskInput ? (
                <textarea
                    className="h-[60px] w-[350px] min-w-[350px] rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 focus:ring-2 outline-none"
                    value={newTaskDescription}
                    placeholder="New task description"
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            createTask(column.id, newTaskDescription);
                            setNewTaskDescription('');
                            setShowNewTaskInput(false);
                        }
                    }}
                    autoFocus
                />
            ) : (
                <button
                    className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2 items-center justify-center"
                    onClick={toggleNewTaskInput}
                >
                    <PlusIcon />
                    Add task
                </button>
            )}
        </div>
    );
}

export default ColumnContainer;
