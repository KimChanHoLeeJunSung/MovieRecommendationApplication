package com._chanho.movie_recommendation.user;

import java.util.List;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

public interface AppUserService {
    AppUser saveUser(AppUser appUser);
    AppUser getUser(String username);
    List<AppUser> getUsers();

    Role saveRole(Role role);
    void grantRoleToUser(String username, String roleName);
}
