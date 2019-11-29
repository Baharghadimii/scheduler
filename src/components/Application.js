import React, { useState, useEffect } from "react";
import "components/Application.scss";
import DayList from "components/DayList";
import Appointment from "components/Appointment";
import { getAppointmentsForDay, getInterview } from "helpers/selectors";

const axios = require('axios');

export default function Application(props) {
  //initial state object
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });
  //save new appointment
  function bookInterview(id, interview) {
    console.log(id, interview);
    //add the appointment object
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    //add new appointment object to object of appointments
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  }

  useEffect(() => {
    //fetch data from the api
    Promise.all([
      Promise.resolve(axios.get('/api/days')),
      Promise.resolve(axios.get('/api/appointments')),
      Promise.resolve(axios.get('/api/interviewers')),
    ]).then((all) => {
      //update state object with data from api
      setState(prev => ({ ...state, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
    });
  }, []);
  //get booked appointments for the selected day
  const app = getAppointmentsForDay(state, state.day).map(appointment => {
    //get interview object for each appointment
    const interview = getInterview(state, appointment.interview);
    return (
      < Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        bookInterview={bookInterview}
      />
    );
  });
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {app}
      </section>
    </main>
  );
}
