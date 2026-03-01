"use client";

import React, { useEffect, useRef } from "react";
import { Clipboard } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { uploadImageToSupabase } from "@/lib/uploadImage";

interface RichTextEditorProps {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
    const editorRef = useRef<ReturnType<typeof useEditor>>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TiptapImage.configure({ inline: false, allowBase64: false }),
        ],
        content: value,
        immediatelyRender: false,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'w-full bg-gray-50 rounded-2xl min-h-[112px] p-5 pt-8 text-[16px] font-medium text-zinc-900 border border-transparent outline-none focus:bg-white focus:border-zinc-200 focus:shadow-sm transition-all prose prose-sm max-w-none [&_img]:rounded-xl [&_img]:max-w-full [&_img]:my-2',
            },
            handlePaste: (_view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.kind === 'file' && item.type.startsWith('image/')) {
                        const file = item.getAsFile();
                        if (!file) continue;
                        event.preventDefault();
                        const toastId = toast.loading("Uploading image\u2026");
                        uploadImageToSupabase(file).then((url) => {
                            const ed = editorRef.current;
                            if (url && ed) {
                                ed.chain().focus().setImage({ src: url }).run();
                                toast.success("Image added!", { id: toastId });
                            } else {
                                toast.error("Upload failed", { id: toastId });
                            }
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    useEffect(() => { editorRef.current = editor; }, [editor]);
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return <div className="w-full bg-gray-50 rounded-2xl h-28 p-5 animate-pulse" />;

    const handleQuickPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && editor) { editor.commands.insertContent(text); toast.success("Pasted to editor", { icon: "📋", duration: 1500 }); }
            else toast.error("Clipboard is empty");
        } catch (err) { toast.error("Clipboard access denied"); }
    };

    return (
        <div className="relative w-full">
            <EditorContent editor={editor} />
            {editor.isEmpty && <div className="absolute top-8 left-5 pointer-events-none text-zinc-400 font-medium text-[16px]">{placeholder}</div>}
            <button type="button" onClick={handleQuickPaste} tabIndex={-1} className="absolute top-3 right-3 p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 active:scale-90 transition-all rounded-lg z-10" title="Paste from clipboard">
                <Clipboard size={18} strokeWidth={2.5} />
            </button>
        </div>
    );
};
