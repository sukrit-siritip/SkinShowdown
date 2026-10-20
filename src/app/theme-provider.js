"use client";

import { App, ConfigProvider, theme } from "antd";

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#b8860b",
          colorSuccess: "#7fa86a",
          colorError: "#c41e3a",
          colorBgBase: "#0a0e12",
          colorTextBase: "#e8dcc8",
          colorBorder: "#2d3543",
          fontFamily: "var(--font-newsreader), serif",
          borderRadius: 0,
          borderRadiusLG: 0,
        },
        components: {
          Input: { colorBgContainer: "#12161d" },
          Button: { colorBgContainer: "#12161d" },
          Form: { itemMarginBottom: 8, verticalLabelPadding: 0 },
          Alert: { borderRadius: 0 },
          Message: { contentBg: "#0f131a" },
          Table: {
            colorBgContainer: "transparent",
            headerBg: "#0f131a",
            headerColor: "#6b7280",
            headerSplitColor: "transparent",
            headerSortActiveBg: "#12171f",
            headerSortHoverBg: "#12171f",
            bodySortBg: "transparent",
            rowHoverBg: "#12171f",
            borderColor: "#1e2430",
            cellPaddingBlockSM: 11,
            cellPaddingInlineSM: 10,
          },
        },
      }}
    >
      <App component={false}>{children}</App>
    </ConfigProvider>
  );
}
