import { useReducer, useEffect } from 'react';
import axios from "axios";
import reducer from 'reducers/application';
import {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from 'reducers/application';
//function being used in application component for handling data
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
          dispatch({ type: SET_INTERVIEW, id, interview });
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