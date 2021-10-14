import { GetStaticProps, InferGetStaticPropsType} from 'next';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {Button,ProgressBar,Navbar} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'
import {useState} from 'react'
import ReactCardFlip from 'react-card-flip';
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async() => {
  const res = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
  const data = await res.json()
  return {
      props:{
         movieData: data.results
      }
  }
}

const Cards = ({movieData,storage,setStorage} : any) => {
  const [rating, setRating] = useState<number[]>(new Array(movieData.length).fill(0))
  const [isFlipped, setIsFlipped] = useState<boolean[]>(new Array(movieData.length).fill(false))

  const handleRating = (rate: number,idx: number) => {
    const nRating = rating.slice()
    nRating.splice(idx,1,rate)
    setRating(nRating)
  }
  const handleClick = (idx:number) => {
    const nFlipped = isFlipped.slice()
    nFlipped.splice(idx,1,!isFlipped[idx])
    setIsFlipped(nFlipped)
  }
  const handleStorage = (title:string, rate:number) => {
    for(let i = 0; i < storage.length; i++){
      if(storage[i][0] === title && storage[i][1] === rate)
        return
      else if(storage[i][0] === title){
        storage.splice(i,1)
        break
      }
    }
    const nStorage = storage.slice()
    nStorage.push([title,rate])
    setStorage(nStorage)
  }
  const refreshCard = (title:string) => {
    const nStorage = storage.slice()
    for(let i = 0; i < storage.length; i++){
      if(storage[i][0] === title){
        nStorage.splice(i,1)
        setStorage(nStorage)
        break
      }
    }
  }

  return(
    <div className = {styles.cards}>
      {movieData.map((movie: any, idx:number) => 
        <div key = {movie.title} className = {styles.card}>
           <ReactCardFlip isFlipped={isFlipped[idx]} flipDirection="vertical">
            <div className = {styles.poster}>
              <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='300px' height='450px' onClick = {() => {handleClick(idx)}}/>
            </div>
            <div className = {styles.content}>
              <div className= {styles.title}>{movie.title}</div>
              <div onClick = {() => {handleClick(idx); handleRating(0,idx); refreshCard(movie.title);}} className = {styles.overview}>{movie.overview}</div>
              <div className = {styles.foot}>
                <Rating onClick={(rate) => {handleRating(rate,idx)}} ratingValue={rating[idx]}/>
                <Button variant = "outline-primary" onClick = {()=> {handleStorage(movie.title,rating[idx])}}>Submit</Button>
              </div>
            </div>
            </ReactCardFlip>
        </div>
      )}
    </div>
  );
}

const Home = ({movieData}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [storage, setStorage] = useState<any[]>([]);
  const router = useRouter()
  console.log(storage)
  return (
    <>
      <Navbar fixed = 'top' className = {styles.Header}>
        <div className ={styles.headerTop}>
          <h1>Please rates at least 10 movies</h1>
          <Button variant = "success" disabled = {!(storage.length >= 10)} className = {styles.headerButton}
                  onClick={() => router.push('/mainPage')}>Next</Button>
        </div>
        <ProgressBar striped variant="success" now={storage.length*5} label = {`${storage.length}/20`} className = {styles.progressBar}/>
      </Navbar>
      <Cards movieData={movieData} storage = {storage} setStorage = {setStorage}></Cards>
    </>
  );
};

export default Home
