ARG BASE_IMAGE
FROM quay.io/fedora-ostree-desktops/${BASE_IMAGE}

ARG VARIANT_NAME

COPY src/install-bun.sh /tmp/os-script/src/install-bun.sh
RUN chmod +x /tmp/os-script/src/install-bun.sh; \
    /tmp/os-script/src/install-bun.sh; \
    ostree container commit;

COPY . /tmp/os-script
RUN mkdir -p /var/lib/alternatives; \
    chmod +x /tmp/os-script/src/run-script.sh; \
    VARIANT_NAME=${VARIANT_NAME} /tmp/os-script/src/run-script.sh; \
    ostree container commit;

## NOTES:
# - /var/lib/alternatives is required to prevent failure with some RPM installs
# - All RUN commands must end with ostree container commit
#   see: https://coreos.github.io/rpm-ostree/container/#using-ostree-container-commit