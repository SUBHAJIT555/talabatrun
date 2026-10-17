export const GAME_RULES = {
  durationSeconds: 60,
  healthyFoodPoints: 10,
  junkFoodPenalty: 5,
  minScore: 0,
};

const foods = "/images/foods";

export const HEALTHY = [
  { id: "apple", file: `${foods}/Apple.svg` },
  { id: "banana", file: `${foods}/Banana.svg` },
  { id: "broccoli", file: `${foods}/Broccoli.svg` },
  { id: "carrot", file: `${foods}/Carrot.svg` },
  { id: "corn", file: `${foods}/Corn.svg` },
  { id: "milk", file: `${foods}/Milk.svg` },
  { id: "grapes", file: `${foods}/Grapes.svg` },
  { id: "kiwi", file: `${foods}/Kiwi.svg` },
  { id: "mango", file: `${foods}/Mango.svg` },
  { id: "orange", file: `${foods}/Orange.svg` },
  { id: "strawberry", file: `${foods}/Strawberry.svg` },
  { id: "salad", file: `${foods}/Salad.svg` },
  { id: "watermelon", file: `${foods}/Watermelon.svg` },
  { id: "egg", file: `${foods}/egg.svg` },
] as const;

export const JUNK = [
  { id: "burger", file: `${foods}/Cheeseburger.svg` },
  { id: "fries", file: `${foods}/Fries.svg` },
  { id: "icecream", file: `${foods}/Icecream.svg` },
  { id: "donut", file: `${foods}/Donut.svg` },
  { id: "pizza", file: `${foods}/Pizza.svg` },
  { id: "lollipop", file: `${foods}/Lollipop.svg` },
] as const;

export type FoodName = (typeof HEALTHY)[number]["id"] | (typeof JUNK)[number]["id"];
