import React, { Component } from 'react';
// import CountdownTimer from 'react-component-countdown-timer';
import uuid from 'uuid';
import axios from 'axios';
import Styled from 'styled-components';
import Loader from 'react-loader-spinner';

import { datajson } from '../data/data';
import Map from './Map.js';
import Players from './Players.js';
import Navigation from './Navigation.js';

const idToName = {
  '4b0963db718e09fbe815d75150d98d79d9a243bb': 'kittendaddy69',
  '5d57a24ad7c366fb7c3de0db9a2d7f1ccd6aaacf': 'anon_denlife_loyalist',
  '11fca1909b41121878367faa97cc6e92a3286cf0': 'DenLifeZero',
  '1862aa8dfe43381b4fbbdbbc5a83397e65824b54': 'goose_h8r',
  '203ef3ef95a3e8c6ef25faa74f40cc384d6378ec': 'strugglebusallday'
};
const nameToId = {
  kittendaddy69: '4b0963db718e09fbe815d75150d98d79d9a243bb',
  anon_denlife_loyalist: '5d57a24ad7c366fb7c3de0db9a2d7f1ccd6aaacf',
  DenLifeZero: '11fca1909b41121878367faa97cc6e92a3286cf0',
  goose_h8r: '1862aa8dfe43381b4fbbdbbc5a83397e65824b54',
  strugglebusallday: '203ef3ef95a3e8c6ef25faa74f40cc384d6378ec'
};

export class GraphMap extends Component {
  constructor(props) {
    super();

    this.interval = null;

    this.state = {
      id: uuid,
      cooldown: 0,
      activeCooldown: false,
      inventory: [],
      next_room_id: -1,
      characters: Object.keys(nameToId),
      characterIds: Object.values(nameToId),
      currentPlayer: null,
      room_data: {
        current_room_id: -1,
        previous_room_id: null,
        exits: [],
        items: [],
        players: [],
        errors: [],
        messages: [],
        title: null,
        description: null,
        coordinates: null,
        elevation: null,
        terrain: ''
      },
      player_status: {
        name: '',
        encumberance: null,
        strength: 10,
        speed: 10,
        gold: null,
        inventory: [],
        status: [],
        errors: [],
        messages: []
      },
      examined: {},
      coordinates: [],
      neighbors: []
    };
  }

  componentDidMount() {
    // this.getInit();
    this.getCoords(datajson);
    if (this.state.activeCooldown) {
      this.checkCooldown();
    }
  }

  componentDidUpdate() {
    console.log('Cooldown:', this.state.cooldown);
    clearInterval(this.interval);
    if (this.state.cooldown > 0) {
      this.interval = setInterval(
        () =>
          this.setState({
            cooldown: this.state.cooldown - 1
          }),
        1000
      );
    } else if (this.state.activeCooldown === true) {
      this.setState({
        activeCooldown: false
      });
    }
  }

  examineRoom = async (name, token = this.state.currentPlayer) => {
    let data = { name: name.player };

    try {
      let res = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/examine/`,
        headers: {
          Authorization: `Token ${token}`
        },
        data
      });

      console.log(res.data);

      this.setState({
        cooldown: res.data.cooldown,
        examined: {
          name: res.data.name,
          description: res.data.description,
          errors: res.data.errors,
          messages: res.data.messages
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  getCoords = data => {
    let coordinates = [];
    let neighbors = [];
    for (let key in data) {
      coordinates.push({ x: data[key][0]['x'], y: data[key][0]['y'], id: key });
      neighbors.push(data[key][1]);
    }
    console.log('COORDINATES', coordinates);
    console.log('neighbors', neighbors);
    this.setState({
      coordinates,
      neighbors
    });
  };

  getData = async token => {
    try {
      let res = await axios({
        url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/',
        method: 'post',
        timeout: 8000,
        headers: {
          Authorization: `Token ${token}`
        }
      });
      if (res.status === 200) {
        // test for status you want, etc
        console.log(res.status);
      }
      // Don't forget to return something
      console.log(res.data);
      console.log(res.data.room_id);

      this.setState({
        player_status: {
          name: res.data.name,
          encumberance: res.data.encumberance,
          strength: res.data.strength,
          speed: res.data.speed,
          gold: res.data.gold,
          inventory: res.data.inventory,
          status: res.data.status,
          errors: res.data.errors,
          messages: res.data.messages
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  getInit = async token => {
    try {
      let res = await axios({
        method: 'get',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/init/`,
        headers: {
          Authorization: `Token ${token}`
        }
      });
      console.log(res.data);

      this.setState({
        cooldown: res.data.cooldown,
        activeCooldown: true,
        room_data: {
          current_room_id: res.data.room_id,
          previous_room_id: this.state.room_data.current_room_id,
          exits: res.data.exits,
          items: res.data.items,
          players: res.data.players,
          errors: res.data.errors,
          messages: res.data.messages,
          title: res.data.title,
          description: res.data.description,
          coordinates: res.data.coordinates,
          elevation: res.data.elevation,
          terrain: res.data.terrain
        }
      });
    } catch (err) {
      // TODO error handling for 400 cooldown not happening
      console.log(err);
    }
  };

  checkCooldown = () => {
    console.log('COOLING OFF...');
    setTimeout(() => {
      console.log('Cooldown:', this.state.cooldown);
      console.log('Setting activeCooldown to false');
      this.setState({ activeCooldown: false });
    }, this.state.cooldown * 1000);
  };

  movement = async (move, token = this.state.currentPlayer) => {
    console.log('movement token', token);
    console.log('movement currentplayer', this.state.currentPlayer);
    // TODO: Make call to another method that grabs the next room from our server --> update state
    let data;
    let dir = Object.values(move)[0];
    let next = datajson[this.state.room_data.current_room_id][1][dir];
    data = {
      direction: dir.toString(),
      next_room_id: next.toString()
    };
    try {
      let res = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
        headers: {
          Authorization: `Token ${token}`
        },
        data
      });
      console.log(res.data);
      console.table('State', this.state.cooldown);

      this.setState({
        id: uuid,
        cooldown: res.data.cooldown,
        activeCooldown: true,
        next_room_id: next,
        room_data: {
          current_room_id: res.data.room_id,
          previous_room_id: this.state.room_data.current_room_id,
          exits: res.data.exits,
          items: res.data.items,
          players: res.data.players,
          errors: res.data.errors,
          messages: res.data.messages,
          title: res.data.title,
          description: res.data.description,
          coordinates: res.data.coordinates,
          elevation: res.data.elevation,
          terrain: res.data.terrain
        }
      });
      console.table('State', this.state.cooldown);

      // setTimeout(() => {
      //   this.getData();
      // }, res.data.cooldown * 1000);
    } catch (err) {
      console.error(err);
    }
  };

  // pray = async () => {
  //   try {
  //     let res = await axios({
  //       method: 'post',
  //       url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/pray/`,
  //       headers: {
  //         Authorization: 'Token 4b0963db718e09fbe815d75150d98d79d9a243bb'
  //       }
  //     });
  //     // TODO: When we find a shrine figure out the res data
  //     console.log(res.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  treasure_pickup = async (name, token = this.state.currentPlayer) => {
    let data = { name: name.item };
    try {
      let res = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/take/`,
        headers: {
          Authorization: `Token ${token}`
        },
        data
      });
      this.setState({
        cooldown: res.data.cooldown
      });
      console.log('picked up', { name });
      console.log('cooldown', this.state.cooldown);
      // TODO: Call status
    } catch (err) {
      console.log(err);
    }
  };

  treasure_drop = async (name, token = this.state.currentPlayer) => {
    let data = { name };
    try {
      let res = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/drop/`,
        headers: {
          Authorization: `Token ${token}`
        },
        data
      });
      this.setState({
        cooldown: res.data.cooldown
      });
      console.log('dropped', { name });
      console.log('cooldown', this.state.cooldown);
      // TODO: Call status
    } catch (err) {
      console.log(err);
    }
  };

  stopAutopilot = async value => {
    let name = idToName[value];
    let data = { name, explore_mode: false };
    try {
      let res = await axios({
        method: 'put',
        url: `https://gentle-dusk-98459.herokuapp.com/api/players/${name}/`,
        // url: `https://gentle-dusk-98459.herokuapp.com/api/players/strugglebusallday/`,
        headers: {
          Authorization: `Token 19b25831b9ab279bb5952dce42810fff6f4e2314`,
          'Content-type': 'application/json'
        },
        data
      });
      console.log('RESPOINSE!!!!!', res);
      this.setState({
        cooldown: res.data.cooldown,
        currentPlayer: value
      });
      console.log('new cooldown', this.state.cooldown);
      setTimeout(() => {
        this.setState({ activeCooldown: false });
        this.getInit(value);
      }, this.state.cooldown * 1000);
    } catch (err) {
      console.log(err);
    }
    // TODO:
    // send api to backend to turn off autopilot for specific user id
    // Cooldown
    // this.getInit(value);
  };

  render() {
    return (
      <MainContainer>
        <MapWrapper>
          <Map
            nextRoom={this.state.next_room_id}
            roomId={this.state.room_data.current_room_id}
            coordinates={this.state.coordinates}
            neighbors={this.state.neighbors}
          />
        </MapWrapper>
        <ControlContainer>
          {this.state.activeCooldown && (
            <>
              <h1>Cooldown: {this.state.cooldown}</h1>
              <Loader type="Puff" color="#ff1f1f" height="150" width="150" />
            </>
          )}

          {!this.state.activeCooldown && (
            <>
              <Navigation
                exits={this.state.room_data.exits}
                movement={exit => this.movement(exit)}
              />

              {this.state.room_data.items.length !== 0 ? (
                this.state.room_data.items.map(item => (
                  <ul key={item}>
                    <li>Items in room:</li>
                    <button onClick={() => this.treasure_pickup({ item })}>
                      pick up: {item}
                    </button>
                  </ul>
                ))
              ) : (
                <p>This room contains no items</p>
              )}

              <Players
                players={this.state.room_data.players}
                examineRoom={name => this.examineRoom(name)}
                currentRoom={this.state.room_data.current_room_id}
              />

              <button onClick={() => this.treasure_drop('tiny treasure')}>
                Drop tiny treasure
              </button>

              <select
                onChange={e => {
                  this.stopAutopilot(e.target.value);
                }}
              >
                <option>Choose your player!</option>
                {this.state.characters.map(chars => (
                  <option value={nameToId[chars]}>{chars}</option>
                ))}
              </select>
            </>
          )}
        </ControlContainer>
      </MainContainer>
    );
  }
}

const MainContainer = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;



`;

const MapWrapper = Styled.div`
  width: 100%;
  /* border: 2px solid yellow; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgb(114,201,221); */
/* background: linear-gradient(0deg, rgba(114,201,221,1) 0%, rgba(48,125,228,0.8751778054971989) 43%, rgba(0,212,255,1) 98%); */
`;

const ControlContainer = Styled.div`
  font-family: 'Anton', sans-serif;
  display: flex;
  flex-direction: column;
  /* border: 2px solid yellow; */
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px;
  height: 94%;
  border-left: 2px solid black;
  background-color: tan;
`;

export default GraphMap;
