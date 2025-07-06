import "./styles.css";
import { handleSelect } from './selection/handleSelect';
import { initializeTooltipController } from './tooltip/tooltip-ui';

initializeTooltipController();

// Add mouseup event listener with a check to prevent handling events on translate UI elements
document.addEventListener('mouseup', (e) => {
  // Check if the mouseup event originated from a translate button or tooltip
  // If not, proceed with the selection handling
  if (e.target.closest('.translate-ui')) {
    return;
  }

  handleSelect(e);
});
