import { useState, useEffect, useCallback } from "react";

// Definir el tipo de las opciones que se pasan al CustomSelect
interface Option {
  label: string;
  value: any; // Puedes cambiar `any` por un tipo más específico si es necesario
}

interface CustomSelectProps {
  options: Option[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Tipo explícito para 'option' como Option
  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  // Tipo explícito para 'event' como MouseEvent
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Asegúrate de que event.target no sea null
      if (isOpen && event.target instanceof HTMLElement && !event.target.closest(".dropdown-content")) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]); // solo depende de isOpen

  return (
    <div className="dropdown-content custom-select relative" style={{ width: "200px" }}>
      <div
        className={`select-selected whitespace-nowrap ${isOpen ? "select-arrow-active" : ""}`}
        onClick={toggleDropdown}
      >
        {selectedOption.label}
      </div>
      <div className={`select-items ${isOpen ? "" : "select-hide"}`}>
        {options.slice(1, -1).map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`select-item ${selectedOption === option ? "same-as-selected" : ""}`}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
