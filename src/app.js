import fs from "node:fs/promises";
import { math } from "micromark-extension-math";
import { fromMarkdown } from "mdast-util-from-markdown";
import { mathFromMarkdown, mathToMarkdown } from "mdast-util-math";
import { toMarkdown } from "mdast-util-to-markdown";
import remarkMdx from 'remark-mdx'
import remarkGfm from 'remark-gfm'
import {remark} from 'remark';
import remarkMath from 'remark-math';

const doc = await fs.readFile("example.md");

const tree = fromMarkdown(doc, {
  extensions: [math()],
  mdastExtensions: [mathFromMarkdown()],
});

console.log(JSON.stringify(tree, null, 2));

const data = {
  type: "root",
  children: [
    {
      type: "heading",
      depth: 1,
      children: [
        {
          type: "inlineMath",
          value: "{\\color{#000}HOMU \\color{#fff}ESTAS}",
          data: {
            hName: "code",
            hProperties: {
              className: [
                "language-math",
                "math-inline",
              ],
            },
            hChildren: [
              {
                type: "text",
                value: "{\\color{#000}HOMU \\color{#fff}ESTAS}",
              },
            ],
          },
        },
      ]
    }
  ]
}
const transforData = process.env.MOCK ? data : tree;
const out = toMarkdown(transforData, { extensions: [mathToMarkdown()] });

console.log("output -> ",JSON.stringify(out, null, 2));

const parsedTree = remark().use(remarkMath).use(remarkMdx).use(remarkGfm).parse(out);

console.log('Parsed AST ->', JSON.stringify(parsedTree, null, 2));