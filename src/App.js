import { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const API_KEY = "2dcebf52867348558e6152813232402";

function App() {
  const [cityName, setCityName] = useState("");
  const [cityWeather, setCityWeather] = useState(null);

  const getCity = () => {
    const url = `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${cityName}`;

    axios
      .get(url)
      .then(function (response) {
        const { data } = response;

        //round the temperature
        data.current.temp_c = Math.round(data.current.temp_c);

        //add a date + time to the city weather object
        const today = new Date();
        const hour = function () {
          const hr = today.getUTCHours() + (data.location.tz_offset / 3600);
          return hr < 10 ? "0" + hr : hr;
        };
        const minutes = function () {
          return today.getMinutes() < 10
            ? "0" + today.getMinutes()
            : today.getMinutes();
        };
        data.time = hour() + ":" + minutes();
        data.day = today.toLocaleDateString("en-US", { weekday: "long" });

        setCityWeather(data);
      })
      .catch(function (error) {
        console.log(error);
        setCityWeather(null);
      });
  };

  return (
    <Container>
      <Row className="justify-content-center my-5">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Enter city name:</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. London"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" onClick={getCity}>
              Get Weather
            </Button>
          </Form>
        </Col>
      </Row>

      {cityWeather && (
        <Row className="justify-content-center my-5">
          <Col xs={12} md={8} lg={6}>
            <Card>
              <Card.Body>
                <Card.Title>{cityWeather.location.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {cityWeather.day} {cityWeather.time}
                </Card.Subtitle>
                <Card.Text>
                  Temperature: {cityWeather.current.temp_c}°C
                </Card.Text>
                <Card.Text>
                  Feels like: {cityWeather.current.feelslike_c}°C
                </Card.Text>
                <Card.Text>Condition: {cityWeather.current.condition.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default App;
