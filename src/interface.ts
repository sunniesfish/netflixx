export interface IMovie{
    id:number;
    backdrop_path:string;
    poster_path:string;
    title:string;
    overview:string;

}
export interface ITv{
    id:number;
    backdrop_path:string;
    poster_path:string;
    name:string;
    overview:string;

}

export interface IGetMoviesResult {
    dates: {
        maximum:string;
        minimum:string;
    };
    page:number;
    results:IMovie[];
    total_pages:number;
    total_results:number;
}
export interface IGetTvResult {
    dates: {
        maximum:string;
        minimum:string;
    };
    page:number;
    results:ITv[];
    total_pages:number;
    total_results:number;
}

export interface ISearchForm{
    keyword:string;
}

export interface ISearchQuery{
    keyword:string,
    adult?:boolean,
    langauge?:string,
    pageNo:number,
}