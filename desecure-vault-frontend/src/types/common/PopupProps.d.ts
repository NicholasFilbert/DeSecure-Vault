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
  onConfirm?: (...args: any) => void | boolean | Promise<void> | Promise<boolean>;
  onClose?: (...args:any) => void;
  validateForm?: (...args: any[]) => boolean;
  confirmText?: string;
  confirmTextColor?: string;
  cancelText?: string;
  cancelTextColor?: string;
  showCancelButton?: boolean;
}

interface UploadPopupButtonProps extends BasePopupProps {
  onConfirm?: (formData: any) => void;
}

type PopupButtonProps = BasePopupProps;

interface UploadPopupButtonProps extends BasePopupProps {
  onConfirm?: (formData: any) => void;
}

interface FormInputProps {
  label: string;
  name: string;
  type: string; // 'text', 'email', 'password', etc.
  placeholder?: string;
  defaultValue?: any;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  error?: string; // optional error message to show below input
  helperText?: string; // small description or hint under input
  autoComplete?: string;
}

interface FormPopupProps extends BasePopupProps {
  fields: FormInputProps[]
}

interface DialogPopupProps extends BasePopupProps {
  message: string | React.ReactNode;
  type?: 'info' | 'warning' | 'error' | 'success';
}