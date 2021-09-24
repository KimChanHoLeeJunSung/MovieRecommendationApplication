package com._chanho.movie_recommendation.user;

import org.springframework.data.jpa.repository.JpaRepository;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
