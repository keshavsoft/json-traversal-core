export const actions = {
    routes: async () => {
        const response = await fetch("./columns.json");
        const json = await response.json();
    }
};

export default actions;