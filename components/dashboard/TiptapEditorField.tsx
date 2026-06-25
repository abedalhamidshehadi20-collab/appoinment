"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import {
  normalizeLineListContent,
  normalizeRichTextContent,
  stripRichTextToLineListText,
  stripRichTextToPlainText,
  toStoredRichTextContent,
} from "@/lib/rich-text";

type TiptapEditorFieldProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  size?: "default" | "compact";
  submitMode?: "html" | "line-list" | "plain-text";
};

function getEditorValue(
  editor: Editor,
  submitMode: "html" | "line-list" | "plain-text",
) {
  const html = editor.getHTML();

  if (submitMode === "line-list") {
    const lineListValue = stripRichTextToLineListText(html);

    return {
      fieldValue: lineListValue,
      plainText: lineListValue,
    };
  }

  if (submitMode === "plain-text") {
    const plainTextValue = stripRichTextToPlainText(html);

    return {
      fieldValue: plainTextValue,
      plainText: plainTextValue,
    };
  }

  const storedHtml = toStoredRichTextContent(html);

  return {
    fieldValue: storedHtml,
    plainText: stripRichTextToPlainText(storedHtml),
  };
}

function ToolbarButton({
  label,
  onClick,
  active = false,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-xl border px-2 text-sm font-semibold transition ${
        active
          ? "border-[#bfd5ff] bg-white text-[var(--brand)] shadow-sm"
          : "border-transparent bg-transparent text-[#6d82a4] hover:border-[#dce8fb] hover:bg-white hover:text-[var(--brand-deep)]"
      } ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
    >
      {children}
    </button>
  );
}

export function TiptapEditorField({
  name,
  defaultValue = "",
  placeholder = "Write here...",
  required = false,
  size = "default",
  submitMode = "html",
}: TiptapEditorFieldProps) {
  const initialValue = useMemo(
    () =>
      submitMode === "line-list"
        ? stripRichTextToLineListText(defaultValue)
        : submitMode === "plain-text"
          ? stripRichTextToPlainText(defaultValue)
          : toStoredRichTextContent(defaultValue),
    [defaultValue, submitMode],
  );
  const [fieldValue, setFieldValue] = useState(initialValue);
  const [plainTextValue, setPlainTextValue] = useState(
    stripRichTextToPlainText(initialValue),
  );
  const editorHeightClassName =
    size === "compact" ? "min-h-[140px]" : "min-h-[240px]";

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content:
      (submitMode === "line-list"
        ? normalizeLineListContent(initialValue)
        : normalizeRichTextContent(initialValue)) || "<p></p>",
    editorProps: {
      attributes: {
        class: `tiptap-editor-content ${editorHeightClassName} px-4 py-3 text-sm text-[var(--brand-deep)] outline-none`,
      },
    },
    onCreate: ({ editor: currentEditor }) => {
      const nextValue = getEditorValue(currentEditor, submitMode);
      setFieldValue(nextValue.fieldValue);
      setPlainTextValue(nextValue.plainText);
    },
    onUpdate: ({ editor: currentEditor }) => {
      const nextValue = getEditorValue(currentEditor, submitMode);
      setFieldValue(nextValue.fieldValue);
      setPlainTextValue(nextValue.plainText);
    },
  });

  const isEmpty = plainTextValue.trim().length === 0;

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-[#dfe8f8] bg-[#f8fbff] transition focus-within:border-[#bfd5ff] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#e8f0ff]">
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e4edf9] bg-[linear-gradient(180deg,#f9fbff_0%,#f3f8ff_100%)] px-3 py-2">
        <ToolbarButton
          label="Bold"
          active={editor?.isActive("bold")}
          disabled={!editor?.can().chain().focus().toggleBold().run()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor?.isActive("italic")}
          disabled={!editor?.can().chain().focus().toggleItalic().run()}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={!editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor?.isActive("bulletList")}
          disabled={!editor?.can().chain().focus().toggleBulletList().run()}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor?.isActive("orderedList")}
          disabled={!editor?.can().chain().focus().toggleOrderedList().run()}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Quote"
          active={editor?.isActive("blockquote")}
          disabled={!editor?.can().chain().focus().toggleBlockquote().run()}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="ml-auto flex items-center gap-1">
          <ToolbarButton
            label="Undo"
            disabled={!editor?.can().chain().focus().undo().run()}
            onClick={() => editor?.chain().focus().undo().run()}
          >
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!editor?.can().chain().focus().redo().run()}
            onClick={() => editor?.chain().focus().redo().run()}
          >
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
        </div>
      </div>

      <div className="relative">
        {isEmpty ? (
          <span className="pointer-events-none absolute left-4 top-3 z-[1] text-sm text-[#8da0be]">
            {placeholder}
          </span>
        ) : null}

        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={fieldValue} readOnly />
      {required ? (
        <input
          required
          tabIndex={-1}
          readOnly
          value={plainTextValue}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
        />
      ) : null}
    </div>
  );
}
