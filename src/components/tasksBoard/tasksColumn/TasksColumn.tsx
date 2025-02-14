import {Column as ColumnType, Task} from "../../../types";
import TaskCard from "./taskCard/TaskCard";

type ColumnProps = {
    column: ColumnType;
    tasks: Task[];
};

function TasksColumn( {column, tasks }: ColumnProps) {
    return (
        <div className="">
            <h2>{column.title}</h2>

            <div className="p-4 bg-body-secondary">
                {tasks.map((task) => {
                    return <TaskCard key={task.id} task={task} />
                })}
            </div>
        </div>
    );
}
export default TasksColumn;