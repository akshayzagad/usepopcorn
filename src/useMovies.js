import { useState, useEffect } from "react";
const KEY = "3a785bcf";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [randomError, setRandomError] = useState("");

 

  useEffect(
    function () {
        //  callBack?.();
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          setIsLoading(true);
          setRandomError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query} `,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Something went wrong, please try again.");
          const data = await res.json();
          if (data.Response === "False") throw new Error("Movie not found");
          setMovies(data.Search);
        } catch (error) {
          console.log(error.message);
          if (error.message !== "signal is aborted without reason") {
            setRandomError(error.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (query.length < 2) {
        setMovies([]);
        setRandomError("");
        return;
      }
      //   handleCloseMovie();
      fetchMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return {movies, isLoading, randomError};
}
