package cz.jalasoft.familytree.server;

import cz.jalasoft.familytree.server.config.WebConfig;
import org.apache.catalina.Context;
import org.apache.catalina.LifecycleException;
import org.apache.catalina.core.StandardContext;
import org.apache.catalina.startup.Tomcat;
import org.flywaydb.core.Flyway;
import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.support.AnnotationConfigWebApplicationContext;
import org.springframework.web.servlet.DispatcherServlet;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.util.Set;

public class Main {

    public static void main(String[] args) throws LifecycleException {

        Tomcat server = new Tomcat();
        server.setPort(8585);
        StandardContext context = (StandardContext) server.addContext("/", "/tmp");
        context.addServletContainerInitializer(Main::onStartup, null);

        server.start();
        server.getServer().await();
    }

    private static void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
        var appCtx = new AnnotationConfigWebApplicationContext();
        appCtx.register(WebConfig.class);

        ctx.addListener(new ContextLoaderListener(appCtx));

        var registration = ctx.addServlet("app", new DispatcherServlet(appCtx));
        registration.setLoadOnStartup(1);
        registration.addMapping("/");

    }
}
