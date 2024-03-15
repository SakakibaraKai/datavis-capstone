# Base image
FROM jupyter/datascience-notebook

# Install additional packages from requirements.txt
COPY requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Expose port 8888 for Jupyter Notebook server
EXPOSE 8888

# Set the command to start Jupyter Notebook server without token
CMD ["jupyter", "notebook", "--ip='0.0.0.0'", "--port=8888", "--no-browser", "--allow-root", "--NotebookApp.token=''", "--NotebookApp.password=''"]
