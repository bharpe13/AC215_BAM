# Use an image with CUDA pre-installed
FROM nvidia/cuda:11.4.1-cudnn8-runtime-ubuntu18.04

# List of needed packages
ARG DEBIAN_PACKAGES="build-essential git unzip wget ffmpeg libsm6 libxext6 python3.6-dev cuda-command-line-tools-11-4 nvidia-cuda-toolkit" 

# Prevent apt from showing prompts
ENV DEBIAN_FRONTEND=noninteractive

# Python wants UTF-8 locale
ENV LANG=C.UTF-8

# Tell pipenv where the shell is. This allows us to use "pipenv shell" as a
# container entry point.
ENV PYENV_SHELL=/bin/bash

# Tell Python to disable buffering so we don't lose any logs.
ENV PYTHONUNBUFFERED=1

ENV PYTHON_PIP_VERSION=20.1.1
ENV PYTHON_GET_PIP_URL=https://github.com/pypa/get-pip/raw/eff16c878c7fd6b688b9b4c4267695cf1a0bf01b/get-pip.py
ENV PYTHON_GET_PIP_SHA256=b3153ec0cf7b7bbf9556932aa37e4981c35dc2a2c501d70d91d2795aa532be79

# Set CUDA_HOME
ENV CUDA_HOME=/usr/local/cuda

# Make sure CUDA is added to PATH
ENV LD_LIBRARY_PATH=/usr/local/cuda/extras/CUPTI/lib64:/usr/local/cuda/lib64:$LD_LIBRARY_PATH

# Ensure we have an up to date baseline, install dependencies and
# create a user so we don't run the app as root
RUN set -ex; \
    for i in $(seq 1 8); do mkdir -p "/usr/share/man/man${i}"; done && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends $DEBIAN_PACKAGES && \
    apt-get download python3-distutils && \
    dpkg-deb -x python3-distutils*.deb / && \
    rm -f python3-distutils*.deb && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    wget -q -O get-pip.py "$PYTHON_GET_PIP_URL" && \
    echo "$PYTHON_GET_PIP_SHA256 *get-pip.py" | sha256sum --check --strict - && \
    python3.6 get-pip.py --disable-pip-version-check --no-cache-dir "pip==$PYTHON_PIP_VERSION" && \
    rm -f get-pip.py && \
    pip install --no-cache-dir --upgrade pip pipenv && \
    useradd -ms /bin/bash app -d /home/app -u 1000 -p "$(openssl passwd -1 Passw0rd)" && \
    mkdir -p /app && \
    chown app:app /app

# Install additional dependencies
RUN \
    wget https://github.com/ninja-build/ninja/releases/download/v1.8.2/ninja-linux.zip && \
    unzip ninja-linux.zip -d /usr/local/bin/ && \
    update-alternatives --install /usr/bin/ninja ninja /usr/local/bin/ninja 1 --force

# Expose port
EXPOSE 9000

# Switch to the new user
USER app
WORKDIR /app

# Install python packages
ADD --chown=app:app Pipfile Pipfile.lock /app/

# Install extra python packages - most don't work with pipenv install, so need to pipenv run pip install
RUN pipenv sync
RUN \
    pipenv run pip install ftfy regex tqdm && \
    pipenv run pip install --no-cache-dir torch==1.7.1+cu110 torchvision==0.8.2+cu110 torchaudio==0.7.2 -f https://download.pytorch.org/whl/torch_stable.html && \
    pipenv run pip install git+https://github.com/openai/CLIP.git && \
    pipenv run pip install nvidia-pyindex && \
    pipenv run pip install nvidia-tensorflow==1.15.4 && \
    pipenv run pip install contextvars && \
    pipenv run pip install contextlib2 && \
    pipenv run pip install pandas && \
    pipenv run pip install matplotlib && \
    pipenv run pip install python-multipart && \
    pipenv run pip install opencv-python && \
    pipenv run pip install cmake && \
    pipenv run pip install dlib

# Add the rest of the source code. This is done last so we don't invalidate all
# layers when we change a line of code.
ADD --chown=app:app . /app

# Entry point
ENTRYPOINT ["/bin/bash","./docker-entrypoint.sh"]
