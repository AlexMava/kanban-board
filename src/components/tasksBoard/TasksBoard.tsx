import {useState} from "react";

import TasksColumn from "./tasksColumn/TasksColumn";

import type {Column as ColumnType, Task} from "../../types";

const COLUMNS: ColumnType[] = [
    { id: 'TODO', title: 'ToDo' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Done' },
];

const INITIAL_TASKS: Task[] = [
    {
        id: '1',
        title: 'Research Project',
        description: 'Gather requirements and create initial documentation',
        status: 'TODO',
    },
    {
        id: '2',
        title: 'Design System',
        description: 'Create component library and design tokens',
        status: 'TODO',
    },
    {
        id: '3',
        title: 'API Integration',
        description: 'Implement REST API endpoints',
        status: 'IN_PROGRESS',
    },
    {
        id: '4',
        title: 'Testing',
        description: 'Write unit tests for core functionality',
        status: 'DONE',
    },
];

function TasksBoard() {
    const [tasks, setTasks] = useState(INITIAL_TASKS);

    return (
        <section>
            <div className="container">
                <div className="row">
                    <div className="col d-flex justify-content-between">
                        {COLUMNS.map((column) => {
                            return (
                                <TasksColumn
                                    key={column.id}
                                    column={column}
                                    tasks={tasks.filter((task) => task.status === column.id)}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TasksBoard;