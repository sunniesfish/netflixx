import { Retryer } from "react-query/types/core/retryer";
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

export async function getTopMovies(pageNo:number) {
    return fetch(`${BASE_URL}/movie/top_rated?language=en-US&page=${pageNo}`, options)
    .then(response => response.json())
}

export async function getUpComMovies(pageNo:number) {
    return fetch(`${BASE_URL}/movie/upcoming?language=en-US&page=${pageNo}`, options)
    .then(response => response.json())
}

export async function getTvs() {
    return fetch(`${BASE_URL}/trending/tv/day?language=en-US`, options)
    .then(response => response.json())
}

export async function getTopTvs(pageNo:number) {
    return fetch(`${BASE_URL}/tv/top_rated?language=en-US&page=${pageNo}`, options)
      .then(response => response.json())
}
export async function getPopTvs(pageNo:number) {
    return fetch(`${BASE_URL}/tv/popular?language=en-US&page=${pageNo}`, options)
    .then(response => response.json())
}

export async function doSearch({keyword, adult, langauge, pageNo, category}:ISearchQuery){
    console.log("pageNo ",pageNo)
    return fetch(
        `${BASE_URL}/search/${category}?query=${keyword}&include_adult=${adult? "true" : "false"}&language=${langauge? langauge : "en-US"}&page=${pageNo}`
        , options)
    .then(response => response.json())
}

export async function getTrailerId(id:number,cat:string) {
    return fetch(
        `${BASE_URL}/${cat}/${id}/videos?language=en-US`
        ,options)
        .then(res => res.json())
}

export async function getDetail(id:number,cat:string) {
    return fetch(
        `${BASE_URL}/${cat}/${id}?language=en-US'`
        ,options)
        .then(res => res.json())
}