import { createBrowserRouter } from "react-router";
import MainLayout from "../layouts/MainLayout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout /> ,
        children: [
            {
                index: true,
                lazy: async () => {
                    const component = await import("../pages/home/Home")
                    return { Component: component.default }
                }
            },
            {
                path: "add-fanfic",
                lazy: async () => {
                    const component = await import("../pages/fanfic/addFanfic")
                    return { Component: component.default }
                }
            },
            {
                path: "fanfic/:id",
                lazy: async () => {
                    const component = await import("../pages/fanfic/detailFanfic")
                    return { Component: component.default }
                }
            }
        ]
    }
])

export default router
