import { $ } from "bun";
import { dirname } from "path";
import { importVariantFromArgs } from "../src/utils/import-variant";

const { variantName, metadata } = await importVariantFromArgs();

const dir = dirname(__dirname);

const registryUser = process.env.REGISTRY_USER;
const registryPassword = process.env.REGISTRY_PASSWORD;

const imageNamePrefix = process.env.IMAGE_NAME?.toLocaleLowerCase() ?? "os";
const imageRegistry = process.env.IMAGE_REGISTRY?.toLocaleLowerCase();

const repo = process.env.GH_REPO;
const commitSha = process.env.GITHUB_SHA?.slice(0, 7);
const refType = process.env.GH_REF_TYPE;
const refName = process.env.GH_REF_NAME ?? "main";
const prId = process.env.GH_PR;

function getTags() {
  const tags: string[] = [];
  tags.push(prId ? `pr-${prId}` : "latest");
  if (refType == "tag") tags.push(refName);
  if (commitSha) tags.push(commitSha);
  return tags.map((tag) => `${imageNamePrefix}-${variantName}:${tag}`);
}

function getLabels() {
  const labels = new Map<string, string>();

  labels.set("org.opencontainers.image.title", metadata.imageTitle);

  if (metadata.imageDescription) {
    labels.set(
      "org.opencontainers.image.description",
      metadata.imageDescription
    );
  }

  if (repo) {
    labels.set(
      "io.artifacthub.package.readme-url",
      `https://raw.githubusercontent.com/${repo}/main/README.md`
    );
  }

  return [...labels.entries()].map((entry) => entry.join("="));
}

const tags = getTags();
const labels = getLabels();

await $`
  podman build \
    --build-arg="VARIANT_NAME=${variantName}" \
    --build-arg="BASE_IMAGE=${metadata.baseImage}" \
    ${tags.map((tag) => ["--tag", tag])} \
    ${labels.map((label) => ["--label", label])} \
    ${dir}
`;

if (imageRegistry && registryUser && registryPassword) {
  await $`
    podman login \
      --username="${registryUser}" \
      --password="${registryPassword}" \
      ${imageRegistry}
  `;

  for (const tag of tags) {
    await $`podman push ${tag} ${imageRegistry}/${tag}`;
  }
}
