import { Main, main } from "./main";
import { instanceToPlain, serialize } from 'class-transformer';
import { GoOut } from "./actions";
import { getRandomInt, getRandomIntIterval } from "./util";
import { Asset } from "./assets";
import { Constants } from "./constants";


export const day_time = 500; // how mouch lasts a day (in ms)
export let day_interval:any = null;
export let game_status:boolean = true;


export function start() {
    if (!day_interval){
        console.log("game started");
        day_interval = setInterval(day, day_time);
    } 
}

export function stop(){
    game_status = false;
    // delete saved state
    localStorage.removeItem(Constants.STORAGE_PREFIX + "_main");
    localStorage.removeItem(Constants.STORAGE_PREFIX + "_assets");
}

export function day() {
    if(game_status){
        main.time += 1;

        if(main.time % 4 == 0){
            randomAction();
        }

        if(main.time % 30 == 0){
            monthly_check();
        }
        if(main.time % 365 == 0){
            yearly_check();
        }

        main.assets.map((asset) => {
            asset.age += 1;

            if(asset.age % 30 == 0){
                asset.month();
            }

            if(asset.age % 365 == 0){
                asset.yearly();
            }            
        });
    }
}

function randomAction(){
    if(getRandomInt(100)<10){
        main.log("Your friends are going out", new GoOut());
    }
}

function monthly_check(){
    // pay the bills (rent & food)
    pay_rent();
    pay_food();
}

function yearly_check(){
    inflation();
}


function pay_rent(){
    // if you don't have a house you pay the rent
    if(main.how_many('house') == 0){
        let cost = 500 * main.inflation_factor;
        let result = main.pay(cost, false);
        if(result){
            main.log(`You pay the rent (${Math.round(cost)})`);
        } else {
            main.log(`You don't have enought money to pay the rent (${Math.round(cost)})`);
            main.log("GAME OVER! Please refresh to start again");
            stop();
        }
    }
}

function pay_food(){
    let cost = getRandomIntIterval(300, 400) * main.inflation_factor;
    main.pay(cost, false);
    main.log(`This month you spent $${Math.round(cost)} on food`);
}

function inflation(){
    let inflation = getRandomIntIterval(Constants.MIN_INFLATION, Constants.MAX_INFLATION);
    main.inflation_factor *= (1+inflation/100); 
    main.log(`This year inflation was ${inflation}%. All priceas are now higher`);
}