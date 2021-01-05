package cz.jalasoft.familytree.server.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@ComponentScan("cz.jalasoft.familytree.server")
@EnableWebMvc
@Configuration
public class WebConfig implements WebMvcConfigurer {


}
