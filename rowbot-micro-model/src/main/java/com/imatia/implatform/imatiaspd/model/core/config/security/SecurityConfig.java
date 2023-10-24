package com.imatia.implatform.imatiaspd.model.core.config.security;

import com.imatia.implatform.imatiaspd.model.core.service.impl.CustomPrivileges;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.expression.method.DefaultMethodSecurityExpressionHandler;
import org.springframework.security.access.expression.method.MethodSecurityExpressionHandler;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.GlobalMethodSecurityConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
	static private final DbFineGrainPermissionEvaluator permissionEvaluator =  new DbFineGrainPermissionEvaluator();
	@Bean
	static MethodSecurityExpressionHandler expressionHandler() {
		var expressionHandler = new DefaultMethodSecurityExpressionHandler();
		expressionHandler.setPermissionEvaluator(permissionEvaluator);
		return expressionHandler;
	}
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
	
	@Bean
	MvcRequestMatcher.Builder mvc(HandlerMappingIntrospector introspector) {
		return new MvcRequestMatcher.Builder(introspector);
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http, MvcRequestMatcher.Builder mvc) throws Exception {
		http
				.authorizeHttpRequests((authorizeHttpRequests) ->
						authorizeHttpRequests
								.requestMatchers(mvc.pattern("/**")).hasAuthority(CustomPrivileges.SEE_HOMEPAGE_PRIV.getName())
				)
				.httpBasic(Customizer.withDefaults())
				.logout((logout)->
						logout
								.logoutUrl("/logout.html")
								.deleteCookies("JSESSIONID")
				);
		return http.build();
		//TODO: rememberMe
	}

}
