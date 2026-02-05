import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';

export default function ToolPlaceholder({ toolId }) {
    const tool = TOOLS.find(t => t.id === toolId);
    const name = tool ? tool.name : 'Unknown Tool';

    return (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-8 animate-fade-in">
            <Link to="/tools" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors">
                <ArrowLeft size={20} /> Back to Tools
            </Link>

            <div className="bg-card rounded-3xl p-12 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto text-gray-400 mb-6">
                    <Construction size={48} />
                </div>

                <h1 className="text-3xl font-bold mb-4">{name}</h1>
                <p className="text-text-secondary text-lg mb-8">
                    This tool is currently being ported to the web version.
                    Check back soon for updates!
                </p>

                <button className="btn-primary mx-auto opacity-50 cursor-not-allowed">
                    Coming Soon
                </button>
            </div>
        </div>
    );
}
