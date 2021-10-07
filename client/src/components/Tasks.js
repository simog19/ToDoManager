import {useEffect, useState} from 'react';
import {Redirect, useParams} from 'react-router-dom';
import {Button, ListGroup} from 'react-bootstrap';
import {Plus} from 'react-bootstrap-icons';
import LinearProgress from '@material/react-linear-progress';
import '@material/react-linear-progress/dist/linear-progress.css';
import {FilterBy, filterTitles} from './Filters';
import Task from './Task';
import * as Api from '../services/api.service';
import AddTaskModal from './AddTaskModal';

export default function Tasks({handleApiException}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [shouldUpdateTasks, setShouldUpdateTasks] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  const startTaskCreate = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  /**
   * @param task {Task}
   */
  const startTaskUpdate = task => {
    setSelectedTask(task);
    setShowModal(true);
  };

  /**
   * @param task {Task}
   * */
  const upsertTask = async task => {
    setIsLoading(true);
    try {
      if (task.id) {
        await Api.updateTask(task);
      } else {
        await Api.createTask(task);
      }
      setShouldUpdateTasks(true);
    } catch (e) {
      handleApiException(e)
    }
  };

  /**
   * @param task {Task}
   * */
  const updateTaskStatus = async task => {
    setIsLoading(true);
    try {
      await Api.updateTaskStatus(task);
      setShouldUpdateTasks(true);
    } catch (e) {
      handleApiException(e)
    }
  };

  /**
   * @param task {Task}
   */
  const deleteTask = async task => {
    setIsLoading(true);
    try {
      await Api.deleteTask(task);
      setShouldUpdateTasks(true);
    } catch (e) {
      handleApiException(e)
    }
  };

  const {filter} = useParams();

  useEffect(() => {
    setShouldUpdateTasks(true);
  }, [filter]);

  useEffect(() => {
    if (shouldUpdateTasks) {
      setIsLoading(true);
      Api.fetchTasks(filter)
        .then(setTasks)
        .then(() => {
          setIsLoading(false);
          setShouldUpdateTasks(false);
        })
        .catch(e => {
          setIsLoading(false);
          setShouldUpdateTasks(false);
          handleApiException(e);
        });
    }
  }, [shouldUpdateTasks, filter]);

  useEffect(() => {
    if (isLoading === false) {
      const timeout = setTimeout(() => {
        setShowLoadingIndicator(isLoading);
      }, 800);
      return () => {
        clearTimeout(timeout);
      };
    } else {
      setShowLoadingIndicator(isLoading);
    }
  }, [isLoading]);

  if (filter != null && !FilterBy.hasOwnProperty(filter)) {
    return <Redirect to="/"/>
  }

  return <>
    <LinearProgress className="loader"
                    closed={!showLoadingIndicator}
                    indeterminate
                    bufferingDots={false}/>
    <h1>{filterTitles[filter ?? FilterBy.ALL]}</h1>
    <ListGroup>
      {tasks.map(task => <Task task={task}
                               key={task.id}
                               isLoading={isLoading}
                               deleteTask={deleteTask}
                               startTaskUpdate={startTaskUpdate}
                               updateTaskStatus={updateTaskStatus}/>)}
    </ListGroup>
    {showModal ? <AddTaskModal show={showModal}
                               setShow={setShowModal}
                               upsertTask={upsertTask}
                               selectedTask={selectedTask}
    /> : ''}
    <Button className="btn-add btn-success position-fixed rounded-circle p-2"
            onClick={startTaskCreate}
            disabled={isLoading}>
      <Plus className="d-block"/>
    </Button>
  </>
}
