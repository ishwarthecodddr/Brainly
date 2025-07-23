import { LinkPreview } from '../types';

export class LinkParser {
  private static youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  private static twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/;
  private static linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:posts|pulse)\/([a-zA-Z0-9-_]+)/;

  static detectPlatform(url: string): 'youtube' | 'twitter' | 'linkedin' | 'other' {
    if (this.youtubeRegex.test(url)) return 'youtube';
    if (this.twitterRegex.test(url)) return 'twitter';
    if (this.linkedinRegex.test(url)) return 'linkedin';
    return 'other';
  }

  static async parseLink(url: string): Promise<LinkPreview> {
    const platform = this.detectPlatform(url);
    
    try {
      switch (platform) {
        case 'youtube':
          return await this.parseYouTube(url);
        case 'twitter':
          return await this.parseTwitter(url);
        case 'linkedin':
          return await this.parseLinkedIn(url);
        default:
          return await this.parseGeneric(url);
      }
    } catch (error) {
      console.error('Error parsing link:', error);
      return this.createFallbackPreview(url, platform);
    }
  }

  private static async parseYouTube(url: string): Promise<LinkPreview> {
    const match = url.match(this.youtubeRegex);
    const videoId = match?.[1];
    
    if (!videoId) {
      return this.createFallbackPreview(url, 'youtube');
    }

    // Use YouTube thumbnail URL format
    const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    // Try to fetch video info from YouTube's oEmbed API
    try {
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oembedUrl);
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title || 'YouTube Video',
          description: data.title ? 'Watch this video on YouTube' : 'YouTube video content',
          thumbnail: data.thumbnail_url || thumbnail,
          author: data.author_name || 'YouTube',
          platform: 'youtube',
          metadata: {
            duration: 'Video',
            views: 'YouTube'
          }
        };
      }
    } catch (error) {
      console.log('YouTube oEmbed failed, using fallback');
    }

    // Fallback with real thumbnail but generic title
    return {
      title: 'YouTube Video',
      description: 'Watch this video on YouTube',
      thumbnail,
      author: 'YouTube',
      platform: 'youtube',
      metadata: {
        duration: 'Video',
        views: 'YouTube'
      }
    };
  }

  private static async parseTwitter(url: string): Promise<LinkPreview> {
    const match = url.match(this.twitterRegex);
    const username = match?.[1];
    const tweetId = match?.[2];

    // Try to extract title from URL or use a more descriptive approach
    let title = 'Twitter Post';
    let author = username ? `@${username}` : 'Twitter';
    
    // Attempt to get better title information
    try {
      // For now, we'll create a more descriptive title based on the username
      if (username) {
        title = `Post by @${username}`;
      }
    } catch (error) {
      console.log('Twitter title extraction failed');
    }

    return {
      title,
      description: 'View this post on Twitter/X',
      thumbnail: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
      author,
      platform: 'twitter',
      metadata: {
        reactions: 'Twitter Post'
      }
    };
  }

  private static async parseLinkedIn(url: string): Promise<LinkPreview> {
    const match = url.match(this.linkedinRegex);
    const postId = match?.[1];

    let title = 'LinkedIn Post';
    
    // Try to create a more descriptive title
    try {
      if (postId) {
        title = `LinkedIn Professional Post`;
      }
    } catch (error) {
      console.log('LinkedIn title extraction failed');
    }

    return {
      title,
      description: 'View this post on LinkedIn',
      thumbnail: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png', // Using same icon style as Twitter
      author: 'LinkedIn',
      platform: 'linkedin',
      metadata: {
        reactions: 'LinkedIn Post'
      }
    };
  }

  private static async parseGeneric(url: string): Promise<LinkPreview> {
    const hostname = new URL(url).hostname;
    
    // Try to extract page title using a simple approach
    let title = 'Web Link';
    
    try {
      // Create a more descriptive title based on the domain
      const domain = hostname.replace('www.', '');
      title = `${domain.charAt(0).toUpperCase() + domain.slice(1)} Link`;
    } catch (error) {
      console.log('Generic title extraction failed');
    }

    return {
      title,
      description: `Content from ${hostname}`,
      thumbnail: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
      author: hostname,
      platform: 'other'
    };
  }

  private static createFallbackPreview(url: string, platform: 'youtube' | 'twitter' | 'linkedin' | 'other'): LinkPreview {
    const platformInfo = {
      youtube: {
        title: 'YouTube Video',
        thumbnail: 'https://www.youtube.com/img/desktop/yt_1200.png',
        author: 'YouTube'
      },
      twitter: {
        title: 'Twitter Post',
        thumbnail: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png',
        author: 'Twitter'
      },
      linkedin: {
        title: 'LinkedIn Post',
        thumbnail: 'https://abs.twimg.com/icons/apple-touch-icon-192x192.png', // Same style as Twitter
        author: 'LinkedIn'
      },
      other: {
        title: 'Web Link',
        thumbnail: `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=128`,
        author: new URL(url).hostname
      }
    };

    const info = platformInfo[platform];

    return {
      title: info.title,
      description: `Saved ${platform} content`,
      thumbnail: info.thumbnail,
      author: info.author,
      platform
    };
  }

  static generateTags(title: string, description: string, platform: string): string[] {
    const commonTags = {
      youtube: ['video', 'tutorial', 'education'],
      twitter: ['social', 'discussion', 'insights'],
      linkedin: ['professional', 'career', 'business'],
      other: ['web', 'article', 'resource']
    };

    const text = `${title} ${description}`.toLowerCase();
    const autoTags: string[] = [];

    // Tech-related keywords
    const techKeywords = ['javascript', 'react', 'typescript', 'css', 'html', 'node', 'python', 'development', 'programming', 'code', 'tech', 'software'];
    const designKeywords = ['design', 'ui', 'ux', 'interface', 'user', 'experience', 'visual', 'graphic'];
    const businessKeywords = ['business', 'startup', 'entrepreneur', 'marketing', 'strategy', 'growth', 'productivity'];
    const careerKeywords = ['career', 'job', 'interview', 'resume', 'professional', 'leadership', 'management'];

    [
      ...techKeywords.map(k => ({ keyword: k, tag: 'development' })),
      ...designKeywords.map(k => ({ keyword: k, tag: 'design' })),
      ...businessKeywords.map(k => ({ keyword: k, tag: 'business' })),
      ...careerKeywords.map(k => ({ keyword: k, tag: 'career' }))
    ].forEach(({ keyword, tag }) => {
      if (text.includes(keyword) && !autoTags.includes(tag)) {
        autoTags.push(tag);
      }
    });

    return [...commonTags[platform as keyof typeof commonTags], ...autoTags].slice(0, 4);
  }
}