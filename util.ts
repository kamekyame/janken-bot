export function pathResolver(meta: ImportMeta): (p: string) => string {
  console.log(meta.url, new URL("", meta.url));
  return (p) => new URL(p, meta.url).pathname;
}
