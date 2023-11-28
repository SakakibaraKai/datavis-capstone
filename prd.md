# Big Data and the Cloud: Product Requirements Document (PRD)

Zoie Asato, Jules Brinkley, Kai Depweg, Jonathan Moreno-Farias, Jeongmuk Oh, Noah Oliver

## Problem Description

As a company dealing with extensive datasets, it's challenging to identify a system that can seamlessly handle data reception, transformation, storage, and visualization. The existing solutions in place require significant manual effort for data transformation and lack the computational power needed for optimal efficiency. Additionally, there's a need for a system that allows easy backend modification and updates to adapt to evolving requirements. We are looking for a solution that enables smooth data insertion and provides monitoring capabilities.

### Scope

Our project will be a Kubernetes environment hosted on the cloud (AWS) to host multiple pods that will contain Jupyter Notebooks to perform data science transformations. After transformation, we will move the data into relational databases, with dashboards that we will be able to view from a web app that is also hosted within the kubernetes environment.

### Use Cases

A user deploys a Jupyter notebook to the Kubernetes cluster, processes real-time streaming data using Spark, and visualizes results instantly.

Multiple users deploy their notebooks on the cluster to run data tasks simultaneously without interference, e.g. students at a college.

Users deploy data tasks on both their private cloud and on Raspberry Pis for fast, localized insights, e.g. company testing secret data that can’t touch the internet.

A data engineer will be able to deploy new dockerized pods using a developer deployment UI to streamline their CI/CD

A data analyst will be able to view dashboards to help them analyze large sets of data

## Purpose and Vision (Background)

Our purpose is to create a seamless, intuitive platform that fundamentally transforms the way data is managed, analyzed, and visualized within Kubernetes environments, specifically tailored for Jupyter notebooks. By bridging the gap between various technologies and ensuring compatibility with both cloud platforms and Raspberry Pis, we will offer a scalable and user-friendly environment. This platform will facilitate real-time data analysis and visualization at any scale, catering to a wide spectrum of users from students to industry professionals. We seek to create a solution with innovation, practicality, and future-readiness in data management technology.

Stakeholders

-	Product Managers (project partner / Instructors)
-	Engineering Team (team members)
-	Users (data analysts, data scientists, etc.)

Project Partner - Should be updated on major updates milestones and should be kept up to schedule of processes. They should be kept up to note on what is happening within the team with schedules, emails and meetings. They should be allowed to add suggestions and guidance when stuck on significant issues.

Engineering Team - Should be in constant communication, allowing for a smooth workflow of what is being accomplished. Again checkup should be enforced to see how progress is going and to see what we are doing against the schedule. This also allows the divvy up of work. Discord communication for requests of code reviews and idea discussions should be encouraged.

Users - Specific targets are divided into scientists and analysts who know how to handle data. They are basically good at data handling technology and want to control the visual flow of data. Those who are most sensitive to and interested in visual exposure specific flow control are assumed to be empowered to select data through our platform.

## Preliminary Context

### Assumptions

We are using standard tools for a project like this in the data engineering space, so compatibility has all been thoroughly tested by others, meaning limited problems with reliability and availability of Kubernetes, JupyterHub, and Docker. Libraries and databases that are used will be open-sourced. We will have proper rights to use information/data otherwise.

We have until the end of winter term to build our first version, and a deadline of the spring term engineering expo during spring term to finish implementing our solution.

### Constraints

Project deadline constraint comes from the spring term engineering expo and the three course sequence. We must have our final project done before the expo in order to prepare for presentations.

There are no budget constraints limiting us as the third party tools and open source data is free to use.

### Dependencies

The successful setup of a Kubernetes cluster depends on either getting the necessary hardware (Raspberry Pis) or selecting and configuring an appropriate cloud environment.

Integration of Jupyter Notebooks relies on the successful deployment of Docker containers within the Kubernetes environment.

The data visualization and dashboard creation depend on the seamless ETL process and integration of the open-source real-time data set.

The overall project success is dependent on the interplay and effective integration of various software tools, platforms, and libraries mentioned in the project description.

## Market Assessment and Competition Analysis

The goal of this project is not to make something new, rather to make use of tools that exist to create a portfolio project and to learn about the data engineering space. We will be using a lot of methodologies that already exist to help us build our environment. We don’t want to use alternatives because that wouldn’t give us the experience and flexibility of building our own environments to use.

- Traditional Business Intelligence Tools (e.g., Tableau, PowerBI): User-friendly but lacks the custom scripting capabilities of Jupyter Notebooks.
- Google Data Studio: Free and integrates with Google services, but limited in advanced analytics capabilities.
- RedisInsight: Efficient for Redis data visualization, but limited to Redis-specific tasks.
- Open-Source Notebooks (e.g., Zeppelin, RStudio): Offers scripting like Jupyter, but may lack its widespread adoption and support.
- Homegrown Python/Julia Scripts: Highly customized but may not be as scalable or comprehensive as a platform solution.
- Cloud Native Solutions (e.g., AWS Sagemaker, Google Cloud AI Notebooks): Integrated with cloud platforms but tied to specific providers. Costs can also be quite high.

All of these potential solutions offer integration with various services, but all of them lack the combination of Jupyter Notebooks’ versatility with the scalability and flexibility of Kubernetes. When used together in a teachable, universal manner, these can be monumental in the process of learning and executing data analysis methods.

## Target Demographics (User Persona)

Joe is a 32 year old financial analyst that needs to analyze large amounts of data to make decisions relating to his stock portfolio. 

Jenna is a 29 year old researcher who is studying the government’s efficiency at solving problems; she needs to be able to analyze data from the government regarding education, agriculture, and transportation.

Alex is a 45 year old data engineer that wants a scalable solution for his organization’s data pipeline. Growing business means more data is being handled, and he doesn’t want to be bottlenecked by his data management system in the future.

## Requirements

### User Stories and Features (Functional Requirements)

| User Story | Feature | Priority | GitHub Issue | Dependencies |
| --- | --- | --- | --- | --- |
| As a data scientist, I want to use a dashboard to deploy a Jupyter Notebook to a Kubernetes environment, so that I can ensure my analysis scales with the data size. | Deploy Jupyter Notebook on Kubernetes | Must Have | [Developer Deployment UI](https://github.com/brinklju/datavis-capstone/issues/3) | Proper Kubernetes configurations, Jupyter Docker Images |
| As a researcher, I want the ability to upload my own datasets into the database so that I can analyze my own data | Upload Data | Must Have | TBD | Basic Data Storage |
| As a consultant, I want to securely save and retrieve my Jupyter notebooks, ensuring they're backed up and accessible anytime. | Secure storage and retrieval system for Jupyter notebooks | Must Have | TBD | Cloud storage integrations, Data encryption tools |
| As a consultant, I want to visualize real-time analytics using dashboards, so that I can present findings to my clients effectively. | Real-time analytics dashboards | Must Have | [Implement Kubernetes Dashboard Integration](https://github.com/brinklju/datavis-capstone/issues/2) | Data source connectors, Dashboard visualization tools |
| As an engineer, I want the environments to run on the cloud and Raspberry Pis so there is a backup environment available. | Cloud environment hosting | Should Have | TBD | Cloud storage integrations |
| As a data scientist, I want to automate my notebook runs using Papermill, so that I can ensure consistency in my analyses. | Papermill integration for automated Jupyter runs | Could Have | TBD | Papermill library compatibility, Jupyter Notebook configurations |
| As a casual user, I want a mobile application version of the platform to run local data analytics on-the-go. | Mobile application | Will Not Have | N/A | Mobile app research and development |
| As an external developer, I want an open API to integrate custom tools and extensions with the platform. | Open API for third-party tool integration | Will Not Have | N/A | Reconciliation of security goals with open source |

### Non-Functional Requirements

- The system should deliver real-time data analytics results with a response time under 500 milliseconds for standard computations.
- With the use of Kubernetes, the platform should be able to dynamically scale resources based on demand. This means effortlessly handling a 70% surge in user workloads during business hours or peak periods without degradation in performance.
- Given the critical nature of data analytics, the system should guarantee an uptime of 99.9% (Three Nines). In the rare event of a system failure, data should be recoverable within 10 minutes.
- Given the sensitivity of data, all data transfers between client and server should be encrypted using advanced encryption standards (AES) with SSL/TLS.
- The platform should be available 24/7 with an exception for scheduled maintenance windows, which should be communicated to users in advance. During maintenance, an alternative read-only mode should be available for users to view their data without performing any operations.
- The product interface should be responsive and compatible across various devices and screen resolutions, from desktops to tablets. While the core computational functionalities would be optimized for desktop, essential viewing and minor editing functionalities should be accessible on tablets.

### Data Requirements

Our platform necessitates the collection and management of several pivotal data points: user profile data, which includes essential details such as names, emails, and encrypted authentication tokens. Within the working environment, users will maintain .ipynb Jupyter Notebook files, along with potential custom scripts in formats like .py, .r, or .jl. Dataset storage is vital, encompassing raw or processed data in formats such as .csv, .xlsx, or .json, each tagged with relevant metadata. Additionally, activity logs document user actions and system events, while billing and usage data captures key metrics like CPU usage and storage.

### Integration Requirements

The platform will integrate with a suite of third-party services vital for its comprehensive functionality. Integration with cloud providers, specifically AWS and Azure, will enable data storage and computational scalability. This necessitates secure API linkages for dataset uploading and retrieval. For user authentication, OAuth mechanisms will be incorporated, allowing sign-in via Google, Microsoft, or other major providers. The platform should interface with external data visualization tools like Tableau or Power BI, enabling users to import or export datasets and visualizations.

### User Interaction and Design

Users of the dashboard will see analytics pages as such:

![alt text](https://github.com/brinklju/datavis-capstone/blob/main/mockup-front.png)

User Experience Design Principles: We want to focus on giving the user an appropriate amount of control within the dashboard UI. We want them to have the freedom to analyze the data as they want or need. With the amount of data that is being analyzed, we also want to give them an easy way to undo mistakes or revert changes.

## Milestones and Timeline

By late October, we anticipate the completion of the initial system architecture and the integration of core data sources. 

Come mid-December, our aim is to have an alpha version of the platform with basic notebook creation and data visualization features. 

Moving into late February, we expect to have integrated third-party services and APIs, ensuring seamless interaction with other platforms. 

As we approach April, the goal is to finalize the platform's user interface and experience, incorporating user feedback and optimizing for various devices. 

By the beginning of May, we hope to initiate robust testing phases, rectifying any issues, and refining the overall system performance. By this time we will be practicing and honing our presentation. 

## Goals and Success Metrics

| Goal | Metric | Baseline | Target | Tracking Method |
| --- | --- | --- | --- | --- |
| Enhance user productivity | Time saved using platform vs. traditional methods | 0% | 25% time saved | User feedback survey |
| Improve system reliability | System uptime | 95% uptime | 99.5% uptime | Monitoring tools like Prometheus |
| Ensure data security | Number of security breaches | N/A | 0 breaches | Security monitoring tools |
| Ensure user satisfaction | User survey response after use | 4.3 stars | 4.5 stars | Offered surveys during review sessions |

## Open Questions

Are there specific pain points or challenges the primary users currently face that we should be aware of?

Are there any existing systems or platforms with which we need to ensure compatibility?

How do you envision the feedback loop during the development phase? How frequently would you like to review progress, and are there specific milestones where you'd like to be particularly involved?

## Out of Scope

In the current project scope, our primary focus is to develop a proof-of-concept for the data analysis platform. As such, full-scale deployment on target infrastructure, comprehensive integration with all potential third-party services, and advanced security best-practices may not be fully addressed. While we'll establish foundational security and design aspects, extensive UI/UX optimization and complete third-party integrations will be earmarked for future phases, given our time constraints.
