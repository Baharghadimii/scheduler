import { useReducer, useEffect } from 'react';
import axios from "axios";
const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW:
      const appointment = {
        ...state.appointments[action.id],
        interview: action.interview && { ...action.interview }
      };
      //updating the appointments object and adding the newly created appointment to the existing appointments object
      const appointments = {
        ...state.appointments,
        [action.id]: appointment
      };
      return { ...state, appointments }
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
export default function useApplicationData() {

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const setDay = day => dispatch({ type: SET_DAY, day });

  //setting initial data using api call
  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then(all => {
      const days = all[0].data;
      const appointments = all[1].data;
      const interviewers = all[2].data;
      dispatch({ type: SET_APPLICATION_DATA, days, appointments, interviewers });
    });
  }, []);

  //setting interview with appointment id and interview object
  function bookInterview(id, interview) {
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        if (response) {
          dispatch({ type: SET_INTERVIEW, id, interview })
        }
      });
  }
  //cancelling interview  with appointment id 
  function cancelInterview(id) {
    return axios.delete(`/api/appointments/${id}`)
      .then((response) => {
        if (response) {
          dispatch({ type: SET_INTERVIEW, id, interview: null })
        }
      })
  }

  return { state, setDay, bookInterview, cancelInterview }
}