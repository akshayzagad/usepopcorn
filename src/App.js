import { useEffect, useState } from "react";
import "./index.css";
import StarRating from "./StarRating";
// import KEY from "./key.js";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];
const KEY = "3a785bcf";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomError, setRandomError] = useState("");
  const [selectedId, setId] = useState(null);

  function handleWatchMovieDelete(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  function handleId(id) {
    setId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie(id) {
    setId(null);
  }

  function handleWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  // useEffect(function(){
  //   console.log("[1] It is intialy render and not render second time");
  // },[]);

  // useEffect(function(){
  //   console.log("[2] It is  render every time");
  // });

  // useEffect(function(){
  //   console.log("[3] It is  render when query is there");
  // },[query]);

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setIsLoading(true);
          setRandomError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query} `
          );
          if (!res.ok)
            throw new Error("Something went wrong, please try again.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (error) {
          console.log(error.message);
          setRandomError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setRandomError("");
        return;
      }
      fetchMovie();
    },
    [query]
  );

  return (
    <>
      <Nav movies={movies}>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Result movies={movies} />
      </Nav>
      <main className="main">
        {/**
         Alternative to children prop in whih we pass element as a props
       */}

        {/* <Box element={<MovieList movies={movies} />} />
        <Box
          element={
            <>
              <WatchBoxSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}

        {/**
         children prop drilling and create reusable component @{Box} which is smae for watchlist and movielist
       */}

        <Box>
          {
            // isLoading ? <Loader/> : <MovieList movies={movies}
          }
          {isLoading && <Loader />}
          {!isLoading && !randomError && (
            <MovieList movies={movies} setOnClickId={handleId} />
          )}
          {randomError && <ErrorMessage message={randomError} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              id={selectedId}
              handleCloseMovie={handleCloseMovie}
              onAddWatchedMovie={handleWatchedMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchBoxSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onWatchMovieDelete={handleWatchMovieDelete}
              />
            </>
          )}
        </Box>
      </main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading....</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function Nav({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Result({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}

/*function WatchBox() {
  const [watched, setWatched] = useState(tempWatchedData);

  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <WatchBoxSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}*/

function MovieList({ movies, setOnClickId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={setOnClickId} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ id, handleCloseMovie, onAddWatchedMovie,watched }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [randomError, setRandomError] = useState("");
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie)=> movie.imdbID).includes(id); 
  useEffect(
    function () {
      async function MovieDetailsApi() {
        try {
          setIsLoading(true);
          setRandomError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&i=${id} `
          );
          if (!res.ok)
            throw new Error("Something went wrong, please try again.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovieDetails(data);
        } catch (error) {
          console.log(error.message);
          setRandomError(error.message);
        } finally {
          setIsLoading(false);
        }
      }
      MovieDetailsApi();
    },
    [id]
  );

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetails;

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === id
  )?.userRating;

  function handleAdd() {

    const newWatchedMovie = {
      imdbID: id,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatchedMovie(newWatchedMovie);
    handleCloseMovie();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
            {!isWatched ? (
              <>
              <StarRating
                maxRating={10}
                size={24}
                onSetRating={setUserRating} // Correct prop name
              />
              {userRating > 0 && (<button className="btn-add" onClick={handleAdd}>
                add to list
              </button>)}
              </>)
              :( <p>
                You rated with movie {watchedUserRating} <span>⭐️</span>
              </p>) }
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </>
  );
}

function WatchBoxSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onWatchMovieDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchMovie
          movie={movie}
          key={movie.imdbID}
          onWatchMovieDelete={onWatchMovieDelete}
        />
      ))}
    </ul>
  );
}

function WatchMovie({ movie, onWatchMovieDelete }) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => onWatchMovieDelete(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
