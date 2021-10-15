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
        HashMap<Genres, Integer> pickedGenres = movieService.getPickedGenres(recommendationDto);
        HashMap<Genres, Integer> pickedGenresWithSort = movieService.sortByValue(pickedGenres);
        Set<Genres> selectBestInKeys = movieService.selectKeyInMap(pickedGenresWithSort);
        return movieRepo.findByGenres(selectBestInKeys, recommendationDto);
    }
}
