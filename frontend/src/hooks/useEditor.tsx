import { Editor, useEditorState } from '@tiptap/react';


export default function useEditor(editor: Editor | null) {
  const editorState = useEditorState({
      editor,
      selector: ctx => {
        return {
          isBold: ctx.editor?.isActive('bold') ?? false,
          canBold: ctx.editor?.can().chain().focus().toggleBold().run() ?? false,
          isItalic: ctx.editor?.isActive('italic') ?? false,
          canItalic: ctx.editor?.can().chain().focus().toggleItalic().run() ?? false,
          isUnderline: ctx.editor?.isActive('underline') ?? false,
          canUnderline: ctx.editor?.can().chain().focus().toggleUnderline().run() ?? false,
          isStrike: ctx.editor?.isActive('strike') ?? false,
          canStrike: ctx.editor?.can().chain().focus().toggleStrike().run() ?? false,
          isCode: ctx.editor?.isActive('code') ?? false,
          canCode: ctx.editor?.can().chain().focus().toggleCode().run() ?? false,
          canClearMarks: ctx.editor?.can().chain().focus().unsetAllMarks().run() ?? false,
          isParagraph: ctx.editor?.isActive('paragraph') ?? false,
          isHeading1: ctx.editor?.isActive('heading', { level: 1 }) ?? false,
          isHeading2: ctx.editor?.isActive('heading', { level: 2 }) ?? false,
          isHeading3: ctx.editor?.isActive('heading', { level: 3 }) ?? false,
          isHeading4: ctx.editor?.isActive('heading', { level: 4 }) ?? false,
          isHeading5: ctx.editor?.isActive('heading', { level: 5 }) ?? false,
          isHeading6: ctx.editor?.isActive('heading', { level: 6 }) ?? false,
          isBulletList: ctx.editor?.isActive('bulletList') ?? false,
          isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
          isCodeBlock: ctx.editor?.isActive('codeBlock') ?? false,
          isBlockquote: ctx.editor?.isActive('blockquote') ?? false,
          canUndo: ctx.editor?.can().chain().focus().undo().run() ?? false,
          canRedo: ctx.editor?.can().chain().focus().redo().run() ?? false,
        }
      },
    })

  return editorState;
}