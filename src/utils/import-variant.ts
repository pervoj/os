import type { Variant } from "./create-variant";

export async function importVariant(variant: string) {
  type Module = {
    default: Variant;
  };

  const config = (await import(
    `../../variants/${variant}/variant.ts`
  )) as Module;

  return config.default;
}

export async function importVariantFromArgs() {
  const args = process.argv.slice(2);
  const [variantName] = args;
  const variant = await importVariant(variantName);

  return { variantName, ...variant };
}
