import { realmPlugin, viewMode$, Cell, ViewMode } from '@mdxeditor/editor';

export const diffSourceContent$ = Cell<string>('');

export const optimizedDiffSourcePlugin = realmPlugin({
  init: (realm) => {
    realm.pubIn({
      [viewMode$]: (mode: ViewMode) => {
        if (mode === 'source' || mode === 'diff') {
          // source나 diff 모드로 전환될 때 현재 내용을 저장
          const content = realm.getValue(diffSourceContent$);
          realm.pub(diffSourceContent$, content);
        }
      }
    });
  },
  update: (realm, params) => {
    // 필요한 경우 여기에 업데이트 로직 추가
  }
});