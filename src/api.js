const API_URL = "http://localhost:5137/api/appointment";

export async function getAppointments() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function addAppointment(appointment) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });
  return response.json();
}

export async function updateAppointment(id, appointment) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(appointment),
  });
  if (response.status === 204) return;
  return response.json();
}

export async function deleteAppointment(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
