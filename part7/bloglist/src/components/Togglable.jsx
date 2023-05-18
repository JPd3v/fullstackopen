import PropTypes from "prop-types";
import { useState, useImperativeHandle, forwardRef } from "react";

const Togglable = forwardRef(({ children, buttonText }, refs) => {
  const [isVisible, setIsVisible] = useState(false);

  function toggleVisibility() {
    setIsVisible(() => !isVisible);
  }

  useImperativeHandle(refs, () => {
    return { toggleVisibility };
  });

  return (
    <div>
      {!isVisible && <button onClick={toggleVisibility}>{buttonText}</button>}
      {isVisible && (
        <>
          {children}
          <button onClick={toggleVisibility}>Cancel</button>
        </>
      )}
    </div>
  );
});

Togglable.propTypes = {
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.element,
};

Togglable.displayName = "Togglable";
export default Togglable;
