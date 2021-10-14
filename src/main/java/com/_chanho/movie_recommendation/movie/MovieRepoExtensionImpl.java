package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;
import com._chanho.movie_recommendation.genre.QGenres;
import com._chanho.movie_recommendation.movie.QMovies;
import com.querydsl.jpa.JPQLQuery;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

import java.util.List;
import java.util.Set;

public class MovieRepoExtensionImpl extends QuerydslRepositorySupport implements MovieRepoExtension {
    public MovieRepoExtensionImpl() {
        super(Movies.class);
    }

    @Override
    public List<Movies> findByGenres(Set<Genres> genres) {
        QMovies movies = QMovies.movies;
        JPQLQuery<Movies> query = from(movies)
                .where(movies.genres.any().in(genres))
                .leftJoin(movies.genres, QGenres.genres).fetchJoin()
                .distinct().limit(10);

        return query.fetch();
    }
}
