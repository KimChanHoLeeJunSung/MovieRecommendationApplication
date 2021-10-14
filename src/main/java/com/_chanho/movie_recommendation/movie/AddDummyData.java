package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.GenreService;
import com._chanho.movie_recommendation.genre.Genres;
import com._chanho.movie_recommendation.genre.GenresRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/dummy")
public class AddDummyData {

    private final GenresRepo genresRepo;
    private final GenreService genreService;

    private final MovieRepo movieRepo;
    private final Map<Long, Long> MovieIdToTid;


    @GetMapping("/add-genres")
    public ResponseEntity<?> addGenres() {
        List<String> genresList = Arrays.asList(
                "(no genres listed)",
                "Mystery",
                "Adventure",
                "Horror",
                "Action",
                "Romance",
                "Western",
                "Film-Noir",
                "Sci-Fi",
                "Children",
                "Animation",
                "IMAX",
                "Drama",
                "Comedy",
                "Thriller",
                "Musical",
                "Fantasy",
                "Documentary",
                "War",
                "Crime");

        genresList.forEach(genre -> {
            Genres genres = new Genres(genre);
            genresRepo.save(genres);
        });

        return ResponseEntity.ok().build();
    }

    @GetMapping("/add-movies")
    public ResponseEntity<?> addMovies() throws IOException {

        File csv = new File("C:\\Users\\KimChanHo\\IdeaProjects\\movie_recommendation\\src\\main\\java\\com\\_chanho\\movie_recommendation\\data\\movies.csv");
        BufferedReader br = new BufferedReader(new BufferedReader(new FileReader(csv)));

        String line = "";
        boolean skipFirstLine = true;
        while ((line = br.readLine()) != null) {
            if(skipFirstLine) {
                skipFirstLine = false;
                continue;
            }

            String[] token = line.split(",");
            Long movieId = Long.parseLong(token[0]);
            String[] genre = token[token.length - 1].split("\\|");

            StringBuilder title = new StringBuilder();
            for(int i = 1; i < token.length - 1; i++) {
                title.append(token[i]);
                if(i != token.length-2) title.append(",");
            }
            System.out.println("title: " + title);


            movieRepo.save(Movies.builder()
                    .id(movieId).tId(MovieIdToTid.get(movieId))
                    .title(title.toString())
                    .genres(Arrays.stream(genre)
                            .map(genreService::findOrCreateNew)
                            .collect(Collectors.toSet()))
                    .build());

        }

        return ResponseEntity.ok().build();
    }

}
