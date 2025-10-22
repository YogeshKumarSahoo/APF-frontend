import React from 'react';

// Simple polymorphic component for compatibility
const PolymorphicComponent = React.forwardRef<any, any>(({ as: Component = 'div', ...props }, ref) => {
  return <Component ref={ref} {...props} />;
});

PolymorphicComponent.displayName = 'PolymorphicComponent';

export default PolymorphicComponent;
