import { type ReactNode, createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

type HeaderSlotContextType = {
  slot: HTMLElement | null;
  setSlot: (slot: HTMLElement | null) => void;
};

const HeaderSlotContext = createContext<HeaderSlotContextType | null>(null);

export const useHeaderSlot = () => {
  const context = useContext(HeaderSlotContext);

  if (!context) {
    throw new Error('HeaderSlotProvider is missing');
  }

  return context;
};

interface HeaderSlotProviderProps {
  children: ReactNode;
}

export const HeaderSlotProvider = ({ children }: HeaderSlotProviderProps) => {
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  return (
    <HeaderSlotContext.Provider value={{ slot, setSlot }}>
      {children}
    </HeaderSlotContext.Provider>
  );
};

interface HeaderActionSlotProps {
  className?: string;
}

export const HeaderActionSlot = ({ className }: HeaderActionSlotProps) => {
  const { setSlot } = useHeaderSlot();

  return (
    <div
      ref={(node) => {
        setSlot(node);
      }}
      className={className}
    />
  );
};

interface HeaderActionsProps {
  children: ReactNode;
}

export const HeaderActions = ({ children }: HeaderActionsProps) => {
  const { slot } = useHeaderSlot();

  if (slot === null) {
    return null;
  }

  return createPortal(children, slot);
};
