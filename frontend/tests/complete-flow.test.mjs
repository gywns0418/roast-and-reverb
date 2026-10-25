import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
test("the full route module initializes and secondary tools stay behind the archive", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    optimizeDeps: { noDiscovery: true },
    appType: "custom",
  });
  try {
    const router = await server.ssrLoadModule("/src/router/AppRouter.jsx");
    assert.equal(typeof router.default, "function");
    const { default: Settings } = await server.ssrLoadModule(
      "/src/pages/mypage/MyPage.jsx",
    );
    const settings = renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(Settings)),
    );
    assert.match(settings, /백업·복구/);
    assert.match(settings, /href="\/archive"/);
    assert.doesNotMatch(
      settings,
      /취향 리포트|연주 만들기|원두 선반.*음악 후보/,
    );
    const { default: Help } = await server.ssrLoadModule(
      "/src/pages/mypage/HelpPage.jsx",
    );
    const help = renderToStaticMarkup(
      React.createElement(MemoryRouter, null, React.createElement(Help)),
    );
    assert.match(help, /href="\/dashboard"/);
    assert.match(help, /한 줄/);
    assert.doesNotMatch(help, /href="\/journey"|href="\/studio"/);
  } finally {
    await server.close();
  }
});
