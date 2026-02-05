import { TOOLS } from '../data/tools';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
    const featuredTools = TOOLS.slice(0, 4);

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <section className="text-center py-12 md:py-20 space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-700 to-primary bg-clip-text text-transparent leading-tight">
                    All-in-One PDF Tools<br />for Productivity
                </h1>
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
                    Merge, split, compress, and edit your PDFs with our powerful, free, and secure online tools.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/tools" className="btn-primary">
                        Explore All Tools
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            {/* Featured Tools */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark">Popular Tools</h2>
                    <Link to="/tools" className="text-primary font-medium hover:underline">View All</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredTools.map((tool) => {
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className="card group hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                                    <Icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{tool.name}</h3>
                                <p className="text-text-secondary text-sm">{tool.description}</p>
                            </Link>
                        )
                    })}
                </div>
            </section>
        </div>
    );
}
