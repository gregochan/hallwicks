(() => {
  const lists = document.querySelectorAll("[data-sortable-list]");

  function updatePositions(list) {
    list.querySelectorAll("[data-sortable-row]").forEach((row, index) => {
      const badge = row.querySelector("[data-sortable-position]");

      if (badge) {
        badge.textContent = String(index + 1);
      }
    });
  }

  function rowAfterPointer(list, y) {
    const rows = [...list.querySelectorAll("[data-sortable-row]:not(.is-dragging)")];

    return rows.reduce(
      (closest, row) => {
        const box = row.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset, row };
        }

        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, row: null }
    ).row;
  }

  lists.forEach((list) => {
    updatePositions(list);

    list.addEventListener("dragstart", (event) => {
      const row = event.target.closest("[data-sortable-row]");
      if (!row) return;

      row.classList.add("is-dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", "");
    });

    list.addEventListener("dragend", (event) => {
      const row = event.target.closest("[data-sortable-row]");
      if (row) row.classList.remove("is-dragging");
      updatePositions(list);
    });

    list.addEventListener("dragover", (event) => {
      event.preventDefault();
      const active = list.querySelector(".is-dragging");
      if (!active) return;

      const after = rowAfterPointer(list, event.clientY);

      if (after) {
        list.insertBefore(active, after);
      } else {
        list.appendChild(active);
      }

      updatePositions(list);
    });
  });
})();
