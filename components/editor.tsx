"use client";

import React, { useCallback, useMemo } from "react";
// import styles from "./editor.module.css";
import "@mdxeditor/editor/style.css";

import {
  MDXEditor,
  MDXEditorMethods,
  RealmProvider,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  BlockTypeSelect,
  ConditionalContents,
  DiffSourceToggleWrapper,
  Separator,
  ShowSandpackInfo,
  SandpackConfig,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  imagePlugin,
  linkPlugin,
  tablePlugin,
  codeBlockPlugin,
  sandpackPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  frontmatterPlugin,
  toolbarPlugin,
  linkDialogPlugin,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  InsertCodeBlock,
  ChangeCodeMirrorLanguage,
  codeMirrorPlugin,
  useCellValue,
  usePublisher,
  ViewMode,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useTheme } from "next-themes";
import { useRef, useEffect, useState } from "react";
import { useEdgeStore } from "@/lib/edgestore";
import { YoutubeDirectiveDescriptor, YouTubeButton } from "./YoutubeDirective";
import {
  optimizedDiffSourcePlugin,
  diffSourceContent$,
} from "./optimizedDiffSourcePlugin";
import { Button } from "./ui/button";
import { BetweenHorizontalStart } from "lucide-react";



interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
  preview?: boolean;
}

const EditorContent = ({
  onChange,
  initialContent,
  editable = true,
  preview = false,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const [viewMode, setViewMode] = useState<ViewMode>("rich-text");

  const editorRef = useRef<MDXEditorMethods>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const content = useCellValue(diffSourceContent$);
  const setContent = usePublisher(diffSourceContent$);

  useEffect(() => {
    if (initialContent && initialContent !== content) {
      setContent(initialContent);
    }
  }, [initialContent, content, setContent]);

  // useEffect(() => {
  //   if (editorRef.current && initialContent) {
  //     editorRef.current.setMarkdown(initialContent);
  //   }
  // }, [initialContent]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const toolbar = container.querySelector(
        ".mdxeditor-toolbar"
      ) as HTMLElement;
      if (toolbar) {
        toolbar.style.position = "sticky";
        toolbar.style.top = "52px";
        toolbar.style.zIndex = "1000";
      }
    }
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      setContent(value);
      onChange(value);
    },
    [setContent, onChange]
  );

  const handleUpload = useCallback(async (file: File) => {
    const response = await edgestore.publicFiles.upload({ file });
    return response.url;
  }, [edgestore.publicFiles]);

  

  const sandpackConfig = useMemo<SandpackConfig>(() => ({
    defaultPreset: "react",
    presets: [
      {
        label: "React",
        name: "react",
        meta: "live react",
        sandpackTemplate: "react",
        sandpackTheme: "light",
        snippetFileName: "/App.js",
        snippetLanguage: "jsx",
      },
    ],
  }), []);

  const insertLineBreak = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.insertMarkdown('<br/>');
    }
  }, []);

  const plugins = useMemo(() => {
    const basePlugins = [
      headingsPlugin({
        allowedHeadingLevels: [1, 2, 3, 4, 5, 6],
      }),
      quotePlugin(),
      listsPlugin(),
      optimizedDiffSourcePlugin(),
      thematicBreakPlugin(),
      linkPlugin(),
      linkDialogPlugin(),
      imagePlugin({
        imageUploadHandler: handleUpload,
      }),
      tablePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
      codeMirrorPlugin({
        codeBlockLanguages: {
          js: "JavaScript",
          jsx: "JSX",
          ts: "TypeScript",
          tsx: "TSX",
          css: "CSS",
          html: "HTML",
          python: "Python",
        },
      }),
      sandpackPlugin({ sandpackConfig }),
      diffSourcePlugin({
        viewMode: viewMode,
        diffMarkdown: content,
      }),
      markdownShortcutPlugin({
        blockShortcuts: false,
        inlineShortcuts: true,
      }),
      frontmatterPlugin(),
      directivesPlugin({
        directiveDescriptors: [
          AdmonitionDirectiveDescriptor,
          YoutubeDirectiveDescriptor,
        ],
      }),
    ];

    if (!preview && editable) {
      basePlugins.push(
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <Button 
                onClick={insertLineBreak} 
                title="line break"
                className="p-1 bg-transparent text-primary hover:bg-muted"
              >
                <BetweenHorizontalStart className="h-4 w-4" />
              </Button>
              <Separator />
              <CreateLink />
              <InsertImage />
              <YouTubeButton />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <InsertCodeBlock />
              <Separator />
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    when: (editor) => editor?.editorType === "sandpack",
                    contents: () => <ShowSandpackInfo />,
                  },
                ]}
              />
            </DiffSourceToggleWrapper>
          ),
        })
      );
    }

    return basePlugins;
  }, [preview, editable, viewMode, content, handleUpload, insertLineBreak, sandpackConfig]);


  return (
    <div ref={containerRef} className="editor-container mt-4">
      <MDXEditor
        key={`mdx-editor-${preview}-${editable}`}
        ref={editorRef}
        onChange={preview ? undefined : handleChange}
        markdown={initialContent || content || ""}
        contentEditableClassName="prose max-w-full whitespace-normal outline-none"
        readOnly={preview || !editable}
        plugins={plugins}
        className={resolvedTheme === "dark" ? "dark-theme" : "light-theme"}
      />
    </div>
  );
};

const Editor = (props: EditorProps) => {
  return (
    <RealmProvider>
      <EditorContent {...props} />
    </RealmProvider>
  );
};

export default React.memo(Editor);

// import {
//   BlockNoteEditor,
//   BlockNoteSchema,
//   defaultBlockSpecs,
//   DefaultInlineContentSchema,
//   DefaultStyleSchema,
//   filterSuggestionItems,
//   insertOrUpdateBlock,
//   PartialBlock,
//   BlockSpecs
// } from "@blocknote/core";
// import {
//   getDefaultReactSlashMenuItems,
//   SuggestionMenuController,
//   useCreateBlockNote,
// } from "@blocknote/react";
// import { BlockNoteView } from "@blocknote/mantine";
// import "@blocknote/core/fonts/inter.css";
// import "@blocknote/mantine/style.css";
// import { useTheme } from "next-themes";
// import dynamic from "next/dynamic";

// import { useEdgeStore } from "@/lib/edgestore";
// import { FaYoutube } from "react-icons/fa";
// import { CustomBlockSchema, CustomSchema, YouTubeBlock } from "./YouTubeEmbed";
// import { useState } from "react";
// import { Input } from "./ui/input";
// import { Button } from "./ui/button";

// interface EditorProps {
//   onChange: (value: string) => void;
//   initialContent?: string;
//   editable?: boolean;
// }

// const customBlockSpecs = {
//   ...defaultBlockSpecs,
//   youtube: YouTubeBlock,
// };

// const schema = BlockNoteSchema.create({
//   blockSpecs: customBlockSpecs,
// }) as CustomSchema;

// const insertYouTube = (editor: BlockNoteEditor<CustomSchema>) => ({
//   title: "YouTube",
//   onItemClick: () => {
//     const url = prompt("YouTube URL을 입력하세요:");
//     if (url) {
//       editor.insertBlocks(
//         [
//           {
//             type: "youtube",
//             props: { url },
//           } as PartialBlock<CustomBlockSchema>,
//         ],
//         editor.getTextCursorPosition().block,
//         "after"
//       );
//     }
//   },
//   aliases: ["youtube"],
//   group: "Embed",
//   icon: <FaYoutube />,
// });

// const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
//   const { resolvedTheme } = useTheme();
//   const { edgestore } = useEdgeStore();

//   const handleUpload = async (file: File) => {
//     const response = await edgestore.publicFiles.upload({ file });
//     return response.url;
//   };

//   const editor = useCreateBlockNote({
//     initialContent: initialContent
//       ? (JSON.parse(initialContent) as PartialBlock<CustomBlockSchema>[])
//       : undefined,
//     uploadFile: handleUpload,
//     schema,
//   });

//   return (
//     <div>
//       <BlockNoteView
//         editor={editor}
//         editable={editable}
//         theme={resolvedTheme === "dark" ? "dark" : "light"}
//         onChange={() => onChange(JSON.stringify(editor.document, null, 2))}
//       >
//         <SuggestionMenuController
//           triggerCharacter={"/"}
//           getItems={async (query) =>
//             filterSuggestionItems(
//               [...getDefaultReactSlashMenuItems(editor), insertYouTube(editor)],
//               query
//             )
//           }
//         />
//       </BlockNoteView>
//     </div>
//   );
// };

// export default Editor;
