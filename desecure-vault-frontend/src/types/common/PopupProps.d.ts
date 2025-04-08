interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: 'center' | 'top';
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;
}

interface BasePopupProps {
  icon?: IconDefinition;
  label: string;
  popupTitle: string;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  position?: 'center' | 'top';
  action?: (...args: any[]) => unknown;
  onConfirm?: (...args: any[]) => unknown;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

interface UploadPopupButtonProps extends BasePopupProps {
  onConfirm?: (formData: any) => void;
}

type PopupButtonProps = BasePopupProps;
