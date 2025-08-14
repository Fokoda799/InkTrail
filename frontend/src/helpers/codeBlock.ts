import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';

const lowlight = createLowlight();

lowlight.register('javascript', javascript);
lowlight.register('python', python);
lowlight.register('cpp', cpp);

// Custom CodeBlock with language label
const CustomCodeBlock = CodeBlockLowlight.extend({
  addAttributes() {
    return {
      language: {
        default: 'javascript',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-language') || 'javascript',
        renderHTML: (attributes: Record<string, any>) => ({
          'data-language': attributes.language,
        }),
      },
    };
  },
}).configure({ lowlight });

export {
  CustomCodeBlock
}