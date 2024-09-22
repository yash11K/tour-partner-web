import React from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ErrorComponent, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, ConfigProvider } from "antd";
import { useAuth0 } from "@auth0/auth0-react";

import { resources, themeConfig } from "@/config";
import { AlgoliaSearchWrapper, FullScreenLoading, Layout } from "./components";
import dataProvider from "@refinedev/simple-rest";
import { AuditLogPage, SettingsPage } from "./routes/administration";
import {
  CompanyCreatePage,
  CompanyEditPage,
  CompanyListPage,
} from "./routes/companies";
import { DashboardPage } from "./routes/dashboard";
import { ForgotPasswordPage } from "./routes/forgot-password";
import { LoginPage } from "./routes/login";
import { RegisterPage } from "./routes/register";
import { UpdatePasswordPage } from "./routes/update-password";

import "./utilities/init-dayjs";
import "@refinedev/antd/dist/reset.css";
import "./styles/antd.css";
import "./styles/fc.css";
import "./styles/index.css";
import useAuth0Provider from "./providers/auth0-provider";


const API_URL = "http://localhost:8080";

const App: React.FC = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <FullScreenLoading />;
  }

  const authProvider = useAuth0Provider();

  return (
    <AlgoliaSearchWrapper>
      <BrowserRouter>
        <ConfigProvider theme={themeConfig}>
          <AntdApp>
            <DevtoolsProvider>
              <Refine
                authProvider={authProvider}
                dataProvider={dataProvider("http://localhost:8080")}
                routerProvider={routerProvider}
                resources={resources}
                notificationProvider={useNotificationProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  projectId: "nWXYXy-t0TZrF-XYDjDz"
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-layout"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <Layout>
                          <Outlet />
                        </Layout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<DashboardPage />} />
                    <Route
                      path="/tour-partners"
                      element={
                        <CompanyListPage>
                          <Outlet />
                        </CompanyListPage>
                      }
                    >
                      <Route path="create" element={<CompanyCreatePage />} />
                    </Route>
                    <Route
                      path="/organizations/:id"
                      element={<CompanyEditPage />}
                    />
                    <Route path="/administration" element={<Outlet />}>
                      <Route path="settings" element={<SettingsPage />} />
                      <Route path="audit-log" element={<AuditLogPage />} />
                    </Route>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-auth"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource resource="dashboard" />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPasswordPage />}
                    />
                    <Route
                      path="/update-password"
                      element={<UpdatePasswordPage />}
                    />
                  </Route>
                </Routes>
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
              <DevtoolsPanel />
            </DevtoolsProvider>
          </AntdApp>
        </ConfigProvider>
      </BrowserRouter>
    </AlgoliaSearchWrapper>
  );
};

export default App;
