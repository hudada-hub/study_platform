import { NextRequest } from "next/server";

import { NextResponse } from "next/server";

// 配置匹配的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public/uploads (静态资源)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads/).*)',
  ],
};

// 这里可以添加你自己的中间件逻辑
export function middleware(request: NextRequest) {
  // 直接放行
  return NextResponse.next();
}