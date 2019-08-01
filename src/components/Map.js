import React from 'react';
// import Styled from 'styled-components';
import { useRef, useEffect } from 'react';

const Map = props => {
  const ref = useRef();
  const { coordinates, neighbors, roomId, nextRoom } = props;

  useEffect(() => {
    // console.log(coordinates)
    const canvas = ref.current;
    canvas.width = 900;
    canvas.height = 640;
    const context = canvas.getContext('2d');
    const minX = 50;
    const minY = 40;
    const maxX = 74;
    const maxY = 80;
    const BoxSize = 8;

    const transX = x => {
      const newX = (x - minX) * (canvas.width / (maxX - minX));
      return newX;
    };

    const transY = y => {
      const newY = (maxY - y) * (canvas.height / (maxY - minY));
      return newY;
    };

    for (let room in coordinates) {

      if (neighbors[room]['n']) {
        let direction = neighbors[room]['n'];
        context.strokeStyle = '#cdf279';
        context.lineWidth = '2';
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + BoxSize / 2,
          transY(coordinates[room]['y'])
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + BoxSize / 2,
          transY(coordinates[direction]['y']) + BoxSize
        );
        context.stroke();
      }
      if (neighbors[room]['s']) {
        let direction = neighbors[room]['s'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + BoxSize / 2,
          transY(coordinates[room]['y']) + BoxSize
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + BoxSize / 2,
          transY(coordinates[direction]['y']) + BoxSize
        );
        context.stroke();
      }
      if (neighbors[room]['e']) {
        let direction = neighbors[room]['e'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + BoxSize,
          transY(coordinates[room]['y']) + BoxSize / 2
        );
        context.lineTo(
          transX(coordinates[direction]['x']),
          transY(coordinates[direction]['y']) + BoxSize / 2
        );
        context.stroke();
      }
      if (neighbors[room]['w']) {
        let direction = neighbors[room]['w'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']),
          transY(coordinates[room]['y']) + BoxSize / 2
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + 5,
          transY(coordinates[direction]['y']) + BoxSize / 2
        );
        context.stroke();
      }

    }
    
    for (let room in coordinates) {
      
      if (coordinates[room]['id'].toString() === roomId.toString()) {
        context.fillStyle = '#f25f5c';
        console.log('Coloring a red square...');
      } else {
        context.fillStyle = 'black';
      }
  
      context.fillRect(
        transX(coordinates[room]['x']),
        transY(coordinates[room]['y']),
        BoxSize,
        BoxSize
      );
      context.fillStyle = 'black';

    }
  }, [coordinates, roomId, nextRoom, neighbors]);

  return (
    <>
      <canvas ref={ref} />
    </>
  );
};

export default Map;
