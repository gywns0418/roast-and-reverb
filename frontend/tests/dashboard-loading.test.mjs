import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {MemoryRouter} from 'react-router-dom';
test('pending dashboard shows only branded loading, never first-visit actions or empty records', async () => {
 const server=await createServer({server:{middlewareMode:true},appType:'custom'});
 try {
  const {default:Dashboard}=await server.ssrLoadModule('/src/pages/dashboard/DashboardPage.jsx');
  const html=renderToStaticMarkup(React.createElement(MemoryRouter,null,React.createElement(Dashboard)));
  assert.match(html,/나의 기록을 펼치고 있어요/);
  assert.match(html,/role="status"/);
  assert.match(html,/aria-busy="true"/);
  assert.doesNotMatch(html,/첫 감상 가이드 시작|아직 첫 기록이 없어요|첫 페어링 만들기|metric-strip/);
 } finally {await server.close();}
});
