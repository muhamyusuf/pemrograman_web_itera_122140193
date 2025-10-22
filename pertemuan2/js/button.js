const setButtonLoading = (button, isLoading = false) => {
  if (!button) return;
  button.dataset.loading = String(isLoading);
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
};

const runWithLoading = async (button, taskFn) => {
  try {
    setButtonLoading(button, true);
    await taskFn();
  } finally {
    setButtonLoading(button, false);
  }
};

export { setButtonLoading, runWithLoading };
