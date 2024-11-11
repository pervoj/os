import { importVariantFromArgs } from "~/utils/import-variant";

const { metadata } = await importVariantFromArgs();

console.log(
  JSON.stringify({
    name: metadata.baseImageName,
    version: metadata.baseImageVersion,
  })
);
