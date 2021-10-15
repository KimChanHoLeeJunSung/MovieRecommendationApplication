package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;
import com._chanho.movie_recommendation.genre.QGenres;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.Set;

public class MovieRepoExtensionImpl extends QuerydslRepositorySupport implements MovieRepoExtension {
    public MovieRepoExtensionImpl() {
        super(Movies.class);
    }

    @Override
    public List<Movies> findByGenres(Set<Genres> genres, RecommendationDto recommendationDto) {
        com._chanho.movie_recommendation.movie.QMovies movies
                = com._chanho.movie_recommendation.movie.QMovies.movies;

        BooleanBuilder containGenres = new BooleanBuilder();
        genres.forEach(genre -> {
            containGenres.and(movies.genres.contains(genre));
        });

        BooleanBuilder notInRecommendation = new BooleanBuilder();
        recommendationDto.getPickedMovies().forEach(movieData -> {
            notInRecommendation.and(movies.id.notIn(movieData.getMovieId()));
        });

        JPQLQuery<Movies> query = from(movies)
                .where(containGenres)
                .where(notInRecommendation)
                .leftJoin(movies.genres, QGenres.genres).fetchJoin()
                .distinct().limit(10);


        return query.fetch();
    }
}
