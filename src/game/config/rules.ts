export const GAME_RULES = {
  durationSeconds: 60,
  healthyFoodPoints: 10,
  junkFoodPenalty: 5,
  minScore: 0,
};

const talabat = "/images/talabatFoodItems";
const classic = "/images/game/foods";

export const HEALTHY = [
  { id: "apple", file: `${talabat}/Glossy Red Apple Still Life.png` },
  { id: "carrot", file: `${talabat}/Fresh Whole Carrots with Sliced Pieces.png` },
  { id: "salad", file: `${talabat}/Fresh Rainbow Salad Bowl.png` },
  { id: "nuts", file: `${talabat}/Mixed Nuts Heap on Transparent Background.png` },
  { id: "orange", file: `${talabat}/Vibrant Water-Droplet Orange Still Life.png` },
  { id: "avocado", file: `${talabat}/Whole and Cut Avocados on Transparent Background.png` },
  { id: "milk", file: `${talabat}/Milk Splash in Crystal Glass.png` },
  { id: "strawberry", file: `${classic}/strawberry.png` },
  { id: "watermelon", file: `${classic}/watermelon.png` },
  { id: "grapes", file: `${classic}/grapes.png` },
  { id: "banana", file: `${classic}/banana.png` },
] as const;

export const JUNK = [
  { id: "burger", file: `${talabat}/Gourmet Sesame Cheeseburger Cutout.png` },
  { id: "fries", file: `${talabat}/Golden Fries in a Red Carton.png` },
  { id: "pizza", file: `${talabat}/Gooey Golden Cheese Pizza Slice.png` },
  { id: "chips", file: `${talabat}/Golden Potato Chips in Glass Bowl.png` },
  { id: "wings", file: `${talabat}/Glossy Buffalo BBQ Chicken Wings.png` },
  { id: "donut", file: `${classic}/donut.png` },
] as const;

export type FoodName = (typeof HEALTHY)[number]["id"] | (typeof JUNK)[number]["id"];
