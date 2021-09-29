package com._chanho.movie_recommendation;

import com._chanho.movie_recommendation.user.AppUser;
import com._chanho.movie_recommendation.user.AppUserService;
import com._chanho.movie_recommendation.user.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;

/**
 *  @author MungBoon(Kim ChanHo)
 *  @version 1.0
 *  @since 09/24/2021
 */

@SpringBootApplication
public class MovieRecommendationApplication {

	public static void main(String[] args) {
		SpringApplication.run(MovieRecommendationApplication.class, args);
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner run(AppUserService userService) {
		return args -> {
			userService.saveRole(new Role(null, "ROLE_USER"));
			userService.saveRole(new Role(null, "ROLE_MANAGER"));
			userService.saveRole(new Role(null, "ROLE_ADMIN"));
			userService.saveRole(new Role(null, "ROLE_SUPER_ADMIN"));

			userService.saveUser(new AppUser(null, "ChanBo", "ChanHo", "1234", new ArrayList<>()));
			userService.saveUser(new AppUser(null, "Modr", "Modric", "1234", new ArrayList<>()));
			userService.saveUser(new AppUser(null, "Chris", "Ronaldo", "1234", new ArrayList<>()));
			userService.saveUser(new AppUser(null, "Sergio", "Ramos", "1234", new ArrayList<>()));

			userService.grantRoleToUser("ChanHo", "ROLE_USER");
			userService.grantRoleToUser("Modric", "ROLE_USER");
			userService.grantRoleToUser("Ronaldo", "ROLE_USER");
			userService.grantRoleToUser("Ronaldo", "ROLE_MANAGER");
			userService.grantRoleToUser("Ramos", "ROLE_ADMIN");
			userService.grantRoleToUser("Ramos", "ROLE_SUPER_ADMIN");
		};
	}

}
