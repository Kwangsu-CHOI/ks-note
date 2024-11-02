import React from 'react';
import { DirectiveDescriptor, insertDirective$, usePublisher } from '@mdxeditor/editor';
import { GenericDirectiveEditor } from '@mdxeditor/editor';
import { DialogButton } from '@mdxeditor/editor';
import { LeafDirective } from 'mdast-util-directive';
import { YoutubeEmbed } from './YouTubeEmbed';

export const YoutubeDirectiveDescriptor: DirectiveDescriptor = {
  name: 'youtube',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: (props: any) => {
    const id = props.mdastNode?.attributes?.id;
    return id ? <YoutubeEmbed id={id} /> : null;
  }
};

export const YouTubeButton: React.FC = () => {
  const insertDirective = usePublisher(insertDirective$)

  return (
    <DialogButton
      tooltipTitle="Insert Youtube video"
      submitButtonTitle="Insert video"
      dialogInputPlaceholder="Paste the youtube video URL"
      buttonContent="YT"
      onSubmit={(url) => {
        try {
          const videoId = new URL(url).searchParams.get('v')
          if (videoId) {
            insertDirective({
              name: 'youtube',
              type: 'leafDirective',
              attributes: { id: videoId },
              children: []
            } as LeafDirective)
          } else {
            alert('Invalid YouTube URL')
          }
        } catch (error) {
          console.error('Error parsing YouTube URL:', error);
          alert('Invalid YouTube URL')
        }
      }}
    />
  )
}