package com._chanho.movie_recommendation.user;

import org.springframework.data.jpa.repository.JpaRepository;

import javax.transaction.Transactional;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    AppUser findByUsername(String username);
}
