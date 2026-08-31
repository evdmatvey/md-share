import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage } from '@pages/home';
import { NotFoundPage } from '@pages/not-found';
import { SharePage } from '@pages/share';
import { AppLayout } from '@shared/ui/app-layout';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/m/:slug" element={<SharePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
