import { TaskType } from  "../../../../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    task: TaskType;
}
function TaskCard({task}: Props) {
    const {setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const { title, content } = task;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}>
            <div className='d-flex flex-column gap-2 p-4 my-2 bg-white rounded'>
                <h5>{title}</h5>
                <p>{content}</p>
            </div>
        </div>
    );
}

export default TaskCard;