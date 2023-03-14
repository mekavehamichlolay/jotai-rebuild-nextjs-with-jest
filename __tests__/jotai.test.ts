import { salary, fullSalary, bonus } from "../store/global";
import { atom } from "../jotai";
describe("check the custom jotai", () => {
  it("should work properly", () => {
    expect(salary.get()).toBe(100_000);
    expect(fullSalary.get()).toBe(salary.get() + bonus.get());
    salary.set(1_000_000);
    expect(salary.get()).toBe(1_000_000);
    expect(fullSalary.get()).toBe(1_000_000 + bonus.get());
  });
  it("should update subscribers only if the value is changed", () => {
    const sub = jest.fn();
    salary.subscribe(sub);
    expect(sub).toBeCalledTimes(0);
    salary.set(salary.get());
    expect(sub).toBeCalledTimes(0);
  });

  it("the subscribed function should run only one time per update", () => {
    const sub = jest.fn();
    salary.subscribe(sub);
    expect(sub).toBeCalledTimes(0);
    salary.set(salary.get());
    expect(sub).toBeCalledTimes(0);
    salary.set(salary.get() + 1);
    expect(sub).toBeCalledTimes(1);
    salary.set(salary.get());
    expect(sub).toBeCalledTimes(1);
    salary.set(salary.get() + 1);
    expect(sub).toBeCalledTimes(2);
  });
  it("the subscribed function should run only one time per update in computed value", () => {
    const sub = jest.fn();
    fullSalary.subscribe(sub);
    expect(sub).toBeCalledTimes(0);
    salary.set(salary.get());
    expect(sub).toBeCalledTimes(0);
    salary.set(salary.get() + 1);
    expect(sub).toBeCalledTimes(1);
    salary.set(salary.get());
    expect(sub).toBeCalledTimes(1);
    salary.set(salary.get() + 1);
    expect(sub).toBeCalledTimes(2);
    bonus.set(bonus.get());
    expect(sub).toBeCalledTimes(2);
    bonus.set(bonus.get() + 1);
    expect(sub).toBeCalledTimes(3);
    bonus.set((i) => i + 1);
    expect(sub).toBeCalledTimes(4);
  });
  it("should work for promises", async () => {
    const promise = atom(() => Promise.resolve("hello"));
    const sub = jest.fn();
    let value = "";
    const sub1 = (v: any) => (value = v);
    promise.subscribe(sub);
    promise.subscribe(sub1);
    await promise.get();
    expect(promise.get()).toBe("hello");
    expect(sub).toBeCalledTimes(1);
    expect(value).toBe("hello");
  });
  it("should be read only, when the initial value is computed", () => {
    try {
      expect(fullSalary.set(1)).toThrow(
        "this atom is subscribed to another atom, you cant set its value directly"
      );
    } catch (err) {
      expect((err as ReturnType<typeof Error>).message).toBe(
        "this atom is subscribed to another atom, you cant set its value directly"
      );
    }
    expect(fullSalary.get()).toBe(salary.get() + bonus.get());
  });
});
