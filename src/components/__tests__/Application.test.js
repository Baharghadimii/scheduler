import React from "react";
import {
  render,
  cleanup,
  waitForElement,
  getByText,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  getByDisplayValue,
  queryByAltText
} from "@testing-library/react";
import axios from "axios";
import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

afterEach(cleanup);
describe(("Application"), () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />)
    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];
    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));


    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday");
    })
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  })
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the first empty appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Are you sure?!")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, 'Confirm'));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday");
    })
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });
  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. finding one existing appointment
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    // 4. Click on the edit button
    fireEvent.click(getByAltText(appointment, "Edit"));
    // 5. Form should be shown with student name and selected interviewer
    fireEvent.change(getByDisplayValue(appointment, "Archie Cohen"), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByText(appointment, "Save"));
    // 6. Check that the element with the text “Saving” is displayed.
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    // 7. Wait until the element with the text “Lydia Miller-Jones” is displayed.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // 8. Check that the DayListItem with the text “Monday” also has the text “1 spot remaining”.
    const day = getAllByTestId(container, "day").find(day => {
      return queryByText(day, "Monday");
    });

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });
  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() =>
      getByText(appointment, "You must choose one interviewer!")
    );
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Are you sure?!")
    ).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    await waitForElement(() =>
      getByText(appointment, "Unable to delete the appointment!")
    );
  });
});

