import { Editor, useEditorState } from '@tiptap/react';

export default function useEditor(editor: Editor | null) {
  const editorState = useEditorState({
    editor,
    selector: ctx => ({
      isBold: ctx.editor?.isActive('bold') ?? false,
      canBold: ctx.editor?.can().toggleBold() ?? false,
      isItalic: ctx.editor?.isActive('italic') ?? false,
      canItalic: ctx.editor?.can().toggleItalic() ?? false,
      isUnderline: ctx.editor?.isActive('underline') ?? false,
      canUnderline: ctx.editor?.can().toggleUnderline() ?? false,
      isStrike: ctx.editor?.isActive('strike') ?? false,
      canStrike: ctx.editor?.can().toggleStrike() ?? false,
      isCode: ctx.editor?.isActive('code') ?? false,
      canCode: ctx.editor?.can().toggleCode() ?? false,
      canClearMarks: ctx.editor?.can().unsetAllMarks() ?? false,
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

      // Link
      isLinkActive: ctx.editor?.isActive('link') ?? false,
      canSetLink: ctx.editor?.can().setLink({ href: '' }) ?? false,

      // Image
      isImageActive: ctx.editor?.isActive('image') ?? false,
      canInsertImage: ctx.editor?.can().insertContent({ type: 'image' }) ?? false,

      canUndo: ctx.editor?.can().undo() ?? false,
      canRedo: ctx.editor?.can().redo() ?? false,

      currentColor: ctx.editor?.getAttributes('textStyle').color ?? null,
      currentHighlight: ctx.editor?.getAttributes('highlight').backgroundColor ?? null,
    }),
  });

  return editorState;
}
