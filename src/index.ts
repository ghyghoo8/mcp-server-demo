#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { searchStocks } from './utils'


searchStocks('同花顺').then(code => {
  console.log('searchStocks===>', code)
})


// 创建MCP服务器
// const server = new McpServer({
//   name: "ashare-query",
//   version: "1.0.0"
// });

// // // Add an addition tool
// server.tool("get_ticker_price",
//   { 
//     code: z.string(),
//   },
//   async ({ code }) => ({
//     content: [{ type: "text", text: code }]
//   })
// );


