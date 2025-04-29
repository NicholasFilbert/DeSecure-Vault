interface ButtonProps {
  icon?: IconDefinition;
  label?: string;
  tooltip?: string;
  action?: (...args: any[]) => unknown;
  className?: string;
}