# Wrapper for start9-pages

Start9 Pages is a simple web server that uses directories inside File Browser or Nextcloud to serve Tor websites. This repository creates the `s9pk` package that is installed to run `start9-pages` on [embassyOS](https://github.com/Start9Labs/embassy-os/. 

This package was recently renamed from Embassy Pages. Package ids cannot currently be changed, so it remains `start9-pages`.

## Dependencies

Install the system dependencies below to build this project by following the instructions in the provided links. You can also find detailed steps to setup your environment in the service packaging [documentation](https://github.com/Start9Labs/service-pipeline#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [make](https://www.gnu.org/software/make/)
- [start-cli](https://github.com/Start9Labs/start-os)

## Cloning

Clone the project locally.

```
git clone https://github.com/Start9Labs/start9-pages-startos.git
cd start9-pages-startos
```

## Building

To build the `start9-pages` package, run the following commands:

```
make
```

## Installing (on embassyOS)

Run the following commands to determine successful install:
> :information_source: Change embassy-server-name.local to your Embassy address

```
start-cli auth login
# Enter your embassy password
embassy-cli --host https://embassy-server-name.local package install start9-pages.s9pk
```

If you already have your `start-cli` config file setup with a default `host`, you can install simply by running:

```
make install
```

>**Tip:** You can also install the start9-pages.s9pk using **Sideload Service** under the **Embassy > Settings** section.

## Verify Install

Go to your Embassy Services page, select **Embassy Pages**, configure and start the service. Then, verify its interfaces are accessible.
