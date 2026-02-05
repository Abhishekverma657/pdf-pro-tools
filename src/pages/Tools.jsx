import { TOOLS } from '../data/tools';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Tools() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTools = TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold">Tools Directory</h1>
                <p className="text-text-secondary">Explore our complete collection of PDF utilities.</p>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for a tool..."
                        className="input-field pl-12"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.id}
                            to={tool.path}
                            className="card group hover:border-primary/50 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center ${tool.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={28} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                            <p className="text-text-secondary text-sm">{tool.description}</p>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
