"use client";

import { ConfigProvider, theme } from "antd";

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#b8860b",
          colorBgBase: "#0a0e12",
          colorTextBase: "#e8dcc8",
          colorBorder: "#2d3543",
          fontFamily: "var(--font-newsreader), serif",
          borderRadius: 0,
        },
        components: {
          Input: { colorBgContainer: "#12161d" },
          Button: { colorBgContainer: "#12161d" },
          Form: { itemMarginBottom: 8, verticalLabelPadding: 0 },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
