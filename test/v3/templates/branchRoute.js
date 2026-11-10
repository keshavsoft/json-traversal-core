export const generateBranchRoute = (children = []) => {
    const importStatements = children
        .map(child => `import ${child}Routes from "./${child}/routes.js";`)
        .join("\n");

    const routeStatements = children
        .map(child => `routes.route("/${child}", ${child}Routes);`)
        .join("\n");

    return `import { Hono } from "hono";
${importStatements}

const routes = new Hono();

${routeStatements}

export default routes;
`;
};

