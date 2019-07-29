import React, { Component } from 'react';
import axios from 'axios';
export class GraphMap extends Component {
  constructor(props){
    super()

    state = {
      cooldown: null,
      inventory: [],
      room_data: {
        current_room: 0,
        previous_room: null,
        exits: [],
        items: [],
        players: [],
        errors: [],
        messages: [],
        title: null,
        description: null,
        coordinates: null,
        elevation: null,
        terrain: '',
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
        messages: [],
      }
    }
  }


  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      let res = await axios({
        url: 'https://lambda-treasure-hunt.herokuapp.com/api/adv/status/',
        method: 'post',
        timeout: 8000,
        headers: {
          Authorization: 'Token 4b0963db718e09fbe815d75150d98d79d9a243bb'
        }
      });
      if (res.status === 200) {
        // test for status you want, etc
        console.log(res.status);
      }
      // Don't forget to return something
      console.log(res.data);
      console.log(res.data.room_id);

      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  movement = async (move, next_room_id = null) => {
    let data;
    if (next_room_id !== null) {
      data = {
        direction: move,
        next_room_id: next_room_id.toString()
      };
    } else {
      data = {
        direction: move
      };
    }
    try {
      let res = await axios({
        method: 'post',
        url: `https://lambda-treasure-hunt.herokuapp.com/api/adv/move/`,
        headers: {
          Authorization: 'Token 4b0963db718e09fbe815d75150d98d79d9a243bb'
        },
        data
      });
      console.log(res.data);
      setTimeout(() => {
        this.getData();
      }, res.data.cooldown * 1000);
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <div>
        <button onClick={() => this.movement('n')}>North</button>
        <button onClick={() => this.movement('s')}>South</button>
        <button onClick={() => this.movement('w')}>West</button>
        <button onClick={() => this.movement('e')}>East</button>
      </div>
    );
  }
}

export default GraphMap;
