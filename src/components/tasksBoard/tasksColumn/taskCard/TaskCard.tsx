import {Task} from "../../../../types";

type TaskCardProps =  {
   task: Task;
}
function TaskCard({task}: TaskCardProps) {
    return (
        <div className="">
            <h3 className="">{task.title}</h3>

            <p>{task.description}</p>
        </div>
    );
}

export default TaskCard;