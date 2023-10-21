# Wrapper for start9-pages

Start9 Pages is a simple web server that uses directories inside File Browser or Nextcloud to serve Tor websites. This repository creates the `s9pk` package that is installed to run `embassy-pages` on [StartOS](https://github.com/Start9Labs/start-os/. 

This package was recently renamed from Embassy Pages. Package ids cannot currently be changed, so it remains `embassy-pages`.

## Dependencies

Install the system dependencies below to build this project by following the instructions in the provided links. You can also find detailed steps to setup your environment in the service packaging [documentation](https://github.com/Start9Labs/service-pipeline#development-environment).

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [deno](https://deno.land/#installation)
- [make](https://www.gnu.org/software/make/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/master/backend)

## Cloning

Clone the project locally.

```
git clone https://github.com/Start9Labs/start9-pages-startos.git
cd start9-pages-startos
```

## Building

To build the `embassy-pages` package, run the following commands:

```
make
```

## Installing (on StartOS)

Run the following commands to determine successful install:
> :information_source: Change adjective-noun.local to your StartOS address

```
start-cli auth login
# Enter your StartOS password
start-cli --host https://adjective-noun.local package install embassy-pages.s9pk
```

If you already have your `start-cli` config file setup with a default `host`, you can install simply by running:

```
make install
```

>**Tip:** You can also install the embassy-pages.s9pk using **Sideload Service** under the **System > Settings** section.

## Verify Install

Go to your StartOS Services page, select **Start9 Pages**, configure and start the service. Then, verify its interfaces are accessible.
