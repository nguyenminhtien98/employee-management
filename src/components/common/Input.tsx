import { useRef, useEffect, type InputHTMLAttributes, forwardRef } from "react";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({
    className,
    type,
    onClick,
    ...rest
  }: InputHTMLAttributes<HTMLInputElement>) => {
    const cls = ["input", className].filter(Boolean).join(" ");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      const input = inputRef.current;
      if (!input || type !== "date") return;

      const handleInputClick = (e: MouseEvent) => {
        const rect = input.getBoundingClientRect();
        const clickX = e.clientX;
        const iconArea = rect.right - 40;

        if (clickX >= iconArea || input === document.activeElement) {
          if ("showPicker" in HTMLInputElement.prototype) {
            try {
              (
                input as HTMLInputElement & { showPicker: () => void }
              ).showPicker();
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err) {
              input.focus();
            }
          }
        }
      };

      input.addEventListener("click", handleInputClick);
      return () => input.removeEventListener("click", handleInputClick);
    }, [type]);

    const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
      if (
        type === "date" &&
        inputRef.current &&
        "showPicker" in HTMLInputElement.prototype
      ) {
        setTimeout(() => {
          try {
            (
              inputRef.current as HTMLInputElement & { showPicker: () => void }
            ).showPicker();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (err) {
            // showPicker may fail in some contexts, that's ok
          }
        }, 10);
      }
      onClick?.(e);
    };

    return (
      <input
        ref={inputRef}
        className={cls}
        type={type}
        onClick={handleClick}
        {...rest}
      />
    );
  });
export default Input;