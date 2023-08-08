ARG FEDORA_MAJOR_VERSION=38

FROM quay.io/fedora-ostree-desktops/base:${FEDORA_MAJOR_VERSION}

COPY files /

RUN ostree container commit
