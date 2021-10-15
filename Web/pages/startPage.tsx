import { GetStaticProps, InferGetStaticPropsType} from 'next';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {Button,ProgressBar,Navbar} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating'
import {useState} from 'react'
import ReactCardFlip from 'react-card-flip';
import { useRouter } from 'next/router'

export const getStaticProps: GetStaticProps = async() => {
  const res = await fetch('http://221.147.149.142:8000/api/movie/movies?size=200')
  const data = await res.json()
  let result = []
  for await(let d of data.content){
    const res1 = await fetch(`https://api.themoviedb.org/3/movie/${d.tid}?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR`)
    result.push(await res1.json())
  }
  // const res = await fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
  // const data = await res.json()
  return {
      props:{
         movieData: result,
         originalData: data.content
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
  const handleStorage = (idx:number, rate:number) => {
    for(let i = 0; i < storage.length; i++){
      if(storage[i][0] === idx && storage[i][1] === rate)
        return
      else if(storage[i][0] === idx){
        storage.splice(i,1)
        break
      }
    }
    const nStorage = storage.slice()
    nStorage.push([idx,rate])
    setStorage(nStorage)
  }
  const refreshCard = (idx:number) => {
    const nStorage = storage.slice()
    for(let i = 0; i < storage.length; i++){
      if(storage[i][0] === idx){
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
              <div onClick = {() => {handleClick(idx); handleRating(0,idx); refreshCard(idx);}} className = {styles.overview}>{movie.overview}</div>
              <div className = {styles.foot}>
                <Rating onClick={(rate) => {handleRating(rate,idx)}} ratingValue={rating[idx]}/>
                <Button variant = "outline-primary" onClick = {()=> {handleStorage(idx,rating[idx])}}>Submit</Button>
              </div>
            </div>
            </ReactCardFlip>
        </div>
      )}
    </div>
  );
}

const Home = ({movieData, originalData}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [storage, setStorage] = useState<any[]>([]);
  const router = useRouter()
  console.log(storage)

  const submit = async() => {
    const submitData = []
    for await(let s of storage){
      let data = originalData[s[0]]
      data.movieId = data.id
      delete data.id
      data.tId = data.tid
      delete data.tid
      delete data.title
      delete data.genres
      data.rating = s[1]
      submitData.push(data)
    }
    console.log(JSON.stringify({
      userId : 1,
      pickedMovies: submitData
    }))

    const response = await fetch('/api/movie/recommendation',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId : 1,
            pickedMovies: submitData
        })
    })
    const data = await response.json()
    if (typeof sessionStorage !== 'undefined'){
      sessionStorage.setItem('recommendation',JSON.stringify(data))
    }
    router.push('/mainPage')
  }
  return (
    <>
      <Navbar fixed = 'top' className = {styles.Header}>
        <div className ={styles.headerTop}>
          <h1>Please rates at least 10 movies</h1>
          <Button variant = "success" disabled = {!(storage.length >= 10)} className = {styles.headerButton}
                  onClick={submit}>Next</Button>
        </div>
        <ProgressBar striped variant="success" now={storage.length*5} label = {`${storage.length}/20`} className = {styles.progressBar}/>
      </Navbar>
      <Cards movieData={movieData} storage = {storage} setStorage = {setStorage}></Cards>
    </>
  );
};

export default Home
