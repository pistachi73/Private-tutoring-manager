import { cva } from "class-variance-authority";
import {
  ModalOverlay,
  type ModalOverlayProps,
  Modal as RACModal,
} from "react-aria-components";

const overlayStyles = cva(
  "fixed inset-0 z-50 bg-black/80 flex items-center justify-center",
  {
    variants: {
      isEntering: {
        true: "animate-in fade-in-0 duration-200 ease-out",
      },
      isExiting: {
        true: "animate-out fade-out-0 duration-200 ease-in",
      },
    },
  },
);

const modalStyles = cva(
  "w-full max-w-md max-h-full rounded-2xl bg-background",
  {
    variants: {
      isEntering: {
        true: "animate-in zoom-in-105 ease-out duration-200",
      },
      isExiting: {
        true: "animate-out zoom-out-95 ease-in duration-200",
      },
    },
  },
);

export function Modal(props: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <RACModal {...props} className={modalStyles} />
    </ModalOverlay>
  );
}
