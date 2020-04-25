import React, { useState, useEffect } from "react";
import api from "./services/api";

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [techs, setTechs] = useState([]);
  const [input, setInput] = useState({ title: "", url: "", tech: "" });

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const { data } = await api.get("/repositories");
    setRepositories(data);
  }

  async function handleAddRepository() {
    const { data } = await api.post("repositories", {
      url: input.url,
      title: input.title,
      techs: techs,
    });

    setRepositories([...repositories, data]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`repositories/${id}`);

    const repo = repositories.filter((r) => r.id !== id);
    setRepositories(repo);
  }

  const handleChange = (propertyName) => (e) => {
    const newInputState = {
      ...input,
      [propertyName]: e.target.value,
    };
    setInput(newInputState);
  };

  const handleAddTech = (e) => {
    e.preventDefault();

    if (techs.length > 0) {
      setTechs([...techs, input.tech]);
    } else {
      const newValue = [];
      newValue.push(input.tech);

      setTechs(newValue);
    }
  };

  return (
    <div>
      <ul data-testid="repository-list">
        {repositories &&
          repositories.map((r) => (
            <li key={r.id}>
              {r.title}
              <button onClick={() => handleRemoveRepository(r.id)}>
                Remover
              </button>
            </li>
          ))}
      </ul>

      <form id="form-repo" onSubmit={handleAddRepository}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={input.title}
          onChange={handleChange("title")}
        />
        <label htmlFor="title">Url</label>
        <input
          type="text"
          name="url"
          id="url"
          value={input.url}
          onChange={handleChange("url")}
        />
        <label htmlFor="title">Tecnologia</label>
        <input
          type="text"
          name="tech"
          id="tech"
          value={input.tech}
          onChange={handleChange("tech")}
        />
        <button onClick={handleAddTech}>Nova Tecnologia</button>
      </form>
      <div id="tec-container">
        <ul>
          {techs &&
            techs.map((t) => (
              <li key={t}>
                <div id="tec-label">{t}</div>
              </li>
            ))}
        </ul>
      </div>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
