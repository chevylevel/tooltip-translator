
export function isTextSelectionValid(sel) {
  if (!sel || sel.rangeCount === 0) return false;
  const range = sel.getRangeAt(0);
  const contents = range.cloneContents();

  function hasTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) return true;

    for (let child of node.childNodes) {
      if (hasTextNode(child)) return true;
    }

    return false;
  }

  return hasTextNode(contents);
}
