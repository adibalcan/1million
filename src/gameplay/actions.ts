import {main} from "./flow";
import "./assets";
import { Job, Car, House, LotteryTicket, ETFSP500, Apartment, Bicycle } from "./assets";


export interface Action{
    name:string
    active():boolean
    action():void
}

class BuyCar implements Action{
    name = "Buy a car";

    active(): boolean {
        let c = new Car();
        if(main.cash > c.value * 0.1 && main.relative_time / 30 > 2)
            return true;
        else
            return false;
    }

    action(): void {
        let c = new Car();
        main.pay(c.value);
        main.assets.push(c);
        let message = "You bought a new car";
        main.log(message);
        console.log(message);
    }
}

class BuyBicycle implements Action{
    name = "Buy a bicycle";

    active(): boolean {
        let b = new Bicycle();
        if(main.cash > b.value * 0.1 && main.relative_time > 10)
            return true;
        else
            return false;
    }

    action(): void {
        let b = new Bicycle();
        main.pay(b.value);
        main.assets.push(b);
        let message = "You bought a new bicycle";
        main.log(message);
        console.log(message);
    }
}

class GetJob implements Action{
    name = "Get a job";

    active(): boolean {
        if(main.how_many('job') < 2 && main.relative_time  > 15)
            return true;
        else
            return false;
    }

    action(): void {
        let j = new Job();
        main.assets.push(j);
        main.log(`Congrats you have a new job`);
    }
}

class BuyLotteryTicket implements Action{
    name = "Buy lottery ticket";

    active(): boolean {
        return true;
    }

    action(): void {
        let l = new LotteryTicket();
        main.pay(l.value);
        main.assets.push(l);
    }
}

class BuyHouse implements Action{
    name = "Buy a house";

    active(): boolean {
        let h = new House();
        if(main.cash > h.value * 0.1 && main.relative_time / 365 > 3){
            return true;
        } else
            return false;
    }

    action(): void {
        let h = new House();
        main.pay(h.value);
        main.assets.push(h);
        main.log(`Congrats you have a new house`);
    }
}

class BuyFlat implements Action{
    name = "Buy a flat";

    active(): boolean {
        let h = new Apartment();
        // you need to have more than 10% of value to buy with credit
        if(main.cash > h.value * 0.05 && main.relative_time / 365 > 1){
            return true;
        } else
            return false;
    }

    action(): void {
        let h = new Apartment();
        main.pay(h.value);
        main.assets.push(h);
        main.log(`Congrats you have a new house`);
    }
}

class OrganizeAParty implements Action{
    name = "Organize a party";

    active(): boolean {
        if(main.cash > 100 && main.relative_time / 30  > 2){
            return true;
        } else {
            return false;
        }
    }

    action(): void {
        let cost = 200 * main.inflation_factor;
        main.pay(cost);
        main.network += 1;
        main.log(`Let's party`);
    }
}

class GoInVacantion implements Action{
    name = "Go in a vacation";

    active(): boolean {
        if(main.cash > 1000 && main.relative_time / 30 > 3){
            return true;
        } else
            return false;
    }

    action(): void {
        let cost = 1000 * main.inflation_factor;
        main.pay(cost);
        main.log(`You had a super vacation. The expenses was ${cost} USD`);
    }
}

export class GoOut implements Action{
    name = "Go Out";

    active(): boolean {
        if(main.cash > 100 && main.relative_time  > 15){
            return true;
        } else
            return false;
    }

    action(): void {
        let cost = 100 * main.inflation_factor;
        main.network += 1;
        main.pay(cost);
        main.log(`You have new friends.`);
    }
}

export class Donate implements Action{
    name = "Donate 50% of cash";

    active(): boolean {
        if(main.cash > 10000 && main.relative_time / 365 > 1){
            return true;
        } else
            return false;
    }

    action(): void {
        let cost = main.cash / 2;
        main.pay(cost, false);
        main.log(`You donated ${cost}`);
    }
}

export class BuySP500 implements Action{
    name = "Buy S&P500";

    active(): boolean {
        if(main.cash > 5000 && main.relative_time / 30 > 3 ){
            return true;
        } else
            return false;
    }

    action(): void {
        let e = new ETFSP500();
        main.pay(e.value);
        main.assets.push(e);
        main.log(`ETFs may be a wise investment`);
    }
}

let actions = [new BuyLotteryTicket(), 
    new OrganizeAParty(), 
    new BuyBicycle(),
    new GoOut(),
    new GoInVacantion(),
    new GetJob(), 
    new BuyCar(), 
    new Donate(),
    new BuyHouse(),
    new BuyFlat(),
    new BuySP500()
];
export default actions;