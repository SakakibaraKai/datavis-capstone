# Software Development Process (SDP)

### Principles

- We are responsive with our asynchronous communication and answer within 16 hours.
- A work item needs a user story (or motivation), technical description, dependencies, estimate, and acceptance criteria before anyone can work on it.
- All changes need to be developed in a separate git branch.
- Once the feature, bug, or refactoring is done, a Pull Request is created.
- The Pull Request has to be reviewed by at least one team member before being merged.
- The Pull Request needs to comply with the Definition of Done (see later) and should be linked to the corresponding work item.
- Work items cannot take more than two days to be completed, but need to encompass a meaningful chunk of work. If a work item is too large (e.g., a larger user story), divide into smaller work items.
- We will have enough items for at least two weeks worth of work on our log at any given time
- We will work primarily asynchronous, as we have many schedules to work with, with occasional sprints for big milestones/as needed.

### Process

#### Conceptual Process

Our workflow follows a typical asynchronous template. Especially being in a team of 6, we won’t always have schedules that align well enough to go fully agile. We will be incorporating some aspects of agile and DevOps regardless. The Kanban approach primarily will be a good process for us to work with.

#### Weekly Process

- Backlog and Planning (1/week)
- Kanban Board (To Do - In Progress - In Review - Done)
- Demo/Review with Stakeholders (1/week)
- Meet with TA (1/2weeks on average)

### Roles

- Project Manager / Product manager: Ensures that the product vision aligns with the stakeholder and user needs. They will run meetings, assist in managing the backlog, keep the meeting notes document up to date and organized, and act as the primary point of contact for the stakeholder. (Assigned to Noah Oliver, Zoie Asato)

- Scrum Master / Agile Coach: Responsible for keeping the team on track with agile practices. Will also ensure that team members are making progress during asynchronous work as well. They will share responsibilities in backlog management, as well as ensuring any roadblocks within the team are addressed. (Assigned to: Kai Depweg)

- Quality Assurance/DevOps: Responsible for maintaining the quality of the product through various testing methods and ensuring the product’s reliability and efficiency through DevOps practices. (Assigned to: Jules Brinkley)

Progress reports are handled by a different member of the team each week.

#### Development Subteams

- Developer Deployment UI: Will be responsible for implementing the frontend and backend of a web accessible UI where users can input a github repo to be deployed within our kubernetes environment. (Assigned to: Noah Oliver, Jules Brinkley)

- Kubernetes: Will be responsible for integration and optimization of containerized apps within the project. They will ensure that the clusters are designed and configured correctly to ensure scalability and efficiency. (Assigned to: Kai Depweg)

- JupyterHub: Will be responsible for deploying and maintaining Jupyter Hub. They will design and configure Jupyter Hub instances. (Assigned to: Zoie Asato)

### Tooling

|   |   |
| --- | --- |
| Version Control | GitHub |
| Project Management | GitHub Issues and Projects |
| Documentation  | README (for rough drafting), https://github.com/withastro/starlight (for stretch/final documentation) |
| Test Framework | Playwright + custom unit tests |
| Linting and Formatting | Prettier |
| CI/CD | GitHub Actions |
| IDE | Visual Studio Code |
| Graphic Design | Figma, pen and paper for rough mockups |
| Others | AI assistants, creation of code executable, monitoring, code analysis, etc. |

### Definition of Done (DoD)
- Acceptance criteria are validated
- Changes are merged (to main branch)
- Unit, integration, and smoke tests are successful
- Changes are implemented in all components (e.g., backend, frontend, libraries, …) (where it makes sense)
- No regressions
- Documentation is updated, incl. deployment instructions if any
- Release notes are updated
- Breaking changes are evaluated/avoided
- Changes are deployed to staging
- Demo is prepared for next stakeholder meeting

### Release Cycle
- Automatically deploy to staging every merge to main branch
- Deploy to production every release
- Release every three months (at the end of the term about)
- Use semantic versioning MAJOR.minor.patch
  - Increment the minor version for new features
  - Increment the patch version for bug fixes
  - Increment the major version for breaking API changes
- Until the API is stable, major should be 0. 

### Environments

| Environment | Infrastructure | Deployment | What is it for? | Monitoring |
| --- | --- | --- | --- | --- |
| Production | AWS through CI/CD | Release | Continued isolation and monitoring | Prometheus/Sentry |
| Staging (Test) | AWS through CI/CD | PR | New unreleased features and integration tests | Prometheus/Sentry |
| Dev | Local (macOS and Windows) | Commit | Development and unit tests | N/A |


