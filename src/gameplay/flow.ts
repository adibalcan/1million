import { Main } from "./main";
import { GoOut } from "./actions";
import { getRandomInt, getRandomIntIterval } from "./util";
import { Asset, objectToAsset } from "./assets";
import { Constants } from "./constants";

export let main:Main = createMainInstance(); // This works as a Singletone
loadAssets();


export let day_interval:any = null;
export let save_interval:any;
export let game_status:boolean = true;

export function start() {
    if (!day_interval){
        console.log("game started");
        day_interval = setInterval(day, Constants.DAY_LASTS);
    } 
    if (!save_interval){
        save_interval = setInterval(save, 10000);
    } 
}

export function stop(){
    game_status = false;
    // delete saved state
    localStorage.removeItem(Constants.STORAGE_PREFIX + "_main");
    localStorage.removeItem(Constants.STORAGE_PREFIX + "_assets");
}

export function reset(){
    stop();
    window.location.reload();
}

export function day() {
    if(game_status){
        main.time += 1;
        main.relative_time += 1;

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
            if(game_status){
                asset.age += 1;

                if(asset.age % 30 == 0){
                    asset.month();
                }

                if(asset.age % 365 == 0){
                    asset.yearly();
                }
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
    game_status && pay_or_collect_rent();
    game_status && pay_food();
}

function yearly_check(){
    game_status && inflation();
}

function pay_or_collect_rent(){
    /**
     * you pay or collect rent based on how many houses do you have
     */
    let rent_cost = 500 * main.inflation_factor;
    let number_of_houses = main.how_many('house');

    // if you don't have a house you pay the rent
    if(number_of_houses == 0){
        let result = main.pay(rent_cost, false);
        if(result){
            main.log(`You pay the rent (${Math.round(rent_cost)})`);
        } else {
            main.log(`You don't have enought money to pay the rent (${Math.round(rent_cost)})`);
            main.log("GAME OVER! Please refresh to start again");
            stop();
        }
    }

    // if you have more than one house you collect the rent
    if(number_of_houses > 1){
        let collected_rent = rent_cost * (number_of_houses - 1);
        main.cash += collected_rent; 
        main.log(`You collected the rent (${Math.round(collected_rent)})`);
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
    main.log(`This year inflation was ${inflation}%. All prices are now higher`);
}

function save(){
    if(game_status){
        // save assets
        localStorage.setItem(Constants.STORAGE_PREFIX + "_assets", JSON.stringify(main.assets));

        // save main context
        localStorage.setItem(Constants.STORAGE_PREFIX + "_main", JSON.stringify(main));
        console.log("save");
    }    
}

function loadMain():Main|false{
    // the loading is done in 2 steps:
    // 1. loading main context in the global varaible
    // 2. loading assets(they have references to the main global variable)
    let data = localStorage.getItem(Constants.STORAGE_PREFIX + "_main");
    if(data){
        let object = JSON.parse(data);
        object.assets = [];
        object.log_history = [];
        // main = Object.create(Main, object);
        // update the global main object
        let newMain:Main = Object.assign(new Main(), object);
        console.log('loaded main context');
        return newMain;
    }else{
        return false;
    }
}

function loadAssets():boolean{
    // the global main variable should exist at the creation moment of the assets 
    // because they are using the main properties
    let data = localStorage.getItem(Constants.STORAGE_PREFIX + "_assets");
    if(data){
        let assetData = JSON.parse(data);
        assetData.map((a:any) => {
            let newAsset = objectToAsset(a);
            if(newAsset){
                let asset = Object.assign(newAsset, a);
                main.assets.push(asset);
            }
        });
        console.log('loaded assets');
        return true;
    }
    return false;
}

function createMainInstance():Main {
    // create main instance or load it form localstorage using load method
    let m = loadMain();
    let newMain:Main;
    if(m){
        return m;
    }else{
        newMain = new Main();
        newMain.log(`You are ${Constants.NAME}, a teenager of 22 years. You have $${Constants.CASH_START} and you need to survive in the economic jungle.`);
        return newMain;
    }
}

