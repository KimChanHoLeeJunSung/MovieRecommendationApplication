package com._chanho.movie_recommendation.api;

import com._chanho.movie_recommendation.user.AppUser;
import com._chanho.movie_recommendation.user.AppUserService;
import com._chanho.movie_recommendation.user.Role;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

@RequestMapping("/api")
@RestController @RequiredArgsConstructor
public class AppUserResource {
    private final AppUserService appUserService;

    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    @PostMapping("/user/save")
    public ResponseEntity<AppUser> saveUser(@RequestBody AppUser appUser) {
        URI uri = URI.create(
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/user/save").toUriString());
        return ResponseEntity.created(uri).body(appUserService.saveUser(appUser));
    }

    @PostMapping("/role/save")
    public ResponseEntity<Role> saveUser(@RequestBody Role role) {
        URI uri = URI.create(
                ServletUriComponentsBuilder
                        .fromCurrentContextPath()
                        .path("/api/role/save").toUriString());

        return ResponseEntity.created(uri).body(appUserService.saveRole(role));
    }

    @PostMapping("/role/grant-to-user")
    public ResponseEntity<?> saveUser(@RequestBody RoleToUserForm form) {
        appUserService.grantRoleToUser(form.getUserName(), form.getRoleName());
        return ResponseEntity.ok().build();
    }
}

@Data
class RoleToUserForm {
    private String userName;
    private String roleName;
}
