package com._chanho.movie_recommendation.movie;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;

@Repository
public interface MovieRepo extends JpaRepository<Movies, Long>, MovieRepoExtension {

    @EntityGraph(value = "Movies.withGenres", type= EntityGraph.EntityGraphType.FETCH)
    Page<Movies> findAll(Pageable pageable);
}
