import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { doSearch } from "../api";
import { useState } from "react";

function Search() {
    const location = useLocation();
    const [ pageNo, setPageNo ] = useState(1);
    const [ adult, setAdult ] = useState(false);
    const temp = new URLSearchParams(location.search).get("keyword");
    const keyword = temp? temp : "";
    const { data, isLoading } = useQuery(
        ["search", keyword, pageNo, adult],() => doSearch({keyword,pageNo, adult })
    );
    console.log(data)
    return (
        <>
        </>
    )
}

export default Search;