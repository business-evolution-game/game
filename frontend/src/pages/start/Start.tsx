import React from 'react';
import PageTemplate from "@pages/PageTemplate";

import {TabsRouting} from "@shared/ui/tabsRouting";
import LoadingCircle from "@shared/ui/loader/LoadingCircle";
import {useGameContractService} from "@entities/game/services/gameContractService";



function Start() {
    const {joinGame, isError, error} = useGameContractService();
    return (
        <PageTemplate>
                <div className="min-h-screen w-full bg-gray-900">
                    <TabsRouting tabs={[
                        {title: "By address", to:"", element:<div>
                                {isError && <div>{error?.message}</div>}
                            <button onClick={()=>{
                                console.log("press join");
                                joinGame().then((data)=>{
                                    //todo: update game stage
                                    //todo: redirect to game page
                                    console.log("joined", data);
                                }).catch(e=>{
                                    console.error("joining error:", e.data);
                                })
                            }}>Join</button>
                            </div>},
                        {title: "By deploying new game", to:"30", element:<LoadingCircle  progress={30}/>}
                    ]} />
                </div>
        </PageTemplate>
    );
}

export default Start;