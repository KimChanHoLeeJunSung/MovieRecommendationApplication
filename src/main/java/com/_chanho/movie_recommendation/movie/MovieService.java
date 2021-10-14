package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;
import com._chanho.movie_recommendation.genre.GenresRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepo movieRepo;
    private final GenresRepo genresRepo;

    public ResponseEntity retrieveMovies(Pageable pageable) {
        Page<Movies> moviesPage = movieRepo.findAll(pageable);
        return new ResponseEntity<>(moviesPage, HttpStatus.OK);
    }

    public HashMap<Genres, Integer> sortByValue(HashMap<Genres, Integer> raw) {
        return raw.entrySet()
                .stream()
                .sorted((i1, i2) -> i1.getValue().compareTo(i2.getValue()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e2, LinkedHashMap::new
                ));
    }

    public HashMap<Genres, Integer> getPickedGenres(RecommendationDto recommendationDto) {
        HashMap<Genres, Integer> pickedGenres = new HashMap<>();
        recommendationDto.getPickedMovies().forEach(
                movieData -> {
                    Movies movie = movieRepo.findById(movieData.getMovieId()).orElseThrow(
                            () -> new IllegalStateException("Cannot find Movies with given id: " + movieData.getMovieId().toString()));

                    Set<Genres> genresList = movie.getGenres();
                    for(Genres g : genresList) {
                        Integer count = pickedGenres.getOrDefault(g, 0);
                        pickedGenres.put(g, count);
                    }
                }
        );

        return pickedGenres;
    }

    public Set<Genres> selectKeyInMap(HashMap<Genres, Integer> pickedGenresWithSort) {
        Iterator<Genres> keys = pickedGenresWithSort.keySet().iterator();
        Set<Genres> selectBestInKeys = new HashSet<>();
        int count = 0;
        while(keys.hasNext() && count < 2) {
            Genres genres = keys.next();
            selectBestInKeys.add(genres);
            count++;
        }

        return selectBestInKeys;
    }
}
