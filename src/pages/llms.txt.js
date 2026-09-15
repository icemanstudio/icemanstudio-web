import { org, faq } from '../data/geo.js';
import { products, categories } from '../data/products.js';
import { bundles, bundleInfo } from '../data/bundles.js';
import { config } from '../data/config.js';

export function GET() {
  const U = org.url;
  const lines = [
    `# ${org.name}`,
    '',
    `> ${org.summary.en}`,
    '',
    `Site: ${U} (English) · ${U}/es/ (Spanish). Contact: ${org.email}. Based in Spain. Store on itch.io: ${org.sameAs[0]}`,
    '',
    '## Store',
    ...['aseprite', 'vfx', 'tileset', 'lowpoly'].flatMap((c) => [
      `### ${categories[c].en}`,
      ...products.filter((p) => p.cat === c).map((p) => `- [${p.name}](${U}/assets/${p.slug}/): ${p.short.en} ${p.price > 0 ? `Price: €${p.price.toFixed(2)}.` : 'Free.'} Also on itch.io: ${p.itch}`)
    ]),
    ...(config.showBundles ? ['### Bundles', ...bundles.map((b) => { const bi = bundleInfo(b); return `- [${b.name}](${U}/assets/bundle/${b.slug}/): ${b.short.en} €${b.price.toFixed(2)} instead of €${bi.sum.toFixed(2)}.`; })] : []),
    '',
    '## Services',
    `- [Game localization with LQA](${U}/services/): from €0.05 per word and language, minimum €300. Core pack: Simplified Chinese, Russian, Brazilian Portuguese, Spanish.`,
    `- [Engine migration](${U}/services/): fixed price per project from €2,000. Unity to Godot, Unity to Unreal, UE4 to UE5.`,
    `- [Free Steam tools](${U}/tools/): wishlist and revenue calculators.`,
    '',
    '## Licence',
    org.license.en,
    '',
    '## FAQ',
    ...faq.en.map((f) => `- **${f.q}** ${f.a}`),
    '',
    '## Machine-readable',
    `- Product feed (JSON): ${U}/catalog.json`,
    `- Full catalogue and services in Markdown: ${U}/llms-full.txt`,
    `- Sitemap: ${U}/sitemap-index.xml`,
    ''
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
