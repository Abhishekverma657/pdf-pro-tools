import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, url }) {
    const siteTitle = "PDF Tools";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaults = {
        description: "Free online PDF tools to merge, split, compress, convert, rotate, unlock and sign PDF files. 100% free, secure and easy to use!",
        keywords: "pdf, merge pdf, split pdf, combine pdf, sign pdf, ocr pdf, convert pdf to image, rotate pdf, protect pdf",
        url: "https://pdf-pro-tools.vercel.app/"
    };

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaults.description} />
            <meta name="keywords" content={keywords || defaults.keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url || defaults.url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaults.description} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url || defaults.url} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description || defaults.description} />
        </Helmet>
    );
}
