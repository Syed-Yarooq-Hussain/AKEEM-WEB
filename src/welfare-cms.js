export const welfareQuery = `*[_type == "welfareProject" && !(_id in path("drafts.**"))] | order(coalesce(order, 100) asc, _createdAt desc){
  _id, title, summary, description, location, status, category,
  "cover": cover{alt, "url": asset->url},
  "gallery": gallery[]{_key, alt, "url": asset->url}
}`;

export function welfareEndpoint(projectId, dataset = 'production') {
  if (!/^[a-z0-9]+$/.test(projectId || '') || !/^[a-z0-9_-]+$/.test(dataset)) return null;
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set('query', welfareQuery);
  url.searchParams.set('perspective', 'published');
  return url.toString();
}

export function localized(value, lang) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return '';
  return [value[lang], value.en, value.de, value.fr, value.es].find(v => typeof v === 'string' && v.trim()) || '';
}

export function imageUrl(value, width = 1000) {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'cdn.sanity.io' || !url.pathname.startsWith('/images/')) return '';
    url.searchParams.set('w', String(width));
    url.searchParams.set('auto', 'format');
    url.searchParams.set('fit', 'max');
    return url.toString();
  } catch { return ''; }
}

export async function fetchWelfare(endpoint, signal) {
  const response = await fetch(endpoint, {signal, credentials: 'omit'});
  if (!response.ok) throw new Error(`Welfare request failed (${response.status})`);
  const data = await response.json();
  if (!Array.isArray(data.result)) throw new Error('Invalid welfare response');
  return data.result.filter(p => p && typeof p._id === 'string' && !p._id.startsWith('drafts.') && localized(p.title, 'en'));
}
