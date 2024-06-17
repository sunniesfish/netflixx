import { ISearchQuery } from "./interface";

const KEY = `api_key=${process.env.REACT_APP_TMDB_API_KEY}`
const BASE_URL = "https://api.themoviedb.org/3"

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_TOKEN}`
    }
};

export async function getMovies(){
    return fetch(`${BASE_URL}/movie/now_playing?${KEY}`)
        .then(res => res.json());
}

export async function getTvs() {
    return fetch(`${BASE_URL}/trending/tv/day?language=en-US`, options)
        .then(res => res.json());
}

export async function doSearch({keyword, adult, langauge, pageNo}:ISearchQuery){
    return   fetch(
        `${BASE_URL}/search/multi?query=${keyword}&include_adult=${adult? "true" : "false"}&language=${langauge? langauge : "en-US"}&page=${pageNo}`
        , options)
    .then(response => response.json())
}

