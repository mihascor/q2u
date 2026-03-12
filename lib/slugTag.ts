export function slugTag(input: string): string {
  return (
    input
      .normalize('NFKC')
      .trim()
      .toLowerCase()
      // unify apostrophes and remove them (e.g. "don't" -> "dont")
      .replace(/['’]/g, '')
      // whitespace to hyphen
      .replace(/\s+/g, '-')
      // keep unicode letters/numbers and hyphens; turn everything else into hyphens
      .replace(/[^\p{L}\p{N}-]+/gu, '-')
      // collapse duplicate hyphens
      .replace(/-+/g, '-')
      // trim hyphens
      .replace(/^-|-$/g, '')
  )
}
