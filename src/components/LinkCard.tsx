import React from 'react';
import { 
  Youtube, 
  Twitter, 
  Linkedin, 
  Link, 
  ExternalLink, 
  Heart, 
  Eye,
  Clock,
  Calendar
} from 'lucide-react';
import { SavedLink } from '../types';

interface LinkCardProps {
  link: SavedLink;
  onRemove: (id: string) => void;
}

export function LinkCard({ link, onRemove }: LinkCardProps) {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <Youtube className="w-5 h-5 text-red-400" />;
      case 'twitter':
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5 text-blue-500" />;
      default:
        return <Link className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'border-red-500/20 bg-red-500/5';
      case 'twitter':
        return 'border-blue-500/20 bg-blue-500/5';
      case 'linkedin':
        return 'border-blue-500/20 bg-blue-500/5';
      default:
        return 'border-gray-600/20 bg-gray-800/50';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const handleOpenLink = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${getPlatformColor(link.platform)} border-gray-200 dark:border-gray-600`}>
      <div className="relative">
        <img
          src={link.thumbnail}
          alt={link.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          {getPlatformIcon(link.platform)}
        </div>
        {link.metadata?.duration && (
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{link.metadata.duration}</span>
          </div>
        )}
        <button
          onClick={handleOpenLink}
          className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <ExternalLink className="w-8 h-8 text-white" />
        </button>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
          {link.title}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{link.author}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {link.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(link.createdAt)}</span>
          </div>
          
          {(link.metadata?.likes || link.metadata?.views || link.metadata?.reactions) && (
            <div className="flex items-center space-x-3">
              {link.metadata.likes && (
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span>{link.metadata.likes}</span>
                </div>
              )}
              {link.metadata.views && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{link.metadata.views}</span>
                </div>
              )}
              {link.metadata.reactions && (
                <span>{link.metadata.reactions}</span>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
          <button
            onClick={handleOpenLink}
            className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium transition-colors"
          >
            Open Link
          </button>
          <button
            onClick={() => onRemove(link.id)}
            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}