FROM alpine-jdk11
MAINTAINER vinceynhz
COPY hermes*.jar hermes.jar
ENTRYPOINT ["java", "-jar", "./hermes.jar"]
