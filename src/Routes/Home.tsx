import { useQuery } from "react-query";
import { getMovies } from "../api";
import { IGetMoviesResult } from "../interface";
import styled from "styled-components";
import { makeImgPath } from "../utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

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
const Box = styled(motion.div)<{photo:string}>`
    background-image: url(${props => props.photo? makeImgPath(props.photo, "w500") : ""});
    background-size: cover;
    background-position: center;
    height: 200px;
    width: 100%;
`

const rowVarients = {
    hidden:{
        x: window.outerWidth-5,
    },
    visible:{
        x:0,
    },
    exit:{
        x: -window.outerWidth+5,
    }
}

const offset = 6;

function Home() {
    const { data, isLoading } = useQuery<IGetMoviesResult>(
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
                            variants={rowVarients} 
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
                                    <Box key={movie.id} photo={movie.backdrop_path}/>
                                )
                            }
                        </Row>
                    </AnimatePresence>
                </Slider>
            </>
            }
        </Wrapper>
    )
}

export default Home;