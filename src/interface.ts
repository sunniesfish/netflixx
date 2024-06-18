
export interface IResult{
    id:number;
    backdrop_path:string;
    poster_path:string;
    name?:string;
    title?:string;
    overview:string;
    media_type:string;
    vote_average:number;
}

export interface IGetResult {
    dates: {
        maximum:string;
        minimum:string;
    };
    page:number;
    results:IResult[];
    total_pages:number;
    total_results:number;
}

export interface ISearchForm{
    keyword:string;
}

export interface ISearchQuery{
    category:string;
    keyword:string,
    adult?:boolean,
    langauge?:string,
    pageNo:number,
}


export interface ITrailerResult{
    id:number,
    results:ITrailer[]
}

export interface ITrailer{
    id:number,
    key:string,
    name:string,
    site:string,
    size:number,
    official:boolean
}

export interface IGenre{
    id:number,
    name:string
}
export interface IDetail{
    genres:IGenre[],
    homepage: string,
}