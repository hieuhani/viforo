import { cloneElement, isValidElement, useCallback, useState } from 'react';
import { usePopper } from 'react-popper';
import cs from 'classnames';
import { useOnClickOutside } from 'hooks/use-click-outside';
interface Props {
  trigger: React.ReactNode;
  dropdownClassName?: string;
}
export const Dropdown: React.FunctionComponent<Props> = ({
  children,
  trigger,
  dropdownClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowElement,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
    placement: 'bottom-end',
  });

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // fake ref
  useOnClickOutside({ current: popperElement }, toggleOpen);

  const triggerNode =
    isValidElement(trigger) &&
    cloneElement(trigger, {
      ref: setReferenceElement,
      onClick: toggleOpen,
    });

  return (
    <div className="relative">
      {triggerNode}
      {isOpen && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className={cs([
            'rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none bg-opacity-80 backdrop-filter backdrop-blur',
            dropdownClassName,
          ])}
        >
          <div
            ref={setArrowElement}
            style={styles.arrow}
            className="flex justify-center -top-1"
          >
            <div className="w-2 h-2 bg-white-800 ring-1 ring-black  ring-opacity-5 transform rotate-45"></div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};
