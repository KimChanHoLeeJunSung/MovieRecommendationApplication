package com._chanho.movie_recommendation.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AppUserServiceImpl implements AppUserService{
    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;

    @Override
    public AppUser saveUser(AppUser appUser) {
        log.info("Saving new user {} to the db", appUser.getNickname());
        return appUserRepository.save(appUser);
    }

    @Override
    public AppUser getUser(String username) {
        return appUserRepository.findByUsername(username);
    }

    @Override
    public List<AppUser> getUsers() {
        return appUserRepository.findAll();
    }

    @Override
    public Role saveRole(Role role) {
        log.info("Saving new role {} to the db", role.getName());
        return roleRepository.save(role);
    }

    @Override
    public void grantRoleToUser(String username, String roleName) {
        log.info("Grant new role {} to {}", roleName, username);
        AppUser appUser = appUserRepository.findByUsername(username);
        Role role = roleRepository.findByName(roleName);

        appUser.getRoles().add(role);
    }
}
