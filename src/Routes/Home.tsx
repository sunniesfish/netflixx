import { useQuery } from "react-query";
import { getMovies } from "../api";
import { IGetResult } from "../interface";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
const BigMovie = styled(motion.div)`
    position: fixed;
    width: 40vw;
    height: 80vh;
    top: 10vh;
    left: 0;
    right: 0;
    margin: 0 auto;
    background-color: ${props => props.theme.black.lighter};
`
const BigCover = styled.div`
    background-size: cover;
    background-position: center center;
    width: 100%;
    height: 400px;
`
const BigTitle = styled.h2`
    color: ${props => props.theme.white.lighter};
    padding: 20px;
    font-size: 46px;
    position: relative;
    top: -80px;
`
const BigOverview = styled.p`
    padding: 20px;
    position: relative;
    top: -80px;
    color: ${props => props.theme.white.lighter};
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

function Home() {
    const navigate = useNavigate();
    const bigMovieMatch = useMatch("/movies/:movieId");
    const { data, isLoading } = useQuery<IGetResult>(
        ["movies","nowPlaying"],
        getMovies
    );
    const [ index, setIndex ] = useState(0);
    const [ leaving, setLeaving ] = useState(false);
    const increaseIndex = () => {
        if(data){
            if(leaving) return
            toggleLeaving();
            const totalMovie = data.results.length - 1;
            const maxIndex = Math.floor(totalMovie/offset)-1;
            setIndex(prev => prev === maxIndex? 0 : prev+1)
        }
    };
    const toggleLeaving = () => setLeaving(prev => !prev);
    const onBoxClick = (movieId:number) => {
        navigate(`/movies/${movieId}`);
    }
    const onOverlayClick = () => {
        navigate("/");
    }
    const clickedMovie = bigMovieMatch?.params.movieId && data?.results.find(movie => movie.id+"" === bigMovieMatch.params.movieId);
    return(
        <Wrapper>
            {isLoading? 
            <Loader>Loading..</Loader> 
            :
            <>
                <Banner 
                    onClick={increaseIndex} 
                    bgPhoto={data?.results[0].backdrop_path || ""}
                >
                    <Title>{data?.results[0].title}</Title>
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
                                .map(movie => 
                                    <Box 
                                        layoutId={movie.id+""}
                                        onClick={()=>onBoxClick(movie.id)}
                                        key={movie.id} 
                                        variants={BoxVariants}
                                        initial="normal"
                                        whileHover="hover"
                                        transition={{type:"tween"}}
                                    >
                                        <img src={makeImgPath(movie.backdrop_path, "w500")} alt="poster"/>
                                        <Info
                                            variants={infoVariants}
                                        >
                                            <h4>{movie.title}</h4>
                                        </Info>
                                    </Box>
                                )
                            }
                        </Row>
                    </AnimatePresence>
                </Slider>
                <AnimatePresence>
                    {bigMovieMatch? 
                    <>
                        <Overlay
                            onClick={onOverlayClick}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                        />
                        <BigMovie
                            layoutId={bigMovieMatch.params.movieId}
                        >
                            {clickedMovie && <>
                                <BigCover
                                    style={{backgroundImage:`linear-gradient(to top,black, transparent), url(${makeImgPath(clickedMovie.backdrop_path,"w500")})`}}
                                />
                                <BigTitle>{clickedMovie.title}</BigTitle>
                                <BigOverview>
                                    {clickedMovie.overview}
                                </BigOverview>
                            </>}
                        </BigMovie> 
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

export default Home;