import { useState, useEffect } from 'react';
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => setState({ ...state, day });
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then(all => {
      setState({
        ...state,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });

    });
  }, []);

  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        if (response) {
          const appointment = {
            ...state.appointments[id],
            interview: JSON.parse(response.config.data).interview
          };
          //updating the appointments object and adding the newly created appointment to the existing appointments object
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          setState({ ...state, appointments })
        }
      });
  }
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then((response) => {
        if (response) {
          const appointment = {
            ...state.appointments[id],
            interview: null
          };
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };
          setState({ ...state, appointments })
        }
      })
  }

  return { state, setDay, bookInterview, cancelInterview }
}