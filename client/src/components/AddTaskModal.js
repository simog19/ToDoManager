import {Button, Col, Form, Modal, Row} from 'react-bootstrap';
import {Formik} from 'formik';
import DayJs from '../utils/dayjs';

const initialValues = {
  description: '',
  deadline: '',
  important: false,
  private: false,
};

export default function AddTaskModal({show, setShow, upsertTask, selectedTask}) {
  const close = () => setShow(false);

  let initialTaskValues = {...initialValues};

  if (selectedTask !== null) {
    initialTaskValues = {...selectedTask}
  }

  if (initialTaskValues?.deadline) {
    initialTaskValues.deadline = initialTaskValues.deadline.format("YYYY-MM-DDTHH:mm");
  } else {
    initialTaskValues.deadline = "";
  }


  return (
    <Formik
      initialValues={/** @type {Task} */initialTaskValues}
      validate={values => {
        const errors = {};
        if (!values.description) {
          errors.description = 'Please enter a description';
        } else if (values.deadline !== '') {
          const dayjsDeadline = DayJs(values.deadline);
          if (!dayjsDeadline.isValid()) {
            errors.deadline = 'Invalid date'
          }
        }
        return errors;
      }}
      onSubmit={(values, {setSubmitting}) => {

        let submitTask = {
          ...values,
        }

        if (selectedTask) {
          submitTask.id = selectedTask.id;
        }


        if (values.deadline === "") {
          delete submitTask.deadline;
        } else {
          submitTask.deadline = DayJs(values.deadline);
        }

        upsertTask(submitTask);

        setSubmitting(false);
        close()
      }
      }
    >
      {
        ({
           values,
           errors,
           handleChange,
           handleBlur,
           handleSubmit,
           setFieldValue,
           isSubmitting,
         }) => (
          <Modal show={show} onHide={close} animation={false}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedTask ? "Edit Task" : "Add new Task"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control type="text"
                                name="description"
                                placeholder="Enter a description"
                                value={values.description}
                                onChange={handleChange}
                                disabled={isSubmitting}
                                className="mb-2"/>
                  {errors.description &&
                  <Form.Text className="text-danger">
                    {errors.description}
                  </Form.Text>
                  }
                  <Form.Label> Due date</Form.Label>
                  <Form.Control type="datetime-local"
                                name="deadline"
                                placeholder="Enter a deadline"
                                value={values.deadline}
                                disabled={isSubmitting}
                                onChange={event => setFieldValue('deadline', event.nativeEvent.target.value)}
                                onBlur={handleBlur}
                                className="mb-2"/>
                  {errors.deadline &&
                  <Form.Text className="text-danger">
                    {errors.deadline}
                  </Form.Text>
                  }
                  <Row className="mt-2">
                    <Col>
                      <div className="checkbox">
                        <Form.Check type="checkbox"
                                    id="important"
                                    label="Important"
                                    checked={values.important}
                                    onChange={e => setFieldValue('important', e.target.checked)}
                                    disabled={isSubmitting}
                                    custom/>
                      </div>
                    </Col>
                    <Col>
                      <div className="checkbox">
                        <Form.Check type="checkbox"
                                    id="private"
                                    label="Private"
                                    checked={values.private}
                                    onChange={e => setFieldValue('private', e.target.checked)}
                                    disabled={isSubmitting}
                                    custom/>
                      </div>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={close}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        )
      }
    </Formik>
  );
}
