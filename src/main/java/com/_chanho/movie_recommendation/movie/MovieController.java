package com._chanho.movie_recommendation.movie;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
