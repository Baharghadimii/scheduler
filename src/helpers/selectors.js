const state = {
  days: [
    {
      id: 1,
      name: "Monday",
      appointments: [1, 2, 3],
      interviewers: [1, 2, 3]
    },
    {
      id: 2,
      name: "Tuesday",
      appointments: [4, 5],
      interviewers: [4, 5]
    }
  ],
  appointments: {
    "1": { id: 1, time: "12pm", interview: null },
    "2": { id: 2, time: "1pm", interview: null },
    "3": {
      id: 3,
      time: "2pm",
      interview: { student: "Archie Cohen", interviewer: 2 }
    },
    "4": { id: 4, time: "3pm", interview: null },
    "5": {
      id: 5,
      time: "4pm",
      interview: { student: "Chad Takahashi", interviewer: 2 }
    }
  },
  interviewers: {
    "1": {
      "id": 1,
      "name": "Sylvia Palmer",
      "avatar": "https://i.imgur.com/LpaY82x.png"
    },
    "2": {
      id: 2,
      name: "Tori Malcolm",
      avatar: "https://i.imgur.com/Nmx0Qxo.png"
    },
    "3": {
      id: 3,
      name: "Mildred Nazir",
      avatar: "https://i.imgur.com/T2WwVfS.png"
    },
    "4": {
      id: 4,
      name: "Sven Jones",
      avatar: "https://i.imgur.com/twYrpay.jpg"
    },
    "5": {
      id: 5,
      name: "Susan Reynolds",
      avatar: "https://i.imgur.com/TdOAdde.jpg"
    },
  }

};
export function getAppointmentsForDay(state, d) {
  let result = [];
  const days = state.days.filter(day => day.name === d);
  if (days[0]) {
    days[0].appointments.forEach(element => {
      if (state.appointments[element]) {
        result.push(state.appointments[element]);
      }
    });
  }

  return result;
}
export function getInterview(state, interview) {
  let result = null;
  if (interview) {
    result = { ...interview, interviewer: state.interviewers[interview.interviewer] };
  }
  return result;
}
export function getInterviewersForDay(state, d) {
  let result = [];
  const days = state.days.filter(day => day.name === d);
  if (days.length) {
    days[0].interviewers.forEach(element => {
      if (state.interviewers[element]) {
        result.push(state.interviewers[element]);
      }
    });
  }
  return result;
}


