package com._chanho.movie_recommendation.genre;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class GenreService {
    private final GenresRepo genresRepo;

    public Genres findOrCreateNew(String name) {
        return genresRepo.findByName(name).orElseGet(
                () -> genresRepo.save(new Genres(name))
        );
    }
}
