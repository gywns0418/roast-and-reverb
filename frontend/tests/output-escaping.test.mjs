import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
test('imported coffee names and notes render as text rather than executable markup',async()=>{
 const server=await createServer({server:{middlewareMode:true},appType:'custom'});
 try{const {default:Card}=await server.ssrLoadModule('/src/components/coffee/CoffeeLogCard.jsx');const attack='<img src=x onerror=alert(1)><script>alert(1)</script>';const html=renderToStaticMarkup(React.createElement(Card,{item:{bean:attack,memo:attack,brewDetails:{}}}));assert.match(html,/&lt;img/);assert.match(html,/&lt;script/);assert.doesNotMatch(html,/<script>|<img src="?x/);}finally{await server.close();}
});
