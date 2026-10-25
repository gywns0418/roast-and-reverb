import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";

test("first visit offers one writing action and defers music and previous tools", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true },
    appType: "custom",
  });
  try {
    const { default: Home } = await server.ssrLoadModule(
      "/src/pages/HomePage.jsx",
    );
    const home = renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(Home)),
    );
    assert.match(home, /좋았던 한 잔을/);
    assert.match(home, /한 줄 남겨보기/);
    assert.equal((home.match(/<textarea/g) || []).length, 1);
    assert.doesNotMatch(
      home,
      /<iframe|음악 선택 범위|커피와 함께, 오늘은 한국 음악|진열장 체험/,
    );
    const { default: Sidebar } = await server.ssrLoadModule(
      "/src/components/layout/Sidebar.jsx",
    );
    const nav = renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(Sidebar)),
    );
    assert.match(nav, /오늘의 한 잔/);
    assert.match(nav, /내 기록/);
    assert.match(nav, /원두 둘러보기/);
    assert.doesNotMatch(
      nav,
      /AI 페어링|취향 리포트|청음실|전체 메뉴|음악 제작/,
    );
  } finally {
    await server.close();
  }
});
