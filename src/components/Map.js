import React from 'react';
import Styled from 'styled-components';
import { useRef, useEffect } from 'react';

const Map = props => {
  const ref = useRef();
  const { coordinates, neighbors, roomId, nextRoom } = props;

  useEffect(() => {
    // console.log(coordinates)
    const canvas = ref.current;
    canvas.width = 1200;
    canvas.height = 900;
    const context = canvas.getContext('2d');
    const minX = 50;
    const minY = 45;
    const maxX = 74;
    const maxY = 75;
    context.clearRect(0, 0, canvas.width, canvas.height);

    const transX = x => {
      const newX = (x - minX) * (canvas.width / (maxX - minX));
      return newX;
    };

    const transY = y => {
      const newY = (maxY - y) * (canvas.height / (maxY - minY));
      return newY;
    };

    for (let room in coordinates) {
      let widthBox = 30;
      let heightBox = 20;
      context.strokeStyle = 'black';
      context.lineWidth = '5 ';

      if (neighbors[room]['n']) {
        let direction = neighbors[room]['n'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + 0.5 + widthBox / 2,
          transY(coordinates[room]['y'])
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + 0.5 + widthBox / 2,
          transY(coordinates[direction]['y']) + heightBox
        );
        context.stroke();
      }
      if (neighbors[room]['s']) {
        let direction = neighbors[room]['s'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + widthBox / 2 + 0.5,
          transY(coordinates[room]['y']) + heightBox
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + widthBox / 2 + 0.5,
          transY(coordinates[direction]['y'])
        );
        context.stroke();
      }
      if (neighbors[room]['e']) {
        let direction = neighbors[room]['e'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']) + widthBox / 2,
          transY(coordinates[room]['y']) + heightBox / 2 + 0.5
        );
        context.lineTo(
          transX(coordinates[direction]['x']),
          transY(coordinates[direction]['y']) + heightBox / 2 + 0.5
        );
        context.stroke();
      }
      if (neighbors[room]['w']) {
        let direction = neighbors[room]['w'];
        context.beginPath();
        context.moveTo(
          transX(coordinates[room]['x']),
          transY(coordinates[room]['y']) + heightBox / 2
        );
        context.lineTo(
          transX(coordinates[direction]['x']) + widthBox,
          transY(coordinates[direction]['y']) + heightBox / 2
        );
        context.stroke();
      }

      if (coordinates[room]['id'] == roomId) {
        context.fillStyle = 'red';
        console.log('Coloring a red square...');
      } else {
        context.fillStyle = 'black';
      }

      context.font = 'bold 12px Arial';
      context.fillRect(
        transX(coordinates[room]['x']),
        transY(coordinates[room]['y']),
        widthBox,
        heightBox
      );
      context.fillStyle = 'white';
      context.fillText(
        coordinates[room]['id'],
        transX(coordinates[room]['x']) + 4,
        transY(coordinates[room]['y']) + heightBox / 2 + 3
      );
      context.fillStyle = 'black';
    }
  }, [coordinates, roomId, nextRoom]);

  return (
    <>
      <canvas
        ref={ref}
        onScroll={console.log}
      />
    </>
  );
};

export default Map;
