import { ModelFactory } from "neogma";
import type { NeogmaInstance } from "neogma";

import { neogma } from "../neogma-client.js";

// ─────────────────────────────────────────────
// Interfaces
// ─────────────────────────────────────────────

export interface CountryProperties {
  /** Human-readable country name, e.g. "Denmark". Unique + not null. */
  name: string;
  /** ISO 3166-1 alpha-2 code, e.g. "DK". Unique + not null. */
  countryCode: string;
  [key: string]: any;
}

export type CountryRelatedNodes = Record<string, never>;

export type CountryInstance = NeogmaInstance<CountryProperties, CountryRelatedNodes>;

// ─────────────────────────────────────────────
// Model Definition
// ─────────────────────────────────────────────

let _CountryModel: ReturnType<typeof buildCountryModel> | null = null;

function buildCountryModel() {
  return ModelFactory<CountryProperties, CountryRelatedNodes>(
    {
      label: "Country",
      schema: {
        name: {
          type: "string",
          minLength: 1,
          required: true,
        },
        countryCode: {
          type: "string",
          minLength: 2,
          maxLength: 3,
          required: true,
        },
      },
      // countryCode is chosen as PK because it is the stable, short, canonical
      // identifier (ISO standard). `name` can change (countries rename),
      // countryCode almost never does.
      primaryKeyField: "countryCode",
      relationships: {},
    },
    neogma
  );
}

export function getCountryModel() {
  if (!_CountryModel) _CountryModel = buildCountryModel();
  return _CountryModel;
}

export const CountryModel = new Proxy({} as ReturnType<typeof buildCountryModel>, {
  get(_target, prop) {
    return (getCountryModel() as Record<string, unknown>)[prop as string];
  },
});
