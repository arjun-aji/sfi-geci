import { MetadataRoute } from 'next';
import { DataService } from '@/lib/data-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const [departments, events, announcements] = await Promise.all([
    DataService.getDepartments(true),
    DataService.getEvents(true),
    DataService.getAnnouncements(true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/notes`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/notes/notes`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/notes/question-papers`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/events`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/members`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/announcements`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/gallery`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/complaints`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: new Date(), priority: 0.6 },
  ];

  // Dynamic department routes
  const deptRoutes: MetadataRoute.Sitemap = departments.flatMap((d) => [
    { url: `${baseUrl}/notes/notes/${d.code}`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/notes/question-papers/${d.code}`, lastModified: new Date(), priority: 0.8 },
  ]);

  // Dynamic event routes
  const eventRoutes: MetadataRoute.Sitemap = events.map((e) => ({
    url: `${baseUrl}/events/${e.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  // Dynamic announcement routes
  const announcementRoutes: MetadataRoute.Sitemap = announcements.map((a) => ({
    url: `${baseUrl}/announcements/${a._id}`,
    lastModified: new Date(),
    priority: 0.7,
  }));

  return [...staticRoutes, ...deptRoutes, ...eventRoutes, ...announcementRoutes];
}
