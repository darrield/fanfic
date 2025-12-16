import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
    {
        path : "/",
        children : [
            {
                index : true,
                lazy : {
                    Component : async() => {
                        const component = await import ("../pages/fanfic/fanfic.tsx")
                        return component.default
                    }
                }
            },

            {
                path : "add-fanfic",
                lazy : {
                    Component : async() => {
                        const component = await import ("../pages/fanfic/addFanfic.tsx")
                        return component.default
                    }
                }
            }
        ]
    }
])

export default router
