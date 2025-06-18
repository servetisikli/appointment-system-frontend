import React, { useState, useEffect } from "react";
import { useAppointments } from "../context/AppointmentContext";

const Home = () => {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    addAppointment,
    deleteAppointment,
    updateAppointment,
  } = useAppointments();

  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    description: "",
    attendee: "",
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentAppointment) {
      // Update existing appointment
      updateAppointment({
        ...currentAppointment,
        ...formData,
      });
    } else {
      // Add new appointment
      addAppointment({
        id: Date.now().toString(),
        ...formData,
      });
    }

    // Reset form and close modal
    resetForm();
  };

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    setFormData({
      name: appointment.name,
      date: appointment.date,
      time: appointment.time,
      description: appointment.description,
      attendee: appointment.attendee || "",
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      description: "",
      attendee: "",
    });
    setCurrentAppointment(null);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Appointment System
      </h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
        >
          Add New Appointment
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Attendee
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {appointment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.time}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {appointment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.attendee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(appointment)}
                        className="text-amber-600 hover:text-amber-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding/editing appointments */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {currentAppointment
                  ? "Edit Appointment"
                  : "Add New Appointment"}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Attendee
                  </label>
                  <input
                    type="text"
                    name="attendee"
                    value={formData.attendee || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {currentAppointment ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
