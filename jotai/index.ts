import { useSyncExternalStore } from "react";

interface Atom<AtomType> {
  get: () => AtomType;
  set: (newValue: AtomType | ((prevValue: AtomType) => AtomType)) => void;
  subscribe: (callback: (newValue: AtomType) => void) => () => void;
}

type AtomGetter<AtomType> = (
  get: <Target>(a: Atom<Target>) => Target
) => AtomType;

export function atom<AtomType>(
  initialValue: AtomType | AtomGetter<AtomType>
): Atom<AtomType> {
  let value: AtomType =
    typeof initialValue === "function" ? (null as AtomType) : initialValue;

  const subcribers = new Set<(newValue: AtomType) => void>();
  const unsubcribers = new Set<() => void>();

  function get<Target>(atom: Atom<Target>) {
    let currentValue = atom.get();
    const unsubscribe = atom.subscribe((newValue) => {
      if (currentValue === newValue) return;
      currentValue = newValue;
      computeValue();
    });
    unsubcribers.add(unsubscribe);
    return currentValue;
  }

  async function computeValue() {
    unsubcribers.forEach((unsubscribe) => {
      unsubscribe();
      unsubcribers.delete(unsubscribe);
    });
    const newValue =
      typeof initialValue === "function"
        ? (initialValue as AtomGetter<AtomType>)(get)
        : value;
    if (value === newValue) return;
    value = null as AtomType;
    value = (newValue as Promise<AtomType>).then ? await newValue : newValue;
    subcribers.forEach((callback) => callback(value));
  }
  computeValue();

  return {
    get: () => value,
    set: (newValue) => {
      if (typeof initialValue === "function") {
        throw new Error(
          "this atom is subscribed to another atom, you cant set its value directly"
        );
      }
      if (value == newValue) return;
      value =
        typeof newValue === "function"
          ? (newValue as (prevValue: AtomType) => AtomType)(value)
          : newValue;
      subcribers.forEach((callback) => callback(value));
    },
    subscribe: (callback) => {
      subcribers.add(callback);

      return () => {
        subcribers.delete(callback);
      };
    },
  };
}

export function useAtom<AtomType>(
  atom: Atom<AtomType>
): [AtomType, (newValue: AtomType) => void] {
  return [useSyncExternalStore(atom.subscribe, atom.get, atom.get), atom.set];
}

export function useAtomValue<AtomType>(atom: Atom<AtomType>) {
  return useSyncExternalStore(atom.subscribe, atom.get, atom.get);
}
