import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bookmark, 
  Search, 
  Tag, 
  Shield, 
  Zap, 
  Youtube, 
  Twitter, 
  Linkedin,
  Menu,
  X,
  ExternalLink,
  Plus,
  Moon,
  Sun,
  Filter
} from 'lucide-react';
import { SavedLink } from './types';
import { LinkCard } from './components/LinkCard';
import { AddLinkModal } from './components/AddLinkModal';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', true);
  const [_savedLinks, setSavedLinks] = useLocalStorage<SavedLink[]>('savedLinks', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  const savedLinks = useMemo(() => {  
    return _savedLinks.map(link => ({
      ...link,
      createdAt: new Date(link.createdAt)
    }));
  }, [_savedLinks]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleAddLink = (link: SavedLink) => {
    setSavedLinks(prev => [link, ...prev]);
  };

  const handleRemoveLink = (id: string) => {
    setSavedLinks(prev => prev.filter(link => link.id !== id));
  };

  const filteredLinks = savedLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'All' || link.tags.includes(selectedTag.toLowerCase());
    
    return matchesSearch && matchesTag;
  });

  const allTags = ['All', ...Array.from(new Set(savedLinks.flatMap(link => link.tags)))
    .map(tag => tag.charAt(0).toUpperCase() + tag.slice(1))];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Paste & Save Instantly",
      description: "Simply paste any YouTube, Twitter, or LinkedIn link and we'll automatically save it with rich previews.",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      platforms: [<Youtube key="yt" className="w-4 h-4 text-red-400" />, <Twitter key="tw" className="w-4 h-4 text-blue-400" />, <Linkedin key="li" className="w-4 h-4 text-blue-300" />]
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Smart Tagging & Filtering",
      description: "Organize your links with intelligent auto-tagging and powerful search filters to find content instantly.",
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      platforms: [<Search key="search" className="w-4 h-4 text-gray-400" />, <Filter key="filter" className="w-4 h-4 text-gray-400" />]
    },
    {
      icon: <Bookmark className="w-6 h-6" />,
      title: "Beautiful Link Previews",
      description: "Rich previews with thumbnails, titles, and author information make browsing your collection a joy.",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      platforms: [<ExternalLink key="ext" className="w-4 h-4 text-gray-400" />]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Private & Secure Dashboard",
      description: "Your personal collection stays private and secure with local storage and no data tracking.",
      color: "bg-green-500/10 text-green-400 border-green-500/20",
      platforms: [<Shield key="shield" className="w-4 h-4 text-green-400" />]
    }
  ];

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        {/* Dashboard Header */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Brainly</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCurrentView('landing')}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Links</h1>
              <p className="text-gray-600 dark:text-gray-400">{savedLinks.length} links saved</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          </div>

          {/* Filter Tags */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    tag === selectedTag 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Links Grid */}
          {filteredLinks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  onRemove={handleRemoveLink}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {savedLinks.length === 0 ? 'No links saved yet' : 'No links match your search'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {savedLinks.length === 0 
                  ? 'Start building your collection by adding your first link!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {savedLinks.length === 0 && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Add Your First Link
                </button>
              )}
            </div>
          )}
        </div>

        <AddLinkModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddLink={handleAddLink}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bookmark className="w-5 h-5 text-white" />
              </div>
              <span
                className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
                onClick={() => setCurrentView('dashboard')}
              >
                Brainly
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Dashboard
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
              >
                Open Dashboard
              </button>
            </div>

            <button
              className="md:hidden text-gray-900 dark:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</a>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="block w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Dashboard
              </button>
              <div className="pt-4 pb-2 space-y-2">
                <button
                  onClick={toggleDarkMode}
                  className="w-full text-left py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-6">
              <Youtube className="w-6 h-6 text-red-400 opacity-60" />
              <Twitter className="w-6 h-6 text-blue-400 opacity-60" />
              <Linkedin className="w-6 h-6 text-blue-300 opacity-60" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Collect, Organize,
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"> Revisit.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Your favorite content from YouTube, Twitter, and LinkedIn—saved in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
              >
                Try Brainly Free
              </button>
              <button className="border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to organize your links
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple, powerful features that make link management effortless
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm"
              >
                <div className={`w-12 h-12 rounded-lg ${feature.color} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                <div className="flex items-center space-x-2">
                  {feature.platforms.map((platform, idx) => (
                    <div key={idx} className="opacity-60 hover:opacity-100 transition-opacity">
                      {platform}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to organize your digital life?
          </h2>
          <p className="text-xl text-purple-100 dark:text-purple-200 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed how they save and organize their favorite content.
          </p>
          <button 
            onClick={() => setCurrentView('dashboard')}
            className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
          >
            Start Free Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Brainly</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The smartest way to save, organize, and revisit your favorite content from across the web.
              </p>
              <div className="flex items-center space-x-4">
                <Youtube className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer" />
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-300 transition-colors cursor-pointer" />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition-colors">Dashboard</button></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Brainly. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm mt-2 sm:mt-0">
              Built with React, TypeScript, Tailwind CSS, and Local Storage.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;