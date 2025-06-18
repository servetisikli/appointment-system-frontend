import React, { createContext, useContext, useReducer } from "react";
import {
  getAppointments,
  addAppointment as apiAddAppointment,
  updateAppointment as apiUpdateAppointment,
  deleteAppointment as apiDeleteAppointment,
} from "../api";

// Initial state
const initialState = {
  appointments: [],
  loading: false,
  error: null,
};

// Reducer function
const appointmentReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_APPOINTMENTS_START":
      return { ...state, loading: true };
    case "FETCH_APPOINTMENTS_SUCCESS":
      return { ...state, loading: false, appointments: action.payload };
    case "FETCH_APPOINTMENTS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      };
    case "DELETE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter(
          (app) => app.id !== action.payload
        ),
      };
    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((app) =>
          app.id === action.payload.id ? action.payload : app
        ),
      };
    default:
      return state;
  }
};

// Create context
const AppointmentContext = createContext();

// Provider component
export const AppointmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  // Functions to interact with appointments
  const fetchAppointments = async () => {
    dispatch({ type: "FETCH_APPOINTMENTS_START" });
    try {
      const data = await getAppointments();
      dispatch({ type: "FETCH_APPOINTMENTS_SUCCESS", payload: data });
    } catch (error) {
      dispatch({ type: "FETCH_APPOINTMENTS_ERROR", payload: error.message });
    }
  };

  const addAppointment = async (appointment) => {
    try {
      // Convert frontend model to backend model
      const backendAppointment = {
        title: appointment.name,
        date: combineDateTime(appointment.date, appointment.time),
        description: appointment.description,
        attendee: appointment.attendee || "",
      };

      const newAppointment = await apiAddAppointment(backendAppointment);

      // Convert backend response to frontend model for state update
      const frontendAppointment = {
        id: newAppointment.id,
        name: newAppointment.title,
        date: formatDate(newAppointment.date),
        time: formatTime(newAppointment.date),
        description: newAppointment.description,
        attendee: newAppointment.attendee,
      };

      dispatch({ type: "ADD_APPOINTMENT", payload: frontendAppointment });
      return frontendAppointment;
    } catch (error) {
      dispatch({ type: "FETCH_APPOINTMENTS_ERROR", payload: error.message });
      throw error;
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await apiDeleteAppointment(id);
      dispatch({ type: "DELETE_APPOINTMENT", payload: id });
    } catch (error) {
      dispatch({ type: "FETCH_APPOINTMENTS_ERROR", payload: error.message });
      throw error;
    }
  };

  const updateAppointment = async (appointment) => {
    try {
      // Convert frontend model to backend model
      const backendAppointment = {
        id: appointment.id,
        title: appointment.name,
        date: combineDateTime(appointment.date, appointment.time),
        description: appointment.description,
        attendee: appointment.attendee || "",
      };

      await apiUpdateAppointment(appointment.id, backendAppointment);
      dispatch({ type: "UPDATE_APPOINTMENT", payload: appointment });
      return appointment;
    } catch (error) {
      dispatch({ type: "FETCH_APPOINTMENTS_ERROR", payload: error.message });
      throw error;
    }
  };

  // Helper function to combine date and time strings into a DateTime
  const combineDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date().toISOString();

    const date = new Date(dateStr);

    if (timeStr) {
      const [hours, minutes] = timeStr.split(":");
      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
    }

    return date.toISOString();
  };

  // Helper function to format date from ISO string to YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString().split("T")[0];
  };

  // Helper function to format time from ISO string to HH:MM
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const value = {
    appointments: state.appointments.map((app) => ({
      id: app.id,
      name: app.title || app.name, // Handle both structures
      date:
        app.date instanceof Date
          ? formatDate(app.date)
          : typeof app.date === "string" && app.date.includes("T")
          ? formatDate(app.date)
          : app.date,
      time:
        app.time ||
        (app.date instanceof Date ||
        (typeof app.date === "string" && app.date.includes("T"))
          ? formatTime(app.date)
          : ""),
      description: app.description,
      attendee: app.attendee,
    })),
    loading: state.loading,
    error: state.error,
    fetchAppointments,
    addAppointment,
    deleteAppointment,
    updateAppointment,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use the appointment context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentProvider"
    );
  }
  return context;
};
