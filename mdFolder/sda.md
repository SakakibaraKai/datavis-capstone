# Big Data and the Cloud: Software Design and Architecture

Zoie Asato, Jules Brinkley, Kai Depweg, Jonathan Moreno-Farias, Jeongmuk Oh, Noah Oliver

CS 461: Senior Software Engineering Project 1

## Introduction

This project outlines the development of a Spark cluster environment within a Kubernetes compute setting, deployable in the cloud – crucial architecture for achieving the project’s objectives of building a scalable, resilient, and efficient data engineering platform. By incorporating containerized Jupyter Notebooks and real-time data visualizations through dashboards, the project aims to facilitate comprehensive data analysis and insights. This document details the intertwining of technologies such as Docker, Python, SQL, and various data science libraries, highlighting its scalability, maintainability, and alignment with modern data engineering practices.

## Architectural Goals and Principles

The architecture of this project is designed to achieve scalability, ensuring that the system can handle increased load and data volumes gracefully. Resiliency is a priority, with a focus on minimizing downtime and quickly recovering from potential failures. Efficiency is key, optimizing resource use for swift data processing.

The system adheres to modularity, breaking down the project into well-defined, interchangeable parts for easier maintenance. We embrace a separation of concerns, ensuring distinct functionalities are handled by different system components, preventing maintenance headaches and increasing complexity.

## System Overview

The system uses an Amazon Web Service (AWS) Elastic Compute (EC2) instance as its computational backbone, hosting a lot of technologies in Docker containers. The React user interface interacts with a Flask-based backend server. The Kubernetes environment is integrated for scalable data processing, while JupyterHub and Papermill provide an interactive notebook environment. A database manages data storage. Users interact with the frontend and notebooks. Developers will interact with the Developer Deployment UI and the Kubernetes dashboard to update and monitor the environment.

Figure 1 describes our project as a whole, showcasing how the Kubernetes environment will hold Docker containers. Figure 2 zooms in on how developers, users managing the system, will interact with it. Figure 3 shows how platform users, like data analysts, will interact with the web application to host and deploy databases and then perform analysis on them. 

![alt text](https://github.com/brinklju/datavis-capstone/blob/main/document-images/Kubernetes%20Backend.png)

*Figure 1: Relational Diagram of Kubernetes Backend*

*Source: Kyle Prouty*

![alt text](https://github.com/brinklju/datavis-capstone/blob/main/document-images/Deployment%20UI.png)

*Figure 2: Relational Diagram of Deployment UI*

*Source: Kyle Prouty*

![alt text](https://github.com/brinklju/datavis-capstone/blob/main/document-images/JupyterHub%20Notebooks.png)

*Figure 3: Relational Diagram of JupyterHub Notebook Deployment*

*Source: Kyle Prouty*

## Architectural Patterns

The project uses a divided architecture, pulling resources and management features from several different technologies for abstraction. The backend follows an Model, View, Controller (MVC) pattern through Flask, ensuring a clear separation of concerns, while React (a component-driven library) is used for user interfaces. Kubernetes provides distributed data processing power, and JupyterHub alongside Papermill facilitates interactive computing and automated notebook execution.

## Component Descriptions

The system architecture is neatly categorized into three main layers.

- Web Application Layer: Flask manages server-side logic and interfaces with the database, React ensures a dynamic and responsive user interface, and Docker guarantees consistent deployment environments for both. 

- Data Processing and Notebook Environment: features JupyterHub for interactive notebook experiences, Papermill for notebook automation, and Kubernetes to handle scalable data processing tasks.

- Database Layer: responsible for data persistence, serving as the central hub for data storage, retrieval, and management, ensuring robust data handling throughout the system.

## Data Management

The system’s data is systematically organized within a relational database, comprising tables for User Profiles, Projects, Tasks, and DataSets. The database management system for this project will be MySQL and each POD will have different data collection, so users can access different collections for each request. User Profiles store personal and authentication details of the users, while Projects keep track of the different initiatives users are working on. Each project can have multiple associated Tasks, capturing the specifics of individual work items, and DataSets, storing metadata about the data being used or generated in the project. These tables are interlinked through foreign keys, establishing clear relationships and ensuring data integrity. Access to this structured data is facilitated through RESTful API endpoints, enabling standard CRUD (Create, Read, Update, Delete) operations and ensuring a smooth data flow throughout the system.

## Interface Design

The interface design hinges on a set of API endpoints and HTTP communication protocols. Users manage and view projects through "GET /projects" and "POST /projects", and interact directly with specific projects using "GET /projects/{id}". WebSockets are utilized for real-time data updates, ensuring that the user interface remains synchronized with backend processes and data changes.

## Considerations

### Security

To mitigate security risks, the system employs HTTPs for secure data transmission, and implements JSON web tokens (JWT) for user authentication, ensuring that user sessions are securely managed. Role-based access control (RBAC) is in place to dictate user permissions, safeguarding sensitive user data and project information. All sensitive user information in the database, including passwords, is securely hashed and salted. Additionally, regular security audits and vulnerability scans are scheduled to proactively identify and address potential security threats.

### Performance

To meet performance requirements, the system adopts horizontal scaling, facilitated by Kubernetes for dynamic resource allocation across containerized applications. Caching is implemented at various levels, including in the database queries and within the web application, reducing latency and improving response times. Load balancers distribute incoming traffic evenly. For data storage, distributed file systems are used to enhance access speed and reliability.

### Maintenance and Support

This is primarily an educational project, so there is no customer that will be using our product after we have completed it. This means that as of now, there are no plans for any continued maintenance or support after this project is completed in two terms. This also means that we don’t have to worry about the logistics of a handoff to our project partner or any other stakeholders. With that said, Kyle Prouty and any HP team that wants to take up the project has full rights to do so however they choose following spring term.

## Deployment Strategy

Docker is used for local development to emulate the production environment, while separate Kubernetes clusters are utilized for testing and staging, helping with early issue detection. Resource sizing is adjusted based on performance insights, with the production environment hosted on a cloud provider utilizing managed Kubernetes services. Auto-scaling is implemented to handle variable loads efficiently, and resources are optimized for compute-heavy tasks and large datasets. In version 0.1.0, it is hosted in a local environment. This means it is a beta version and the product has been modified to address local bugs and get Kyle’s feedback. If the version is 1.0.0 or higher, it means it is hosted on AWS, which means that the web application we will ultimately submit has successfully reached production stage and been deployed.

## Testing Strategy

The testing strategy encompasses unit tests for individual components, integration tests for verifying component interactions, and performance tests in staging to identify bottlenecks, especially in Kubernetes jobs. End-to-end testing should give us a seamless user experience, while security testing validates authentication and data protection mechanisms. 

## Glossary

AWS - Amazon Web Services

EC2 - Elastic Compute

GET - Request method to fetch data from a server

DELETE - Request method to remove a resource from a server

JWT - JSON web tokens

MVC - Model, view, controller

POST - Request method to submit data to a server.


