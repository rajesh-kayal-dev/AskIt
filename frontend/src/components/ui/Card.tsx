interface CardProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

const paddingMap = {
  none: '0',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  padding = 'lg', 
  style = {} 
}) => {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        padding: paddingMap[padding],
        ...style,
      }}
    >
      {children}
    </div>
  );
};