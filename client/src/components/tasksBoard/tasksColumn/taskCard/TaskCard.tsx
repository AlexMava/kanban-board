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

    const { title, id, url, created_at, commentsCount, owner } = task;

    function getFormatedDate( date: string ) {
        const dateNow = new Date(),
            dateCreated = new Date(date);

        const yyyy = dateCreated.getFullYear(),
            mm = dateCreated.getMonth() + 1, // Months start at 0!
            dd = dateCreated.getDate(),
            formattedDate = dd + '/' + mm + '/' + yyyy;

        const diff = Math.abs(dateNow.valueOf() - dateCreated.valueOf());
        const diffDays = Math.floor(diff / (24*60*60*1000));
        let pluralEnding = diffDays === 1 ? '' : 's';

        let res = 'opened ';

        if (diff > 0 && diff < 60000 * 5) { ///less than 5 mins
            res += 'right now';
        } else if (diff < 60000 * 60 * 20) {//less than 1 day
            res += 'today';
        } else if (diff > 60000 * 60 * 20 && diff < 60000 * 60 * 20 * 10) {//less than 1 day
            res += `${diffDays} day${pluralEnding} ago`;
        } else {
            res += formattedDate;
        }
        return res;
    }

    const created = getFormatedDate(created_at);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}>
            <div className='d-flex flex-column gap-2 p-4 my-2 bg-white rounded'>
                <a href={url} target='_blank'>
                    <h6>{title}</h6>
                </a>

                <p>
                    <span>{`#${id}`} </span>
                    <span>{created}</span>
                </p>

                <p>
                    <a href={owner.homepage} target='_blank'>{`${owner.login}`}</a>
                    <span>{` Comments: ${commentsCount}`}</span>
                </p>
            </div>
        </div>
    );
}

export default TaskCard;