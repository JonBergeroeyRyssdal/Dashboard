//----------Classes----------

//Parent
class Vehicle {
  constructor(type, wheels, doors, color) {
    this.type = type;
    this.wheels = wheels;
    this.doors = doors;
    this.color = color;
  }
  Description() {
    return `The ${this.type} has ${this.wheels} wheels, ${this.doors} doors, and the color ${this.color}.`;
  }
}

//Child 1
class Car extends Vehicle {
  constructor(type, wheels, doors, color, topSpeed) {
    super(type, wheels, doors, color);
    this.topSpeed = topSpeed;
  }

  getTopSpeed() {
    return `The top speed of the car is ${this.topSpeed} km/h.`; 
  }
}

//Child 2
class Truck extends Vehicle {
  constructor(type, wheels, doors, color, maxLoadWeight) {
    super(type, wheels, doors, color);
    this.maxLoadWeight = maxLoadWeight;
  }

  getMaxLoadWeight() {
    return `The max load weight of the truck is ${this.maxLoadWeight} kg.`;
  }
}

//Vehicle Factory will create Vehicles of different types

class VehicleFactory {
  create(type, attributes) {
    switch (type) {
      case "car":
        return new Car(attributes.type, attributes.wheels, attributes.doors, attributes.color, attributes.topSpeed);
      case "truck":
        return new Truck(attributes.type, attributes.wheels, attributes.doors, attributes.color, attributes.maxLoadWeight);
    }
  }
}

//----------Car Implementation----------

//Create JSON string object from schema

const json_car = '{"type": "car", "wheels": 4, "doors": 4, "color": "Red"}';

//Convert JSON object to JS Object

const js_car = JSON.parse(json_car);

//Add topSpeed to the JS Obj

js_car.topSpeed = 250;

//Create CarFactory and a Car

const CarFactory = new VehicleFactory();

const myCar = CarFactory.create("car", js_car);

console.log(myCar.Description());

console.log(myCar.getTopSpeed());

//----------Truck Implementation----------

//Create JSON string object from schema

const json_truck = '{"type": "truck", "wheels": 6, "doors": 2, "color": "Blue"}';

//Convert JSON object to JS Object
const js_truck = JSON.parse(json_truck);

//Add maxLoadWeight to the JS Obj
js_truck.maxLoadWeight = 3000;

//Create TruckFactory and a Truck

const TruckFactory = new VehicleFactory();

const myTruck = TruckFactory.create("truck", js_truck);

console.log(myTruck.Description());

console.log(myTruck.getMaxLoadWeight());

//Debug

