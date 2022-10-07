EMVER := $(shell toml get manifest.toml "version" | sed -e 's/^"//' -e 's/"//')
S9PK_PATH=$(shell find . -name embassy-pages.s9pk -print)
SCRIPTS_SRC := $(shell find ./scripts -name '*.ts')

.DELETE_ON_ERROR:

all: verify

verify: embassy-pages.s9pk $(S9PK_PATH)
	embassy-sdk verify s9pk $(S9PK_PATH)

clean:
	rm -f image.tar
	rm -f embassy-pages.s9pk

install: embassy-pages.s9pk
	embassy-cli package install embassy-pages

embassy-pages.s9pk: manifest.toml image.tar instructions.md LICENSE icon.png ${ASSET_PATHS} scripts/embassy.js
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/embassy-pages/main:${EMVER} --platform=linux/amd64 -o type=docker,dest=image.tar .

scripts/embassy.js: $(SCRIPTS_SRC)
	deno bundle scripts/embassy.ts scripts/embassy.js