import React, { useRef, useEffect } from "react";

function CustomSelect({ options, selectedOption, handleSelectClick, handleOptionClick, optionsOpen, setOptionsOpen, customStyle }) {
  const optionsWrapperRef = useRef()
  
    function handleWrapperClick(e) {
      if (optionsWrapperRef?.current && !optionsWrapperRef?.current.contains(e.target)) {
        setOptionsOpen(false);
      }
    }
  
    useEffect(() => {
      document.addEventListener("click", handleWrapperClick);
      return () => {
        document.removeEventListener("click", handleWrapperClick);
      };
    });
  
    const { value: lang } = selectedOption;
  
    return (
      <div className="select-wrapper" style={{...customStyle}} ref={optionsWrapperRef}>
              <div
                className="select-inner-wrapper"
                onClick={handleSelectClick}
                data-testid="select-inner-wrapper"
              >
                <div className="selected-value">{selectedOption.label}</div>
                <ion-icon name="chevron-down-outline"></ion-icon>
              </div>
              {optionsOpen && (
                <div className="options-wrapper">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className={`option ${option.value === lang ? "active" : ""
                        }`}
                      onClick={() => handleOptionClick(option.value)}
                      data-testid={`option-${option.value}`}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
    );
  }
  
  export default CustomSelect;