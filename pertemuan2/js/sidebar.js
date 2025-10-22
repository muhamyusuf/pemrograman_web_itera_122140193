const normalizeRoute = (value = "") => {
  if (!value) return "";
  const sanitized = value.replace(/^(\.\/)/, "").trim();
  const [path] = sanitized.split(/[?#]/);
  const segments = path.split(/[\\/]/).filter(Boolean);
  const last = segments[segments.length - 1] || path;
  return last.toLowerCase();
};

const getCurrentRoute = () => {
  const { pathname } = window.location;
  return normalizeRoute(pathname);
};

const setActiveSidebar = (element) => {
  document.querySelectorAll(".sidebar__button").forEach((item) => {
    item.classList.remove("is-active");
    item.removeAttribute("aria-current");
  });

  if (element) {
    element.classList.add("is-active");
    element.setAttribute("aria-current", "page");
  }
};

const hydrateSidebar = () => {
  const items = Array.from(document.querySelectorAll(".sidebar__button"));
  if (!items.length) return;

  const currentRoute = getCurrentRoute();
  let hasMatch = false;

  items.forEach((item) => {
    const targetRoute =
      normalizeRoute(item.getAttribute("data-route")) ||
      normalizeRoute(item.getAttribute("href"));

    item.addEventListener("click", () => setActiveSidebar(item));

    if (!hasMatch && targetRoute && targetRoute === currentRoute) {
      setActiveSidebar(item);
      hasMatch = true;
    }
  });

  if (!hasMatch) {
    const fallback = items.find(
      (item) => normalizeRoute(item.getAttribute("data-route")) === "index.html",
    );
    if (fallback) {
      setActiveSidebar(fallback);
    }
  }
};

export { hydrateSidebar, setActiveSidebar };
