import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, keywords, url }) {
    const siteTitle = "PDF Tools";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const defaults = {
        description: "Free online PDF tools to merge, split, compress, convert, rotate, unlock and sign PDF files. 100% free, secure and easy to use!",
        keywords: "pdf tools, pdf editor, free pdf tools, online pdf tools, merge pdf, combine pdf, split pdf, compress pdf, convert pdf, pdf converter, pdf to word, word to pdf, pdf to jpg, jpg to pdf, image to pdf, excel to pdf, pdf to excel, rotate pdf, pdf rotator, sign pdf, pdf signature, e-sign pdf, digital signature pdf, protect pdf, password protect pdf, encrypt pdf, unlock pdf, pdf password remover, watermark pdf, add watermark to pdf, pdf watermark, ocr pdf, pdf ocr, extract text from pdf, pdf text extractor, pdf reader, edit pdf, pdf editor online, pdf tools online free, free pdf converter, pdf file converter, convert pdf to word, convert word to pdf, pdf to docx, docx to pdf, pdf splitter, pdf merger, combine multiple pdf, join pdf files, pdf page organizer, rearrange pdf pages, delete pdf pages, extract pdf pages, add page numbers to pdf, pdf page numbering, invoice scanner, scan invoice, extract invoice data, pdf manipulation, pdf processing, pdf software, pdf utilities, best pdf tools, pdf toolkit, all in one pdf, pdf suite, pdf manager, secure pdf, pdf security, client side pdf, browser pdf tools, no upload pdf, privacy pdf tools, safe pdf tools",
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
