ARG FEDORA_MAJOR_VERSION=38

FROM quay.io/fedora-ostree-desktops/silverblue:${FEDORA_MAJOR_VERSION}

# Copy the files.
COPY files /

# Install yq.
COPY --from=docker.io/mikefarah/yq /usr/bin/yq /usr/bin/yq

# Copy the build scripts.
COPY scripts /tmp/scripts

RUN chmod +x /tmp/scripts/build.sh && \
    /tmp/scripts/build.sh && \
    rm -rf /tmp/* /var/* && \
    ostree container commit
