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

fs.writeFile("src/output/tree.json", JSON.stringify(tree, null, 2), err => {
  if(err)
    console.warn(err);
  else 
    console.log("Tree saved");
});


const transforData = process.env.MOCK === "true" ? data : tree;
const out = toMarkdown(transforData, { extensions: [mathToMarkdown()] });

fs.writeFile("src/output/output.md", out, err => {
  if(err)
    console.warn(err);
  else 
    console.log("Output saved");
});

const parsedTree = remark().use(remarkMath).use(remarkMdx).use(remarkGfm).parse(out);

fs.writeFile("src/output/parsedTree.json", JSON.stringify(parsedTree, null, 2), err => {
  if(err)
    console.warn(err);
  else 
    console.log("Parsed Tree saved"); 
});