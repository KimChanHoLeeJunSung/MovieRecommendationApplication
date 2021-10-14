package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Set;


public interface MovieRepoExtension {
    List<Movies> findByGenres(Set<Genres> genres);
}
