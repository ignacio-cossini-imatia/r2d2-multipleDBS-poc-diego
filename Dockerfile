FROM openjdk:11-jre-slim

ENV PORT 8080
ENV CLASSPATH /opt/lib
EXPOSE 8080

# Copy jar file
COPY ./imatiaspd-boot/target/imatiaspd-boot.jar /opt/imatiaspd-boot.jar
WORKDIR /opt
CMD ["/bin/bash", "-c", "case $ENVIRONMENT_PROFILE in 'production') java -jar imatiaspd-boot.jar --spring.profiles.active=production;; *) java -jar imatiaspd-boot.jar --spring.profiles.active=staging;; esac;"]
