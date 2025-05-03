import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"


function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    getNotes();
  }, []) // calls function getNotes as soon as we visit age

  const getNotes = () => {
    api.get('/api/notes/')
      .then(res => {
        setNotes(res.data);
        console.log(res.data);
      })
      .catch(err => alert(err));
  }

  const deleteNote = (id) => {
    api.delete(`/api/notes/delete/${id}/`)
      .then(res => {
        if (res.status === 204) {
          alert('Note deleted');
          getNotes(); // updating the screen
        }
        else {
          alert('Error while deleting Note');
        }
      })
      .catch(err => alert(err));
  }

  const createNote = (e) => {
    e.preventDefault();
    api.post("/api/notes/", { title, content })
    .then(res => {
      if (res.status === 201) {
        alert('Note created');
        getNotes();
      }
      else {
        alert('Error while creating Note');
      }
    })
    .catch(err => alert(err));
  }

  return <div>
    <div>
      <h2>Notes</h2>
      {notes.map((note) => <Note note={note} onDelete={deleteNote} key={note.id} />)}
    </div>
    <h2>Create Note</h2>
    <form onSubmit={createNote}>
      <label htmlFor="title">Title:</label>
      <br />
      <input
        type="text"
        id="title"
        name="title"
        required
        onChange={(e) => setTitle(e.target.value)}
        />
      <label htmlFor="content">Content:</label>
      <br />
      <textarea
        name="content"
        id="content"
        cols="30"
        rows="10"
        required
        value = {content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <input type="submit" value="Submit" />
    </form>
  </div>
}

export default Home;