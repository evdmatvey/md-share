import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { RouteFallback } from './RouteFallback';

export const RoutePending = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Outlet />
    </Suspense>
  );
};
