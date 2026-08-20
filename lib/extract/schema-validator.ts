import { SchemaValidationResult } from "./types";

// Required field contracts for common Schema.org types
const REQUIRED_SCHEMA_FIELDS: Record<string, string[]> = {
  Product: ["name", "image", "offers"],
  Article: ["headline", "author", "datePublished", "image"],
  BlogPosting: ["headline", "author", "datePublished"],
  Organization: ["name", "url", "logo"],
  WebSite: ["name", "url"],
  FAQPage: ["mainEntity"],
  BreadcrumbList: ["itemListElement"],
};

export function validateSchema(schemaObj: any): SchemaValidationResult {
  if (!schemaObj || typeof schemaObj !== "object") {
    return {
      isValid: false,
      type: "Unknown",
      missingRequiredFields: ["@type"],
      errors: ["Schema is not a valid object"],
      raw: schemaObj,
    };
  }

  const rawType = schemaObj["@type"];
  const type = Array.isArray(rawType) ? rawType[0] : (rawType || "Unknown");
  const missingRequiredFields: string[] = [];
  const errors: string[] = [];

  const requiredFields = REQUIRED_SCHEMA_FIELDS[type];
  if (requiredFields) {
    for (const field of requiredFields) {
      if (!schemaObj[field]) {
        missingRequiredFields.push(field);
      }
    }
  }

  if (missingRequiredFields.length > 0) {
    errors.push(`Schema of type '${type}' is missing required fields: ${missingRequiredFields.join(", ")}`);
  }

  return {
    isValid: missingRequiredFields.length === 0,
    type,
    missingRequiredFields,
    errors,
    raw: schemaObj,
  };
}
