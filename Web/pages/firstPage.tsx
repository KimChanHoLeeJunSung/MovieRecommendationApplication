import { GetStaticProps, InferGetStaticPropsType} from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import {Row,Col,Card,Button} from 'react-bootstrap';
import { Rating, RatingView } from 'react-simple-star-rating'
import {useState} from 'react'
import ReactCardFlip from 'react-card-flip';

export const getStaticProps: GetStaticProps = async() => {
  const res = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
  const data = await res.json()
  return {
      props:{
         movieData: data.results
      }
  }
}

const Cards = ({movieData} : any) => {
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

  return(
    <div className = {styles.cards}>
      {movieData.map((movie: any, idx:number) => 
        <div key = {movie.title} className = {styles.card}>
           <ReactCardFlip isFlipped={isFlipped[idx]} flipDirection="vertical">
            <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='300px' height='450px' onClick = {() => {handleClick(idx)}}/>
            <div className = {styles.content}>
              <div className= {styles.title}>{movie.title}</div>
              <div onClick = {() => {handleClick(idx)}} className = {styles.overview}>{movie.overview}</div>
              <div className = {styles.foot}>
                <Rating onClick={(rate) => {handleRating(rate,idx)}} ratingValue={rating[idx]} /* Rating Props */ className = {styles.ratings}/>
                <Button variant = "outline-primary" className = {styles.submitButton}>Submit</Button>
              </div>
            </div>
            </ReactCardFlip>
        </div>
      )}
    </div>
  );
}

const Home = ({movieData}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Cards movieData={movieData}></Cards>
    </>
  );
};

export default Home
