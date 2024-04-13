import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import useStore from '../store';
import TrashIcon from "../icons/TrashIcon";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";


function ColumnContainer({ column }) {

    const [editMode, setEditMode] = useState(false);
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [showNewTaskInput, setShowNewTaskInput] = useState(false);

    const { tasks, createTask, updateColumn, deleteColumn } = useStore();

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

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-columnBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col " >
            {/* Column title */}
            <div
                {...attributes}
                {...listeners}
                onClick={() => {
                    setEditMode(true);
                }}
                className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between">
                <div className="flex gap-2">
                    {!editMode && column.name}
                    {editMode && (
                        <input
                            className="bg-black focus:border-rose-500 border rounded outline-none px-2"
                            value={column.name}
                            onChange={(e) =>
                                updateColumn(column.id, e.target.value)
                            }
                            autoFocus
                            onBlur={() => {
                                setEditMode(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key !== "Enter") return;
                                setEditMode(false);
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
