import type { LexicalNode } from 'lexical';
import type { MdxJsxTextElement } from 'mdast-util-mdx-jsx';

export const OptimizedDiffSourceVisitor = {
  testNode: (node: any): node is MdxJsxTextElement => node.type === 'mdxJsxTextElement',
  visitNode: (node: MdxJsxTextElement, actions: any) => {
    // 여기에 최적화된 변환 로직 구현
    // 예: 불필요한 변환 단계 제거 또는 캐싱 메커니즘 추가
  }
};

export const OptimizedLexicalDiffSourceVisitor = {
  testNode: (node: any): node is LexicalNode => {
    // LexicalNode의 타입을 확인하는 로직을 구현해야 합니다.
    // 예를 들어, 특정 프로퍼티나 메서드의 존재 여부를 확인할 수 있습니다.
    return typeof node === 'object' && node !== null && '__type' in node;
  },
  visitNode: (node: LexicalNode, actions: any) => {
    // 여기에 Lexical 노드에서 마크다운으로의 최적화된 변환 로직 구현
  }
};