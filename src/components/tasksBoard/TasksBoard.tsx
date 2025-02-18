import { useState, useEffect } from "react";
import { ColumnType, TaskType } from "../../types";
import TasksColumn from "./tasksColumn/TasksColumn";

import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import KanbanService from "../../services/KanbanService";

const taskService = new KanbanService();

const COLUMNS: ColumnType[] = [
    {id: 'TODO', title: 'ToDo'},
    {id: 'IN_PROGRESS', title: 'In Progress'},
    {id: 'DONE', title: 'Done'},
];

// const INITIAL_TASKS: TaskType[] = [
//     {
//         id: '1',
//         title: 'Task1',
//         content: 'Content1',
//         columnId: 'TODO',
//     },
//     {
//         id: '2',
//         title: 'Task2',
//         content: 'Content2',
//         columnId: 'TODO',
//     },
//     {
//         id: '3',
//         title: 'Task3',
//         content: 'Content3',
//         columnId: 'TODO',
//     },
//     {
//         id: '4',
//         title: 'Task4',
//         content: 'Content4',
//         columnId: 'IN_PROGRESS',
//     },
//     {
//         id: '5',
//         title: 'Task5',
//         content: 'Content5',
//         columnId: 'DONE',
//     },
//
// ];

function TasksBoard() {
    const [tasks, setTasks] = useState<TaskType[]>([]);

    useEffect(() => {
        onRequest();
    }, [])
    const onRequest = () => {
        taskService.getAllIssues()
            .then(onIssuesLoaded)
            // .then(res => res.forEach((item: any) => console.log(item)))
            .catch(() => console.log('Error by saving data to the state'))
        //fix any-type
    }

    const onIssuesLoaded = (newIssues: TaskType[]) => {
        setTasks(issues => [...issues, ...newIssues]);
    }

    return (
        <section>
            <div className="container">
                <div className="row">
                    <DndContext
                        onDragOver={onDragOver}
                    >
                        <div className="d-flex gap-3">
                            <>
                                {COLUMNS.map((col) => {
                                    return (<TasksColumn
                                        key={col.id}
                                        column={col}
                                        tasks={tasks.filter((task) => task.columnId === col.id)}
                                    />)
                                })}
                            </>
                        </div>
                    </DndContext>
                </div>
            </div>
        </section>
    );
    function onDragOver(event: DragOverEvent) {
        const {active, over} = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === 'Task';
        const isOverTask = over.data.current?.type === 'Task';

        if (!isActiveTask) return;

        //Dropping a task over another task
        if (isActiveTask && isOverTask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === 'Column';
        //Dropping a task over another column
        if (isActiveTask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId;

                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }
}
export default TasksBoard;