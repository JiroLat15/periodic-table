document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const body = document.body;

  // Default to light mode
  body.classList.add("light-mode");
  themeIcon.src = "material-icon/dark mode.png";

  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    body.classList.toggle("light-mode", !isDark);

    // Change icon based on theme
    themeIcon.src = isDark
      ? "material-icon/light mode.png"
      : "material-icon/dark mode.png";
  });
});
