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
            },
            {
                path: "profile",
                lazy: async () => {
                    const component = await import("../pages/profile/profile.tsx")
                    return { Component: component.default }
                }
            },
            {
                path: "bookmarks",
                lazy: async () => {
                    const component = await import("../pages/bookmark/Bookmarks")
                    return { Component: component.default }
                }
                }

        ]
    },
        {
        path : "/auth",
        children : [
            {
                index : true,
                lazy : {
                    Component : async() => {
                        const component = await import("../pages/auth/signup/SignUp.tsx")
                        return component.default
                    }
                }
            },
            {
                path : "signIn",
                lazy : {
                    Component : async() => {
                        const component = await import("../pages/auth/signin/SignIn.tsx")
                        return component.default
                    }
                }
            }
        ]    
    },  
])

export default router
