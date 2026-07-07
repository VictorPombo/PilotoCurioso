'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapImage from '@tiptap/extension-image';
import { Video } from '@/lib/tiptap/Video';
import { supabase } from '@/lib/supabase';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Unlink,
  RemoveFormatting,
  Upload,
  Film,
  Loader2,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

/** Upload file to Supabase Storage and return public URL */
async function uploadToStorage(
  file: File,
  bucket: 'images' | 'videos'
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `articles/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return publicUrl;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  if (!editor) return null;

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL do link', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageByUrl = useCallback(() => {
    const url = window.prompt('URL da Imagem');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploadingImage(true);
        setUploadProgress('Enviando imagem...');
        const publicUrl = await uploadToStorage(file, 'images');
        editor.chain().focus().setImage({ src: publicUrl }).run();
        setUploadProgress('');
      } catch (err: any) {
        console.error('Erro upload imagem:', err.message);
        alert('Erro ao fazer upload da imagem.');
        setUploadProgress('');
      } finally {
        setUploadingImage(false);
        if (imageInputRef.current) imageInputRef.current.value = '';
      }
    },
    [editor]
  );

  const addVideoByUrl = useCallback(
    (vertical: boolean) => {
      const url = window.prompt('URL do vídeo (MP4 ou link direto)');
      if (url) {
        editor.chain().focus().setVideo({ src: url, vertical }).run();
      }
    },
    [editor]
  );

  const handleVideoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, vertical: boolean) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        setUploadingVideo(true);
        setUploadProgress('Enviando vídeo...');
        const publicUrl = await uploadToStorage(file, 'videos');
        editor.chain().focus().setVideo({ src: publicUrl, vertical }).run();
        setUploadProgress('');
      } catch (err: any) {
        console.error('Erro upload vídeo:', err.message);
        alert('Erro ao fazer upload do vídeo.');
        setUploadProgress('');
      } finally {
        setUploadingVideo(false);
        if (videoInputRef.current) videoInputRef.current.value = '';
      }
    },
    [editor]
  );

  const buttonClass = (isActive: boolean) =>
    `p-2 rounded-lg transition-colors flex items-center justify-center ${
      isActive
        ? 'bg-brand-red text-white'
        : 'text-zinc-400 hover:bg-surface-3 hover:text-white'
    }`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-surface-2 rounded-t-xl">
      {/* Text formatting */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive('bold'))}
        title="Negrito"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive('italic'))}
        title="Itálico"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Headings */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={buttonClass(editor.isActive('heading', { level: 2 }))}
        title="Título (H2)"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={buttonClass(editor.isActive('heading', { level: 3 }))}
        title="Subtítulo (H3)"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive('bulletList'))}
        title="Lista"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={buttonClass(editor.isActive('orderedList'))}
        title="Lista Numerada"
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={buttonClass(editor.isActive('blockquote'))}
        title="Citação"
      >
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Links */}
      <button
        type="button"
        onClick={setLink}
        className={buttonClass(editor.isActive('link'))}
        title="Inserir Link"
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive('link')}
        className={buttonClass(false)}
        title="Remover Link"
      >
        <Unlink className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Imagem: URL */}
      <button
        type="button"
        onClick={addImageByUrl}
        className={buttonClass(false)}
        title="Inserir Imagem (URL)"
      >
        <ImageIcon className="w-4 h-4" />
      </button>

      {/* Imagem: Upload */}
      <label
        className={`${buttonClass(false)} cursor-pointer`}
        title="Upload Imagem"
      >
        {uploadingImage ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploadingImage}
          className="hidden"
        />
      </label>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Vídeo Vertical: URL */}
      <button
        type="button"
        onClick={() => addVideoByUrl(true)}
        className={buttonClass(false)}
        title="Inserir Vídeo Vertical 9:16 (URL)"
      >
        <Smartphone className="w-4 h-4" />
      </button>

      {/* Vídeo Horizontal: URL */}
      <button
        type="button"
        onClick={() => addVideoByUrl(false)}
        className={buttonClass(false)}
        title="Inserir Vídeo Horizontal 16:9 (URL)"
      >
        <Monitor className="w-4 h-4" />
      </button>

      {/* Vídeo: Upload */}
      <label
        className={`${buttonClass(false)} cursor-pointer`}
        title="Upload Vídeo (Vertical por padrão)"
      >
        {uploadingVideo ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Film className="w-4 h-4" />
        )}
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => handleVideoUpload(e, true)}
          disabled={uploadingVideo}
          className="hidden"
        />
      </label>

      <div className="w-px h-6 bg-white/10 mx-1" />

      {/* Clear formatting */}
      <button
        type="button"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        className={buttonClass(false)}
        title="Limpar Formatação"
      >
        <RemoveFormatting className="w-4 h-4" />
      </button>

      {/* Upload progress indicator */}
      {uploadProgress && (
        <span className="ml-2 text-xs text-purple-400 font-medium animate-pulse">
          {uploadProgress}
        </span>
      )}
    </div>
  );
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      Video,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-red underline cursor-pointer',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-invert prose-p:leading-relaxed prose-a:text-brand-red prose-headings:font-display focus:outline-none min-h-[300px] max-w-none p-4',
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;

        const files = event.dataTransfer?.files;
        if (!files || files.length === 0) return false;

        const file = files[0];

        if (file.type.startsWith('image/')) {
          event.preventDefault();
          uploadToStorage(file, 'images')
            .then((url) => {
              const { schema } = view.state;
              const node = schema.nodes.image.create({ src: url });
              const tr = view.state.tr.replaceSelectionWith(node);
              view.dispatch(tr);
            })
            .catch((err) => {
              console.error('Erro drag&drop imagem:', err);
              alert('Erro ao fazer upload da imagem.');
            });
          return true;
        }

        if (file.type.startsWith('video/')) {
          event.preventDefault();
          uploadToStorage(file, 'videos')
            .then((url) => {
              const { schema } = view.state;
              const node = schema.nodes.video.create({
                src: url,
                vertical: true,
              });
              const tr = view.state.tr.replaceSelectionWith(node);
              view.dispatch(tr);
            })
            .catch((err) => {
              console.error('Erro drag&drop vídeo:', err);
              alert('Erro ao fazer upload do vídeo.');
            });
          return true;
        }

        return false;
      },
    },
  });

  // Sincroniza o valor externo se mudar (ex: ao carregar matéria ou ao gerar via IA)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Drag & drop visual feedback
  useEffect(() => {
    const container = editorContainerRef.current;
    if (!container) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = () => {
      setIsDragging(false);
    };

    const handleDrop = () => {
      setIsDragging(false);
    };

    container.addEventListener('dragover', handleDragOver);
    container.addEventListener('dragleave', handleDragLeave);
    container.addEventListener('drop', handleDrop);

    return () => {
      container.removeEventListener('dragover', handleDragOver);
      container.removeEventListener('dragleave', handleDragLeave);
      container.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div
      ref={editorContainerRef}
      className={`border rounded-xl bg-surface-1 overflow-hidden transition-colors ${
        isDragging
          ? 'border-brand-red/50 bg-brand-red/5'
          : 'border-white/10 focus-within:border-brand-red/50'
      }`}
    >
      <MenuBar editor={editor} />
      {isDragging && (
        <div className="flex items-center justify-center gap-2 py-3 bg-brand-red/10 text-brand-red text-sm font-medium border-b border-brand-red/20">
          <Upload className="w-4 h-4" />
          Solte a imagem ou vídeo aqui
        </div>
      )}
      <div className="bg-surface-2 p-1">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
