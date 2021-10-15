import {Modal,Button,Nav,Navbar} from 'react-bootstrap';
import { GetStaticProps, InferGetStaticPropsType} from 'next';
import {useState,useEffect} from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import ReactCardFlip from 'react-card-flip';
import styles from "../styles/Main.module.css";
import "swiper/css";
import "swiper/css/navigation";
import YouTube from 'react-youtube';
import SwiperCore, {Navigation} from 'swiper';
SwiperCore.use([Navigation]);

export const getStaticProps: GetStaticProps = async() => {
    const res1 = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
    const data1 = await res1.json()
    const videoIDs = []
    for await(let d of  data1.results.slice(0,10)){
        const movieId = d.id
        const res = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR`)
        const data = await res.json()
        videoIDs.push(data.results[0].key)
    }

    const res3 = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
    const data3 = await res3.json()
    return {
        props:{
           movieData1: data1.results.slice(0,10),
           movieData3: data3.results.slice(0,20),
           videoIDs:videoIDs,
        }
    }
}

const VideoModal = (props: any) => {
    const ratio = props.ratio;
    const opts = {
        height: `${700 * ratio}`,
        width: '100%',
        playerVars: {
          autoplay: 1,
        },
    }
    return (
      <Modal
        {...props}
        size = 'xl'
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <YouTube videoId = {props.videoId} opts = {opts}></YouTube>
        </Modal.Body>
      </Modal>
    );
  }


const Main = ({movieData1,movieData3,videoIDs}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [ratio,setRatio] = useState<number>(1)
    const [userId,setUserId] = useState<any>()
    const [isFlipped1, setIsFlipped1] = useState<boolean[]>(new Array(movieData1.length).fill(false))
    const [isFlipped2, setIsFlipped2] = useState<boolean[]>(new Array(10).fill(false))
    const [isFlipped3, setIsFlipped3] = useState<boolean[]>(new Array(movieData3.length).fill(false))
    const [videoId,setVideoId] = useState<string>(videoIDs[0])
    const [modalShow, setModalShow] = useState<boolean>(false)
    const [movieData2,setMovieData2] = useState<any[]>([])

    const handleClick1 = (idx:number) => {
        const nFlipped = isFlipped1.slice()
        nFlipped.splice(idx,1,!isFlipped1[idx])
        setIsFlipped1(nFlipped)
    }

    const handleClick2 = (idx:number) => {
        const nFlipped = isFlipped2.slice()
        nFlipped.splice(idx,1,!isFlipped2[idx])
        setIsFlipped2(nFlipped)
    }

    const handleClick3 = (idx:number) => {
        const nFlipped = isFlipped3.slice()
        nFlipped.splice(idx,1,!isFlipped3[idx])
        setIsFlipped3(nFlipped)
    }

    useEffect(() => {
        async function setRecommendation(){
            let data = []
            if (typeof sessionStorage !== 'undefined'){
                data = JSON.parse(sessionStorage.getItem('recommendation')!)
            }
            const result2 = []
            for await(let d of data){
                const res2 = await fetch(`https://api.themoviedb.org/3/movie/${d.tid}?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR`)
                const data2  = await res2.json()
                result2.push(data2)
            }
            setMovieData2(result2)
        }
        setRecommendation()

        if (typeof sessionStorage !== 'undefined'){
            setUserId(sessionStorage.getItem('userId'))
        }
        function defineRatio(){
            if (typeof window !== 'undefined' && typeof screen !== 'undefined')
                setRatio(window.innerWidth/screen.availWidth)
        }
        window.addEventListener('resize', defineRatio)
        defineRatio()
        return () => window.removeEventListener('resize', defineRatio);
    },[])
    
    return (
        <>
        <Navbar bg="dark" variant="dark" fixed="top">
            <Navbar.Brand href="#home" style = {{marginLeft:'2vw', color:'red', fontSize:'25px'}}>Movie Recommendation System</Navbar.Brand>
            <Nav className="me-auto">
            <Nav.Link href="./mainPage">Home</Nav.Link>
            <Nav.Link href="../startPage">Rate Movies</Nav.Link>
            </Nav>
            <Navbar.Text style = {{marginRight:'1vw'}}>
                Signed in as: <a>{userId}</a>
            </Navbar.Text>
            <Nav style = {{marginRight:'2vw'}}>
                <Nav.Link href="../">LogOut</Nav.Link>
            </Nav>
        </Navbar>
        <VideoModal ratio = {ratio} videoId = {videoId} onHide = {()=>setModalShow(false)} show={modalShow}></VideoModal>
        <div className={styles.container1}>
            <div className={styles.title1}>최신 TOP10 콘텐츠</div>
            <Swiper grabCursor={true} slidesPerView={4.5*ratio}  className={styles.mySwiper} navigation = {true}>
                {
                    movieData1.map((movie: any, idx:number) =>
                    <SwiperSlide key = {movie.title} className = {`${styles.slide} slide${idx+1}`}>
                        <div className={styles.slideNumber}>{idx+1}</div>
                        <style global jsx>{`
                            .slide10 {
                                left : -60px;
                            }    
                        `}</style>
                        <ReactCardFlip isFlipped={isFlipped1[idx]} flipDirection="horizontal">
                            <div className={`${styles.slidePoster} image${idx+1}`}>
                                <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='240px' height='360px' onClick = {() => {handleClick1(idx)}}/>
                            </div>
                            <div className = {`${styles.slideContent} image${idx+1}`}>
                                <div className= {styles.title}>{movie.title}</div>
                                <div onClick = {()=>{handleClick1(idx)}} className = {styles.overview}>{movie.overview}</div>
                                <Button style ={{fontSize:'medium'}} onClick = {()=>{setVideoId(videoIDs[idx]); setModalShow(true);}}>See Trailer</Button>
                            </div>
                        </ReactCardFlip>
                        <style global jsx>{`
                            .image10 {
                                left : -70px;
                            }    
                        `}</style>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
        <div className={styles.container1}>
            <div className={styles.title1}>취향저격 콘텐츠</div>
            <Swiper grabCursor={true} slidesPerView={6*ratio}  className={styles.mySwiper} navigation = {true}>
                {
                    movieData2.map((movie: any, idx:number) =>
                    <SwiperSlide key = {movie.title}>
                        <div key = {movie.title} className = {styles.card}>
                            <ReactCardFlip isFlipped={isFlipped2[idx]} flipDirection="horizontal">
                                <div className = {styles.poster}>
                                <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='300px' height='450px' onClick = {() => {handleClick2(idx)}}/>
                                </div>
                                <div className = {styles.content}>
                                    <div className= {styles.title}>{movie.title}</div>
                                    <div onClick = {()=>{handleClick2(idx)}} className = {styles.overview}>{movie.overview}</div>
                                </div>
                            </ReactCardFlip>
                        </div>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
        <div className={styles.container1}>
            <div className={styles.title1}>평점높은 콘텐츠</div>
            <Swiper grabCursor={true} slidesPerView={6*ratio}  className={styles.mySwiper} navigation = {true}>
                {
                    movieData3.map((movie: any, idx:number) =>
                    <SwiperSlide key = {movie.title}>
                        <div key = {movie.title} className = {styles.card}>
                            <ReactCardFlip isFlipped={isFlipped3[idx]} flipDirection="horizontal">
                                <div className = {styles.poster}>
                                <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='300px' height='450px' onClick = {() => {handleClick3(idx)}}/>
                                </div>
                                <div className = {styles.content}>
                                    <div className= {styles.title}>{movie.title}</div>
                                    <div onClick = {()=>{handleClick3(idx)}} className = {styles.overview}>{movie.overview}</div>
                                </div>
                            </ReactCardFlip>
                        </div>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
        </>
    );
};
  
export default Main
  