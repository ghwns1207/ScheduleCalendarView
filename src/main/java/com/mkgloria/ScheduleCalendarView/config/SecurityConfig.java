package com.mkgloria.ScheduleCalendarView.config;

import com.mkgloria.ScheduleCalendarView.config.auth.PrincipalDetailsService;
import com.mkgloria.ScheduleCalendarView.config.handler.CustomAccessDeniedHandler;
import com.mkgloria.ScheduleCalendarView.config.handler.CustomAuthenticationFailureHandler;
import com.mkgloria.ScheduleCalendarView.config.handler.CustomAuthenticationSuccessHandler;
import com.mkgloria.ScheduleCalendarView.utils.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Slf4j
@AllArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class SecurityConfig{

    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;
    private final CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(CsrfConfigurer::disable);
        http.authorizeHttpRequests(authorize ->
                authorize
                        .requestMatchers("/user/**").authenticated()
                        .requestMatchers("/manager/**").hasAnyRole("ADMIN","MANAGER")
                        .requestMatchers("/admin/**").hasAnyRole("ADMIN")
                        .anyRequest().permitAll()
        ).formLogin(formLogin ->
                formLogin
                        .loginPage("/loginFrom")
                        .loginProcessingUrl("/api/auth/login")
                        .successHandler(customAuthenticationSuccessHandler)
                        .failureHandler(customAuthenticationFailureHandler)
                        .permitAll()
        ).logout(logout ->
                        logout
                                .logoutSuccessUrl("/loginFrom")
                                .invalidateHttpSession(true)
                                .deleteCookies("JSESSIONID")
                                .deleteCookies("jwtToken")
                ).exceptionHandling(exceptionHandling ->
                exceptionHandling
                        .accessDeniedHandler(customAccessDeniedHandler)
        );

//        http.httpBasic(AbstractHttpConfigurer::disable);
//        http.addFilterAfter(new JwtAuthFilter(principalDetailsService
//                , jwtUtil), UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
