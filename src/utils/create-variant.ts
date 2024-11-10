import { getVariantInput } from "./get-variant-input";

type PromiseOr<T> = T | Promise<T>;

export type VariantInput = Awaited<ReturnType<typeof getVariantInput>>;
export type VariantFunction = (input: VariantInput) => PromiseOr<void>;

export type VariantMetadata = {
  baseImage: `${string}:${number}`;
  baseDirectory: string;
  imageTitle: string;
  imageDescription?: string;
};

export function createVariant(
  metadata: VariantMetadata,
  variant: VariantFunction
) {
  async function buildVariant() {
    const input = await getVariantInput(metadata.baseDirectory);
    return await variant(input);
  }

  function extend(
    extMetadata: Omit<VariantMetadata, "baseImage">,
    extVariant: VariantFunction
  ) {
    return createVariant({ ...metadata, ...extMetadata }, async (input) => {
      await buildVariant();
      await extVariant(input);
    });
  }

  return { metadata, buildVariant, extend };
}

export type Variant = ReturnType<typeof createVariant>;
