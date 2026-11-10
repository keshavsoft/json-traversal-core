export const generateLeafRoute = (actions = []) => {
    const routeHandlers = actions
        .map(action => `routes.get("/${action.name}", (c) => {\n    return c.json({ status: true, action: "${action.handler}" });\n});`)
        .join("\n\n");

    return `import { Hono } from "hono";

const routes = new Hono();

${routeHandlers}

export default routes;
`;
};

