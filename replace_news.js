const fs = require('fs');
let text = fs.readFileSync('src/components/lobby/CleanHomeHero.tsx', 'utf-8');

const target = `    // Auto-rolling news - 3 articles per page, changing every 12s
    useEffect(() => {
        if (!news?.articles || news.articles.length <= 3) return;
        if (WIDGETS[widgetIndex] !== 'news') return;
        setNewsPage(prev => {
            const totalPages = Math.ceil(news.articles.length / 3);
            return prev % totalPages;
        });
        const id = setInterval(() => {
            setNewsPage(prev => {
                const totalPages = Math.ceil(news.articles.length / 3);
                return (prev + 1) % totalPages;
            });
        }, 15000);
        return () => clearInterval(id);
    }, [news, widgetIndex]);`;

const replacement = `    // Auto-rolling news - 3 articles per page, changing every 15s
    useEffect(() => {
        if (!news?.articles || news.articles.length <= 3) return;
        if (WIDGETS[widgetIndex] !== 'news') return;
        setNewsPage(prev => {
            const totalPages = Math.ceil(news.articles.length / 3);
            return prev % totalPages;
        });
        
        if (newsHovered) return;
        
        const id = setInterval(() => {
            setNewsPage(prev => {
                const totalPages = Math.ceil(news.articles.length / 3);
                return (prev + 1) % totalPages;
            });
        }, 15000);
        return () => clearInterval(id);
    }, [news, widgetIndex, newsHovered]);`;

text = text.replace(target, replacement);
fs.writeFileSync('src/components/lobby/CleanHomeHero.tsx', text);
console.log('Replaced news auto roller!');
