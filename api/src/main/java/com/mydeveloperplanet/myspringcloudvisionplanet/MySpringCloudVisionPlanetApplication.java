package com.mydeveloperplanet.myspringcloudvisionplanet;

import javax.servlet.MultipartConfigElement;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.util.unit.DataSize;

@SpringBootApplication
public class MySpringCloudVisionPlanetApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(MySpringCloudVisionPlanetApplication.class, args);
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(MySpringCloudVisionPlanetApplication.class);
    }

    // Set maxPostSize of embedded tomcat server to 10 megabytes (default is 2 MB, not large enough to support file uploads > 1.5 MB)
    @Bean
    MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofBytes(512000000L));
        factory.setMaxRequestSize(DataSize.ofBytes(512000000L));
        return factory.createMultipartConfig();
    }
}
