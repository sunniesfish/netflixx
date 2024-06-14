const KEY = `api_key=${process.env.REACT_APP_TMDB_API_KEY}`
const BASE_URL = "https://api.themoviedb.org/3"

export function getMovies(){
    return fetch(`${BASE_URL}/movie/now_playing?${KEY}`)
        .then(res => res.json());
}