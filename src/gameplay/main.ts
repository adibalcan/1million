import { Action } from "./actions";
import { Asset, Car, Credit, House, Job, LotteryTicket } from "./assets";
import { Constants } from "./constants";

export type LogItem = {
    message:string;
    action?:Action;
}

class Main{
    public name = Constants.NAME;
    public cash = Constants.CASH_START;
    public time = Constants.AGE_IN_DAYS;
    public skill = 1;
    public network = 1;
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
        /**
         * To avoid missing references after serialization / deserialization we associated an id to every asset
         */
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

    compute_net_worth(){
        let net_worth = this.cash;
        for(let i=0; i < this.assets.length; i++){
            let asset = this.assets[i]
            
            switch(asset.type){
                case 'credit':
                    net_worth -= asset.value;
                    break;
                case 'job':
                    break;
                default:
                    net_worth += asset.value;
            }
        }
        return Math.round(net_worth);
    }

    how_many(asset_type:string):number{
        let stats = this.asset_stats();

        if(asset_type in stats) 
            return stats[asset_type];
        else
            return 0;
    }
}



export {Main};