import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, InputGroup, FormControl, Button, Row, Card} from 'react-bootstrap'
import { useState, usEffect, useEffect } from 'react'

const CLIENT_ID = "ec8bce885bf3470b9d49e883f4bf9629";
const CLIENT_SECRET = "e9170a7e917841ba8c4ee13d6b1ec191";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    //API Access token 
    var authParameters = {
      method: 'POST',
      headers:{
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }

    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then(result => result.json())
      .then(data => setAccessToken(data.access_token))
  },[])

  //Search
  async function search() {
    console.log("Search for " + searchInput)

  //Get request using search to get Artist ID
  var searchParameters = {
    method:'GET',
    headers:{
      'Content-Type' : 'applicaiton/json',
      'Authorization' : 'Bearer ' + accessToken
    }
  }

  

  var artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data => { return data?.artist?.items?.[0]?.id })

    console.log("Artist ID is " + artistID);
  //Get request with Artist ID grab all the albums from that artist
  
  // const myTimeout = setTimeout(() => {},5000);
  
  var albums = await fetch('https://api.spotify.com/v1/artist/' + artistID + '/album' + '?include_groups=album&market=US&limit=50', searchParameters)
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  //Display those albums to the user 

}

  return (

    <div className="App">
      <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl
          placeholder='Search For Artist'
          type='input'
          onKeyPress={event => {
            if(event.key == "Enter"){
              search();
            }
          }}
          onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick= {search} >
              Search
          </Button>
        </InputGroup>
      </Container>

      <Container>
        <Row className='mx-2 row row-cols-4'>

        <Card>
          <Card.Img src='#'/>
          <Card.Body>
            <Card.Title>Album Name Here</Card.Title>
          </Card.Body>
          </Card>

        </Row>
        </Container>
      
    </div>
  );
}

export default App;
