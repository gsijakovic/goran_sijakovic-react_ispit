import React, { useState } from "react";
import { propTypes } from "react-bootstrap/esm/Image";

import PropTypes from "prop-types";
import axios from "axios";
import { Form, Button, Card } from "react-bootstrap";

//komponenta sa 2 propa gdje user sadrži sve info o korisniku, a repositories niz repositorija samog korisnika; Card komponenta unutar JSX-a je za prikaz infa o korisniku
const UserDetails = ({ user, repositories }) => {
  return (
    <div>
      <Card>
        <Card.Img variant="top" src="{user.avatar_url}" />
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Text>Location: {user.location}</Card.Text>
          <Card.Text>Bio:{user.bio}</Card.Text>
        </Card.Body>
      </Card>

      <h2>Repositories</h2>
      <ul>
        {repositories.map((repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
};

// provjera dokumentiranja propova u React komponenti

UserDetails.propsTypes = {
  user: PropTypes.object.isRequired,
  repositories: propTypes.array.isRequired
};

//pohranjivanje i ažuriranje stanja unutar komponente
const UserForm = ({ onSubmit }) => {
  const [username, setUsername] = useState("");

  //spriječavamo osvježavanje stranice i potom sa onSubmit predajemo trenutnu vriejdnost username
  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(username);
  };

  //JSX struktura forme za unos korisničkog imena, komponenta <form> iz react bootstrapa; funkcija handleSubmit na propu onSubmit se poziv kada se forma pošalje
  //<Form.Group> unutar <Form> za grupiranje elemenata forme sa unique identifikatorom grupe
  // Form.Control komponenta predstavlja HTML <input> za unos teksta; placeholder prop za prikazivanje uputa korisniku da unuse korisničko ime
  //Value jepostavljena na state "username" i kod svake promjene inputa poziva se funkcija setUsername koja ažurira username state na temelju unesene vrijednosti
  //Button za prikaz gumba; variant prop na "primary" za stil gumba te type prop na "submit" da je gumb za slanje forme
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Github Username</Form.Label>
        <From.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(event) => setUsername(event.taget.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Get user data
      </Button>
    </Form>
  );
};

//pomoću useState definiramo user (podaci od gihub korisnika) i repositories(podaci o njegovim repo)
//handleSubmit  sa async za asinkroni proziv prema Github API-ju; pozivamo 2 API rute (za detalje korisnika i repozitorije korisnika)
//u slučaju greške kod API poziva lovimo greške  bloku catch i ispisujemo u konzoli

const App = () => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState();

  const handleSubmit = async (username) => {
    try {
      const userResponse = await axios.get(
        `https://api.github.com/users/${username}`
      );
      const repositoryResponse = await axios.get(
        `https://api.github.com/users/${username}/repos`
      );
      setUser(userResponse.data);
      setRepositories(repositoryResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  //ako korisnik stisne na gumb reset na način da postavljamo user stanje na null i repositories na prazan niz što je ujedno i reste stanja app
  const handleReset = () => {
    setUser(null);
    setRepositories([]);
  };

  return (
    <div className="container">
      <h1>Github user detalji</h1>
      {!user ? (
        <UserForm onSubmit={handleSubmit} />
      ) : (
        <>
          <UserDetails user={user} repositories={repositories} />
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
        </>
      )}
    </div>
  );
};

export default App;
