import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@shared/ui/app-layout';
import { DocumentRobotsMeta } from './DocumentRobotsMeta';
import { RoutePending } from './RoutePending';

const HomePage = lazy(async () => {
  const module = await import('@pages/home');
  return { default: module.HomePage };
});

const SharePage = lazy(async () => {
  const module = await import('@pages/share');
  return { default: module.SharePage };
});

const NotFoundPage = lazy(async () => {
  const module = await import('@pages/not-found');
  return { default: module.NotFoundPage };
});

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <DocumentRobotsMeta />
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<RoutePending />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/m/:slug" element={<SharePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
