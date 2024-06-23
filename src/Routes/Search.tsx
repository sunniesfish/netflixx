import { useInfiniteQuery, useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { doSearch } from "../api";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { IGetResult, IResult } from "../interface";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
const Wrapper = styled.div`
    width: 100%;
    min-height: 50vh;
    display: flex;
    align-items: center;
    flex-direction: column;
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
    height: 75vh;
    display: flex;
    overflow-y: scroll;

    align-items: center;
    flex-direction: column;
    .observer{
        margin-bottom: 20px;
    }
`
const ResultContainer = styled.div`
    width: 100%;
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`
const Tab = styled.div`
    display: flex;
    justify-content: space-evenly;
    width: 160px;
    border-radius: 30px;
    border: 1px solid ${prev => prev.theme.white.lighter};
    margin-bottom: 30px;
    &:hover{
        cursor: pointer;
    }
    &>div{
        position: relative;
        width: 50%;
        text-align: center;
    }
`
const Selector = styled(motion.div)`
    position: absolute;
    width: 100%;
    background-color: red;
    border-radius: 30px;
    top: 0;
    left: 0;
`
const ResultItem = styled(motion.div)`
    margin-bottom: 15px;
    width: 90%;
    height: 150px;
    display: flex;
    justify-content: space-evenly;
`
const Observer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    span{
        font-weight: bold;
    }
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
    const [ items, setItems ] = useState<IResult[]>([]);
    const [ category, setCategory ] = useState("movie")

    const temp = new URLSearchParams(location.search).get("keyword");
    const keyword = temp? temp : "";

    const lastElementRef = useRef<HTMLDivElement | null>(null);
    const resultBoxRef = useRef<HTMLDivElement | null>(null);
    
    const { data, isLoading } = useQuery<IGetResult>(
        ["search", keyword, pageNo, adult, category],
        () => doSearch({keyword, pageNo, adult, category}),
        {keepPreviousData: true}
    );

    const handleCategoryChange = (cat:string) => {
        setItems([]);
        setCategory(cat);
        setPageNo(1);
        if (resultBoxRef.current) {
            resultBoxRef.current.scrollTo(0, 0);
        }
    } 

    const handleObserver = (entries:IntersectionObserverEntry[]) => {
        const target = entries[0];
        if(target.isIntersecting){
            setPageNo(prev => prev + 1);
            console.log("intersecting")
        }
    }


    useEffect(()=>{
        const observeTarget = document.querySelector(".observer");
        const observer = new IntersectionObserver(handleObserver,{
            threshold:0.4,root:document.querySelector(".observing-root")
        });
        if(observeTarget){
            observer.observe(observeTarget);
        }
    },[category]);
    useEffect(()=>{
        if(data?.results){
            setItems(prev => {
               return prev !== data.results ? prev.concat(data.results) : prev
            })
        }
    },[data])
    return (
        <>
        <Wrapper>
            <ResultCount>
                <span>
                    {keyword? `"${keyword}" : ` : `"" : `}
                    {data?.total_results? `${data.total_results} Results` : "0 Result"}
                </span>
            </ResultCount>
            <Tab>
                <div onClick={() => handleCategoryChange("movie")}>
                    Movie
                    {category === "movie"? <Selector layoutId="selector">Movie</Selector> : null}
                </div>
                <div onClick={() => handleCategoryChange("tv")}>
                    TV Series
                    {category === "tv"? <Selector layoutId="selector">TV Series</Selector> : null}
                </div>
            </Tab>
            <ResultBox className="observing-root" ref={resultBoxRef}>
                {isLoading? 
                <Loader>
                    Loading...
                </Loader> 
                :
                <>
                <AnimatePresence>
                    <ResultContainer>
                        {items.map((result,index) =>
                            <ResultItem key={index}>
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
                        <Observer className="observer" ref={lastElementRef}>
                            <span>Loading...</span>
                        </Observer>
                    </ResultContainer>
                </AnimatePresence>
                </>
                }
            </ResultBox>
        </Wrapper>
        </>
    )
}

export default Search;