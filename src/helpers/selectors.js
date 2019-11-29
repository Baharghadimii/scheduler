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


