## Installation and Usage
### Requirements
- [Docker](https://www.docker.com/)

### Installation
There are two ways to install get get docker immages first method is pulling dockerimmages and second is copying the directory and then dockering each part.

#### Dockerhub method
1. Go to this website and fallow the instructions [DockerImmageRepo](https://hub.docker.com/repository/docker/depwegk/big_data_and_the_cloud/general)

#### Dockerizing method 2
1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/your-repo-name.git
    ```
2. Navigate to the directory:
    ```bash
    cd your-repo-name
    ```
3. Install the dependencies if needed:
    ```bash
    npm install
    ```
4. Dockerize each branch (jupyter, frontend, backend)
    ```bash
    docker build -t <name> .
    ```

### Usage
1. Lanch every docker and go to localhost at port 5173

## Contact
If you have any questions or suggestions about the project, feel free to contact:
- Name: Kai Depweg
- Email: Depwegk@oregonstate.edu

## Additional Information
- https://hub.docker.com/repository/docker/depwegk/big_data_and_the_cloud/general
