# Wrapper for Embassy Pages

This project wraps `Embassy Pages` for EmbassyOS.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [appmgr](https://github.com/Start9Labs/embassy-os/tree/master/appmgr)
- [make](https://www.gnu.org/software/make/)

## Cloning

Clone the project locally.

```
git clone https://github.com/Start9Labs/embassy-pages-wrapper.git
cd embassy-pages-wrapper
```

## Building

To build the project, run the following commands:

```
make
```

## Installing (on Embassy)

SSH into an Embassy device.
`scp` the `.s9pk` to any directory from your local machine.
Run the following command to determine successful install:

```
sudo appmgr install embassy-pages.s9pk
```
