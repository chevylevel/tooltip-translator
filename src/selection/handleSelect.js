import { showTranslation } from '../tooltip/tooltip-ui';
import { showTranslateButton } from '../button/button-ui';
import { isTextSelectionValid } from './istextSelectionValid';

export function handleSelect(e) {
  setTimeout(() => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const text = sel.toString().trim();

    if (text && isTextSelectionValid(sel)) {
      const selectionRect = sel.getRangeAt(0).getBoundingClientRect();
      showTranslateButton(
        selectionRect,
        { x: e.clientX, y: e.clientY },
        () => showTranslation(selectionRect, text),
      );
    }
  }, 10);
}
