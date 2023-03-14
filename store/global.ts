import { atom } from "../jotai";

export const salary = atom(100_000);
export const bonus = atom(10_000);
export const fullSalary = atom((get) => get(salary) + get(bonus));
