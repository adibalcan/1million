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

export interface Asset {
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


export class Job extends BaseAsset{
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
        this.value += this.value * Constants.ANNUAL_JOB_PAYMENT_INCREASE;
    }

    quit(){
        main.remove_asset_by_id(this.id);
        // main.remove_asset(this);
        main.log("You quit your job");
    }
}

export class Car extends BaseAsset{
    type = "car";
    name = "WV Golf"
    isSellable = true;
    intialValue = 15000;
    value = 15000 * main.inflation_factor;
    last_ride = 0; // time of the last ride

    month(){
        // depreciation
        this.value = Math.max(Math.round(this.value*0.95), this.intialValue*0.1); 
        this.car_accident();
    }

    getActions(){
        return [{name:"Uber ride", action:this.doUber.bind(this)}]
    }

    doUber(){
        if(Date.now() - this.last_ride > Constants.DAY_LASTS / Constants.UBER_RIDES_PER_DAY){
            let price = getRandomIntIterval(100 * main.inflation_factor, 300 * main.inflation_factor);
            main.cash += price;
            main.log(`You get ${price} from the ride`);
            this.last_ride = Date.now();
        } else {
            main.log(`You are too tierd for a ride`);
        }
    }

    car_accident(){
        if(getRandomInt(100)<10){ // 10% probability
            let reparations = Math.round(this.value * 0.2);
            main.pay(reparations);
            main.log(`You had a car accident. You are fine but the reparations was ${reparations}`);
        }
    }
}

export class House extends BaseAsset{
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

export class Apartment extends BaseAsset{
    type = "house";
    name = "A small flat"
    isSellable = true;
    intialValue = 250000;
    value = 250000 * main.inflation_factor;

    month(){
        
    }

    yearly(){
        // apreciation
        this.value = Math.max(Math.round(this.value*1.1), this.intialValue*0.1); 
    }
}

export class Credit extends BaseAsset{
    type = "credit";
    name = "Credit"
    isSellable = false;
    value = 0;

    getActions(){
        let value = Math.min(this.value, this.compute_rate());
        
        return [
            // {name:`Pay ${value}`, action: (value:number) => {this.pay_value.bind(this)(value)}},
            {name:"Pay all", action:this.pay_all.bind(this)}
        ];
        
    }

    constructor(value:number=0, name:string=""){
        super();
        this.value = value;
        this.name = name;
    }

    compute_rate(){
        return Math.min(this.value, Constants.CREDIT_MAX_RATE);
    }

    month(){
        if(this.value > 0){
            let rate = this.compute_rate();
            
            // pay principal
            if(main.cash > rate){
                this.pay_value(rate);
            } else {
                this.bankrupcy();
            }

            // pay the interest rate
            let interest = Math.round(this.value * (Constants.CREDIT_INTEREST_RATE / 100) / 12);
            if(main.cash > interest){
                main.pay(interest, false);
                main.log(`You paid ${interest} as the interest rate for the credit`);
            }else{
                main.log(`You don't have money for interest rate (${interest})`);
                this.bankrupcy();
            }
        }
    }

    yearly(): void {

    }

    pay_value(rate:number){
        main.cash -= rate;
        this.value -= rate;
        main.log(`You paid ${rate} for credit`);
    }

    pay_all(){
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

export class LotteryTicket extends BaseAsset{
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

export class ETFSP500 extends BaseAsset{
    type = "sp500";
    name = "S&P500";
    isSellable= true;
    value = 5000 * main.inflation_factor;

    yearly(): void {
        this.value += this.value * (getRandomIntIterval(5,15) / 100);
    }
}

