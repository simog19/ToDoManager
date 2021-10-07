import {PeopleFill} from 'react-bootstrap-icons';
import {ListGroup} from 'react-bootstrap';
import {formatDate} from '../utils/dayjs';
import Icons from './Icons';

export default function Task({task, deleteTask, startTaskUpdate, updateTaskStatus, isLoading}) {
  const onStatusToggle = ({ target }) => {
    task.completed = target.checked;
    updateTaskStatus(task);
  };
  return (
    <ListGroup.Item key={task.id}>
      <div className="d-flex">
        <label className={`m-0 mr-auto clickable ${task.important ? 'text-danger' : ''}`}>
          <input type="checkbox"
                 checked={task.completed}
                 disabled={isLoading}
                 className="mr-1 clickable"
                 onChange={onStatusToggle}/>
          {task.description}
        </label>
        {task.private === false && <div className="svg-icon mr-2"><PeopleFill/></div>}
        <button className="mr-2 icon-button"
                onClick={() => startTaskUpdate(task)}
                disabled={isLoading}>
          {Icons.IconEdit}
        </button>
        <button className="icon-button"
                onClick={() => deleteTask(task)}
                disabled={isLoading}>
          {Icons.IconDelete}
        </button>
      </div>
      {task.deadline && <time className="text-muted">{formatDate(task.deadline)}</time>}
    </ListGroup.Item>
  );
}
