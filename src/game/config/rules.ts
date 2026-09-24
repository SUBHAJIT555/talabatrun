export const GAME_RULES = {
  durationSeconds: 60,
  healthyFoodPoints: 10,
  junkFoodPenalty: 5,
  minScore: 0,
};

export const HEALTHY = [
  "apple",
  "banana",
  "orange",
  "watermelon",
  "broccoli",
  "carrot",
  "avocado",
  "salad",
  "strawberry",
  "grapes",
  "almonds",
  "water",
] as const;

export const JUNK = [
  "burger",
  "fries",
  "pizza",
  "donut",
  "soda",
  "icecream",
  "cupcake",
  "chocolate",
  "chips",
  "hotdog",
  "candy",
  "chicken",
] as const;

export type FoodName = (typeof HEALTHY)[number] | (typeof JUNK)[number];
