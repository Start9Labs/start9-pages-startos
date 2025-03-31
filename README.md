# Start9 Pages for StartOS

Start9 Pages is a simple web server that uses directories inside File Browser or Nextcloud to serve websites. This repository creates the `s9pk` package that runs on [StartOS](https://github.com/Start9Labs/start-os/). 

## Dependencies
- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [make](https://www.gnu.org/software/make/)
- [start-cli](https://github.com/Start9Labs/start-os/)

## Build enviroment
Prepare your build environment. In this example we are using Ubuntu 20.04.

1. Install docker
    ```
    curl -fsSL https://get.docker.com -o- | bash
    sudo usermod -aG docker "$USER"
    exec sudo su -l $USER
    ```
1. Set buildx as the default builder
    ```
    docker buildx install
    docker buildx create --use
    ```
1. Enable cross-arch emulated builds in docker
    ```
    docker run --privileged --rm linuxkit/binfmt:v0.8
    ```
1. Install essential build packages:
    ```
    sudo apt-get install -y build-essential openssl libssl-dev libc6-dev clang libclang-dev ca-certificates
    ```
1. Install Rust
    ```
    curl https://sh.rustup.rs -sSf | sh
    # Choose nr 1 (default install)
    source $HOME/.cargo/env
    ```
1. Build and install start-cli
    ```
    cd ~/ && git clone --recursive https://github.com/Start9Labs/start-os.git
    make cli
    start-cli init
    ```

## Cloning
Clone the project locally. 

```
git clone https://github.com/Start9Labs/start9-pages-startos.git
cd start9-pages-startos
```

## Building
To build the package, run one of the following commands:

```
# for multi platform
make
```
```
# for amd64
make x86
```
```
# for arm64
make arm
```

## Installing on StartOS

### CLI

> Change *adjective-noun.local* to your Start9 server address

```
start-cli auth login
# Enter your Start9 server master password
start-cli --host https://adjective-noun.local package install start9-pages.s9pk
```

### UI

Select the Sideload Utility from the StartOS UI header and drag-n-drop the s9pk file to upload and install.

### Verify

Go to your StartOS Services page and select this service to view it's dashboard.