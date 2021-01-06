package cz.jalasoft.familytree.server.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseBuilder;
import org.springframework.jdbc.datasource.embedded.EmbeddedDatabaseType;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.sql.DataSource;

@ComponentScan("cz.jalasoft.familytree.server")
@EnableWebMvc
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.H2).build();
    }

    @EventListener(classes = ContextRefreshedEvent.class)
    public void onContextRefreshed() {
        var ds = dataSource();

        var flyway = Flyway.configure().dataSource(ds).locations("db/migrations").load();
        var result = flyway.migrate();
        System.out.println("Db update to version %s".formatted(result.database));
    }
}
