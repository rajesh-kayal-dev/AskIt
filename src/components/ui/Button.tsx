interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: {
    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: 'var(--color-bg-primary)',
    color: 'var(--color-text-primary)',
    border: '1px solid #e0e0e0',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'var(--color-error, #e74c3c)',
    color: '#ffffff',
    border: 'none',
  },
};

const sizeStyles = {
  sm: { padding: '8px 16px', fontSize: 'var(--font-size-sm)' },
  md: { padding: '12px 24px', fontSize: 'var(--font-size-base)' },
  lg: { padding: '16px 32px', fontSize: 'var(--font-size-lg)' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  style = {},
  ...props
}) => {
  return (
    <button
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 'var(--border-radius-md)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'all var(--transition-fast)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-sm)',
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};