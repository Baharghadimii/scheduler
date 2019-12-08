import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "hooks/useVisualMode"
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE_WITH_NO_INTERVIEWER = "ERROR_SAVE_WITH_NO_INTERVIEWER";

  const { interview } = props;
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  function save(name, interviewer) {

    if (!interviewer) {
      transition(ERROR_SAVE_WITH_NO_INTERVIEWER, true);
      return;
    }
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING, true)
    props.bookInterview(props.id, interview)
      .then(() => {
        transition(SHOW)
      })
      .catch(() => transition(ERROR_SAVE))
  }
  function remove() {
    transition(DELETING, true)
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true)
      );
  }
  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE &&
        <Form onCancel={back} onSave={save} interviewers={props.interviewers} />
      }
      {mode === SAVING &&
        <Status message="Saving" />
      }
      {mode === DELETING &&
        <Status message="Deleting" />
      }
      {mode === CONFIRM &&
        <Confirm onConfirm={remove} onCancel={() => transition(SHOW)} />
      }
      {mode === EDIT &&
        <Form
          name={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      }
      {mode === ERROR_SAVE &&
        <Error message="Unable to save the appointment!" onClose={() => transition(SHOW)} />
      }
      {mode === ERROR_SAVE_WITH_NO_INTERVIEWER &&
        <Error message="You must choose one interviewer!" onClose={() => transition(CREATE, true)} />
      }
      {mode === ERROR_DELETE &&
        <Error message="Unable to delete the appointment!" onClose={() => transition(SHOW)} />
      }
    </article>
  );
}