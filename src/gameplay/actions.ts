import {main} from "./main";
import "./assets";
import { Job, Car, House, Asset, LotteryTicket } from "./assets";


export interface Action{
    name:string
    active():boolean
    action():void
}


class BuyCar implements Action{
    name = "Buy a car";

    active(): boolean {
        let c = new Car();
        if(main.cash > c.value * 0.1){
            return true;
        } else
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

class GetJob implements Action{
    name = "Get a job";

    active(): boolean {
        if(main.how_many('job') < 2)
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
        if(main.cash > h.value * 0.1){
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

class OrganizeAParty implements Action{
    name = "Organize a party";

    active(): boolean {
        return true;
    }

    action(): void {
        let cost = 200 * main.inflation_factor;
        main.pay(cost);
        main.log(`Let's party`);
    }
}

class GoInVacantion implements Action{
    name = "Go in a vacation";

    active(): boolean {
        if(main.cash > 500){
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
        if(main.cash > 100){
            return true;
        } else
            return false;
    }

    action(): void {
        let cost = 100 * main.inflation_factor;
        main.pay(cost);
        main.log(`You have new friends.`);
    }
}

export class Donate implements Action{
    name = "Donate 50% of cash";

    active(): boolean {
        if(main.cash > 10000){
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

let actions = [new BuyLotteryTicket(), 
    new OrganizeAParty(), 
    new GoOut(),
    new GoInVacantion(),
    new GetJob(), 
    new BuyCar(), 
    new Donate(),
    new BuyHouse()];
export default actions;