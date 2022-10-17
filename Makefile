PKG_VERSION := $(shell toml get manifest.toml "version" | sed -e 's/^"//' -e 's/"//')
SCRIPTS_SRC := $(shell find ./scripts -name '*.ts')
PKG_ID := $(shell toml get manifest.toml "id" | sed -e 's/^"//' -e 's/"//')

.DELETE_ON_ERROR:

all: verify

verify:  $(PKG_ID).s9pk
	embassy-sdk verify s9pk $(PKG_ID).s9pk

clean:
	rm -rf docker-images
	rm -f image.tar
	rm -f embassy-pages.s9pk
	rm -f scripts/*.js

install:  $(PKG_ID).s9pk
	embassy-cli package install $(PKG_ID).s9pk

 $(PKG_ID).s9pk: manifest.toml instructions.md LICENSE icon.png scripts/embassy.js docker-images/aarch64.tar docker-images/x86_64.tar
	if ! [ -z "$(ARCH)" ]; then cp docker-images/$(ARCH).tar image.tar; fi
	embassy-sdk pack

docker-images/aarch64.tar: Dockerfile docker_entrypoint.sh
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/arm64 -o type=docker,dest=docker-images/aarch64.tar .

docker-images/x86_64.tar: Dockerfile docker_entrypoint.sh
	mkdir -p docker-images
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/$(PKG_ID)/main:$(PKG_VERSION) --platform=linux/amd64 -o type=docker,dest=docker-images/x86_64.tar .

scripts/embassy.js: $(SCRIPTS_SRC)
	deno bundle scripts/embassy.ts scripts/embassy.js