import { useEffect } from "react";

export function useInputMethod() {
  useEffect(() => {
    const markPointer = () => { document.documentElement.dataset.inputMethod = "pointer"; };
    const markKeyboard = (event: KeyboardEvent) => {
      if (["Tab", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) document.documentElement.dataset.inputMethod = "keyboard";
    };
    window.addEventListener("pointerdown", markPointer, true);
    window.addEventListener("keydown", markKeyboard, true);
    return () => {
      window.removeEventListener("pointerdown", markPointer, true);
      window.removeEventListener("keydown", markKeyboard, true);
    };
  }, []);
}
