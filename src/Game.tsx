import React, { useReducer, useState } from 'react';
import { main, start, reset, game_status } from './gameplay/flow';
import {LogItem, Main} from './gameplay/main';
import actions, {Action} from './gameplay/actions';
import { Asset, AssetAction } from './gameplay/assets';
import './Game.css';
import { convertDaysToAge } from './gameplay/util';


function AssetComponent(props:{asset:Asset}){
    return (<div className="asset flex-between">
        <span>
            <span className="name">{props.asset.name}</span>
            <span className="value" title="value">{ Math.round(props.asset.value)}</span> 
        </span>
        <span className="actions">
            {game_status &&
            <span>
                {props.asset.getActions().map((action:AssetAction, index:number) => (
                    <button className="action" key={index} onClick={action.action}>{action.name}</button>
                ))} 
                {props.asset.isSellable &&
                    <button className="action" onClick={(e) => main.sell_asset(props.asset)}>Sell</button>
                }
            </span>
            }
        </span>
    </div>)
}

function Player(props:{main:Main}){
    return (
        <div>
            <div className="flex-between">
                <span>
                    <h1 className='marginzero'>{props.main.name}</h1>
                </span>
                <span>
                    <span>Net Worth {props.main.compute_net_worth()}</span>
                    &nbsp; 
                    <button onClick={reset}>Reset game</button>
                </span>
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
        <div className="statuspanel">
            <Player main={m}/>
        </div>
        <div className="maincontent">
            <div>
                <h1>Actions</h1>
                {game_status &&
                    <div>
                    {actions.filter((action:Action) => action.active()).map((action:Action, index:number) => (
                        <span key={index}>
                            <button key={index} onClick={action.action}>{action.name}</button> &nbsp;
                        </span>
                        )
                    )}
                    </div>
                }
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

    </div>
  );
}

export default Game;