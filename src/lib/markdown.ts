import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

export interface TocItem {
    id: string;
    text: string;
    level: number;
}

export interface MarkdownResult {
    contentHtml: string;
    toc: TocItem[];
}

/**
 * Custom Rehype plugin to extract Table of Contents (TOC)
 */
function rehypeExtractToc(options: { toc: TocItem[] }) {
    return (tree: any) => {
        visit(tree, "element", (node: any) => {
            if (["h2", "h3"].includes(node.tagName) && node.properties?.id) {
                options.toc.push({
                    id: node.properties.id,
                    text: node.children[0]?.value || "", // Simple text extraction
                    level: parseInt(node.tagName.substring(1)),
                });
            }
        });
    };
}

/**
 * Process markdown content to HTML with enhanced features
 */
export async function processMarkdown(content: string): Promise<MarkdownResult> {
    const toc: TocItem[] = [];

    const file = await unified()
        .use(remarkParse) // Parse markdown to AST
        .use(remarkRehype) // Convert Markdown AST to HTML AST
        .use(rehypeSlug) // Add IDs to headings
        .use(rehypeExtractToc, { toc }) // Extract TOC
        .use(rehypePrettyCode, {
            // Syntax highlighting
            theme: "github-dark",
            keepBackground: true,
            onVisitLine(node: any) {
                // Prevent lines from collapsing in `display: grid` mode, and allow empty lines to be copy/pasted
                if (node.children.length === 0) {
                    node.children = [{ type: "text", value: " " }];
                }
            },
        })
        .use(rehypeStringify) // Convert HTML AST to string
        .process(content);

    return {
        contentHtml: file.toString(),
        toc,
    };
}
