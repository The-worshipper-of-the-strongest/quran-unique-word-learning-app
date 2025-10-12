document.addEventListener('DOMContentLoaded', () => {
  // Get all "Show" buttons
  const showButtons = document.querySelectorAll('.show-meaning');
  
  showButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Get the index from data-index attribute
      const index = button.getAttribute('data-index');
      // Find the corresponding meaning element
      const meaning = document.getElementById(`meaning_${index}`);
      // Toggle the hidden class
      if (meaning.classList.contains('hidden')) {
        meaning.classList.remove('hidden');
        button.textContent = 'Hide';
      } else {
        meaning.classList.add('hidden');
        button.textContent = 'Show';
      }
    });
  });
});