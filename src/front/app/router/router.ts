
const router = createBrowserRouter([
    {
        path: "/",
        element: <DrinkListPage api={new CacheAPI(new HTTPDrinksAPI())}/>,
},
{
    path: "/favourites",
        element: <DrinkListPage api={new FavouritesAPI()}/>
},
{
    path: "/web3",
        element: <DrinkListPage api={new CacheAPI(new Web3DrinksAPI())}/>
},
{
    path: "/*",
        element: <Page404/>
}
]);