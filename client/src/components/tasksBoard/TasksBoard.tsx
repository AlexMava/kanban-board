import { useState } from "react";
import { ColumnType, TaskType, RepoDetailsType } from "../../types";
import TasksColumn from "./tasksColumn/TasksColumn";

import {DndContext, DragOverEvent} from "@dnd-kit/core";
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
        name: '',
        stargazers_count: 0,
        html_url: ' ',
        svn_url: ' ',
        organization: {
            url: ' ',
            login: ' ',
        },
        issues: [
            {
                id: 0,
                columnId: '',
                title: '',
                content: '',
                url: '',
                created_at: '',
                commentsCount: 0,
                owner: {
                    login: '',
                    homepage: '',
                }
            }
        ]
    }

    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [repoDetails, setRepoDetails] = useState<RepoDetailsType>(emptyRepo);
    const [searchString, setSearchString] = useState<string>('');

    const API_URL = 'http://localhost:5000';

    const onRequest = async (url: string) => {
        url = removeLastSlash(url);
        const repoName = url.substring(url.lastIndexOf('/') + 1);

        taskService.getRepoDetails(removeLastSlash(url))
            .then(getItemFromGithub)
            .then(loadingData)
            .catch((e) => console.log('Error ', e))

        function loadingData() {
            taskService.getData(`${API_URL}/api/kanbanboard/get-repo/?name=${repoName}`)
                .then(onRepoLoaded)
                .catch(() => console.log('Error can not fetch a data from server!!!'));
        }
    }

    const getItemFromGithub = async (repo: RepoDetailsType) => {
        const data = {...repo}
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        if (repo?.id && repo?.name) {
            const response = await fetch(`${API_URL}/api/kanbanboard/AddRepo`, requestOptions)

            const responseData = await response.json();
            return responseData;
        }
    }

    const onRepoLoaded = (repo: RepoDetailsType) => {
        if (repo && repo?.issues) {
            setRepoDetails(repo);
            setTasks([...repo.issues]);
        } else {
            setRepoDetails(emptyRepo);
            setTasks([...emptyRepo.issues]);
        }
    }

    const handleChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    }

    const handleSubmit = (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onRequest(searchString.replace('github.com/', 'api.github.com/repos/'));
    }

    function removeLastSlash(url: string)
    {
        return url.replace(/\/$/, "");
    }

    const { name, html_url,  stargazers_count, organization } = repoDetails;

    function RepoHeader() {
        return (
            <p>
                <a href={organization.url}>{organization.login}</a>
                <span>{` > `}</span>
                <a href={html_url}>{name}</a>

                <b>&emsp;{`${stargazers_count} stars`}</b>
            </p>
        );
    }

    const RepoHeaderContent = organization && stargazers_count ? <RepoHeader /> : null;

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
                        <p>As example use this URL: <code>https://github.com/facebook/react</code></p>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">{RepoHeaderContent}</div>
                </div>

                <div className="row">
                    <DndContext
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
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

    function onDragEnd() {
        const data = {
            id: repoDetails.id,
            issues: [...tasks]
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        fetch(`${API_URL}/api/kanbanboard/UpdateRepo`, requestOptions)
            .then(response => response.json())
            .catch((e) => console.log('Error!', e))
    }
}
export default TasksBoard;