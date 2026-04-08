import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/', // السماح لصفحة الهبوط
      disallow: [
        '/dashboard', // منع لوحة تحكم العملاء
        '/admin',     // منع لوحة الإدارة
        '/api',       // منع أرشفة مسارات البرمجة الخلفية
      ],
    },
    sitemap: 'https://flexm.pro/sitemap.xml',
  }
}