import React, { useReducer, useState } from 'react';
import {LogItem, main, Main} from './gameplay/main';
import actions, {Action} from './gameplay/actions';
import { start } from "./gameplay/flow";
import { Asset, AssetAction } from './gameplay/assets';
import './Game.css';
import { convertDaysToAge } from './gameplay/util';


function AssetComponent(props:{asset:Asset}){
    return (<div>
        {props.asset.name} { Math.round(props.asset.value)} &nbsp;
        <span>
            {props.asset.getActions().map((action:AssetAction, index:number) => (
                <button key={index} onClick={action.action}>{action.name}</button>
            ))} 
        </span>
        {props.asset.isSellable &&
            <button onClick={(e) => main.sell_asset(props.asset)}>Sell</button>
        }
    </div>)
}

function Player(props:{main:Main}){
    return (
        <div>
            <div>
                <span>{props.main.name}</span>
            </div>
            <div>
                <span>{convertDaysToAge(props.main.time)}</span>
            </div>
            <div>
                <span>Cash</span>
                <span> {Math.round(props.main.cash)}</span>
            </div>
            {props.main.assets.length > 0 &&
                <>
                    {props.main.assets.map((asset:Asset, index:number) => (
                        <AssetComponent key={index} asset={asset} />
                        )
                    )}
                </>
            }
        </div>
    )
}

function Game() {
  const [m, setMain]  = useState(main);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  // automatically update the state
  // TODO use frametime
  // https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b
  setTimeout(forceUpdate, 1000);
  start();
  
  return (
    <div className="Game">
        <div className="maincontent">
            <div>
                <h1>Actions</h1>
                <div>
                {actions.filter((action:Action) => action.active()).map((action:Action, index:number) => (
                    <span key={index}>
                        <button key={index} onClick={action.action}>{action.name}</button> &nbsp;
                    </span>
                    )
                )}  
                </div>
            </div>
            <div className="feed">
                <h1>Feed</h1>
                {m.log_history.map((item:LogItem, index:any) => 
                <div key={index}>{item.message} 
                    &nbsp;
                    {item.action && <button onClick={item.action.action}>{item.action.name}</button>}
                </div>)}
            </div>
        </div>
        <div className="statuspanel">
            <Player main={m}/>
        </div>
    </div>
  );
}

export default Game;