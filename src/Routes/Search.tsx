import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { doSearch } from "../api";
import { useState } from "react";
import styled from "styled-components";
import { IGetResult } from "../interface";
import { makeImgPath } from "../utils";
import { motion } from "framer-motion";
const Wrapper = styled.div`
    width: 100%;
    min-height: 50vh;
    display: flex;
    align-items: center;
    flex-direction: column;

    border: 1px solid red;
`
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const ResultCount = styled.div`
    width: 100%;
    height: 160px;
    display: flex;
    align-items: center;
    span{
        margin: 40px 50px 0 50px;
        font-size: 28px;
    }
`
const ResultBox = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border: 1px solid blue;
`
const Tab = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 170px;
    &:hover{
        cursor: pointer;
    }
    &>div{
        position: relative;
        width: 50%;
        border: 1px solid green;
        text-align: center;
    }
`
const Selector = styled(motion.div)`
    position: absolute;
    width: 100%;
    background-color: red;
    top: 0;
    left: 0;
`
const ResultItem = styled.div`
    margin-bottom: 15px;
    width: 90%;
    height: 150px;
    display: flex;
    justify-content: space-evenly;
    
    border: 1px solid red;
`
const Img = styled.div`
    background-position: center center;
    background-size: cover;
    width: 13%;
    min-width: 100px;
    height: 100%;
`
const Info = styled.div`
    height: 100%;
    width: 75%;
    h2{
        font-weight: bold;
        margin-top: 10px;
    }
    span{
        margin-bottom: 5px;
        font-weight: bold;
    }
    p{
        margin-top: 5px;
        height: 80px;
        overflow: hidden;
    }
`
function Search() {
    const location = useLocation();
    const [ pageNo, setPageNo ] = useState(1);
    const [ adult, setAdult ] = useState(false);
    const temp = new URLSearchParams(location.search).get("keyword");
    const keyword = temp? temp : "";
    const [ category, setCategory ] = useState("movie")
    const { data, isLoading } = useQuery<IGetResult>(
        ["search", keyword, pageNo, adult, category],() => doSearch({keyword, pageNo, adult, category})
    );
    console.log(data)
    return (
        <Wrapper>
            <ResultCount>
                <span>
                    {keyword? `"${keyword}" : ` : `"" : `}
                    {data?.total_results? `${data.total_results} Results` : "0 Result"}
                </span>
            </ResultCount>
            <ResultBox>
                <Tab>
                    <div onClick={() => setCategory("movie")}>
                        Movie
                        {category === "movie"? <Selector layoutId="selector">Movie</Selector> : null}
                    </div>
                    <div onClick={() => setCategory("tv")}>
                        TV Series
                        {category === "tv"? <Selector layoutId="selector">TV Series</Selector> : null}
                    </div>
                </Tab>
                {isLoading? 
                <Loader>
                    Loading...
                </Loader> 
                :
                <>
                {data?.results.map(result =>
                    <ResultItem key={result.id}>
                        <Img 
                            style={{
                                backgroundImage:`url(${makeImgPath(
                                    result.backdrop_path? result.backdrop_path : result.poster_path? result.poster_path : "", 
                                    "w500"
                                )})`}}
                        />
                        <Info>
                            <h2>{result.name? result.name : result.title? result.title : null}</h2>
                            <span>{result.media_type}</span>
                            <p>{result.overview}</p>
                        </Info>
                    </ResultItem>
                )}
                </>
                }
            </ResultBox>
        </Wrapper>
    )
}

export default Search;