import { Action } from "./actions";
import { Asset, Car, Credit, House, Job, LotteryTicket } from "./assets";
import { instanceToPlain, plainToInstance, serialize } from 'class-transformer';
import { Constants } from "./constants";
import { game_status } from "./flow";

export type LogItem = {
    message:string;
    action?:Action;
}

class Main{
    public name = Constants.NAME;
    public cash = Constants.CASH_START;
    public time = Constants.AGE_IN_DAYS
    public inflation_factor = 1;
    public assets:Asset[] = [];
    public log_history:LogItem[] = [];
    public actions = 0;

    pay(sum: number, credit = true): boolean {
        if (sum > this.cash) {
            if (credit) {
                let extra_money = sum;
                let c = new Credit(extra_money, "credit");
                this.assets.push(c);
                return true;
            } else {
                return false;
            }
        } else {
            this.cash -= sum;
            return true;
        }
    }

    sell_asset(asset:Asset){
        this.cash += asset.value;
        this.log(`You sold the ${asset.name} for ${asset.value}`)
        // remove
        this.remove_asset(asset);
    }

    remove_asset(asset:Asset){
        this.assets = this.assets.filter(e => e !== asset);
    }

    remove_asset_by_id(id:any){
        this.assets = this.assets.filter(a => a.id !== id);
    }

    log(message:string, action?:Action){
        let item:LogItem = {message:message}
        if(action){
            item.action = action;
        }
        this.log_history.unshift(item);
        this.log_history = this.log_history.slice(0, 15);
    }

    asset_stats(){
        let stats:any = {}
    
        for(let i=0; i < this.assets.length; i++){
            let asset = this.assets[i]
            
            if (asset.type in stats){
                stats[asset.type] += 1;
            }else{
                stats[asset.type] = 1;
            }
        }
        return stats;
    }

    how_many(asset_type:string):number{
        let stats = this.asset_stats();

        if(asset_type in stats) 
            return stats[asset_type];
        else
            return 0;
    }
}

// This Works as a Singletone
let main:Main;


function save(){
    if(game_status){
        // save assets
        localStorage.setItem(Constants.STORAGE_PREFIX + "_assets", JSON.stringify(main.assets));

        // save main context
        localStorage.setItem(Constants.STORAGE_PREFIX + "_main", JSON.stringify(main));
        console.log("save");
    }    
}


function load(){
    let loaded = false;
    let data = localStorage.getItem(Constants.STORAGE_PREFIX + "_main");
    if(data){
        let object = JSON.parse(data);
        object.assets = [];
        object.log_history = [];
        // main = Object.create(Main, object);
        main = Object.assign(new Main(), object);
        loaded = true;
        console.log('loaded main context');
    }

    loadAssets();
    return loaded;
}

function loadAssets(){
    let data = localStorage.getItem(Constants.STORAGE_PREFIX + "_assets");
    if(data){
        let assetData = JSON.parse(data);
        assetData.map((a:any) => {
            let newAsset = null;
            switch(a.type){
                case 'job':
                    newAsset = new Job();
                    break;
                case 'car':
                    newAsset = new Car();
                    break;
                case 'house':
                    newAsset = new House();
                    break;
                case 'credit':
                    newAsset = new Credit();
                    break;
                case 'lottery':
                    newAsset = new LotteryTicket();
                    break;
                default:
                    console.error('Asset not supported');
            }

            if(newAsset){
                let asset = Object.assign(newAsset, a);
                main.assets.push(asset);
            }
        });
        console.log('loaded assets');
    }

}


// create main instance or load it form localstorage using load method

if(!load()){
    main = new Main();
    main.log("You are John, a teenager of 22 years. You have $1000 and you need to survive in the economic jungle.")
}

setInterval(save, 10000);

export {main, Main};