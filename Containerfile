ARG SOURCE_IMAGE="silverblue"
ARG SOURCE_TAG="41"

FROM quay.io/fedora-ostree-desktops/${SOURCE_IMAGE}:${SOURCE_TAG}

COPY src /tmp/os-src

RUN mkdir -p /var/lib/alternatives && \
    chmod +x /tmp/os-src/main.sh && \
    /tmp/os-src/main.sh && \
    ostree container commit

## NOTES:
# - /var/lib/alternatives is required to prevent failure with some RPM installs
# - All RUN commands must end with ostree container commit
#   see: https://coreos.github.io/rpm-ostree/container/#using-ostree-container-commit