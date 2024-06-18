import { useQuery } from "react-query";
import { getDetail, getTrailerId, getTvs } from "../api";
import { IDetail, IGenre, IGetResult, ITrailerResult } from "../interface";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import Trailer from "../Components/Trailer";

const Wrapper = styled.div`
    background-color: black;
`
const Loader = styled.div`
    height: 20vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Banner = styled.div<{bgPhoto:string}>`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 60px;
    background-image: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0), rgba(0,0,0,1)) ,url(${props => makeImgPath(props.bgPhoto)});
    background-size: cover;
`
const Title = styled.h2`
    font-size: 58px;
    margin-bottom: 10px;
    max-width: 80%;
`
const Overview = styled.p`
    font-size: 29px;
    width: 50%;
    max-height: 4.5em;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3; /* 줄 수를 설정 */
    -webkit-box-orient: vertical;
`
const Overlay = styled(motion.div)`
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    opacity: 0;
`
const BigTv = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 60vh;
    top: 10vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.veryDark};
    &>*{
        width: 100%;
    }
`
const BigCover = styled.div`
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`
const BigRow = styled.div`
    padding: 5px 20px 0 20px;
    svg{
        width: 17px;
        fill: yellow;
    }
    .modal__score{
        margin: 0 10px 0 10px;
        font-size: 17px;
        color: ${props => props.theme.white.lighter};
    }
    .modal__genre{
        font-size: 17px;
        margin: 0 10px 0 0;
        color: ${props => props.theme.white.lighter};
    }
`
const BigInfo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent 10%, black, black);
`
const BigTitle = styled.h2`
    margin-top: 300px;
    color: ${props => props.theme.white.lighter};
    padding: 20px;
    font-size: 36px;
    position: relative;
`
const BigOverview = styled.p`
    padding: 20px;
    max-height: 100px;
    position: relative;
    color: ${props => props.theme.white.lighter};
    overflow: hidden;
    text-overflow: ellipsis;
`
const Slider = styled.div`
    position: relative;
    top: -150px;
`
const Row = styled(motion.div)`
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(6, 1fr);
    margin-bottom: 5px;
    width: 100%;
    position: absolute;
`
const Box = styled(motion.div)`
    background-size: cover;
    background-position: center center;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    flex-direction: column;
    &:hover{
        cursor: pointer;
    }
    img{
        display: flex;
        flex-grow: 1;
        object-fit: cover;
    }
    &:first-child{
        transform-origin: center left;
    }
    &:last-child{
        transform-origin: center right;
    }
`
const Info = styled(motion.div)`
    margin: 0;
    padding: 10px;
    background: linear-gradient(
        to bottom,
        ${props => props.theme.black.darker},
        black
    );
    opacity: 0;
    width: 100%;
    h4{
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`
const infoVariants = {
    hover:{
        opacity: 1,
        transition:{
            delay:0.3,
            duration:0.3,
            type:"tween"
        }
    }
}
const rowVariants = {
    hidden:{
        x: "100vw",
    },
    visible:{
        x:0,
    },
    exit:{
        x: "-100vw",
    }
}
const BoxVariants = {
    normal:{
        scale:1,
    },
    hover:{
        scale:1.3,
        y: -80,
        transition:{
            delay:0.3,
            duration:0.3,
            type:"tween"
        }
    },
}
const offset = 6;
const Star = () => {
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
        </svg>
    </>
}

function Tv() {
    const navigate = useNavigate();
    const bigTvMatch = useMatch("/tv/:tvId");
    const { data, isLoading } = useQuery<IGetResult>(
        ["tv","nowPlaying"],
        getTvs
    );
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false);
    const [ trailerId, setTrailerId ] = useState<string|undefined>(undefined);
    const [ genres, setGenres ] = useState<IGenre[] | undefined>(undefined);
    const [coverDimensions, setCoverDimensions] = useState({ width: "0px", height: "0px" });
    
    const increaseIndex = () => {
        if(data){
            if(leaving) return
            toggleLeaving();
            const totalTv = data.results.length - 1;
            const maxIndex = Math.floor(totalTv/offset)-1;
            setIndex(prev => prev === maxIndex? 0 : prev+1)
        }
    };
    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClick = async (tvId:number) => {
        navigate(`/tv/${tvId}`);
        const response:ITrailerResult = await getTrailerId(tvId, "tv");
        const detail:IDetail = await getDetail(tvId,"tv");
        setTrailerId(response.results[0]?.key? response.results[0].key : undefined);
        setGenres(detail? detail.genres : undefined);
    }
    const onOverlayClick = () => {
        navigate("/tv");
    }
    const clickedTv = bigTvMatch?.params.tvId && data?.results.find(tv => tv.id+"" === bigTvMatch.params.tvId);
    useEffect(() => {
        const coverElement = document.querySelector(".bigCover");
        if (coverElement) {
            const { offsetWidth, offsetHeight } = coverElement as HTMLDivElement;
            setCoverDimensions({ width: `${offsetWidth}px`, height: `${offsetHeight}px` });
        }
    }, [bigTvMatch, data]);
    return (
        <Wrapper>
            {isLoading? 
            <Loader>Loading..</Loader> 
            :
            <>
                <Banner 
                    onClick={increaseIndex} 
                    bgPhoto={data?.results[0].backdrop_path || ""}
                >
                    <Title>{data?.results[0].name}</Title>
                    <Overview>{data?.results[0].overview}</Overview>
                </Banner>
                <Slider>
                    <AnimatePresence
                        initial={false} 
                        onExitComplete={toggleLeaving}
                    >
                        <Row 
                            variants={rowVariants} 
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{type:"tween", duration:1}}
                            key={index}
                        >
                            {data?.results
                                .slice(1)
                                .slice(offset*index, offset*index+offset)       
                                .map(tv => 
                                    <Box 
                                        layoutId={tv.id+""}
                                        onClick={()=>onBoxClick(tv.id)}
                                        key={tv.id} 
                                        variants={BoxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{type:"tween"}}
                                    >
                                        <img src={makeImgPath(tv.backdrop_path, "w500")} alt="poster"/>
                                        <Info
                                            variants={infoVariants}
                                        >
                                            <h4>{tv.name}</h4>
                                        </Info>
                                    </Box>
                                )
                            }
                        </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                    {bigTvMatch? 
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                        />
                        <BigTv
                            layoutId={bigTvMatch.params.tvId}
                        >
                            {clickedTv && <>
                                <BigCover
                                    className="bigCover"
                                    style={{backgroundImage:`linear-gradient(to top,black, transparent), url(${makeImgPath(clickedTv.backdrop_path,"w500")})`}}
                                >
                                    {trailerId && 
                                        <Trailer
                                            height={coverDimensions.height}
                                            width={coverDimensions.width} 
                                            videoId={trailerId} 
                                            onError={()=>setTrailerId(undefined)}
                                        />
                                    }
                                </BigCover>
                                <BigInfo>
                                    <BigTitle>{clickedTv.name}</BigTitle>
                                    <BigRow>
                                        <Star/>
                                        <span className="modal__score">{clickedTv.vote_average.toFixed(1)}</span>
                                    </BigRow>
                                    <BigRow>
                                        {genres? genres.map(item => <span className="modal__genre">{item.name}</span>) : null}
                                    </BigRow>
                                    <BigOverview>
                                        {clickedTv.overview}
                                    </BigOverview>
                                </BigInfo>
                            </>}
                        </BigTv> 
                    </>
                    : 
                    null
                    }
                </AnimatePresence>
            </>
            }
        </Wrapper>
    )
}

export default Tv;