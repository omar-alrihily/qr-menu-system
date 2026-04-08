import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://flexm.pro', // استبدله برابط موقعك الفعلي
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}