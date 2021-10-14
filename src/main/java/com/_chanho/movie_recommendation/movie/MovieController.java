package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/movie")
public class MovieController {
    private final MovieRepo movieRepo;
    private final MovieService movieService;

    @GetMapping("/movies")
    public ResponseEntity retrieveMovies(@PageableDefault(size = 100) Pageable pageable) {
        return movieService.retrieveMovies(pageable);
    }

    @PostMapping("/recommendation")
    public List<Movies> getRecommendation(@RequestBody RecommendationDto recommendationDto) {
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

        HashMap<Genres, Integer> pickedGenresWithSort = sortByValue(pickedGenres);
        Iterator<Genres> keys = pickedGenresWithSort.keySet().iterator();
        Set<Genres> selectBestInKeys = new HashSet<>();
        int count = 0;
        while(keys.hasNext() && count < 2) {
            Genres genres = keys.next();
            selectBestInKeys.add(genres);
            count++;
        }

        for(Genres g : selectBestInKeys) {
            log.info("selected genres: " + g.toString());
        }


        return movieRepo.findByGenres(selectBestInKeys);
    }

    private HashMap<Genres, Integer> sortByValue(HashMap<Genres, Integer> raw) {
        return raw.entrySet()
                .stream()
                .sorted((i1, i2) -> i1.getValue().compareTo(i2.getValue()))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e2, LinkedHashMap::new
                ));
    }
}
