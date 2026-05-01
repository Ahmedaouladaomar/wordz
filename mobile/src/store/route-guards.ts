/**
 * Route Guard Configuration
 * Define which routes are protected (require authentication) and which are public
 */

export type RouteType = "public" | "protected";

export const ROUTE_CONFIG: Record<string, RouteType> = {
  // Public routes - no authentication required
  login: "public",
  register: "public",

  // Protected routes - authentication required
  home: "protected",
  dashboard: "protected",
};

export const PUBLIC_ROUTES = Object.entries(ROUTE_CONFIG)
  .filter(([, type]) => type === "public")
  .map(([route]) => route);

export const PROTECTED_ROUTES = Object.entries(ROUTE_CONFIG)
  .filter(([, type]) => type === "protected")
  .map(([route]) => route);

/**
 * Check if a route is protected
 */
export const isProtectedRoute = (route: string): boolean => {
  return ROUTE_CONFIG[route] === "protected";
};

/**
 * Check if a route is public
 */
export const isPublicRoute = (route: string): boolean => {
  return ROUTE_CONFIG[route] === "public";
};
