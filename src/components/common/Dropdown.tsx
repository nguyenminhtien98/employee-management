import { useState, useRef, useEffect } from "react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export default function Dropdown({
  value,
  onChange,
  options,
  placeholder = "Chọn...",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && menuRef.current && dropdownRef.current) {
      const menu = menuRef.current;
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      menu.style.top = "";
      menu.style.bottom = "";
      menu.style.left = "";
      menu.style.right = "";
      menu.style.width = "";

      menu.style.width = `${rect.width}px`;
      menu.style.minWidth = `${rect.width}px`;

      if (
        rect.bottom + menuRect.height > viewportHeight &&
        rect.top > viewportHeight / 2
      ) {
        menu.style.bottom = "100%";
        menu.style.top = "auto";
        menu.style.marginBottom = "4px";
        menu.style.marginTop = "0";
      } else {
        menu.style.top = "calc(100% + 4px)";
        menu.style.bottom = "auto";
        menu.style.marginTop = "0";
        menu.style.marginBottom = "0";
      }

      menu.style.left = "0";
      menu.style.right = "auto";

      setTimeout(() => {
        const selectedItem = menu.querySelector(`[data-value="${value}"]`);
        if (selectedItem) {
          selectedItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }, 0);
    }
  }, [isOpen, value]);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
      >
        <span>{displayText}</span>
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu" ref={menuRef}>
          {options.map((option) => (
            <div
              key={option.value}
              data-value={option.value}
              className={`dropdown-item ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
