EMVER := $(shell toml get manifest.toml "version" | sed -e 's/^"//' -e 's/"//')
ASSET_PATHS := $(shell find ./assets/*)

.DELETE_ON_ERROR:

all: verify

verify: embassy-pages.s9pk $(S9PK_PATH)
	embassy-sdk verify s9pk $(S9PK_PATH)

clean:
	rm -f image.tar
	rm -f embassy-pages.s9pk

install: embassy-pages.s9pk
	embassy-cli package install embassy-pages

embassy-pages.s9pk: manifest.toml image.tar instructions.md LICENSE icon.png ${ASSET_PATHS}
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh check-web.sh
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/embassy-pages/main:${EMVER} --platform=linux/arm64/v8 -o type=docker,dest=image.tar .
