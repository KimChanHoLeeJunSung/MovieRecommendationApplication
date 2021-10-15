package com._chanho.movie_recommendation.movie;

import com._chanho.movie_recommendation.genre.Genres;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Set;


@NamedEntityGraph(name="Movies.withGenres", attributeNodes = {
        @NamedAttributeNode("genres")
})
@Entity @Data @Builder
@NoArgsConstructor @AllArgsConstructor
public class Movies {
    @Id
    @GeneratedValue
    private Long id;

    private String title;

    private Long tId;

    @ManyToMany
    private Set<Genres> genres;

    public MovieData toMovieData() {
        return MovieData.builder().movieId(this.id).tId(this.tId).rating(4.0).build();
    }
}
