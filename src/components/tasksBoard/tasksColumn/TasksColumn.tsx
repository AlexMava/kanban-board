import { useMemo } from "react";
import TaskCard from "./taskCard/TaskCard";
import { ColumnType, TaskType } from "../../../types";

import { useSortable, SortableContext } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    column: ColumnType;
    tasks: TaskType[];
}

function TasksColumn(props: Props) {
    const {column, tasks} = props;

    const tasksIds = useMemo(() => {
        return tasks.map((task) => task.id);
    }, [tasks])

    const {setNodeRef, transform, transition} = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    return (
        <div className='col p-4 bg-body-secondary'
             ref={setNodeRef}
             style={style}
        >
            <div className="">
                <h2>{column.title}</h2>
            </div>
            <div className="">
                <SortableContext items={tasksIds}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task}/>
                    ))}
                </SortableContext>
            </div>
        </div>
    );
}
export default TasksColumn;