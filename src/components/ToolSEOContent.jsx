import { CheckCircle2, HelpCircle, BookOpen } from 'lucide-react';

export default function ToolSEOContent({ content }) {
    if (!content) return null;

    return (
        <div className="mt-20 pt-10 border-t border-gray-200 dark:border-gray-800 space-y-16 animate-fade-in">

            {/* Features Section */}
            {content.features && (
                <section>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold mb-4">Why use this tool?</h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Our {content.title || 'PDF Tool'} is designed for speed, security, and ease of use.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {content.features.map((feature, i) => (
                            <div key={i} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                                    <CheckCircle2 size={24} />
                                </div>
                                <p className="font-medium text-lg">{feature}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* How To Section */}
            {content.steps && (
                <section className="bg-gray-50 dark:bg-white/5 rounded-[32px] p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                                <BookOpen className="text-primary" />
                                How to use?
                            </h2>
                            <div className="space-y-6">
                                {content.steps.map((step, i) => (
                                    <div key={i} className="flex gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                            {i + 1}
                                        </span>
                                        <p className="text-lg text-text-secondary pt-0.5">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="h-full flex items-center justify-center bg-white dark:bg-black/20 rounded-2xl p-8 border border-gray-100 dark:border-gray-700/50 dashed border-2">
                            <p className="text-center text-text-secondary italic">
                                "Simple, fast, and secure PDF processing directly in your browser."
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {content.faq && (
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {content.faq.map((item, i) => (
                            <div key={i} className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-lg font-bold mb-2 flex items-start gap-3">
                                    <HelpCircle size={20} className="text-primary mt-1 flex-shrink-0" />
                                    {item.q}
                                </h3>
                                <p className="text-text-secondary ml-8">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
