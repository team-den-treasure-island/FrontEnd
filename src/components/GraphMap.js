import React, { Component } from 'react';
// import CountdownTimer from 'react-component-countdown-timer';
import uuid from 'uuid';
import axios from 'axios';
import Styled from 'styled-components';
import Loader from 'react-loader-spinner';

import { datajson } from '../data/data';
import Map from './Map.js';
import Players from './Players.js';
import PlayerStats from './PlayerStats.js'
import Navigation from './Navigation.js';
import Items from './Items.js'

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
        Name: '',
        Encumbrance: null,
        Strength: 10,
        Speed: 10,
        Gold: null,
        Inventory: [],
        Status: [],
        Errors: [],
        Messages: []
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
    // if (this.state.currentPlayer !== null){
    // }
  }
  
  componentDidUpdate() {
    console.log('Cooldown:', this.state.cooldown);
    clearInterval(this.interval);
    if (this.state.cooldown > 0) {
      this.interval = setInterval(() => this.setState({
          cooldown: this.state.cooldown - 1
        }),1000);
    } else if (this.state.activeCooldown === true) {
      this.getData()
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

  getData = async (token=this.state.currentPlayer) => {
    console.log('INSIDE GET DATA')
    console.log('TOKEN:', token)
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
      console.log('USER DATA:', res.data);
      console.log(res.data.room_id);

      this.setState({
        player_status: {
          Name: res.data.name,
          Encumbrance: res.data.encumbrance,
          Strength: res.data.strength,
          Speed: res.data.speed,
          Gold: res.data.gold,
          Inventory: res.data.inventory,
          Status: res.data.status,
          Errors: res.data.errors,
          Messages: res.data.messages
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  updateManualPosition = async token => {
    console.log('UPDATING PLAYER POSITION...')
    try {
      let name = idToName[token]
      console.log('NAME:', name)
      let data = { name, current_room: this.state.room_data.current_room_id };
      let res = await axios({
        method: 'put',
        url: `https://gentle-dusk-98459.herokuapp.com/api/players/${name}/`,
        headers: {
          Authorization: `Token 19b25831b9ab279bb5952dce42810fff6f4e2314`,
          'Content-type': 'application/json'
        },
        data
      });
      this.setState({
        cooldown: res.data.cooldown,
        currentPlayer: token
      });
      console.log('new cooldown', this.state.cooldown);
      this.setState({ activeCooldown: true })
      setTimeout(() => {
        this.setState({ activeCooldown: false });
      }, this.state.cooldown * 1000);
    } catch (err) {
      console.log(err);
    }
  }

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
      // Update player position on server
      this.updateManualPosition(token)
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
      this.updateManualPosition(token)

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
      this.setState({
        cooldown: res.data.cooldown,
        currentPlayer: value
      });
      console.log('new cooldown', this.state.cooldown);
      this.setState({ activeCooldown: true })
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
            <CooldownSpinner>
              <div>
                <h2>Cooldown: {this.state.cooldown}</h2>
              </div>
              <Loader type='Rings' color='#cdf279' height={150} width={150} />
            </CooldownSpinner>
          )}
          {!this.state.activeCooldown && (
            <ControlComponents>
              <Navigation
                exits={this.state.room_data.exits}
                movement={exit => this.movement(exit)}
              />
              <Items 
                items={this.state.room_data.items}
                pickup={(item) => this.treasure_pickup(item)}
              />
              <Players
                players={this.state.room_data.players}
                examineRoom={name => this.examineRoom(name)}
                currentRoom={this.state.room_data.current_room_id}
                characters={this.state.characters}
                nameToId={nameToId}
                stopAutopilot={value => this.stopAutopilot(value)}
              />
              <PlayerStats 
                player={this.state.player_status}
              />
              {/* <button onClick={() => this.treasure_drop('tiny treasure')}>
                Drop tiny treasure
              </button> */}
            </ControlComponents>
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
  width: 80vw;
  /* border: 2px solid yellow; */
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0;
  margin: 0;
`;

const ControlContainer = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  border-left: 2px solid black;
  width: 20vw;
  height: 100vh;
  max-height: 100vh;
`;

const ControlComponents = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 20px 10px;
`

const CooldownSpinner = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  /* border: 2px solid red; */

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`

export default GraphMap;
