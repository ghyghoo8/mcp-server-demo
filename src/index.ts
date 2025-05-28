#!/usr/bin/env node
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { searchStocks, getStockPrice } from './utils'

const minSchema = z.enum(['1m', '5m', '15m', '30m', '60m']);
const daySchema = z.enum(['1d','1w','1M']);


// 创建MCP服务器
const server = new McpServer({
  name: "ashare-query",
  version: "1.0.0"
});


server.resource(
  "stock-code",
  new ResourceTemplate("file:///libs/codeData.json", { list: undefined }),
  async (uri) => ({
    contents: [{ uri: uri.href, text: "all stock-code list data", mimeType:'application/json'}],
  })
)

server.tool("get_stock_code",
  {
    name: z.string()
  },
  async ({ name }) => {
    const code = await searchStocks(name) as string
    return {
      content: [{ type: "text", text: code }]
    }
  }
);


// Add an addition tool
server.tool("get_stock_price_min",
  { 
    code: z.string(),
    frequency: minSchema,
    count: z.number().default(10),
  },
  async ({ code, frequency, count }) => {
    const data = await getStockPrice(code, frequency,count )
    return {
      content: [{ type: "text", text: data }]
    }
  }
);

server.tool("get_stock_price_day",
  { 
    code: z.string(),
    frequency: daySchema,
    count: z.number().default(10),
    end_date: z.optional(z.string())
  },
  async ({ code, frequency,count,end_date }) => {
    const data = await getStockPrice(code, frequency,count,end_date )
    return {
      content: [{ type: "text", text: data }]
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport).then((v) => {
  console.log('MCP Server running===>')
});

// 关闭则退出
process.on('SIGINT', async () => {
  await server.close();
  console.log('MCP Server closed')
  process.exit(0);
});
