import { lazy } from "react";

const SearchPage = lazy(() => import("@/features/search/SearchPage"));
const HomePage = lazy(() => import("@/features/home/HomePage"));
const DynamicPage = lazy(() => import("@/features/dynamic-page/DynamicPage"));
const NewsPage = lazy(() => import("@/features/news/NewsPage"));
const NewsDetailPage = lazy(() => import("@/features/news/NewsDetailPage"));
const EmployeeDetailPage = lazy(() => import("@/features/employees/EmployeeDetailPage"));
const LaboratoryDetailPage = lazy(() => import("@/features/laboratories/LaboratoryDetailPage"));
const DepartmentDetailPage = lazy(() => import("@/features/departments/DepartmentDetailPage"));
const ScientificDetailPage = lazy(() => import("@/features/scientific/ScientificDetailPage"));
const PostgraduateDetailPage = lazy(() => import("@/features/postgraduate-education/PostgraduateDetailPage"));
const NotFoundPage = lazy(() => import("@/features/not-found/NotFoundPage"));
const Layout = lazy(() => import("@/layout/layout"));

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/home",
        element: <HomePage />,
      },
      {
        path: "/dynamic-page/:slug",
        element: <DynamicPage />,
      },
      {
        path: "/news",
        element: <NewsPage />,
      },
      {
        path: "/news/:id",
        element: <NewsDetailPage />,
      },
      {
        path: "/employees/:id",
        element: <EmployeeDetailPage />,
      },
      {
        path: "/laboratories/:id",
        element: <LaboratoryDetailPage />,
      },
      {
        path: "/departments/:id",
        element: <DepartmentDetailPage />,
      },
      {
        path: "/scientific-directions/:slug",
        element: <ScientificDetailPage />,
      },
      {
        path: "/postgraduate-educations/:slug",
        element: <PostgraduateDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
