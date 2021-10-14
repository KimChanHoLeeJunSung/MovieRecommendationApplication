import { GetStaticProps, InferGetStaticPropsType} from 'next';
import {useState,useEffect} from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "../styles/Main.module.css";
import "swiper/css";
import "swiper/css/navigation";
import SwiperCore, {Navigation} from 'swiper';
SwiperCore.use([Navigation]);

export const getStaticProps: GetStaticProps = async() => {
    const res1 = await fetch('https://api.themoviedb.org/3/movie/popular?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
    const data1 = await res1.json()
    const res2 = await fetch('https://api.themoviedb.org/3/movie/496243/similar?api_key=4a31bb4ebbbd558417577076973d354b&language=ko-KR&region=KR')
    const data2 = await res2.json()
    return {
        props:{
           movieData1: data1.results.slice(0,10),
           movieData2: data2.results.slice(0,10)
        }
    }
}


const Main = ({movieData1,movieData2}: InferGetStaticPropsType<typeof getStaticProps>) => {
    const [ratio,setRatio] = useState<number>(1)

    useEffect(() => {
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
        <div className={styles.container}>
            <div className={styles.title1}>한국 TOP10 콘텐츠</div>
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
                        <div className={`${styles.slideImage} image${idx+1}`}>
                            <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='240px' height='360px'/>
                        </div>
                        <style global jsx>{`
                            .image10 {
                                left : -70px;
                            }    
                        `}</style>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
        <div className={styles.container}>
            <div className={styles.title1}>취향저격 콘텐츠</div>
            <Swiper grabCursor={true} slidesPerView={6*ratio}  className={styles.mySwiper} navigation = {true}>
                {
                    movieData2.map((movie: any, idx:number) =>
                    <SwiperSlide key = {movie.title}>
                        <Image alt = '' src ={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} width='300px' height='450px'/>
                    </SwiperSlide>)
                }
            </Swiper>
        </div>
        </>
    );
};
  
export default Main
  