import { put } from '@vercel/blob';

// Use high-quality Unsplash images matching each destination theme
const IMAGES = [
  {
    name: 'agency.jpg',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1280&q=80&auto=format&fit=crop',
  },
  {
    name: 'paris-1889.jpg',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1280&q=80&auto=format&fit=crop',
  },
  {
    name: 'cretaceous.jpg',
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1280&q=80&auto=format&fit=crop',
  },
  {
    name: 'florence-1504.jpg',
    url: 'https://images.unsplash.com/photo-1543429776-2782fc8e4132?w=1280&q=80&auto=format&fit=crop',
  },
  {
    name: 'hero-bg.jpg',
    url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80&auto=format&fit=crop',
  },
];

async function uploadAll() {
  const results = {};

  for (const image of IMAGES) {
    console.log(`Fetching ${image.name} from Unsplash...`);
    const response = await fetch(image.url);
    const buffer = await response.arrayBuffer();
    const file = new File([buffer], image.name, { type: 'image/jpeg' });

    console.log(`Uploading ${image.name} to Blob (${Math.round(buffer.byteLength / 1024)}KB)...`);
    const blob = await put(`timetravel/${image.name}`, file, {
      access: 'public',
    });

    results[image.name] = blob.url;
    console.log(`Done: ${blob.url}`);
  }

  console.log('\n--- ALL BLOB URLS ---');
  console.log(JSON.stringify(results, null, 2));
}

uploadAll().catch(console.error);
