import React, { useEffect, useState } from "react";
import axios from "axios";

const PollList = () => {
  const [polls, setPolls] = useState([]);

  // Fetch Poll Data
  useEffect(() => {
    axios.get("http://localhost:5000/api/polls")
      .then(response => setPolls(response.data))
      .catch(error => console.error("Error fetching polls:", error));
  }, []);

  // Vote for a Movie
  const voteForMovie = (movie) => {
    axios.post("http://localhost:5000/api/vote", { movie })
      .then(response => {
        setPolls(prevPolls =>
          prevPolls.map(poll =>
            poll.movie === movie ? { ...poll, votes: response.data.votes } : poll
          )
        );
      })
      .catch(error => console.error("Error voting:", error));
  };

  return (
    <div>
      <h2>Vote for Your Favorite Movie</h2>
      <ul>
        {polls.map(poll => (
          <li key={poll.movie}>
            {poll.movie}: {poll.votes} votes
            <button onClick={() => voteForMovie(poll.movie)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollList;
