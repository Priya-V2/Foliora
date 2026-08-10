// React Hook Form leaves untouched optional fields as "" rather than
// undefined. The backend DTOs use `@IsOptional()`, which only skips
// `undefined`/`null` (not ""), so an empty string would still fail e.g.
// `@IsEmail()`/`@IsUrl()` validation. Strip "" -> undefined before every
// portfolio section submit.
export function cleanFormInput<T extends Record<string, unknown>>(input: T): T {
  const result = {} as Record<string, unknown>;

  for (const [key, value] of Object.entries(input)) {
    result[key] = value === "" ? undefined : value;
  }

  return result as T;
}
