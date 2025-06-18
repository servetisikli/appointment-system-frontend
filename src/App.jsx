import React, { useEffect, useState } from "react";
import {
  getAppointments,
  addAppointment,
  updateAppointment,
  deleteAppointment,
} from "./api";

function App() {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    id: null,
    title: "",
    date: "",
    description: "",
    attendee: "",
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function fetchAppointments() {
    setAppointments(await getAppointments());
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editing) {
      // Güncellemede tüm alanları gönder
      await updateAppointment(editing, {
        id: editing,
        title: form.title,
        date: form.date,
        description: form.description,
        attendee: form.attendee,
      });
      setEditing(null);
    } else {
      // Eklemede description ve attendee de gönder
      await addAppointment({
        title: form.title,
        date: form.date,
        description: form.description,
        attendee: form.attendee,
      });
    }
    setForm({ id: null, title: "", date: "", description: "", attendee: "" });
    fetchAppointments();
  }

  function handleEdit(a) {
    setForm({
      id: a.id,
      title: a.title,
      date: a.date,
      description: a.description || "",
      attendee: a.attendee || "",
    });
    setEditing(a.id);
  }

  async function handleDelete(id) {
    await deleteAppointment(id);
    fetchAppointments();
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Randevular</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Başlık"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="date"
          value={form.date}
          onChange={handleChange}
          placeholder="Tarih (YYYY-MM-DD)"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Açıklama"
          className="w-full border rounded px-3 py-2"
        />
        <input
          name="attendee"
          value={form.attendee}
          onChange={handleChange}
          placeholder="Katılımcı"
          className="w-full border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editing ? "Güncelle" : "Ekle"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({
                id: null,
                title: "",
                date: "",
                description: "",
                attendee: "",
              });
            }}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Vazgeç
          </button>
        )}
      </form>

      <ul className="space-y-2">
        {appointments.map((a) => (
          <li
            key={a.id}
            className="flex items-center justify-between border-b py-2"
          >
            <span>
              <span className="font-semibold">{a.title}</span> -{" "}
              <span className="text-gray-600">{a.date}</span>
              {a.description && (
                <span className="ml-2 text-gray-500">({a.description})</span>
              )}
              {a.attendee && (
                <span className="ml-2 text-gray-400">[{a.attendee}]</span>
              )}
            </span>
            <span>
              <button
                onClick={() => handleEdit(a)}
                className="text-yellow-600 hover:underline mr-2"
              >
                Düzenle
              </button>
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-600 hover:underline"
              >
                Sil
              </button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
