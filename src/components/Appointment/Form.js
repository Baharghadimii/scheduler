import React, { useState } from "react";
import Button from "components/Button";
import InterviewerList from "components/InterviewerList";
import useVisualMode from "hooks/useVisualMode";

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);

  useVisualMode();

  return <main className="appointment__card appointment__card--create">
    <section className="appointment__card-left">
      <form autoComplete="off">
        <input
          className="appointment__create-input text--semi-bold"
          name={name}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter Student Name"
          onSubmit={(event) => event.preventDefault()}
        />
      </form>
      <InterviewerList
        interviewers={[]}
        interviewer={interviewer}
        setInterviewer={setInterviewer}
      />
    </section>
    <section className="appointment__card-right">
      <section className="appointment__actions">
        <Button danger onClick={props.onCancel}>Cancel</Button>
        <Button confirm onClick={props.onSave}>Save</Button>
      </section>
    </section>
  </main>
}