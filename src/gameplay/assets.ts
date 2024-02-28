import { EnumType } from "typescript";
import { type } from "os";
import { getRandomInt, getRandomIntIterval} from "./util";
import { stop, main } from "./flow";
import { Constants } from "./constants";

export type AssetAction = {
    name:String,
    action:any
}

export function asset_stats(){
    let stats:any = {}

    for(let i=0; i < main.assets.length; i++){
        let asset = main.assets[i]
        
        if (asset.type in stats){
            stats[asset.type] += 1;
        }else{
            stats[asset.type] = 1;
        }
    }
    return stats;
}

export function objectToAsset(a:any):Asset|null{
    let newAsset:Asset|null = null;
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
    return newAsset
}

interface Asset {
    age: number;
    id: any;
    type:string;
    name:string;
    value:number;
    isSellable:boolean;
    month():void;
    yearly():void;
    getActions():AssetAction[];
}

class BaseAsset implements Asset{
    id:string = ""; 
    type: string = "";
    name: string = "";
    value: number = 0;
    isSellable: boolean = false;
    age: number = 0;
    
    constructor(){
        this.id = "id" + getRandomInt(999999);
    }
    
    getActions(): any[]{
        return [];
    }

    month(): void {

    }
    yearly(): void{

    }
    actions: AssetAction[] = [];
}


class Job extends BaseAsset{
    type = "job";
    name = "Job";
    isSellable = false;
    value = 1000 * main.inflation_factor; // salary

    getActions(){
        return [{name:"Quit", action:this.quit.bind(this)}]
    }
    
    month(){
        main.cash += this.value;
        main.log(`You get salary`);
    }

    yearly(): void {
        this.value += this.value * 0.1;
    }

    quit(){
        main.remove_asset_by_id(this.id);
        // main.remove_asset(this);
        main.log("You quit your job");
    }
}

class Car extends BaseAsset{
    type = "car";
    name = "WV Golf"
    isSellable = true;
    intialValue = 15000;
    value = 15000 * main.inflation_factor;

    month(){
        // depreciation
        this.value = Math.max(Math.round(this.value*0.95), this.intialValue*0.1); 
        this.car_accident();
    }

    getActions(){
        return [{name:"Uber ride", action:this.doUber.bind(this)}]
    }

    doUber(){
        let price = getRandomIntIterval(100 * main.inflation_factor, 300 * main.inflation_factor);
        main.cash += price;
        main.log(`You get ${price} from the ride`);
    }

    car_accident(){
        if(getRandomInt(100)<10){ // 10% probability
            let reparations = Math.round(this.value * 0.2);
            main.pay(reparations);
            main.log(`You had a car accident. You are fine but the reparations was ${reparations}`);
        }
    }
}

class House extends BaseAsset{
    type = "house";
    name = "House"
    isSellable = true;
    intialValue = 500000;
    value = 500000 * main.inflation_factor;

    month(){
        
    }

    yearly(){
        // apreciation
        this.value = Math.max(Math.round(this.value*1.1), this.intialValue*0.1); 
    }
}

class Credit extends BaseAsset{
    type = "credit";
    name = "Credit"
    isSellable = false;
    value = 0;

    getActions(){
        return [{name:"Pay", action:this.pay.bind(this)}];
    }

    constructor(value:number=0, name:string=""){
        super();
        this.value = value;
        this.name = name;
    }

    month(){
        if(this.value > 0){
            let rate = 500;
            if(main.cash > rate){
                main.cash -= rate;
                this.value -= rate;
                main.log(`You paid ${rate} for credit`);
            } else {
                this.bankrupcy();
            }
        }
    }

    yearly(): void {
        let interest = this.value * (Constants.CREDIT_INTEREST_RATE / 100);
        if(main.cash > interest){
            main.pay(interest);
            main.log(`You paid ${interest} as the interest rate for the credit`);
        }else{
            main.log(`You don't have money for interest rate (${interest})`);
            this.bankrupcy();
        }
    }

    pay(){
        if(main.cash > this.value){
            main.cash -= this.value;
            this.value = 0;
            main.remove_asset_by_id(this.id);
        }else{
            main.log("You don't have enough money");
        }
    }

    bankrupcy(){
        main.log("Bankrupcy. You don't have money to pay the credit");
        main.log("GAME OVER! Please refresh to start again");
        stop();
    }
}

class LotteryTicket extends BaseAsset{
    type = "lottery";
    name = "Lottery Ticket";
    isSellable= false;
    value = 10 * main.inflation_factor;

    month(){
        // remove
        main.remove_asset(this);
        if(getRandomInt(100) == 1){
            let prize = 10000 * main.inflation_factor; 
            main.cash += prize;
            main.log(`Your lottery ticket was lucky. You own ${Math.round(prize)}`);
        }else{
            main.log("Your lottery ticket was non winning");
        }
    }
}




export { Job, Car, House, Credit, LotteryTicket };
export type { Asset };
