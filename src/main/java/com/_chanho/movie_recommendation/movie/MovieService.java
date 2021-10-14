package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.GenresRepo;
import lombok.RequiredArgsConstructor;
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
}
