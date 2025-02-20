import { useState, useEffect } from "react";
import { ColumnType, TaskType, RepoDetailsType } from "../../types";
import TasksColumn from "./tasksColumn/TasksColumn";

import { DndContext, DragOverEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import KanbanService from "../../services/KanbanService";

import './TasksBoard.css';

const taskService = new KanbanService();

const COLUMNS: ColumnType[] = [
    {id: 'TODO', title: 'ToDo'},
    {id: 'IN_PROGRESS', title: 'In Progress'},
    {id: 'DONE', title: 'Done'},
];

function TasksBoard() {
    const emptyRepo = {
        id: 0,
        name: ' ',
        stargazers_count: 0,
        html_url: ' ',
        svn_url: ' ',
        organization: {
            url: ' ',
            login: ' ',
        }
    }

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [repoDetails, setRepoDetails] = useState<RepoDetailsType>(emptyRepo);
    const [searchString, setSearchString] = useState<string>('');

    // useEffect(() => {
    //     onRequest('facebook', 'react');
    // }, [])
    const onRequest = (url: string) => {
        taskService.getAllIssues(url)
            .then(onIssuesLoaded)
            .catch(() => console.log('Error by saving issues to the state'))

        taskService.getRepoDetails(url)
            .then(onRepoLoaded)
            .catch(() => console.log('Error by saving repo-details to the state'))
    }

    const onIssuesLoaded = (newIssues: TaskType[]) => {
        // setTasks(issues => [...issues, ...newIssues]);
        setTasks(newIssues);
    }

    const onRepoLoaded = (repo: RepoDetailsType) => {
        setRepoDetails(repo);
    }

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    }

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onRequest(searchString.replace('https://github.com/', 'https://api.github.com/repos/'));
    }

    const {name, html_url,  stargazers_count, organization } = repoDetails;

    return (
        <section>
            <div className="container">
                <div className="row mb-3">
                    <div className="col">
                        <form onSubmit={(e) => handleSubmit(e)} className='kanban__search-form'>
                            <input onChange={handleChange} type="text" className="" id="searchInput"
                                   placeholder="Enter Github Repo URL" value={searchString}/>

                            <button type="submit" className="btn btn-primary">Load issues</button>
                        </form>
                        <p>As example copy this URL: <code>https://github.com/facebook/react</code></p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                    <p>
                            <a href={organization.url}>{organization.login}</a>
                            <span>{` > `}</span>
                            <a href={html_url}>{name}</a>

                            <b>&emsp;{`${stargazers_count} stars`}</b>
                        </p>
                    </div>
                </div>

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