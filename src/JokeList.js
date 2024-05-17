import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

function JokeList({ numJokesToGet = 5}) {
  //set up the useState
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // useEffect to get jokes if there are none
  useEffect(function () {
    async function getJokes() {
      // let j be the current set of jokes, seenJokes is creating a new Set
      let j = [...jokes];
      let seenJokes = new Set();
      try {
        // while the numofJokes is less than 5, get more jokes from calling axios
        while (j.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...jokeObj } = res.data;
          //if a joke hasn't been seen, add it to the j list of jokes
          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0})
          } else {
            console.error("duplicate");
          }
        }
        // change the state of jokes to j and isLoading to false
        setJokes(j);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    //if there are no jokes, call the getJokes function
    if (jokes.length === 0) getJokes();
       }, [jokes, numJokesToGet]
  );

  function generateNewJokes() {
    setJokes([]);
    setIsLoading(true);
  }
  // mapping votes to each joke id (delta = +1 or -1)
  function vote(id, delta) {
    setJokes(allJokes => 
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta} : j))
    );
  }
// this sorts jokes by votes, 
  let sortedJokes = [...jokes].sort((a,b) => b.votes - a.votes);


    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
  
  }

export default JokeList;
