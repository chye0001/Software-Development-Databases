import { ModelFactory } from "neogma";
import type { NeogmaInstance } from "neogma";

import { neogma } from "../neogma-client.js";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface BrandProperties {
  /** Brand name, e.g. "Nike". Unique + not null. */
  name: string;
  [key: string]: any;
}

export type BrandRelatedNodes = Record<string, never>;

export type BrandInstance = NeogmaInstance<BrandProperties, BrandRelatedNodes>;

// ─────────────────────────────────────────────
// Model Definition
// ─────────────────────────────────────────────

let _BrandModel: ReturnType<typeof buildBrandModel> | null = null;

function buildBrandModel() {
  return ModelFactory<BrandProperties, BrandRelatedNodes>(
    {
      label: "Brand",
      schema: {
        name: {
          type: "string",
          minLength: 1,
          required: true,
        },
      },
      primaryKeyField: "name",
      relationships: {},
    },
    neogma
  );
}

export function getBrandModel() {
  if (!_BrandModel) _BrandModel = buildBrandModel();
  return _BrandModel;
}

export const BrandModel = new Proxy({} as ReturnType<typeof buildBrandModel>, {
  get(_target, prop) {
    return (getBrandModel() as Record<string, unknown>)[prop as string];
  },
});
