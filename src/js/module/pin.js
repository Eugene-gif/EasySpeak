export function pin () {
  const inputs = document.querySelectorAll(".access__input");

  inputs.forEach((ele, index) => {
    ele.addEventListener("keydown", (e) => {
      if (e.keyCode === 8 && e.target.value === "")
        inputs[Math.max(0, index - 1)].focus();
    });

    ele.addEventListener("input", (e) => {
      const [first, ...rest] = e.target.value;
      e.target.value = first ?? "";
      const lastInputBox = index === inputs.length - 1;
      const insertedContent = first !== undefined;

      if (insertedContent && !lastInputBox) {
        inputs[index + 1].focus();
        inputs[index + 1].value = rest.join("");
        inputs[index + 1].dispatchEvent(new Event("input"));
      }
    });
  });
}