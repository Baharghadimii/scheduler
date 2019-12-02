import React, { useState } from "react";
import InterviewerList from "components/InterviewerList";
import Button from "components/Button";
import PropTypes from 'prop-types';

export default function Form(props) {
  const [name, setName] = useState(props.name || "");
  const [interviewer, setInterviewer] = useState(props.interviewer || null);
  const [error, setError] = useState("");
  //validate two props: selected should be number and setInterviewer should be required function
  InterviewerList.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func.isRequired
  };
  //validate if user types the name then save the appointment
  function validate() {
    if (name === "") {
      setError("Student name cannot be blank");
      return;
    }
    props.onSave(name, interviewer);
  }
  return (
    <main className="appointment__card appointment__card--create">
      <section className="appointment__card-left">
        {/* onSubmit event is added to prevent the default refresh and form submit behavior */}
        <form autoComplete="off" onSubmit={event => event.preventDefault()}>
          <input
            className="appointment__create-input text--semi-bold"
            name="name"
            type="text"
            placeholder="Enter Student Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            /*
          This must be a controlled component
        */
            data-testid="student-name-input"
          />
          <section className="appointment__validation">{error}</section>
        </form>
        <InterviewerList
          interviewers={props.interviewers}
          value={interviewer}
          onChange={setInterviewer}
        />
      </section>
      <section className="appointment__card-right">
        <section className="appointment__actions">
          {/* Changed the props to onCancel as it was changed it in the index.js */}
          <Button danger onClick={props.onCancel}>
            Cancel
          </Button>
          <Button confirm onClick={validate}>
            Save
          </Button>
        </section>
      </section>
    </main >

  );

}