import React, { useState } from "react";
import "./App.css";
import { v4 as uuid } from "uuid";

function Cell(props) {
  return (
    <div
      onClick={() => props.handleCellClick(props.position)}
      style={{ background: props.isStar ? "yellow" : "blue" }}
    >
      <p>{props.position}</p>
      <h3>{props.isActive ? "X" : null}</h3>
    </div>
  );
}

export default function App() {
  const [userInput, setUserInput] = useState(4);
  const [activeCells, setActiveCells] = useState([0, 1, 2]);
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  function handleCellClick(index) {
    if (activeCells.includes(index)) {
      const updatedCells = activeCells.filter((cell) => cell !== index);
      setActiveCells(updatedCells);
    } else {
      setActiveCells([...activeCells, index]);
    }
  }
  function handleUserInput(e) {
    const input = parseInt(e.target.value, 10) || "";
    if (input > 8 || input < 0 || isNaN(input)) {
      return;
    }
    setUserInput(input);
  }

  return (
    <div className="App">
      <h2>Click on cells to activate and deactivate</h2>
      <div className="grid-box">
        {cells.map((num, index) => (
          <Cell
            key={uuid()}
            isStar={userInput === index}
            isActive={activeCells.includes(index)}
            handleCellClick={handleCellClick}
            position={index}
          />
        ))}
      </div>

      <h2>Active Neighbors: {getActiveCount(activeCells, userInput)}</h2>
      <label>Set star: </label>
      <input
        onChange={handleUserInput}
        value={userInput}
        placeholder="enter star"
        type="text"
      />
    </div>
  );
}

function getActiveCount(activeNeighbors, star) {
  function checkStatus(currentPosition) {
    if (currentPosition > 8 || currentPosition < 0) {
      return false;
    } else if (activeNeighbors.includes(currentPosition)) {
      return true;
    }
  }

  const neighbors = [
    { neighborLocation: star - 3, restrictedStars: null }, //top
    { neighborLocation: star + 3, restrictedStars: null }, //bottom
    { neighborLocation: star - 1, restrictedStars: [3, 6] }, //left
    { neighborLocation: star + 1, restrictedStars: [2, 5] }, // right
    { neighborLocation: star - 4, restrictedStars: [6] }, //top left
    { neighborLocation: star - 2, restrictedStars: [2, 5, 8] }, //top right
    { neighborLocation: star + 2, restrictedStars: [0, 3, 6] }, //bottom left
    { neighborLocation: star + 4, restrictedStars: [2] } // bottom right
  ];

  let activeCount = 0;
  for (let check of neighbors) {
    if (check.restrictedStars?.includes(star)) {
      continue;
    } else {
      if (checkStatus(check.neighborLocation)) {
        activeCount += 1;
      }
    }
  }

  return activeCount;
}

// console.log(getActiveCount([1, 2, 3], 4)); //=> 3
// console.log(getActiveCount([1, 2, 3], 8)); //=> 0
// console.log(getActiveCount([7, 5, 2], 8)); //=> 2
// console.log(getActiveCount([7, 5, 2], 3)); //=> 1
// console.log(getActiveCount([0,1,2], 6)); //=> 0

//           0 | 1 | 2
//           ---------
//           3 | 4 | 5
//           ---------
//           6 | 7 | 8
