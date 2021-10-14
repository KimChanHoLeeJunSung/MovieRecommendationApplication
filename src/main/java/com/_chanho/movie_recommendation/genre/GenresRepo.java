package com._chanho.movie_recommendation.genre;

import com._chanho.movie_recommendation.genre.Genres;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;
import java.util.Optional;

@Transactional
public interface GenresRepo extends JpaRepository<Genres, Long> {

    Optional<Genres> findByName(String name);

}
