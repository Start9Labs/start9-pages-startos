ASSETS := $(shell yq e '.assets.[].src' manifest.yaml)
ASSET_PATHS := $(addprefix assets/,$(ASSETS))

.DELETE_ON_ERROR:

all: embassy-pages.s9pk

install: embassy-pages.s9pk
	appmgr install embassy-pages.s9pk

embassy-pages.s9pk: manifest.toml config_spec.yaml config_rules.yaml image.tar instructions.md $(ASSET_PATHS)
	embassy-sdk pack

image.tar: Dockerfile docker_entrypoint.sh
	DOCKER_CLI_EXPERIMENTAL=enabled docker buildx build --tag start9/embassy-pages/main --platform=linux/arm/v7 -o type=docker,dest=image.tar .
