# Project Hermes

## Introduction

Project Hermes is a web application designed for one-to-many communications, offering two distinct roles: **Producer** and **Subscriber**. In the Producer role, users can send messages in markdown code to a randomly generated channel. Subscribers can join said channels by entering the corresponding ID and receive and edit messages, as well as see the live rendered markdown format.

## Application Architecture

Project Hermes follows a Domain-Driven Design (DDD) architecture and is built using Spring Boot for the backend and Vue 3 for the frontend. It leverages WebSockets with STOMP (Simple Text Oriented Messaging Protocol) for real-time communication between Publishers and Subscribers.

### Backend Architecture

The backend of Project Hermes consists of a Spring Boot application that acts as a simple STOMP-over-WebSockets message broker. It provides basic security and serves static web resources via the embedded Tomcat server. The core components include:

- **Controller:** There is a single controller that handles incoming messages in the format of:
  ```json
  {
    "channelId": "...", 
    "data": "..."
  }
  ```
- **Model:** The messages are mapped to simple POJO annotated with Lombok. Messages are then forwarded to the corresponding topic based on the channel ID for subscribers to receive.
- **Infra:** The application provides simple SpringBoot starter configurations for the STOMP broker and web security.

### Frontend Architecture

The frontend of Project Hermes is built with HTML, CSS, and JavaScript, and utilizes Vue 3 for building interactive UI components. Key frontend technologies include:

- **[Vue 3](https://vuejs.org):** Project Hermes utilizes Vue 3 to create a responsive and dynamic user interface.
- **[Ace](https://github.com/ajaxorg/ace):** The Ace editor is used for message input and editing, providing a powerful in-browser code editor.
- **[Marked](https://marked.js.org):** Messages are rendered in markdown format using Marked for visual validation and copy of the formatted message.

## Getting Started

### Choosing a Role

- On launching the application, users are presented with a choice to select their role as a **Producer** or **Subscriber**.

### Producer Role

- When selecting the Producer role, the application generates a unique channel ID.
- Users can send messages in markdown code to the generated channel.

### Subscriber Role

- Selecting the Subscriber role prompts users to enter a channel ID to subscribe to.
- Subscribers receive messages in raw markdown and the UI presents the rendered markdown format for editing and viewing.

### Configurable Backend Host

- Project Hermes allows users to change the backend host to connect to using a simple cookie. This option can be edited from the initial page.

## Tech Stack

Project Hermes utilizes the following technologies:

- **Backend:**
  - Spring Boot 2.1.18
  - STOMP (Simple Text Oriented Messaging Protocol)
  - Embedded Tomcat
  - Lombok
  - JDK 11

- **Frontend:**
  - Vue 3
  - Ace Editor
  - Marked
  - HTML 5
  - CSS 3
  - Javascript ES 6

- **Build Tools:**
  - Gradle 4.8

## Building the Project

To build Project Hermes, follow these steps:

1. Clone the repository to your local machine.

2. Open a terminal and navigate to the project's root directory.

3. Use the provided Gradle Wrapper (`gradlew`) to build the project:

   ```shell
   ./gradlew build
   ```

   This command will build the project, including compiling the backend and frontend components.

4. Once the build is successful, you can run the application using the following command:

   ```shell
   java -jar build/libs/hermes-{version}.jar
   ```

5. Once the application starts it can be accessed in the browser at `http://localhost:8080`

## Docker Integration
Project Hermes provides Docker support for easy deployment. You can build and run the application in a Docker container using the provided Dockerfile and run script.

### Building the Docker Image

Ensure that Docker is installed on your system.

Navigate to the project's root directory.

Run the provided build-docker.sh script to build the Docker image:

```shell
./run.sh -c build
```

This script will create a Docker image based on an existing image of Alpine Linux preloaded with OpenJDK 11 and package the application JAR inside the new image.

### Running the Docker Container

Once the Docker image is built, you can run the application in a Docker container:

```shell
./run.sh
```

The application then will be available in the docker host under port `60069`
