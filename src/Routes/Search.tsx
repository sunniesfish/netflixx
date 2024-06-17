import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { doSearch } from "../api";
import { useState } from "react";
import styled from "styled-components";
import { IGetMoviesResult } from "../interface";
const Wrapper = styled.div`
    width: 100%;
    min-height: 50vh;
    display: flex;
    align-items: center;
    flex-direction: column;

    border: 1px solid red;
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

    border: 1px solid blue;
`
function Search() {
    const location = useLocation();
    const [ pageNo, setPageNo ] = useState(1);
    const [ adult, setAdult ] = useState(false);
    const temp = new URLSearchParams(location.search).get("keyword");
    const keyword = temp? temp : "";
    const { data, isLoading } = useQuery<IGetMoviesResult>(
        ["search", keyword, pageNo, adult],() => doSearch({keyword,pageNo, adult })
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

            </ResultBox>
        </Wrapper>
    )
}

export default Search;