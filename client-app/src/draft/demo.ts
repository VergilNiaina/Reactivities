// need to be explecite sometimes
let data : number | string = 42;
data = 'test';


export interface Duck{
    name: string;
    legs: number;
    // ? make optional
    makeSound?:(sound: string)=> void;
}

//need to create interface
const duck: Duck= {
    name:"ducky",
    legs:2,
    makeSound: (sound: any) => console.log(sound)
}

const duck2: Duck= {
    name:"duckyTwo",
    legs:2,
}
// ! force 
duck.makeSound!('voice');


export const ducks=[duck,duck2]