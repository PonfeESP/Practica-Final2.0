import logo from './../logo.svg';
import './Home.css';
import { useEffect, useState } from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';
import { TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { navigate } from 'react-router-dom';

function Timer(props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <div>Llevas en esta página {seconds} segundos</div>;
}

function Cine() {
  const [data, setData] = useState([{ error: "" }]);
  useEffect(() => {
    const consultaAPI = async () => {
      axios({
        url: 'http://localhost:8000/cinemas',
        method: 'POST',
        data: {}
      }).then(res => setData(res.data));
    };
    consultaAPI();
  }, [setData]);
  return (
    <>
      <h2>Datos del cine:</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {Object.keys(data[0]).map(elem => (<TableCell key={elem}>{elem}</TableCell>))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {Object.keys(data[0]).map(elem => (<TableCell key={elem}>{row[elem]}</TableCell>))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

const Home = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [userError, setUserError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const performLogin = (event) => {
    event.preventDefault();
    setUserError(false);
    setPasswordError(false);

    if (username === '') setUserError(true);
    if (password === '') setPasswordError(true);

    if (!!username && !!password) {
      axios({
        url: 'http://localhost:8000/login',
        method: 'POST',
        withCredentials: true,
        data: {
          username: username,
          password: password,
        }
      }).then(response => {
        if (!response.data.error) {
          setSuccessMessage('Inicio de sesión exitoso');
          
        }
      })
    }
  };

  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>
          Create React App + Material-UI
        </p>

        <form onSubmit={performLogin}>
          <label>
            Username:
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
            {userError && <span className="error">Please enter a username</span>}
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            {passwordError && <span className="error">Please enter a password</span>}
          </label>
          <button type="submit">Log in</button>
        </form>

        {successMessage && <div>{successMessage}</div>}

        {/*<ButtonGroup variant="contained" aria-label="outlined primary button group">
          <Button variant="primary">PRIMARY BUTTON</Button>
          <Button variant="secondary">SECONDARY BUTTON</Button>
        </ButtonGroup>

        <Timer />*/}

        {successMessage && <Cine />}
      </header>
    </div>
  );
}

export default Home;